import React, { Component } from 'react';
import './App.css';
import  RealTimeChart from './components/RealTimeChart.js'
import PingForm from './components/PingForm.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.MAX_POINTS = 50;
    this.state = {
      lineChartData: null,
      eventSource: null,
      address: '192.168.0.1',
      play: false
    };
    this.onChangeHandler = this.onChangeHandler.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  initializeLineChartData(){
    return {
      labels: Array(this.MAX_POINTS).fill(''),
      datasets: [
        {
          type: "line",
          label: `Ping ${this.state.address}`,
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
  }

  pingEventMessageHandler(event) {
    if(this.state.play === false){
      return;
    }
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
    var re = /^\[(\d+\.\d+)\] (\d+) bytes from (.+): icmp_seq=(\d+) ttl=(\d+) time=(.+) ms$/;
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
  
  onChangeHandler(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  onClickHandler(event) {
    switch(event.target.name) {
      case 'play':
        this.setState({play: !this.state.play});
        break;
      case 'start':
        if(this.state.eventSource)
          this.state.eventSource.close();
        this.setState({
          eventSource: new EventSource(`http://localhost:4000/ping?ip=${this.state.address}`),
          lineChartData: this.initializeLineChartData(),
          play: true
        }, () => {
          this.state.eventSource.onmessage = e => this.pingEventMessageHandler(e);
        });
        break;
      default:
      console.error('Invalid event');
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
        <PingForm
          addressValue={this.state.address}
          onChangeHandler={this.onChangeHandler}
          onClickHandler={this.onClickHandler}
        />
      </div>
    );
  }
}

export default App;
