function filterLocationData(location, filter) {
    var filteredLocationData = [];

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
    return filteredLocationData;
}

function filterMusicData(music, filteredLocationData, filter) {

    var firstFilter = [];

    for (var i = 0; i < music.length; i++) {
        if (music[i].date === filter) {
            firstFilter.push(music[i]);
        }
    }

    var secondFilter = [];

    
    for (var x = 0; x < filteredLocationData.length; x++) {
        var timeSingle = filteredLocationData[x].time.replace(':', '.');
        secondFilter[timeSingle] = [];
    }

    var secondFilterKeys = Object.keys(secondFilter);

    var filteredMusicData = [];

    for (var y = 0; y < secondFilterKeys.length; y++) {

        var timeSingle = secondFilterKeys[y];
        filteredMusicData[timeSingle] = [];

        if (secondFilterKeys[y + 1] !== undefined) {

            for (var z = 0; z < firstFilter.length; z++) {

                if (Number(firstFilter[z].time.replace(':', '.')) >= Number(secondFilterKeys[y]) && Number(firstFilter[z].time.replace(':', '.')) <= Number(secondFilterKeys[y + 1])) {
                    filteredMusicData[timeSingle].push(firstFilter[z]);
                }

            }

        }

    }

    return filteredMusicData;

}

function buildMapGraph(location, properties, music, filter) {

    var filteredLocationData = filterLocationData(location, filter);
    var filteredMusicData = filterMusicData(music, filteredLocationData, filter);


    var svg = d3.select('#choroplethSVG');

    var projection = d3.geoMercator()
        .translate([properties.width / 2, properties.height / 2])
        .scale(100);

    var path = d3.geoPath()
        .projection(projection);

    if (Number(filter.split('-')[0] > 16) && Number(filter.split('-')[0] < 26)) {
        buildJapan(properties, filteredLocationData, filteredMusicData);
    } else {
        buildNetherlands(properties, filteredLocationData, filteredMusicData);
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
                },
                time: Number(data[i].time.replace(':', '.'))
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
                },
                time: Number(data[i].time.replace(':', '.')),
                timeAfter: Number(data[i + 1].time.replace(':', '.'))
            }
        }
        lineData.push(result);
    }
    return lineData;
}

