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
import KeplerGlSchema from 'kepler.gl/schemas';

// Kepler.GL Config
import tripVisState from '../helpers/visStateForTrips';

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
    // Refer to this image: 'highcharts-examples-js/keplergl-research/tripExample.png'
    // Link: https://github.com/keplergl/kepler.gl/blob/master/examples/demo-app/src/data/sample-animate-trip-data.js
    const processedTrips = data.map(n => {
        // Create dedicated variables for coordinates and the time
        const start_lng = n.start_lng;
        const end_lng = n.end_lng;
        const start_lat = n.start_lat;
        const end_lat = n.end_lat;

        // Add 2 hours (7200 Seconds) to make the playback start at 02:01
        const start_datetime = (new Date(n.start_datetime).getTime() / 1000) + 7200;
        const end_datetime = (new Date(n.end_datetime).getTime() / 1000) + 7200;

        // Since Kepler.GL requires a minimum of 3 arrays containing the Lng, Lat, Elevation, and Time, we can
        // solve this by creating an average value of the aforementioned elements.
        const avg_lng = ((start_lng + end_lng) / 2);
        const avg_lat = ((start_lat + end_lat) / 2);
        const avg_datetime = ((start_datetime + end_datetime) / 2);

        // Prepare variables for the tooltip when we hover over a trip
        // Since Javascript doesn't come with a customized way to output a certain formatting
        // we will use a library called Moment which will allow us to output timestamps
        // in a way that suits us.
        // ! : Remove two hours because moment adds it.
        const startEpoch = moment.unix(start_datetime).subtract(2, 'h');
        const endEpoch = moment.unix(end_datetime).subtract(2, 'h');
        const tripDuration = endEpoch.diff(startEpoch, 'minutes');

        // Distance function
        // Resource: https://www.geodatasource.com/developers/javascript
        const tripDistance = distance(
            start_lat, // pass start lat
            start_lng, // pass start lng
            end_lat, // pass end lat
            end_lng, // pass end lng
            "k"
        ).toFixed(2);

        // Calculate the trip speed
        const tripSpeed = (parseFloat(tripDistance) / (endEpoch.diff(startEpoch, 'minutes')) * 60);

        // We return each trip with the format that Kepler.GL requires for each trip as the following
        return {
            "type": "Feature",
            // We add the trip information in the tooltip here.
            "properties": {
                "Start Time ▶️": startEpoch.format("DD/MM - HH:mm"),
                "End Time 🏁": endEpoch.format("DD/MM - HH:mm"),
                "Duration ⏱️": `${tripDuration} Min`,
                "Distance 📏": `${tripDistance} KM`,
                "Estimated Speed 🎿": `${tripSpeed.toFixed(1)} KM/h`,
                // Note that Kepler hover only shows the first 5 properties so this one won't appear on hover
                "raw_speed": tripSpeed.toFixed(1)
            },
            "geometry": {
                "type": "LineString",
                // MUST BE AT LEAST THREE ARRAYS..
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
                            id: 'trips-layer',
                        },
                        data: processGeojson(ready),

                    },
                    option: {
                        centerMap: true,
                        readOnly: false
                    },
                    config: {
                        "mapState": {
                            "bearing": 0,
                            "dragRotate": true,
                            "latitude": 50.933249957830746,
                            "longitude": 6.943077214828662,
                            "pitch": 30,
                            "zoom": 12.048058916916952,
                            "isSplit": false
                        },
                        "mapStyle": {
                            "styleType": "dark",
                            "mapStyles": {}
                        },
                        "visState":
                            tripVisState  // Configuration for the trips.

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

// Journal:
// DONE: Custom Color on the trips themselves (speed bound).
// Can't be done since it is a bug.
// ABNDND: Show legend by default.
// Doesn't have its own trigger.
// ABNDND: Show Coordinates by default.
// Really annoying
// DONE: Time of the trips doesn't match the timeline 🤔.
// TODO: Inject the charts into KeplerGLs sidebar.