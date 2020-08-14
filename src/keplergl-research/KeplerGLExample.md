### How to enable trip animation
In order to animate the path, the geoJSON data needs to contain `LineString` in its feature geometry, and the 
coordinates in the LineString need to have 4 elements in the formats of `[longitude, latitude, altitude, timestamp]` 
with the last element being a timestamp. Valid timestamp formats include unix in seconds such as `1564184363` or in
milliseconds such as `1564184363000`.

### Example
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": { "vendor":  "A",
      "vol":20},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [-74.20986, 40.81773, 0, 1564184363],
          [-74.20987, 40.81765, 0, 1564184396],
          [-74.20998, 40.81746, 0, 1564184409]
        ]
      }
    }
  ]
}
```
