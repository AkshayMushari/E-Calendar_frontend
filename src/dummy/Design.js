import React, { Component } from 'react';
import CanvasJSReact from '@canvasjs/react-charts';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

class Design extends Component {
    render() {
        const options = {
            theme: 'light2',
            title: {
                text: "Employee Time Division"
            },
            animationEnabled: true,
            axisY: {
                title: "Percent",
                suffix: "%"
            },
            legend: {
                horizontalAlign: 'center',
                verticalAlign: 'bottom'
            },
            toolTip: {
                shared: true
            },
            data: [
                {
                    type: "stackedBar100",
                    showInLegend: true,
                    name: "Work",
                    color: "#4CAF50",
                    indexLabel: "#percent%",
                    dataPoints: [
                        { y: 500, label: "Alice" },
                        { y: 400, label: "Bob" },
                        { y: 450, label: "Charlie" },
                        { y: 480, label: "David" }
                    ]
                },
                {
                    type: "stackedBar100",
                    showInLegend: true,
                    name: "Meetings",
                    color: "#FF9800",
                    indexLabel: "#percent%",
                    dataPoints: [
                        { y: 120, label: "Alice" },
                        { y: 200, label: "Bob" },
                        { y: 180, label: "Charlie" },
                        { y: 140, label: "David" }
                    ]
                },
                {
                    type: "stackedBar100",
                    showInLegend: true,
                    name: "Leaves",
                    color: "#F44336",
                    indexLabel: "#percent%",
                    dataPoints: [
                        { y: 80, label: "Alice" },
                        { y: 100, label: "Bob" },
                        { y: 120, label: "Charlie" },
                        { y: 150, label: "David" }
                    ]
                },
                {
                    type: "stackedBar100",
                    showInLegend: true,
                    name: "Other",
                    color: "#9C27B0",
                    indexLabel: "#percent%",
                    dataPoints: [
                        { y: 100, label: "Alice" },
                        { y: 80, label: "Bob" },
                        { y: 90, label: "Charlie" },
                        { y: 60, label: "David" }
                    ]
                }
            ]
        };

        return (
            <div>
                <CanvasJSChart options={options} />
            </div>
        );
    }
}

export default Design;
