import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React
import moment from 'moment';
import { distance } from '../helpers/distance';

export const DistanceCoveredPerBikeChart = (bikeData) => {
    // Define the necessary states for our chart
    const [ data ] = useState(bikeData.bikeData);

    // HDD - Debug
    // console.log("Data", data);

    // We filter the trips by the date using map (1) using the library Moment (2)
    // Also, we use a distance function (3) to calculate the distance for each trip.
    // Resource 1: https://www.youtube.com/watch?v=G3BS3sh3D8Q
    // Resource 2: https://momentjs.com/docs/#/displaying/format/
    // Resource 3: https://www.geodatasource.com/developers/javascript
    const filteredTripsById = data.map(n => {

        // Create an object to hold the Moment object to filter it later
        const momentObj = moment( n.start_datetime );

        return {
            // Variable explain what each one contains
            bike: n.bike,
            datetime: momentObj.format('DD-MM-YYYY - HH:mm'),
            year: momentObj.format("YYYY"),
            monthName: momentObj.format("MMMM"),
            monthNumber: momentObj.format("MM"),
            dayName: momentObj.format("dddd"),
            dayNumber: momentObj.format("DD"),
            hour: momentObj.format("HH"),
            distance: parseFloat(distance( n.start_lat,n.start_lng,n.end_lat,n.end_lng, 'K').toFixed(3))
        }
    });

    // HDD - Debug
    // console.log("Distance Covered Per Bike", filteredTripsById);

    // We select distinct objects by property value from an array of objects (By the day name)
    // Resource: https://codeburst.io/javascript-array-distinct-5edc93501dc4
    const filteredTrips = Array.from(new Set(filteredTripsById.map(n => n.bike))).map(id => {
        return {
            id: id,
            tripData: filteredTripsById.filter(s => s.bike === id),
            distanceCovered: filteredTripsById.filter(s => s.bike === id).reduce((currentTotal, s) => {
                return parseFloat((s.distance + currentTotal).toFixed(3))
            }, 0)
        }
    });

    // HDD - Debug
    // console.log("filteredTrips", filteredTrips);

    // Format the series in a way that Highcharts understands
    // Resource: https://www.highcharts.com/demo/column-rotated-labels
    const ready = [{
        name: "Distance (KM)",
        // Map the `ids` and `amountOfTrips` to data (Res 1) and sort it (Res 2)
        // Resource 1: https://www.youtube.com/watch?v=G3BS3sh3D8Q
        // Resource 2: https://stackoverflow.com/questions/25082034/highcharts-error-15
        data: filteredTrips.map(n => [n.id, n.distanceCovered]).sort()
    }]

    // HDD - Debug
    // console.log("ready", ready);

    // Make the chart object and pass our `formattedSeries` array to it.
    const chart = useMemo(() => {
        return {
            title: {
                text: `Distance Covered Per Bike`
            },
            subtitle: {
                text: `An Ahmad Hadidi Chart`
            },
            chart: {
                type: 'column'
            },
            yAxis: {
                title: {
                    text: `Distance Covered`
                }
            },
            xAxis: {
                title: {
                    text: ``
                },
                type: 'category',
                // I guess this is for visually impaired users.
                accessibility: {
                    rangeDescription: 'Range: 2010 to 2017'
                }
            },
            // legend: {
            //     layout: 'vertical',
            //     align: 'right',
            //     verticalAlign: 'middle'
            // },
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