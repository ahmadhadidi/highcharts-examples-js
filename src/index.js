import React from "react";
import ReactDOM from "react-dom";
import "./layout.css" // import the layout
import bikeData from "../src/data/bikesharing_data.json" // Our converted CSV file into JSON

// Import the example charts
import { DemoChart } from "./ChartExamples/DemoChart";
import { TripsCountOneBikeChart } from "./ChartExamples/TripsCountOneBikeChart";
import { TripsCountChart } from "./ChartExamples/TripsCountChart";
import { TripsCountPerBikeChart } from "./ChartExamples/TripsCountPerBikeChart";
import { TripsAcrossDaysChart } from "./ChartExamples/TripsAcrossDaysChart";
import { TripsCountPerMonthChart } from "./ChartExamples/TripsCountPerMonth";

function App() {
    // Make a demo prop to pass it to the components
    const exampleProp = { name: "Ahmad" };

    // Combine both props into one prop
    const combinedProps = { bikeData, exampleProp };

    // HDD - Debug
    // console.log("In App");

    return (
        <div className="App flexbox">
            <div className="column">
                {/* Pass the bikeData as a partial object to make the code scalable */}
                <TripsCountChart bikeData={ combinedProps.bikeData } />
            </div>
            <div className="column">
                <TripsCountOneBikeChart bikeData={ combinedProps.bikeData }/>
            </div>
            <div className="column">
                <TripsCountPerBikeChart bikeData={ combinedProps.bikeData }/>
            </div>
            <div className="column">
                <TripsAcrossDaysChart bikeData={ combinedProps.bikeData }/>
            </div>
            <div className="column">
                <TripsCountPerMonthChart bikeData={ combinedProps.bikeData }/>
            </div>
            <div className="column">
                <DemoChart props/>
            </div>
        </div>
    );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);