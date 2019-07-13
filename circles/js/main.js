d3.csv('data/ages.csv').then(data => {

    data.forEach(elm => {
        elm.age = Number(elm.age);
    });

    let svg = d3.select('#chart-area').append('svg')
        .attr('width', 400)
        .attr('height', 400);

    let circles = svg.selectAll('circle')
        .data(data);

    circles.enter()
        .append('circle')
            .attr('cx', (d, i) => {
                return (i * 50) + 25;
            })
            .attr('cy', 25)
            .attr('r', d => d.age * 2)
            .attr('fill', d => {
                if (d.name == 'Tony') {
                    return 'blue';
                } else {
                    return 'red';
                }
            });
}).catch(error => console.log(error));
