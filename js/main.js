buildBaseGraphs(musicData);
buildBaseGraphs(locationData, musicData);

$('#dateControlledByRange').on('input', function() {
    $('#rangeControlledByDate').prop('valueAsNumber', $.prop(this, 'valueAsNumber'));
});
$('#rangeControlledByDate').on('input', function() {
    $('#dateControlledByRange').prop('valueAsNumber', $.prop(this, 'valueAsNumber'));
});

var slider = document.getElementById('rangeControlledByDate');
var filterDate = document.getElementById('dateControlledByRange');

slider.addEventListener('change', function() {
    // Remove svg to build again
    var map = document.getElementById('choroplethSVG');
    map.remove();

    // Format filter right
    var filterSplit = filterDate.value.split('-');
    var filter = filterSplit[2] + '-' + filterSplit[1] + '-' + filterSplit[0];

    buildBaseGraphs(locationData, musicData, filter);
});

// Resize event handler
var resizeTimer;
$(window).resize(function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(doResize, 200);
});

// What to do when resize happens
function doResize() {
    rebuildOnResize();
}

// Function to remove graphs and build them again.
function rebuildOnResize() {
    // Remove linegraph
    var averageKMGraph = document.getElementById('barchart__artistsSVG');
    averageKMGraph.remove();

    // Build linegraph again
    buildBaseGraphs(musicData); 
}

// Base function
function buildBaseGraphs(data, data2 = 0, filter = '05-03-2018') {

    // Create base tooltip
    var tooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'chart__tooltip')
        .style('position', 'absolute')
        .style('z-index', '10')
        .style('visibility', 'hidden')
        .style('opacity', 0);

    var margin = {
        top: 80,
        right: 60,
        bottom: 80,
        left: 60
    };

    // GET RIGHT ID
    var graphDiv = document.getElementById(data.name);
    graphDiv.style.width = '100%';
    graphDiv.style.overflow = 'hidden';
    var holderWidth = document.getElementById('container--' + data.name).offsetWidth;

    var width = holderWidth - margin.right - margin.left;
    var height = 600 - margin.top - margin.bottom;

    var baseProps = {
        margin: margin,
        holderWidth: holderWidth,
        width: width,
        height: height
    };

    var chartSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    chartSVG.setAttribute('width', width);
    chartSVG.setAttribute('height', height);
    chartSVG.setAttribute('id',  data.name + 'SVG');
    chartSVG.setAttribute('style', 'padding:' + margin.top + 'px ' + margin.right + 'px ' + margin.bottom + 'px ' + margin.left + 'px');
    graphDiv.appendChild(chartSVG);

    switch(data.name) {

        case 'barchart__artists':
            return buildBarChartArtist(data.data, baseProps);

        case 'choropleth':
            return buildMapGraph(data.data, baseProps, data2.data, filter);

        default:
            return;

    }
}


// var svg = d3.select("body")
//         .append("svg")
//         .attr("width", "100%")
//         .attr("height", "100%")
//         .call(d3.zoom().on("zoom", function () {
//             svg.attr("transform", d3.event.transform)
//         }))
//         .append("g")

//     svg.append("circle")
//         .attr("cx", document.body.clientWidth / 2)
//         .attr("cy", document.body.clientHeight / 2)
//         .attr("r", 50)
//         .style("fill", "#B8DEE6")

