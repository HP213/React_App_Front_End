import React, { Component } from 'react'
import Chart from "chart.js";
import classes from "../chartCSS/LineGraph.module.css";
let myLineChart;

//--Chart Style Options--//
Chart.defaults.global.defaultFontFamily = "'PT Sans', sans-serif"
Chart.defaults.global.legend.display = false;
//--Chart Style Options--//

export default class LineGraph extends Component {
    chartRef = React.createRef();

    componentDidMount() {
        this.buildChart();
    }

    componentDidUpdate() {
        this.buildChart();
    }

    buildChart = () => {
        const myChartRef = this.chartRef.current.getContext("2d");
        const { data, average, labels } = this.props;

        if (typeof myLineChart !== "undefined") myLineChart.destroy();

        myLineChart = new Chart(myChartRef, {
            type: "line",
            data: {
                //Bring in data
                labels: labels,
                datasets: [
                    {fill : "origin"},
                    {
                        label: "1.3kwh Constant",
                        data: data,
                        fill: false,
                        borderColor: "#6610f2"
                    },
                    {fill : '1'},
                    {
                        label: "Current Consumption in Kwh",
                        data: average,
                        fill: true,
                        borderColor: "#E0E0E0"
                    }
                ]
            },
            options: {
              title : {
              display : true,
              text : 'Comparsion of Electricity Cosumptions'
            },
              plugins: {
              filler: {
                  propagate: true
              }
            }
                //Customize chart options
            }
        });
    }

    render() {

        return (
            <div className={classes.graphContainer}>
                <canvas
                    id="myChart"
                    ref={this.chartRef}
                />
            </div>
        )
    }
}
