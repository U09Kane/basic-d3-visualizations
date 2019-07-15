d3.json('data/buildings.json').then(data => {

    const names = Object.values(data).map(val => val.name);
    console.log(names);

    let svg = d3.select('#chart-area').append('svg')
        .attr('width', 400)
        .attr('height', 400);
    
    let rects = svg.selectAll('rect')
        .data(data)

    const x = d3.scaleBand()
        .domain(names)
        .range([0, 400])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    const y = d3.scaleLinear()
        .domain([0, 828])
        .range([0, 400]);

    rects.enter()
        .append('rect')
            .attr('x', elm => x(elm.name))
            // .attr('x', (elm, idx) => (idx * 50) + 25)
            .attr('y', 20)
            .attr('width', x.bandwidth)
            .attr('height', elm => y(elm.height))
            .attr('fill', 'grey')

}).catch(error => console.log(error));