function setStandardPosition(svg) {
    if (window.innerWidth > 1600) {
        svg.attr('transform','translate(-0.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 1500 && window.innerWidth < 1601) {
        svg.attr('transform','translate(-100.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 1400 && window.innerWidth < 1501) {
        svg.attr('transform','translate(-200.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 1300 && window.innerWidth < 1401) {
        svg.attr('transform','translate(-250.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 1200 && window.innerWidth < 1301) {
        svg.attr('transform','translate(-300.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 1100 && window.innerWidth < 1201) {
        svg.attr('transform','translate(-350.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 1000 && window.innerWidth < 1101) {
        svg.attr('transform','translate(-400.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 900 && window.innerWidth < 1001) {
        svg.attr('transform','translate(-450.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 800 && window.innerWidth < 901) {
        svg.attr('transform','translate(-500.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 700 && window.innerWidth < 801) {
        svg.attr('transform','translate(-650.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 600 && window.innerWidth < 701) {
        svg.attr('transform','translate(-700.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else if (window.innerWidth > 500 && window.innerWidth < 601) {
        svg.attr('transform','translate(-750.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    } else {
        svg.attr('transform','translate(-800.9491808452208,-2234.235587745507) scale(14.702606135664869)');
    }
}

function buildNetherlands(properties, data, music) {

    var lineData = lineDataFormatting(data);

    var svg = d3.select('#choroplethSVG');

    // set standard zoom for different device widths
    setStandardPosition(svg);

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
                .attr('fill', '#FF6B6B')
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
                .attr('stroke', '#FFE66D')
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
                })
                .on('mouseover', function(d, i) {
                    d3
                        .select('.chart__tooltip')
                        .transition()
                        .duration(200)
                        .style('opacity', 0.9)
                        .style('visibility', 'visible');

                    var musicTimefiltered = [];
                    var musicKeys = Object.keys(music);

                    for (var i = 0; i < musicKeys.length; i++) {

                        if (Number(d.time) === Number(musicKeys[i])) {
                            musicTimefiltered.push(music[musicKeys[i]]);
                        }

                    }

                    var tooltipHTML;
                
                    var tooltipValue = function() {

                        if (musicTimefiltered[0].length !== 0) {
                            console.log(musicTimefiltered[0]);
                            for (var x = 0; x < musicTimefiltered[0].length; x++) {
                                if (x === 0) {
                                    tooltipHTML = '<div class="border-custom" style="padding: 5px;">' + musicTimefiltered[0][x].artist + ' - ' + musicTimefiltered[0][x].title + '</div>';
                                } else if (x === musicTimefiltered[0].length - 1) {
                                    tooltipHTML = tooltipHTML + '<div style="padding: 5px;">' + musicTimefiltered[0][x].artist + ' - ' + musicTimefiltered[0][x].title + '</div>';
                                } else {
                                    tooltipHTML = tooltipHTML + '<div class="border-custom" style="padding: 5px;">' + musicTimefiltered[0][x].artist + ' - ' + musicTimefiltered[0][x].title + '</div>';
                                }
                            }
                        } else {
                            tooltipHTML = 'Tussen deze tijdstippen heb ik geen muziek geluisterd';
                        }


                        return '<div style="background-color: #184C54; color: white; padding: 10px; border-radius: 5px;">' + tooltipHTML + '</div>';
                    };
                    $('.chart__tooltip').html(tooltipValue);
                })
                    .on('mousemove', function() {
                    return d3.select('.chart__tooltip')
                        .style('top', d3.event.pageY - 10 + 'px')
                        .style('left', d3.event.pageX + 10 + 'px')
                        .style('cursor', 'default');
                })
                    .on('mouseout', function(d, i) {
                    d3.select('.chart__tooltip')
                        .style('opacity', 0)
                        .style('visibility', 'hidden');
                });
                

    });

    // make zoomable
    // svg.call(d3.zoom().on("zoom", function () {
    //     var x = d3.event.transform.x * 7 + -307.9491808452208;
    //     var y = d3.event.transform.y * 7 + -2234.235587745507;
    //     var scale = d3.event.transform.k * 5 + 14.702606135664869;
    //     svg.attr("transform", 'translate(' + x + ',' +  + y +') scale(' + scale +')')
    // }));

}

function buildJapan(properties, data, music) {

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
                .attr('fill', '#FF6B6B')
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
                .attr('stroke', '#FFE66D')
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
                })
                .on('mouseover', function(d, i) {
                    d3
                        .select('.chart__tooltip')
                        .transition()
                        .duration(200)
                        .style('opacity', 0.9)
                        .style('visibility', 'visible');

                    var musicTimefiltered = [];
                    var musicKeys = Object.keys(music);

                    for (var i = 0; i < musicKeys.length; i++) {

                        if (Number(d.time) === Number(musicKeys[i])) {
                            musicTimefiltered.push(music[musicKeys[i]]);
                        }

                    }

                    var tooltipHTML;
                
                    var tooltipValue = function() {

                        if (musicTimefiltered[0].length !== 0) {
                            console.log(musicTimefiltered[0]);
                            for (var x = 0; x < musicTimefiltered[0].length; x++) {
                                if (x === 0) {
                                    tooltipHTML = '<div class="border-custom" style="padding: 5px;">' + musicTimefiltered[0][x].artist + ' - ' + musicTimefiltered[0][x].title + '</div>';
                                } else if (x === musicTimefiltered[0].length - 1) {
                                    tooltipHTML = tooltipHTML + '<div style="padding: 5px;">' + musicTimefiltered[0][x].artist + ' - ' + musicTimefiltered[0][x].title + '</div>';
                                } else {
                                    tooltipHTML = tooltipHTML + '<div class="border-custom" style="padding: 5px;">' + musicTimefiltered[0][x].artist + ' - ' + musicTimefiltered[0][x].title + '</div>';
                                }
                            }
                        } else {
                            tooltipHTML = 'Tussen deze tijdstippen heb ik geen muziek geluisterd';
                        }


                        return '<div style="background-color: #184C54; color: white; padding: 10px; border-radius: 5px;">' + tooltipHTML + '</div>';
                    };
                    $('.chart__tooltip').html(tooltipValue);
                })
                    .on('mousemove', function() {
                    return d3.select('.chart__tooltip')
                        .style('top', d3.event.pageY - 10 + 'px')
                        .style('left', d3.event.pageX + 10 + 'px')
                        .style('cursor', 'default');
                })
                    .on('mouseout', function(d, i) {
                    d3.select('.chart__tooltip')
                        .style('opacity', 0)
                        .style('visibility', 'hidden');
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
