d3.json('data/buildings.json').then(data => {

    let svg = d3.select('#chart-area').append('svg')
        .attr('width', 400)
        .attr('height', 400);
    
    let rects = svg.selectAll('rect')
        .data(data)
    
    const y = d3.scaleLinear()
        .domain([0, 828])
        .range([0, 400])

    rects.enter()
        .append('rect')
            .attr('x', (elm, idx) => (idx * 50) + 25)
            .attr('y', 25)
            .attr('width', 30)
            .attr('height', elm => y(elm.height))
            .attr('fill', 'grey')

}).catch(error => console.log(error));
