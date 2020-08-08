import React, { useMemo } from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React

export const DemoChart = () => {

    // Create a random dataset
    // this array can obtained from any datastore, just make sure that you adhere
    // to creating a collection of arrays within 1 array.
    const randomDataset = [
        [1, 2, 3, 4, 5, 6],
        [2, 8, 2, 1, 3, 8],
        [3, 3, 4, 2, 9, 1],
        [4, 4, 4, 4, 4, 4],
        [5, 4, 4, 4, 4, 4],
        [6, 4, 4, 4, 4, 4],
    ]

    // Format the series in a way that Highcharts understands
    // Resource -- https://www.youtube.com/watch?v=G3BS3sh3D8Q
    const formattedSeries = randomDataset.map(n => ({
        name: n[0],
        data: n
    }));

    // Make the chart object and pass our `formattedSeries` array to it.
    const chart = useMemo(() => {
        return {
            title: {
                text: 'Example Chart'
            },
            subtitle: {
                text: 'With Memoization and Array Mapping'
            },
            yAxis: {
                title: {
                    text: 'Sum count of Trips'
                }
            },
            xAxis: {
                title: {
                    text: 'Date'
                },
                // I guess this is for visually impaired users.
                accessibility: {
                    rangeDescription: 'Range: 2010 to 2017'
                }
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle'
            },
            series: formattedSeries
        }
    }, [formattedSeries]);

    // HDD - Debug
    // console.log("chart", chart);

    // Render the chart
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chart}
        />
    );
}