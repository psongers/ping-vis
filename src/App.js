import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import  RealTimeChart from './components/RealTimeChart.js'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lineChartData: {
        labels: [],
        datasets: [
          {
            type: "line",
            label: "test",
            backgroundColor: "rgba(0, 0, 0, 0)",
            borderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderColor: "rgba(75,192,192,1)",
            borderWidth: "2",
            lineTension: 0.45,
            data: [1]
          },
        ]
      }
    }
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
      console.log(ping)
    } catch (error){
      console.error(error);
    }
  }


  parseUnixPingString(pingString) {
    var re = /^\[(\d+\.\d+)\] (\d+) bytes from (\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}): icmp_seq=(\d+) ttl=(\d+) time=(.+)$/;
    var match = pingString.match(re)
    return {
      string: match[0],
      time: match[1],
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <RealTimeChart 
          lineChartData={this.state.lineChartData}
        />
      </div>
    );
  }
}

export default App;
