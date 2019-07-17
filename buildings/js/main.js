const margin = {left: 100, right: 10, top: 10, bottom: 150};
let width = 600 - margin.left - margin.right;
let height = 400 - margin.top - margin.bottom;


let g = d3.select('#chart-area')
    .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
            .append('g')
                .attr('transform', `translate(${margin.left}, ${margin.top})`)

// X Label
g.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', width / 2)
    .attr('y', height + 140)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .text("World's Tallest Buildings");

// Y Label
g.append('text')
    .attr('class', 'y-axis-label')
    .attr('x', - (height / 2))
    .attr('y', -60)
    .attr('font-size', '20px')
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(-90)')
    .text('Height (m)');

d3.json('data/buildings.json').then(data => {
    const names = Object.values(data).map(val => val.name);
    const max_ = d3.max(data, elm => elm.height);
  
    let rects = g.selectAll('rect')
        .data(data)

    const x = d3.scaleBand()
        .domain(names)
        .range([0, width])
        .paddingInner(0.3)
        .paddingOuter(0.3);

    const y = d3.scaleLinear()
        .domain([0 , max_])
        .range([height, 0]);
    
    const xAxisCall = d3.axisBottom(x);
    g.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0, ${height})`)
        .call(xAxisCall)
        .selectAll('text')
            .attr('y', 10)
            .attr('x', -5)
            .attr('text-anchor', 'end')
            .attr('transform', 'rotate(-40)');
    
    const yAxisCall = d3.axisLeft(y)
        .ticks(3)
        .tickFormat(val => val + 'm');

    g.append('g')
        .attr('class', 'y-axis')
        .call(yAxisCall)

    rects.enter()
        .append('rect')
            .attr('x', elm => x(elm.name))
            .attr('y', elm => y(elm.height))
            .attr('width', x.bandwidth)
            .attr('height', elm => height - y(elm.height))
            .attr('fill', 'grey')

}).catch(error => console.log(error));
