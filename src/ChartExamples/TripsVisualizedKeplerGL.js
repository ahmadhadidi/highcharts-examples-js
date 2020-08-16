import React, {useMemo, useState} from "react";
import Highcharts from "highcharts";  // Highcharts library
import HighchartsReact from 'highcharts-react-official';  // Highcharts wrapper for React
import moment from 'moment';
import {distance} from '../helpers/distance';

// Kepler.GL Imports
// import KeplerGl from "kepler.gl";
import keplerGlReducer, { uiStateUpdaters } from "kepler.gl/reducers";
import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import { taskMiddleware } from "react-palm/tasks";
import { Provider, useDispatch } from "react-redux";
import { addDataToMap } from "kepler.gl/actions";
import { processGeojson } from 'kepler.gl/processors';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { customizedKeplerGlReducer } from '../helpers/initialUiState';
import { enhanceReduxMiddleware } from 'kepler.gl/middleware';
import styled from 'styled-components';
import {theme} from 'kepler.gl/styles';

import CustomSidebarFactory from "../keplergl-components/side-bar";
import CustomPanelHeaderFactory from "../keplergl-components/panel-header";
import CustomPanelToggleFactory from "../keplergl-components/panel-toggle";
import CustomSidePanelFactory from "../keplergl-components/custom-panel";

import {
    SidebarFactory,
    PanelHeaderFactory,
    PanelToggleFactory,
    CustomPanelsFactory,
    injectComponents
} from 'kepler.gl/components';

// Kepler.GL Config
import tripVisState from '../helpers/visStateForTrips';

const StyledMapConfigDisplay = styled.div`
  position: absolute;
  z-index: 100;
  bottom: 10px;
  right: 10px;
  background-color: ${theme.sidePanelBg};
  font-size: 11px;
  width: 300px;
  color: ${theme.textColor};
  word-wrap: break-word;
  min-height: 60px;
  padding: 10px;
`;

// Inject custom components
const KeplerGl = injectComponents([
    [SidebarFactory, CustomSidebarFactory],
    // [PanelHeaderFactory, CustomPanelHeaderFactory],
    // [PanelToggleFactory, CustomPanelToggleFactory],
    [CustomPanelsFactory, CustomSidePanelFactory]
]);

// Create a reducer for Kepler using our customized reducer
const reducers = combineReducers({
    keplerGl: customizedKeplerGlReducer
});

// Setup for creating a Kepler Store
// Resource: https://github.com/keplergl/kepler.gl/blob/master/examples/custom-reducer/src/store.js
const middlewares = enhanceReduxMiddleware([]);
const enhancers = [applyMiddleware(...middlewares)];
const initialState = {};

// add redux devtools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Create a redux store for Kepler.GL
const store = createStore(reducers, initialState, composeEnhancers(...enhancers));

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
    const [data] = useState(bikeData.bikeData);

    // HDD - Debug
    // console.log("data", data);

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
                        readOnly: false,
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
                            "styleType": "light",
                            "mapStyles": {}
                        },
                        "visState":
                        tripVisState  // Configuration for the trips.
                    }
                })
            );
        }
    }, [dispatch, ready]);

    // Add state for the AutoSizer so that we can show Kepler.GL as a `chart` in `index.js`
    // Note: If you want Kepler to occupy the entire screen, comment the elements in
    const state = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    // Render the chart
    return (
        <Provider store={store}>
            {/* Uncomment the below chunk to show Kepler.GL as an adjacent div to the other charts */}
            {/*<AutoSizer>*/}
            {/*    {({width, height}) => (*/}
            {/*        <KeplerGl*/}
            {/*            id="covid"*/}
            {/*            mapboxApiAccessToken={"pk.eyJ1IjoiZ2VtMDA3YmQiLCJhIjoiY2s4eWp1bm1lMDI0YjNnbzJrdjAwZjBtOCJ9.tbVJU8WahL2ZTuI7fS-NDQ"}*/}
            {/*            width={width}*/}
            {/*            height={height}*/}
            {/*        />*/}
            {/*    )}*/}
            {/*</AutoSizer>*/}

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
// Done: Show legend by default.
// ABNDND: Show Coordinates by default.
    // Really annoying
// DONE: Time of the trips doesn't match the timeline 🤔.
// TODO: Inject the charts into KeplerGLs sidebar.