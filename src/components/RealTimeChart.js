import React, { Component } from 'react';
import { Line } from "react-chartjs-2";

const lineChartOptions = {
    responsive: true,
    showLines: true,
    tooltips: {
        enabled:true
    },
    scales: {
        xAxes: [
            {
                ticks: {
                    autoSkip: true,
                    maxTicksLimit: 10
                }
            }
        ]
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
            />
          </div>
        );
    }
}

export default RealTimeChart;