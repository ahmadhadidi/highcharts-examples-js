import React, {useMemo, useState, useEffect} from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React

export const TripsCountPerBikeChart = (bikeData) => {
    // Define the necessary states for our chart
    const [data, setData] = useState(bikeData.bikeData);
    const [bikeId, setBikeId] = useState(21434);

    // Filter *per* Bike ID
    // const filteredTrips = data.filter((n) => {
    //     return Object.keys(n.bike)
    // })

    const filteredTrips = Array.from(new Set(data.map(n => n.bike))).map(id => {
        return {
            id: id,
            data: data.find( s => s.bike === id ),
            count: data.reduce((count, n) => {return count = count + 1;}, 0)
        }
    });

    console.log("filteredTrips", filteredTrips);

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
                text: `Trips Count Per Bike`
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
    }, [ready]);

    // HDD - Debug
    console.log("chart", chart);

    // Render the chart
    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={chart}
        />
    );
}