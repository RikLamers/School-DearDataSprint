// var width = 960,
//         height = 550;

//     var colour = d3.scale.category20();

//     var projection = d3.geo.mercator()
//         .scale(1)
//         .translate([0, 0]);

//     var path = d3.geo.path()
//         .projection(projection);

//     var svg = d3.select("body").append("svg")
//         .attr("width", width)
//         .attr("height", height);

//     d3.json("nld.json", function(error, nld) {

//         var l = topojson.feature(nld, nld.objects.subunits).features[3],
//             b = path.bounds(l),
//             s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
//             t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

//         projection
//             .scale(s)
//             .translate(t);

//         svg.selectAll("path")
//             .data(topojson.feature(nld, nld.objects.subunits).features).enter()
//             .append("path")
//             .attr("d", path)
//             .attr("fill", function(d, i) {
//                 return colour(i);
//             })
//             .attr("class", function(d, i) {
//                 return d.properties.name;
//             });
//     });

//     http://bl.ocks.org/phil-pedruco/9344373


var data = [];

d3.csv('../data/locatiegeschiedenis.csv', function(d,i) {
    var lat = getRightCoords(d.Latitude);
    var long = getRightCoords(d.Longitude);
    var date = getTime(d.Time);

    var result = {
        date: date.date,
        time: date.time,
        latitude: lat,
        longitude: long
    };

    data.push(result);

});

function getRightCoords(coords) {
	var count = coords.length - 7;
    var secondHalf = coords.slice(count);
    var firstHalf = coords.substring(0, count)
    var coord = firstHalf + '.' + secondHalf;
	return Number(coord);
}

function getTime(date) {
    var timeOnly = date.substring(11);
    var dateOnly = date.substring(0, 10);
    var dateFormat = dateOnly.split('/').join('-');
    var result = {
        date: dateFormat,
        time: timeOnly
    };
    return result;
}

var musicData = [];

d3.csv('../data/music.csv', function(d,i) {
    var date = getRightMusicTime(d.time);
    var result = {
        artist: d.Artist,
        title: d.Title,
        album: d.Album,
        date: date.date,
        time: date.time
    };

    musicData.push(result);
});

function getRightMusicTime(date) {
    var dateOnly = date.split('Mar').join('03').substring(0, 10).split(' ').join('-');
    var timeOnly = date.substring(12);

    var result = {
        date: dateOnly,
        time: timeOnly
    }

    return result;
}

var dataReverse;
var musicDataRevers;
setTimeout(function() {
    dataReverse = data.reverse();
    musicDataRevers = musicData.reverse();
    console.log(dataReverse);
    console.log(musicDataRevers);
}, 1000);
  