import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import  RealTimeChart from './components/RealTimeChart.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.MAX_POINTS = 50;
    this.state = {
      lineChartData: {
        labels: Array(this.MAX_POINTS).fill(''),
        datasets: [
          {
            type: "line",
            label: "Ping 192.168.0.1",
            fill: 'start',
            backgroundColor: "rgba(201, 203, 207, 0.6)",
            borderColor: "rgb(0, 0, 0)",
            pointBackgroundColor: "#fff",
            pointBorderColor: "rgb(0, 0, 0)",
            borderWidth: "2",
            lineTension: 0.0001,
            data: []
          },
        ]
      }
    };
    this.eventSource = new EventSource("http://localhost:4000/ping");
    this.eventSource.onopen = e => console.log(e);
  }

  componentDidMount() {
    this.eventSource.onmessage = e => this.pingEventMessageHandler(e);
  }

  componentWillUnmount() {
    this.eventSource.close();
  }

  pingEventMessageHandler(event) {
    
    try{
      var ping = this.parseUnixPingString(event.data)
      const lastDataset = this.state.lineChartData.datasets[0];
      const newDataset = { 
        ...lastDataset,
        data: [
          ...lastDataset.data.splice(-(this.MAX_POINTS -1)),
          ping.time
        ]
      };

      const timestampAsDate = new Date(ping.timestamp * 1000);

      var lastLabels;
      if(this.state.lineChartData.labels[this.state.lineChartData.labels.length - 1] == ''){
        //var nextInd = this.state.lineChartData.labels.findIndex("");
        lastLabels = [
          ...this.state.lineChartData.labels.slice(0, newDataset.data.length-1),
          timestampAsDate.toLocaleTimeString(),
          ...this.state.lineChartData.labels.slice(newDataset.data.length, this.MAX_POINTS),
        ]
      } else {
        lastLabels = [
          ...this.state.lineChartData.labels.slice(-(this.MAX_POINTS -1)),
          timestampAsDate.toLocaleTimeString()
        ]
      }

      const newChartData = {
        datasets: [newDataset],
        labels: lastLabels
      }

      this.setState({lineChartData: newChartData});
    } catch (error){
      console.error(error);
    }
  }

  parseUnixPingString(pingString) {
    var re = /^\[(\d+\.\d+)\] (\d+) bytes from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}): icmp_seq=(\d+) ttl=(\d+) time=(.+) ms$/;
    var match = pingString.match(re)
    return {
      string: match[0],
      timestamp: match[1],
      bytes: match[2],
      ip: match[3],
      icmp_seq: match[4],
      ttl: match[5],
      time: match[6],
    }
  }
  
  render() {
    return (
      <div className="App">
        <header>
          <h1>Ping Visualizer</h1>
        </header>
        <RealTimeChart 
          height={500}
          lineChartData={this.state.lineChartData}
        />
      </div>
    );
  }
}

export default App;
