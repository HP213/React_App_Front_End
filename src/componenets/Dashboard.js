import React, { Component } from 'react';
import classes from "../chartCSS/Dashboard.module.css";
import chartIcon from "../assets/chart-icon.svg";
import LineGraph from "./LineGraph";
import { managerData, nationalAverageData, yearLabels} from "../mockData";

export default class Dashboard extends Component {
    state = {
        data: this.props.const,
        average: this.props.average,
        labels: this.props.labels
    }


    render() {
        console.log("Average", this.state.average);
        console.log("Labels", this.state.labels);
        console.log("Data", this.state.data);
        const { data, average, labels } = this.state;
        return (
            <div className={classes.container}>
                <header>
                    <img src={chartIcon} alt="bar chart icon" />
                    <h1>Current Saving is : {this.props.savings.toFixed(2)}% in {this.props.days} Days</h1>
                </header>
                <h2>Number of Servers : {this.props.count}</h2>

                <LineGraph
                    data={data}
                    average={average}
                    labels={labels} />

            </div>
        )
    }
}
