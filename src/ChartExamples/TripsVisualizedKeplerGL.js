import React, {useMemo, useState} from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React
import moment from 'moment';
import { distance } from '../helpers/distance';

// Kepler.GL Imports
import KeplerGl from "kepler.gl";
import keplerGlReducer from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { Provider, useDispatch } from "react-redux";
import { addDataToMap } from "kepler.gl/actions";
import { processGeojson } from 'kepler.gl/processors';

// Create a reducer for Kepler
const reducers = combineReducers({
    keplerGl: keplerGlReducer
});

// Create a redux store for Kepler.GL
const store = createStore( reducers, {}, applyMiddleware(taskMiddleware) );

// Export the visualisation with the required provider by Kepler.GL
export function Viz(bikeData) {
    return (
        <Provider store={store}>
            <TripsVisualizedKeplerGL bikeData={bikeData.bikeData}/>
        </Provider>
    )
}

export const TripsVisualizedKeplerGL = (bikeData) => {
    // Define the necessary states for our chart
    const [ data ] = useState(bikeData.bikeData);

    // HDD - Debug
    // console.log("data", data);

    // Only 1 Trip for Testing
    // const processedTrip = {
    //     "type": "FeatureCollection",
    //     "features": [
    //         {
    //             "type": "Feature",
    //             "properties": {
    //                 "Distance": "A",
    //                 "Speed": 20,
    //             },
    //             "geometry": {
    //                 "type": "LineString",
    //                 // MUST BE THREE POINTS..
    //                 "coordinates": [
    //                     [6.94792, 50.96076, 5, 1564184363],
    //                     [6.97000, 50.96569, 0, 1564194396],
    //                     [6.97010, 50.97969, 0, 1564195396]
    //                 ]
    //             }
    //         }
    //     ]
    // }

    // We process each trip with the format that Kepler.GL understands
    // Refer to this image:
    // Link: https://github.com/keplergl/kepler.gl/blob/master/examples/demo-app/src/data/sample-animate-trip-data.js
    const processedTrips = data.map(n => {
        // Create dedicated variables for coordinates and the time
        const start_lng = n.start_lng;
        const end_lng = n.end_lng;
        const start_lat = n.start_lat;
        const end_lat = n.end_lat;
        const start_datetime = new Date(n.start_datetime).getTime() / 1000;
        const end_datetime = new Date(n.end_datetime).getTime() / 1000;

        // Since Kepler.GL requires a minimum of 3 arrays containing the Lng, Lat, Elevation, and Time, we can
        // solve this by creating an average value of the aforementioned elements.
        const avg_lng = ((start_lng + end_lng) / 2);
        const avg_lat = ((start_lat + end_lat) / 2);
        const avg_datetime = ((start_datetime + end_datetime) / 2);

        // Prepare variables for the tooltip when we hover over a trip
        // Since Javascript doesn't come with a customized way to output a certain formatting
        // we will use a library called Moment which will allow us to output timestamps
        // in a way that suits us.
        const startEpoch = moment.unix(start_datetime);
        const endEpoch = moment.unix(end_datetime);
        const tripDuration = endEpoch.diff(startEpoch, 'minutes');

        // Distance function
        // https://www.geodatasource.com/developers/javascript
        const tripDistance = distance(
            start_lat, // pass start lat
            start_lng, // pass start lng
            end_lat, // pass end lat
            end_lng, // pass end lng
            "k"
        ).toFixed(3);
        const tripSpeed = (parseFloat(tripDistance) / (endEpoch.diff(startEpoch, 'minutes')) * 60);

        // We return each trip with the format that Kepler.GL requires for each trip as the following
        return {
            "type": "Feature",
            // We add the trip information in the tooltip here.
            "properties": {
                "Start Time ▶️": startEpoch.format("DD/MM - HH:mm"),
                "End Time 🏁": endEpoch.format("DD/MM - HH:mm"),
                "Duration ⏱️": `${tripDuration} Min`,
                "Estimated Speed 🎿": `${tripSpeed.toFixed(1)} KM/h`,
            },
            "geometry": {
                "type": "LineString",
                // MUST BE AT LEAST THREE POINTS..
                // LNG, LAT, Elevation, Epoch
                "coordinates": [
                    [start_lng, start_lat, 0, start_datetime],  // Add the data for the start of the trip
                    [avg_lng, avg_lat, 0, avg_datetime],  // Add the data for the middle of the trip
                    [end_lng, end_lat, 0, end_datetime]  // Add the data for the end of the trip
                ]
            }
        }
    });

    // HDD - Debug
    // console.log("Trips", processedTrips);

    // Inject the head of the trip as it is in Kepler GL's example.
    // Link: https://github.com/keplergl/kepler.gl/blob/master/examples/demo-app/src/data/sample-animate-trip-data.js
    const ready = {
        "type": "FeatureCollection",
        "features": processedTrips
    }

    // HDD - Debug
    // console.log("ready", ready);

    // HDD - Debug
    // console.log("GeoJSON", processGeojson(ready));


    // Dispatch the data
    const dispatch = useDispatch();


    React.useEffect(() => {
        if (ready) {
            // HDD - Debug
            // console.log("Ready variable for React", ready);
            dispatch(
                addDataToMap({
                    datasets: {
                        info: {
                            label: "Trip Details",
                        },
                        data: processGeojson(ready)
                    },
                    option: {
                        centerMap: true,
                        readOnly: false
                    },
                    config: {
                        "mapState": {
                            "bearing": 0,
                            "dragRotate": false,
                            "latitude": 50.933249957830746,
                            "longitude": 6.943077214828662,
                            "pitch": 30,
                            "zoom": 12.048058916916952,
                            "isSplit": false
                        },
                    }
                })
            );
        }
    }, [dispatch, ready]);

    // Render the chart
    return (
        <Provider store={store}>
            <KeplerGl
                id="covid"
                mapboxApiAccessToken={"pk.eyJ1IjoiZ2VtMDA3YmQiLCJhIjoiY2s4eWp1bm1lMDI0YjNnbzJrdjAwZjBtOCJ9.tbVJU8WahL2ZTuI7fS-NDQ"}
                width={window.innerWidth}
                height={window.innerHeight}
            />
        </Provider>
    );
}