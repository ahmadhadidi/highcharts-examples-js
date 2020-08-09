import React, {useMemo, useState } from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React

export const TripsCountChart = (bikeData) => {
    // Define the necessary states for our chart
    const [data] = useState(bikeData.bikeData);

    // Count the amount of trips using the reduce function
    const tripsCount = data.reduce( (count, n) => {
        return count = count + 1;
    }, 0)

    // HDD - Debug
    // console.log("tripsCount", tripsCount);

    // Format the trips in a way that highcharts understands
    // Resource -- https://www.youtube.com/watch?v=G3BS3sh3D8Q
    const formattedSeries = [{
        name: "Trips Count",
        data: [tripsCount]
    }]

    // Make the chart object and pass our `formattedSeries` array to it.
    const chart = useMemo(() => {
        return {
            title: {
                text: 'Trips Count for All Bikes'
            },
            subtitle: {
                text: 'An Ahmad Hadidi Chart'
            },
            chart: {
                type: 'bar'
            },
            yAxis: {
                title: {
                    text: 'Count of Trips'
                }
            },
            xAxis: {
                title: {
                    text: 'All Trips'
                },
                categories: [''],
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