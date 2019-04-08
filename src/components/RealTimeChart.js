import React, { Component } from 'react';
import { Line } from "react-chartjs-2";

const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    showLines: true,
    tooltips: {
        enabled:true
    },
    scales: {
        xAxes: [
            {
                ticks: {
                    autoSkip: true
                }
            }
        ],
        yAxes: [{
            scaleLabel: {
                display: true,
                labelString: 'Time (ms)'
            }
        }]
    },
};

class RealTimeChart extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
          <div>
            <Line
                data={this.props.lineChartData}
                options={lineChartOptions}
                height={this.props.height}
            />
          </div>
        );
    }
}

export default RealTimeChart;