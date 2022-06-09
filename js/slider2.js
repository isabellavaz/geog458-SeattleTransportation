'use strict';

(function () {
    const layers = [
        '0-1,000',
        '1,000-5,000',
        '5,000-10,000',
        '10,000-15,000',
        '15,000-20,000',
        '20,000-30,000',
        '30,000-40,000',
        '40,000 and more',
        'No data',
    ];
    const colors = [
        '#FFEDA0',
        '#FED976',
        '#FEB24C',
        '#FD8D3C',
        '#FC4E2A',
        '#E31A1C',
        '#BD0026',
        '#800026',
        '#000000',
    ];
    const data = {
        2010: 'https://gisdata.seattle.gov/server/rest/services/SDOT/SDOT_Traffic_Volume/MapServer/3/query?outFields=*&where=1%3D1&f=geojson',
        2011: 'https://gisdata.seattle.gov/server/rest/services/SDOT/SDOT_Traffic_Volume/MapServer/4/query?outFields=*&where=1%3D1&f=geojson',
        2012: 'https://gisdata.seattle.gov/server/rest/services/SDOT/SDOT_Traffic_Volume/MapServer/5/query?outFields=*&where=1%3D1&f=geojson',
        2013: 'https://gisdata.seattle.gov/server/rest/services/SDOT/SDOT_Traffic_Volume/MapServer/6/query?outFields=*&where=1%3D1&f=geojson',
        2014: 'https://gisdata.seattle.gov/server/rest/services/SDOT/SDOT_Traffic_Volume/MapServer/7/query?outFields=*&where=1%3D1&f=geojson',
        2015: 'https://gisdata.seattle.gov/server/rest/services/SDOT/SDOT_Traffic_Volume/MapServer/8/query?outFields=*&where=1%3D1&f=geojson',
        2016: 'https://gisdata.seattle.gov/server/rest/services/SDOT/SDOT_Traffic_Volume/MapServer/9/query?outFields=*&where=1%3D1&f=geojson',
        2017: 'https://gisdata.seattle.gov/server/rest/services/SDOT/SDOT_Traffic_Volume/MapServer/10/query?outFields=*&where=1%3D1&f=geojson',
        2018: 'https://gisdata.seattle.gov/server/rest/services/SDOT/SDOT_Traffic_Volume/MapServer/11/query?outFields=*&where=1%3D1&f=geojson',
    }

    window.addEventListener('load', init);

    function init() {
        // initialize basemmap
        mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/dark-v10', // style URL
            projection: 'albers',
            zoom: 12, // starting zoom
            center: [-122.3228888311884, 47.603535767789154] // starting center
        });

        geojsonFetch(map);
        document.getElementById('slider').addEventListener('input', function() {
            document.getElementById('year').textContent = this.value;
            map.removeLayer('rateData-layer');
            map.addLayer({
                'id': 'rateData-layer',
                'type': 'line',
                'source': `rateData${this.value}`,
                'layout': {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                'paint': {
                    'line-color': [
                        'step',
                        ['get', data[this.value].features[0].properties.AWDT ? 'AWDT' : 'AAWDT'],
                        '#FFEDA0',
                        1000,
                        '#FED976',
                        5000,
                        '#FEB24C',
                        10000,
                        '#FD8D3C',
                        15000,
                        '#FC4E2A',
                        20000,
                        '#E31A1C',
                        30000,
                        '#BD0026',
                        40000,
                        "#800026"
                    ],
                    'line-width': 2,
                }
            });
        });
    }

    // load data and add as layer
    async function geojsonFetch(map) {
        let promises = [];
        for (let year in data) {
            promises.push(fetch(data[year]).then(res => res.json()).then(res => data[year] = res));
        }
        await Promise.all(promises);
        console.log(data);
        document.getElementById('loading').classList.add('hidden');
        Object.entries(data).forEach(d => map.addSource(`rateData${d[0]}`, {
            type: 'geojson',
            data: d[1]
        }));

        map.addLayer({
            'id': 'rateData-layer',
            'type': 'line',
            'source': 'rateData2018',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': [
                    'step',
                    ['get', 'AWDT'],
                    '#FFEDA0',
                    1000,
                    '#FED976',
                    5000,
                    '#FEB24C',
                    10000,
                    '#FD8D3C',
                    15000,
                    '#FC4E2A',
                    20000,
                    '#E31A1C',
                    30000,
                    '#BD0026',
                    40000,
                    "#800026"
                ],
                'line-width': 2,
                // 'fill-outline-color': '#BBBBBB',
                // 'fill-opacity': 0.7,
            }
        });

        // legend
        const legend = document.getElementById('legend');
        legend.innerHTML = "<b>Traffic Data in Seattle<br></b><p>Average Weekday Traffic Volumes<br><em>1,000s of Vehicles</em></p><br>";
        const source =
            '<p style="text-align: right; font-size:10pt"> Data Source: <a href="https://data-seattlecitygis.opendata.arcgis.com/datasets/2018-traffic-flow-counts">City of Seattle GIS Open Data</a></p>';

        layers.forEach((layer, i) => {
            const color = colors[i];
            const item = document.createElement('div');
            const key = document.createElement('span');
            key.className = 'legend-key';
            key.style.backgroundColor = color;

            const value = document.createElement('span');
            value.innerHTML = `${layer}`;
            item.appendChild(key);
            item.appendChild(value);
            legend.appendChild(item);
        });
        legend.innerHTML += source;

        map.on('mousemove', ({ point }) => {
            const area = map.queryRenderedFeatures(point, {
                layers: ['rateData-layer']
            });
            document.getElementById('text-escription').innerHTML = area.length ?
                `<h3>${area[0].properties.STNAME_ORD ?? area[0].properties.STNAME ?? 'Unknown Street'}</h3>
                <p>
                    <em>
                        <strong>${(area[0].properties.AWDT ? area[0].properties.AWDT : area[0].properties.AAWDT).toLocaleString()}</strong> thousands average weekday vehicles
                    </em>
                </p>` : '<p>Hover over a street to see the traffic density!</p>';
        });
    }
})();
