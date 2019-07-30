const margin = {left: 100, right: 10, top: 10, bottom: 150};
const width = 600 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const continents = ['asia', 'americas', 'europe', 'africa'];
const t = d3.transition()


let g = d3.select('#chart-area')
	.append('svg')
	.attr('width', width + margin.left + margin.right)
	.attr('height', height + margin.top + margin.bottom)
	.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xAxisGroup = g.append('g')
  .attr('class', 'x-axis')
  .attr('transform', `translate(0, ${height})`);

const yAxisGroup = g.append('g')
  .attr('class', 'y-axis');

// X & Y Scales
const x = d3.scaleLog()
  .domain([300, 150000])
  .range([0, width]);

const y = d3.scaleLinear()
  .domain([0, 90])
  .range([height, 0]);

const c = d3.scaleOrdinal()
  .domain(continents)
  .range(d3.schemeCategory10);

const sizeScale = d3.scaleLinear()
  .domain([0, 2000000000])
  .range([3, 10]);

g.append('text')
  .attr('class', 'year-label')

// X Label
g.append('text')
  .attr('class', 'x-label')
  .attr('x', width / 2)
  .attr('y', height + 80)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('GDP Per Capita ($)');

// Y Label
g.append('text')
  .attr('class', 'y-label')
  .attr('x', - (height / 2))
  .attr('y', - 60)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .attr('transform', 'rotate(-90)')
  .text('Life Expectency (years)');

const yearLabel = g.append('text')
  .attr('class', 'year-label')
  .attr('x', width - 50)
  .attr('y', height - 25)
  .attr('font-size', '20px')
  .attr('text-anchor', 'middle')
  .text('YEAR');

// Create Legend
const legend = g.append('g')
  .attr('transform', `translate(${width - 10}, ${height - 125})`);

continents.forEach(elm, idx => {
  let legendRow = legend.append('g')
    .attr('transform', `translate(0, ${i * 20})`);
  
  legendRow.append('rect')
    .attr('height', 10)
    .attr('width', 10)
    .attr('fill', c(cont));
});

d3.json('data/data.json').then(data => {
    // let curData = data[0].countries;
    let idx = 0
    let last = data.length - 1;
    let curData = data[idx].countries;

    const timer = d3.interval(() => {
      let curData = filterData(data[idx].countries);
      let curYear = data[idx].year;

      update(curData, curYear);
      idx == last ? timer.stop() : null;
      idx += 1;

    }, 500);

    // First Update
    update(filterData(curData));

}).catch(error => console.log(error));

function filterData(data) {
  let result = data.filter(d => d.income && d.life_exp && d.population);
  return result;
}

function update(data, year) {
  const xAxisCall = d3.axisBottom(x)
    .ticks(3);
  const yAxisCall = d3.axisLeft(y);

  xAxisGroup.call(xAxisCall);
  yAxisGroup.call(yAxisCall);
  yearLabel.text(year);
    
  const circs = g.selectAll('circle')
    .data(data, d => d.country);

  circs.exit()
    .remove();

  circs.enter()
    .append('circle')
    .attr('fill', d => c(d.continent))
    .attr('cx', d => x(d.income))
    .attr('cy', d => x(d.life_exp))
    .attr('r', d => sizeScale(d.population))
    .merge(circs)
    .transition(t)
      .attr('cx', d => x(d.income))
      .attr('cy', d => y(d.life_exp))
      .attr('r', d => sizeScale(d.population));
}