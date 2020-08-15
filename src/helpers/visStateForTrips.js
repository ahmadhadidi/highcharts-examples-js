import animationConfiguration from "./animationConfiguration";

export default {
    "layers": [
        {
            "id": "yosy2x",
            "type": "trip",
            "config": {
                // Notice here that dataId must be similar to the dataID in "datasets > info > id"
                "dataId": "trips-layer",
                "label": "Trip Details",
                "color": [
                    18,
                    147,
                    154
                ],
                "columns": {
                    "geojson": "_geojson"
                },
                "isVisible": true,
                "visConfig": {
                    "opacity": 0.8,
                    // How thick the trip is
                    "thickness": 1,
                    // The color range of the trip based on the speed.
                    "colorRange": {
                        "name": "Uber Viz Diverging 3.5",
                        "type": "diverging",
                        "category": "Uber",
                        "colors": [
                            "#00939C",
                            "#2FA7AE",
                            "#5DBABF",
                            "#8CCED1",
                            "#BAE1E2",
                            "#F8C0AA",
                            "#EB9C80",
                            "#DD7755",
                            "#D0532B",
                            "#C22E00"
                        ]
                    },
                    // How long the tail of each trip is allowed to be.
                    // The unit `180` here means 180 seconds.
                    "trailLength": 180,
                    "sizeRange": [
                        0,
                        10
                    ]
                },
                "hidden": false,
                "textLabel": [
                    {
                        "field": null,
                        "color": [
                            255,
                            255,
                            255
                        ],
                        "size": 18,
                        "offset": [
                            0,
                            0
                        ],
                        "anchor": "start",
                        "alignment": "center"
                    }
                ]
            },
            // This is 100% bugged, it doesn't accept "raw_speed" as a variable.
            "visualChannels": {
                "colorField": {
                    "name": "raw_speed",
                    "type": "real"
                },
                "colorScale": "quantize",
                "sizeField": null,
                "sizeScale": "linear"
            }
        }
    ],
    // The animation details in which we can adjust the playback rate of the animation and
    // at which point we can start it from. Uses epoch.
    "animationConfig": animationConfiguration,
    "interactionConfig": {
        "tooltip": {
            "fieldsToShow": {
                "trips-layer": [
                    {
                        "name": "Start Time ▶️",
                        "format": null
                    },
                    {
                        "name": "End Time 🏁",
                        "format": null
                    },
                    {
                        "name": "Duration ⏱️",
                        "format": null
                    },
                    {
                        "name": "Distance 📏",
                        "format": null
                    },
                    {
                        "name": "Estimated Speed 🎿",
                        "format": null
                    }
                ]
            },
            "compareMode": false,
            "compareType": "absolute",
            "enabled": true
        },
        "brush": {
            "size": 0.5,
            "enabled": false
        },
        // Search bar on the top right corner of the interface
        "geocoder": {
            "enabled": true
        },
        // Shows the Longtitude and Latitude when the mouse is hovered anywhere on the map
        "coordinate": {
            "enabled": false
        }
    }
}