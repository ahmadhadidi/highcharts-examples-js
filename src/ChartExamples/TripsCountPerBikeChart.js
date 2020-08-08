import React, {useMemo, useState, useEffect} from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React

export const TripsCountPerBikeChart = (bikeData) => {
    // Define the necessary states for our chart
    const [data, setData] = useState(bikeData.bikeData);
    const [bikeId, setBikeId] = useState(21434);

    // We select distinct objects by property value from an array of objects
    // Resource: https://codeburst.io/javascript-array-distinct-5edc93501dc4
    const filteredTrips = Array.from(new Set(data.map(n => n.bike))).map(id => {
        return {
            id: id,
            tripData: data.filter(s => s.bike === id),
            amountOfTrips: data.filter(s => s.bike === id).length
        }
    });

    const xAxisCategories = filteredTrips.map(n => n.id);
    const numberOfTripsPerBike = filteredTrips.map( n => n.tripData.length );

    console.log("filteredTrips", filteredTrips);
    console.log("Amount of Trips per Bike", numberOfTripsPerBike);
    console.log("xAxisCategories", xAxisCategories);

    // Format the series in a way that Highcharts understands
    // Resource -- https://www.youtube.com/watch?v=G3BS3sh3D8Q
    // Make sure that you adhere to creating a collection of arrays within 1 array.
    // const ready = [{
    //     name: "Trips Count",
    //     data: numberOfTripsPerBike
    // }]

    const ready = [{
        name: "Trip Count",
        data: filteredTrips.map(n => [n.id, n.amountOfTrips])
    }]

    //     filteredTrips.map(n => {
    //     return {
    //         name: "Bike IDs",
    //         data: [n.id, n.amountOfTrips]
    //     }
    // });

    console.log("ready", ready);

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
                // style: {
                //     fontSize: '13px',
                //     fontFamily: 'Verdana, sans-serif'
                // },
                // categories: ready.map(n => n.name),
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