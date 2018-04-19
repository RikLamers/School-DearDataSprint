function buildMapGraph(location, properties, music, filter) {

    var filteredLocationData = [];
    var filteredMusicData = [];

    for (var i = 0; i < location.length; i++) {
        if (location[i].date === filter) {
            if (location[i].latitude.toString()[1] === '.') {
                var latitude = location[i].latitude.toString().replace('.', '').substr(0, 2) + '.' + location[i].latitude.toString().substr(3, location[i].latitude.toString().length);

                var result = {
                    date: location[i].date,
                    time: location[i].time,
                    longitude: location[i].longitude,
                    latitude: Number(latitude)
                }
                filteredLocationData.push(result);
            } else {
                filteredLocationData.push(location[i]);
            }
        }
    }

    var svg = d3.select('#choroplethSVG');

    var projection = d3.geoMercator()
        .translate([properties.width / 2, properties.height / 2])
        .scale(100);

    var path = d3.geoPath()
        .projection(projection);

    if (Number(filter.split('-')[0] > 16) && Number(filter.split('-')[0] < 26)) {
        buildJapan(properties, filteredLocationData);
    } else {
        buildNetherlands(properties, filteredLocationData);
    }

}

function lineDataFormatting(data) {
    var lineData = [];

    for (var i = 0; i < data.length; i++) {
        var result;

        if (i === data.length - 1) {
            result = {
                from: {
                    latitude: data[i].latitude,
                    longitude: data[i].longitude
                },
                to: {
                    latitude: undefined,
                    longitude: undefined
                }
            }
        } else {
            result = {
                from: {
                    latitude: data[i].latitude,
                    longitude: data[i].longitude
                },
                to: {
                    latitude: data[i + 1].latitude,
                    longitude: data[i + 1].longitude
                }
            }
        }
        lineData.push(result);
    }
    return lineData;
}

function buildNetherlands(properties, data) {

    var lineData = lineDataFormatting(data);

    var svg = d3.select('#choroplethSVG');

    // set standard zoom
    svg.attr('transform','translate(-307.9491808452208,-2234.235587745507) scale(14.702606135664869)');

    var projection = d3.geoMercator()
        .scale(1)
        .translate([0, 0]);

    var path = d3.geoPath()
        .projection(projection);

    d3.json('/data/nld.json').then(function(nld) {

        var l = topojson.feature(nld, nld.objects.subunits).features[3],
        b = path.bounds(l),
        s = .3 / Math.max((b[1][0] - b[0][0]) / properties.width, (b[1][1] - b[0][1]) / properties.height),
        t = [((properties.width / 1.1) - s * (b[1][0] + b[0][0])) / 2, ((properties.height / 1.5) - s * (b[1][1] + b[0][1])) / 2];

        projection
            .scale(s)
            .translate(t);

        var provincies = topojson.feature(nld, nld.objects.subunits).features;

        svg.selectAll('.provincie')
            .data(provincies)
            .enter()
            .append('path')
                .attr('class', 'provincie')
                .attr('d', path)
                .attr('fill', '#e5e5e5')
                .attr('stroke', '#777')
                .attr('stroke-width', 0.5);

        svg.selectAll('punten')
            .data(data)
            .enter()
            .append('circle')
                .attr('fill', 'red')
                .attr('r', 0.5)
                .attr('cx', function(d) {
                    return projection([d.longitude, d.latitude])[0];
                })
                .attr('cy', function(d) {
                    return projection([d.longitude, d.latitude])[1];
                });

        svg.selectAll('lijnen')
            .data(lineData)
            .enter()
            .append('line')
                .attr('class', 'lijntje')
                .attr('stroke', 'blue')
                .attr('stroke-width', 0.3)
                .attr('x1', function(d) {
                    return projection([d.from.longitude, d.from.latitude])[0];
                })
                .attr('y1', function(d) {
                    return projection([d.from.longitude, d.from.latitude])[1];
                })
                .attr('x2', function(d, i) {
                    if (i === lineData.length - 1) {
                        return projection([d.from.longitude, d.from.latitude])[0];
                    } else {
                        return projection([d.to.longitude, d.to.latitude])[0];
                    }
                })
                .attr('y2', function(d, i) {
                    if (i === lineData.length - 1) {
                        return projection([d.from.longitude, d.from.latitude])[1];
                    } else {
                        return projection([d.to.longitude, d.to.latitude])[1];
                    }
                });
                

    });

    

    // make zoomable
    svg.call(d3.zoom().on("zoom", function () {
        var x = d3.event.transform.x * 7 + -307.9491808452208;
        var y = d3.event.transform.y * 7 + -2234.235587745507;
        var scale = d3.event.transform.k * 5 + 14.702606135664869;
        svg.attr("transform", 'translate(' + x + ',' +  + y +') scale(' + scale +')')
    }));

}

function buildJapan(properties, data) {

    var svg = d3.select('#choroplethSVG');

    // set standard zoom
    svg.attr('transform','translate(-4047.9534809248953,2948.2391641178037) scale(93.18333113594278)');

    var lineData = lineDataFormatting(data);

    var projection = d3.geoMercator()
		.center([137, 34])
		.scale(900)
		.translate([properties.width / 2, properties.height / 2]);

	var path = d3.geoPath()
		.projection(projection);

    d3.json('/data/japan.json').then(function(jpn) {

        var japan = topojson.feature(jpn, jpn.objects.japan).features;

        svg.selectAll('.provincie')
            .data(japan)
            .enter()
            .append('path')
                .attr('class', 'provincie')
                .attr('d', path)
                .attr('fill', '#e5e5e5')
                .attr('stroke', '#777')
                .attr('stroke-width', 0.05);

        svg.selectAll('punten')
            .data(data)
            .enter()
            .append('circle')
                .attr('fill', 'red')
                .attr('r', 0.05)
                .attr('cx', function(d) {
                    return projection([d.longitude, d.latitude])[0];
                })
                .attr('cy', function(d) {
                    return projection([d.longitude, d.latitude])[1];
                });

        svg.selectAll('lijnen')
            .data(lineData)
            .enter()
            .append('line')
                .attr('class', 'lijntje')
                .attr('stroke', 'blue')
                .attr('stroke-width', 0.05)
                .attr('x1', function(d) {
                    return projection([d.from.longitude, d.from.latitude])[0];
                })
                .attr('y1', function(d) {
                    return projection([d.from.longitude, d.from.latitude])[1];
                })
                .attr('x2', function(d, i) {
                    if (i === lineData.length - 1) {
                        return projection([d.from.longitude, d.from.latitude])[0];
                    } else {
                        return projection([d.to.longitude, d.to.latitude])[0];
                    }
                })
                .attr('y2', function(d, i) {
                    if (i === lineData.length - 1) {
                        return projection([d.from.longitude, d.from.latitude])[1];
                    } else {
                        return projection([d.to.longitude, d.to.latitude])[1];
                    }
                });

    });

    // make zoomable
    // svg.call(d3.zoom().on("zoom", function () {
    //     var x = (d3.event.transform.x * 50) + -4047.9534809248953;
    //     var y = (d3.event.transform.y * 50) + 2948.2391641178037;
    //     var scale = (d3.event.transform.k * 30) + 93.18333113594278;
    //     svg.attr("transform", 'translate(' + x + ',' +  + y +') scale(' + scale +')')
    // }));

}
