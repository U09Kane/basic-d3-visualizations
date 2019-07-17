// Set Size for Chart (svg)
const margin = {left: 100, right: 10, top: 10, bottom: 150};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

// create svg inside a group
let g = d3.select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// X Label
g.append('text')
  .attr('class', 'x-label')
  .attr('x', width / 2)
  .attr('y', height + 80)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('Month');

// Y Label
g.append('text')
  .attr('class', 'y-label')
  .attr('x', - (height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Earnings');

// read in data
d3.json('data/revenues.json').then(data => {
  const months = data.map(elm => elm.month);
  const max_ = d3.max(data, elm => elm.revenue);
  
  // create rects/bars
  let rects = g.selectAll('rect').data(data);
  
  // create scalar functions scale values to fit dimensions of chart
  const x = d3.scaleBand()
    .domain(months)
    .range([0, width])
    .paddingInner(0.3)
    .paddingOuter(0.3);

  const y = d3.scaleLinear()
    .domain([0, max_])
    .range([height, 0]);
  
  // Create Axes
  const xAxisCall = d3.axisBottom(x);
  const yAxisCall = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(val => '$' + val);
  
  // Add X Axis
  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxisCall);
  
  // Add Y Axis
  g.append('g')
    .attr('class', 'y-axis')
    .call(yAxisCall);
  
  // add rectangles
  rects.enter()
    .append('rect')
    .attr('x', elm => x(elm.month))
    .attr('y', elm => y(elm.revenue))
    .attr('width', x.bandwidth)
    .attr('height', elm => height - y(elm.revenue))
    .attr('fill', 'green');

}).catch(error => console.log(error));

