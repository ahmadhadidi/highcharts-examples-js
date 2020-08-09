import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React
import moment from 'moment';

export const TripsCountPerMonthChart = (bikeData) => {
    // Define the necessary states for our chart
    const [ data ] = useState(bikeData.bikeData);

    // We filter the trips by the date using map (1) by using Moment (2)
    // Resource 1: https://www.youtube.com/watch?v=G3BS3sh3D8Q
    // Resource 2: https://momentjs.com/docs/#/displaying/format/
    const filteredTripsByDate = data.map(n => {

        // Create an object to hold the Moment object to filter it later
        const momentObj = moment( n.start_datetime );

        return {
            // Variable explain what each one contains
            datetime: momentObj.format('DD-MM-YYYY - HH:mm'),
            year: momentObj.format("YYYY"),
            monthName: momentObj.format("MMMM"),
            monthNumber: momentObj.format("MM"),
            dayName: momentObj.format("dddd"),
            dayNumber: momentObj.format("DD"),
            hour: momentObj.format("HH"),
        }
    });

    // HDD - Debug
    // console.log("Filtered Trips By Day", filteredTripsByDate);

    // We select distinct objects by property value from an array of objects (By the day name)
    // Resource: https://codeburst.io/javascript-array-distinct-5edc93501dc4
    const filteredTrips = Array.from(new Set(filteredTripsByDate.map(n => n.monthName))).map(id => {
        return {
            id: id,
            tripData: filteredTripsByDate.filter(s => s.monthName === id),
            amountOfTrips: filteredTripsByDate.filter(s => s.monthName === id).length
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
        data: filteredTrips.map(n => [n.id, n.amountOfTrips])
    }]

    // HDD - Debug
    // console.log("ready", ready);

    // Make the chart object and pass our `formattedSeries` array to it.
    const chart = useMemo(() => {
        return {
            title: {
                text: `Trips Count Per Month`
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
                    text: ``
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