function buildBarChartArtist(data, properties) {
    // Prepare data
    var allArtist = [];

    for (var i = 0; i < data.length; i++) {
        allArtist.push(data[i].artist);
    }

    // Uitleg
    // https://gist.github.com/ralphcrisostomo/3141412
    var countArtist = allArtist.reduce((b,c)=>((b[b.findIndex(d=>d.artist===c)]||b[b.push({artist:c,count:0})-1]).count++,b),[]);

    var sortArtists = [];

   for (var x = 0; x < countArtist.length; x++) {
       sortArtists.push([countArtist[x].artist, countArtist[x].count]);
   }

    sortArtists.sort(function(a, b) {
        return a[1] - b[1];
    });

    sortArtists.reverse();
    var top10 = sortArtists.slice(0,10);

    // Select SVG
    var svg = d3.select('#barchart__artistsSVG');

    // SET RANGE X AXIS
    var x = d3.scaleBand()
        .rangeRound([0, properties.width])
        .domain(top10.map(function(d) {
            return d[0];
        }));

    var maxYBarchart = Math.ceil(top10[0][1]/100)*100;

    // SET RANGE AND DOMAIN Y AXIS
    var y = d3.scaleLinear()
        .rangeRound([properties.height, 0])
        .domain([0, maxYBarchart]);

    // Delete lines on the xAxis
    var customXaxis = function() {
        $('.x.axis')
            .find('.tick')
            .find('line')
            .remove();
    };

    var colours = d3.scaleOrdinal().range(['#EF476F', '#FFD166']);

    var customYaxis = function() {
        $('.tick:first-of-type line')
            .attr('stroke', '#333333')
            .attr('stroke-width', 2);
        $('.tick:not(:first-of-type) line')
            .append('line')
            .attr('stroke-dasharray', '2,5')
            .attr('stroke', '#999999')
            .attr('stroke-width', '1px');
        $('.tick')
            .find('text')
            .attr('x', -10);
        $('.tick')
            .find('line')
            .attr('x1', 0)
            .attr('x2', properties.width);
    };

    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + properties.height + ')')
        .call(
            d3.axisBottom(x)
                .ticks(0)
                .tickPadding(10)
                .tickSize(2)
        )
        .attr('font-size', '0.875em')
        .select('.domain')
        .remove()
        .call(customXaxis);


    svg.append('g')
        .attr('class', 'y axis')
        .call(
            d3.axisLeft(y)
                .tickSizeInner(-properties.width)
                .tickFormat(function(e) {
                    return e;
                })
                .tickSizeOuter(0)
            )
        .attr('font-size', '0.875em')
        .call(customYaxis);

    svg.selectAll('.bar')
        .data(top10)
        .enter()
        .append('rect')
        .attr('x', function(d) {
            return x(d[0]);
        })
        .attr('y', function(d) {
            return y(d[1]);
        })
        .attr('width', x.bandwidth() - 5)
        .attr('height', function(d) {
            return 440 - y(d[1]);
        })
        .attr('fill', function(d) {
            return colours(d[0]);
        })
        .style('position', 'relative')
        // TOOLTIP
        .on('mouseover', function(d, i) {
            d3
                .select('.chart__tooltip')
                .transition()
                .duration(200)
                .style('opacity', 0.9)
                .style('visibility', 'visible');

            var tooltipValue = function() {
                return (
                    '<div style="background-color: #06D6A0; padding: 9px; border-radius: 5px; text-align: center;"><div><strong>' + d[0] + ' heb ik ' + d[1] + ' keer geluisterd</strong></div></div>'
                );
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

}