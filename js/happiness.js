

function createBubbleChart() {

    yearSlider = d3.select('#yearSlider');
    let selectedYear = yearSlider.property('value');


    yearSlider.on("change", function (d) {

        //       d3.selectAll("svg > *").remove();
        d3.select("#my_dataviz").selectAll("svg").remove();
        // recover the option that has been chosen
        selectedYear = d3.select(this).property("value")
        console.log(selectedYear);
        // run the updateChart function with this selected option
        bubbleChart();
    })

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .style("position", "absolute")
        .attr("class", "tooltip")
        .style("background-color", "white")
        // .style("border-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "black")


    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("<p style=\"font-family: 'Ubuntu'; \"> Country: " + "<b>" + d['Country name'] + "</b>" +
                "<br> Happiness Index: " + "<b>" + +d['Life Ladder'] + "</b></p>")
            .style("top", (event.pageY + 20) + "px")
            .style("left", (event.pageX + 20) + "px")

        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 2)
        // .attr("r", d.radius * 1.1)
    }
    var moveTooltip = function (d) {
        tooltip
            .style("top", (event.pageY + 20) + "px")
            .style("left", (event.pageX + 20) + "px")
    }
    var hideTooltip = function (d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)

        d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", 1)
        // .attr("r", d.radius)

        // u
        // .style("stroke", "black")
    }

    sideText_1 = d3.select('#sideText_1');
    sideText_1.text(side_text_1)

    sideText = d3.select('#sideText');
    sideText.text("This Bubble chart shows a Summary of wrold happiness across the world for a given year. Each bubble represents one country. Year can be changed from the slider at the bottom of the chart")

    function bubbleChart() {
        d3.csv("world-happiness-report-cleaned.csv", function (rawData) {
            // bubbleChart creation function; instantiate new bubble chart given a DOM element to display it in and a dataset to visualise





            const width = chart_width;
            const height = chart_height;

            // location to centre the bubbles
            const centre = { x: width / 2, y: height / 2 };

            // strength to apply to the position forces
            const forceStrength = 0.03;

            // these will be set in createNodes and chart functions
            let svg = null;
            let bubbles = null;
            let labels = null;
            let nodes = [];



            // charge is dependent on size of the bubble, so bigger towards the middle
            function charge(d) {
                return Math.pow(d.radius, 2.0) * 0.05
            }

            // create a force simulation and add forces to it
            const simulation = d3.forceSimulation()
                .force('charge', d3.forceManyBody().strength(charge))
                // .force('center', d3.forceCenter(centre.x, centre.y))
                .force('x', d3.forceX().strength(forceStrength).x(centre.x))
                .force('y', d3.forceY().strength(forceStrength).y(centre.y))
                .force('collision', d3.forceCollide().radius(d => d.radius + 1));

            // force simulation starts up automatically, which we don't want as there aren't any nodes yet
            simulation.stop();

            // set up colour scale
            const fillColour = d3.scaleOrdinal()
                .domain(["1", "2", "3", "5", "99"])
                .range(["#0074D9", "#7FDBFF", "#39CCCC", "#3D9970", "#AAAAAA"]);

            // const color = d3.scaleOrdinal()
            //     .domain(["very-low", "low", "medium", "high", "very-high"])
            //     .range(["lightsteelblue", "skyblue", "lightsalmon", "orange", "yellow"])

            // Color scale: Based on Happiness Index
            var color = d3.scaleOrdinal()
                .domain(["very-low", "low", "medium", "high", "very-high"])
                .range(["#243B81", "#62BCCC", "#F64F39", "#EE9323", "#FFFF00"])


            // size bubbles based on area
            const radiusScale = d3.scaleOrdinal()
                .domain(["very-low", "low", "medium", "high", "very-high"])
                .range([3, 10, 20, 30, 40])






            function getRadius(life_ladder) {
                if (life_ladder < 4) {
                    return radiusScale("very-low")
                } else if (life_ladder < 5) {
                    return radiusScale("low")
                } else if (life_ladder < 6) {
                    return radiusScale("medium")
                } else if (life_ladder < 7) {
                    return radiusScale("high")
                } else if (life_ladder < 10) {
                    return radiusScale("very-high")
                }
            }

            // data manipulation function takes raw data from csv and converts it into an array of node objects
            // each node will store data and visualisation values to draw a bubble
            // rawData is expected to be an array of data objects, read in d3.csv
            // function returns the new node array, with a node for each element in the rawData input
            function createNodes(rawData) {
                // use max size in the data as the max in the scale's domain
                // note we have to ensure that size is a number
                const maxSize = d3.max(rawData, d => +d['Life Ladder']);



                // use map() to convert raw data into node data
                const myNodes = rawData.map(d => ({
                    ...d,
                    radius: getRadius(+d['Life Ladder']),
                    //       size: +d['Life Ladder'],
                    x: Math.random() * 900,
                    y: Math.random() * 800
                }))

                return myNodes;
            }



            // main entry point to bubble chart, returned by parent closure
            // prepares rawData for visualisation and adds an svg element to the provided selector and starts the visualisation process
            // let chart = function chart(selector, rawData) {

            rawData = rawData.filter(function (d) { return d['year'] == selectedYear });
            // console.log(rawData);

            // convert raw data into nodes data
            nodes = createNodes(rawData);
            console.log(nodes);

            // create svg element inside provided selector
            svg = d3.select('#my_dataviz')
                .append('svg')
                .attr('width', width)
                .attr('height', height)



            // svg.append("rect")
            //     .attr("width", "100%")
            //     .attr("height", "100%")
            //     .attr("fill", "gainsboro");

            // bind nodes data to circle elements
            const elements = svg.selectAll('.bubble')
                .data(nodes, d => d['Country name'])
                .enter()
                .append('g')

            bubbles = elements
                .append('circle')
                .on("click", function (d) {
                    simulation.stop()
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 0)
                    showCountry(d['Country name'])
                    console.log("Clicking")
                })
                .classed('bubble', true)
                .attr('r', d => d.radius)
                .style("stroke", "black")
                .attr('fill', function (d) {
                    if (+d['Life Ladder'] < 4) { return color("very-low") }
                    else if (+d['Life Ladder'] < 5) { return color("low") }
                    else if (+d['Life Ladder'] < 6) { return color("medium") }
                    else if (+d['Life Ladder'] < 7) { return color("high") }
                    else if (+d['Life Ladder'] < 10) { return color("very-high") }
                })

            // labels
            labels = elements
                .append('text')
                .on("click", function (d) {
                    simulation.stop()
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 0)
                    showCountry(d['Country name'])
                    console.log("Clicking")
                })
                .attr('dy', '.3em')
                .style('text-anchor', 'middle')
                .style('font-size', 12)
                //       .text(d => d['Country name'])
                .text(function (d) {
                    if (+d['Life Ladder'] < 4) { return "" }
                    else if (+d['Life Ladder'] < 5) { return "" }
                    else if (+d['Life Ladder'] < 6) { return "" }
                    else if (+d['Life Ladder'] < 7) { return "" }
                    else if (+d['Life Ladder'] < 10) { return d['Country name'] }
                })


            // labels
            //     //     .append("g")
            //     .on("mouseover", showTooltip)
            //     .on("mousemove", moveTooltip)
            //     .on("mouseleave", hideTooltip)

            bubbles
                //     .append("g")
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip)



            // set simulation's nodes to our newly created nodes array
            // simulation starts running automatically once nodes are set
            simulation.nodes(nodes)
                .on('tick', ticked)
                .restart();
            // }

            // callback function called after every tick of the force simulation
            // here we do the actual repositioning of the circles based on current x and y value of their bound node data
            // x and y values are modified by the force simulation
            function ticked() {
                bubbles
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)

                labels
                    .attr('x', d => d.x)
                    .attr('y', d => d.y)
            }

            // return chart function from closure
            // return chart;
        })
    }


    bubbleChart();
    // myBubbleChart('#my_dataviz', data);

}

// d3.select("#my_dataviz")
//     .append('circle')
//     .attr('cx', 1024 - 100)
//     .attr('cy', 720 - 100)
//     .attr('r', 40)
//     .attr('stroke', 'black')
//     .attr('fill', '#69a3b2');






