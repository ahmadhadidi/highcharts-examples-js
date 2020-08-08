import React, {useMemo, useState } from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React

export const TripsCountOneBikeChart = (bikeData) => {
    // Define the necessary states for our chart
    const [ data ] = useState(bikeData.bikeData);
    const [ bikeId ] = useState(21434);

    // Filter by a certain Bike ID
    const filteredTrips = data.filter(n => {
        return n.bike === bikeId;
    })

    // HDD - Debug
    // console.log("filteredTrips", filteredTrips);

    // Format the series in a way that Highcharts understands
    // Resource -- https://www.youtube.com/watch?v=G3BS3sh3D8Q
    // Make sure that you adhere to creating a collection of arrays within 1 array.
    const ready = [{
        name: "Trips Count",
        data: [filteredTrips.length]
    }]

    // Make the chart object and pass our `formattedSeries` array to it.
    const chart = useMemo(() => {
        return {
            title: {
                text: `Trips Count for One Bike`
            },
            subtitle: {
                text: `Ahmad AlHadidi`
            },
            chart: {
                type: 'bar'
            },
            yAxis: {
                title: {
                    text: `Count of trips`
                }
            },
            xAxis: {
                title: {
                    text: ``
                },
                categories: [`Bike #${bikeId}`],
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
    }, [ready, bikeId]);

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