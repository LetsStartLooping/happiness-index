
function createCountryChart(country) {
    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 1024 - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // var country = 'Switzerland';
    console.log("-------")
    console.log(country)


    // When the button is changed, run the updateChart function
    d3.select("#chooseCountry").on("change", function (d) {
        // recover the option that has been chosen
        var selectedCountry = d3.select(this).property("value")
        // run the updateChart function with this selected option
        updateCountry(selectedCountry)
    })

    function updateCountry(newCountry) {

        d3.select("#my_dataviz").selectAll('svg').remove();
        svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        //Read the data
        d3.csv("world-happiness-report-cleaned.csv", function (data) {


            var countryList = d3.map(data, function (d) { return (d['Country name']) }).keys()

            var avg_data = d3.nest()
                .key(function (d) { return d['year']; })
                .rollup(function (d) {
                    return d3.mean(d, function (g) { return +g['Life Ladder']; });
                }).entries(data);


            data = data.filter(function (d) {
                if (d['Country name'] == newCountry) {
                    return true;
                } else {
                    return false;
                }
            })

            // data = data.filter(function (d) { d['Country name'] == newCountry });

            // console.log(countryList);

            var country_data = [];
            data.forEach(function (d) {
                country_data.push({
                    key: d['year'],
                    value: +d['Life Ladder']
                });
            });

            // console.log(country_data);

            avg_data.sort(function (a, b) {
                return d3.descending(+a.key, +b.key);

            });

            country_data.sort(function (a, b) {
                return d3.descending(+a.key, +b.key);

            });


            // Add X axis --> it is a date format
            var x = d3.scaleLinear()
                .domain(d3.extent(avg_data, function (d) { return d.key; }))
                .range([0, width]);
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickFormat(d3.format('')).ticks(5));

            // Get minimum value
            min_country = d3.min(country_data, function (d) { return +d.value; })
            min_avg = d3.min(avg_data, function (d) { return +d.value; })

            min_y = 0
            if (min_country <= min_avg) {
                min_y = min_country;
            } else {
                min_y = min_avg
            }

            // Get max value
            max_country = d3.max(country_data, function (d) { return +d.value; })
            max_avg = d3.max(avg_data, function (d) { return +d.value; })

            max_y = 0
            if (max_country >= max_avg) {
                max_y = max_country;
            } else {
                max_y = max_avg
            }


            // Add Y axis
            var y = d3.scaleLinear()
                .domain([min_y - 0.5, max_y + 0.5])
                .range([height, 0]);
            svg.append("g")
                .call(d3.axisLeft(y));



            // Annotations
            // Features of the annotation
            const annotations = [
                {
                    note: {
                        label: "",
                        title: newCountry
                    },
                    x: 100,
                    y: 100,
                    dy: 110,
                    dx: 40
                },
                {
                    note: {
                        label: "",
                        title: "World Average"
                    },
                    x: 200,
                    y: 200,
                    dy: -40,
                    dx: 100
                }
            ]

            // Add annotation to the chart
            const makeAnnotations = d3.annotation()
                .annotations(annotations)


            // Draw the line
            svg.append("path")
                .datum(avg_data)
                .transition()
                .duration(1000)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 5)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.key) })
                    .y(function (d) { return y(d.value) })
                )

            svg.append("path")
                .datum(country_data)
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", 5)
                .transition()
                .duration(1000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.key) })
                    .y(function (d) { return y(d.value) })
                )

            var u = svg.selectAll(".lineTest")
                .datum(country_data);

            // Updata the line
            u
                .enter()
                .append("path")
                .attr("class", "lineTest")
                .merge(u)
                .transition()
                .duration(3000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.key) })
                    .y(function (d) { return y(d.value + 0.5) }))
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2.5)

            var u1 = svg.selectAll(".lineTest1")
                .datum(avg_data);

            // Updata the line
            u1
                .enter()
                .append("path")
                .attr("class", "lineTest1")
                .merge(u1)
                .transition()
                .duration(3000)
                .attr("d", d3.line()
                    .x(function (d) { return x(d.key) })
                    .y(function (d) { return y(d.value + 0.5) }))
                .attr("fill", "none")
                .attr("stroke", "orangered")
                .attr("stroke-width", 2.5)


            // add the options to the button
            d3.select("#chooseCountry")
                .selectAll('myOptions')
                .data(countryList)
                .enter()
                .append('option')
                .text(function (d) { return d; }) // text showed in the menu
                .attr("value", function (d) { return d; })

            d3.select("#chooseCountry").property("selected", newCountry)


            // Annotations
            svg
                .append("g")
                .attr('class', 'annotation-group')
                .style('opacity', 0)
                .call(makeAnnotations)

            d3.select("#my_dataviz").selectAll('.annotation-group')
                .transition()
                .duration(1000)
                .style('opacity', 1)

        })
    }
    updateCountry(country)
}