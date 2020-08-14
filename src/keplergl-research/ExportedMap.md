### Notice
* Map config is coupled with loaded datasets. `dataId` is used to bind layers, filters, and tooltips to a specific
dataset. When passing this config to `addDataToMap`, make sure the **dataset id matches the dataId/s** in this config.

```json
{
  "version": "v1",
  "config": {
    "visState": {
      "filters": [
        {
          "dataId": [
            "16usj037n"
          ],
          "id": "bt7byv92b",
          "name": [],
          "type": null,
          "value": null,
          "enlarged": false,
          "plotType": "histogram",
          "yAxis": null
        },
        {
          "dataId": [
            "16usj037n"
          ],
          "id": "qe6nro3kc",
          "name": [
            "start_datetime"
          ],
          "type": "timeRange",
          "value": [
            1562361444600,
            1562530401600
          ],
          "enlarged": true,
          "plotType": "histogram",
          "yAxis": null
        }
      ],
      "layers": [
        {
          "id": "irlp7ij",
          "type": "trip",
          "config": {
            "dataId": "16usj037n",
            "label": "BikeSharingTripsLabel",
            "color": [
              221,
              178,
              124
            ],
            "columns": {
              "geojson": "start_lat"
            },
            "isVisible": true,
            "visConfig": {
              "opacity": 0.8,
              "thickness": 0.5,
              "colorRange": {
                "name": "Global Warming",
                "type": "sequential",
                "category": "Uber",
                "colors": [
                  "#5A1846",
                  "#900C3F",
                  "#C70039",
                  "#E3611C",
                  "#F1920E",
                  "#FFC300"
                ]
              },
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
          "visualChannels": {
            "colorField": null,
            "colorScale": "quantile",
            "sizeField": null,
            "sizeScale": "linear"
          }
        }
      ],
      "interactionConfig": {
        "tooltip": {
          "fieldsToShow": {
            "16usj037n": [
              {
                "name": "id",
                "format": null
              },
              {
                "name": "bike",
                "format": null
              },
              {
                "name": "start_datetime",
                "format": null
              },
              {
                "name": "end_datetime",
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
        "geocoder": {
          "enabled": false
        },
        "coordinate": {
          "enabled": false
        }
      },
      "layerBlending": "normal",
      "splitMaps": [],
      "animationConfig": {
        "currentTime": null,
        "speed": 1
      }
    },
    "mapState": {
      "bearing": 0,
      "dragRotate": false,
      "latitude": 50.947004175000004,
      "longitude": 6.949357842,
      "pitch": 30,
      "zoom": 12,
      "isSplit": false
    },
    "mapStyle": {
      "styleType": "dark",
      "topLayerGroups": {},
      "visibleLayerGroups": {
        "label": true,
        "road": true,
        "border": false,
        "building": true,
        "water": true,
        "land": true,
        "3d building": false
      },
      "threeDBuildingColor": [
        9.665468314072013,
        17.18305478057247,
        31.1442867897876
      ],
      "mapStyles": {}
    }
  }
}
```