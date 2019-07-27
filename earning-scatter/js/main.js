// Set Size for Chart (svg)
const margin = {left: 100, right: 10, top: 10, bottom: 150};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
let flag = true;
const t = d3.transition().duration(500);

// create svg inside a group
let g = d3.select('#chart-area')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

// Add X Axis
let xAxisGroup = g.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${height})`)
  
// Add Y Axis
let yAxisGroup = g.append('g')
  .attr('class', 'y-axis')

const x = d3.scaleBand()
  .range([0, width])
  .paddingInner(0.3)
  .paddingOuter(0.3);

const y = d3.scaleLinear()
  .range([height, 0]);

// X Label
g.append('text')
  .attr('class', 'x-label')
  .attr('x', width / 2)
  .attr('y', height + 80)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('Month');

// Y Label
yLabel = g.append('text')
  .attr('class', 'y-label')
  .attr('x', - (height / 2))
  .attr('y', -60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Earnings');

// read in data
d3.json('data/revenues.json').then(data => {
  d3.interval(() => {
    newData = flag ? data : data.slice(1);
    update(newData);
    flag = !flag;
  }, 1000);

  // run for the first time
  update(data); 
    
}).catch(error => console.log(error));


function update(data) {
  /* Takes object data and generates a bar chart
  of appropriate size and scaling.
  */
  const months = data.map(elm => elm.month);
  const val = flag ? 'revenue' : 'profit';
  const max_ = d3.max(data, elm => elm[val]);
  x.domain(months);
  y.domain([0, max_]);

  // Create Axes
  const xAxisCall = d3.axisBottom(x);
  xAxisGroup.transition(t).call(xAxisCall);

  const yAxisCall = d3.axisLeft(y)
    // .ticks(5)
    .tickFormat(val => '$' + val);
  yAxisGroup.transition(t).call(yAxisCall);
  
  // JOIN
  let circs = g.selectAll('circle')
    .data(data, d => d.month);
  // REMOVE
  circs.exit()
    .attr('fill', 'red')
    .transition(t)
    .attr('cy', y(0))
    .remove();

  // UPDATE
  // circs.transition(t)
 
  // ENTER
  circs.enter()
    .append('circle')
    .attr('fill', 'green')
    .attr('cy', y(0))
    .attr('cx', elm => x(elm.month) + x.bandwidth() / 2)
    .attr('r', 5)
    .merge(circs)
    .transition(t)
      .attr('cx', elm => x(elm.month) + x.bandwidth() / 2)
      .attr('cy', elm => y(elm[val]))
  
  yText = val.slice(0, 1).toLocaleUpperCase() + val.slice(1);
  yLabel.text(yText);
}
