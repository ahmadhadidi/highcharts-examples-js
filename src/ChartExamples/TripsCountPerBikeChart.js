import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React

export const TripsCountPerBikeChart = (bikeData) => {
    // Define the necessary states for our chart
    const [ data ] = useState(bikeData.bikeData);

    // We select distinct objects by property value from an array of objects
    // Resource: https://codeburst.io/javascript-array-distinct-5edc93501dc4
    const filteredTrips = Array.from(new Set(data.map(n => n.bike))).map(id => {
        return {
            id: id,
            tripData: data.filter(s => s.bike === id),
            amountOfTrips: data.filter(s => s.bike === id).length
        }
    });

    // HDD - Debug
    // console.log("filteredTrips", filteredTrips);
    // console.log("Amount of Trips per Bike", numberOfTripsPerBike);
    // console.log("xAxisCategories", xAxisCategories);

    // Format the series in a way that Highcharts understands
    // Resource: https://www.highcharts.com/demo/column-rotated-labels
    const ready = [{
        name: "Trip Count",
        // Map the `ids` and `amountOfTrips` to data (Res 1) and sort it (Res 2)
        // Resource 1: https://www.youtube.com/watch?v=G3BS3sh3D8Q
        // Resource 2: https://stackoverflow.com/questions/25082034/highcharts-error-15
        data: filteredTrips.map(n => [n.id, n.amountOfTrips]).sort()
    }]

    // HDD - Debug
    // console.log("ready", ready);

    // Make the chart object and pass our `formattedSeries` array to it.
    const chart = useMemo(() => {
        return {
            title: {
                text: `Trips Count Per Bike`
            },
            subtitle: {
                text: `An Ahmad Hadidi Chart`
            },
            chart: {
                type: 'column'
            },
            yAxis: {
                title: {
                    text: `Count of trips`
                }
            },
            xAxis: {
                title: {
                    text: `Bike IDs`
                },
                type: 'category',
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
            series: ready
        }
    }, [ready]);

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