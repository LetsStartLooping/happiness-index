
var sideTextTitles = ["Log GDP per Capita", "Social Support", "Corruption", "Freedom to make Life Choices"]
var gdp_text = "This chart shows relationship between GDP per Capita and Happiness Index for different countries. As overall trend shows here Happiness Index tend to increase as GDP per Capita Increases."
var ss_text = "This chart shows relationship between Happiness Index and Social Support for different countries. As overall trend shows here Happiness Index tend to increase as Social Support Increases."
var cur_text = "This chart shows relationship between Happiness Index and Perceptions of Curruption for different countries. As overall trend shows here Happiness Index tend to increase as Perceptions of Curruption Decreases."
var fre_text = "This chart shows relationship between Freedom to make life choices and Happiness Index for different countries. As overall trend shows here Happiness Index tend to increase as Freedom to make life choices Increases."

function createFeatureChart() {
    var selectedYear = 2018
    var selectedItem = 'Log GDP per capita'

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
        width = 1280 - margin.left - margin.right,
        height = 720 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Initialize the X axis
    var x = d3.scaleLinear()
        .range([0, width - 256]);
    //   .padding(0.2);
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")

    // Initialize the Y axis
    var y = d3.scaleLinear()
        .range([height, 0]);
    var yAxis = svg.append("g")
        .attr("class", "myYaxis")

    // Color scale: Based on Happiness Index
    var color = d3.scaleOrdinal()
        .domain(["very-low", "low", "medium", "high", "very-high"])
        .range(["#243B81", "#62BCCC", "#F64F39", "#EE9323", "#FFFF00"])



    yearSlider = d3.select('#yearSlider');
    selectedYear = yearSlider.property('value');


    yearSlider.on("change", function (d) {

        // recover the option that has been chosen
        selectedYear = d3.select(this).property("value")

        // run the updateChart function with this selected option
        update(selectedItem)
    })

    textTitle = d3.select('#sideTextTitle');
    sideText = d3.select('#sideText');

    var ss_button = d3.select('#b_ss');
    ss_button.on("click", function (d) {
        sideText.text(ss_text)
        update('Social support')
    })

    var cur_button = d3.select('#b_cur');
    cur_button.on("click", function (d) {
        sideText.text(cur_text)
        update('Perceptions of corruption')
    })

    var gdp_button = d3.select('#b_gdp');
    gdp_button.on("click", function (d) {
        sideText.text(gdp_text)

        update('Log GDP per capita')
    })

    var fre_button = d3.select('#b_fre');
    fre_button.on("click", function (d) {
        sideText.text(fre_text)
        update('Freedom to make life choices')
    })


    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#my_dataviz")
        .append("div")
        .style("opacity", 0)
        .style("position", "absolute")
        .attr("class", "tooltip")
        .style("background-color", "white")
        //     .style("border-color", "black")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "black")
    //         .append("g")
    //             .attr("transform",
    //             "translate(" + margin.left + "," + margin.top + ")")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function (d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("Happiness Index: " + + d['Life Ladder'])
            .style("top", (event.pageY + 20) + "px")
            .style("left", (event.pageX + 20) + "px")
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

        // u
        // .style("stroke", "black")
    }

    function update(selectedVar) {


        textTitle.text(selectedVar)

        //     clearChart();

        //     d3.select('.annotation-group').remove()

        d3.select("#my_dataviz").selectAll('.annotation-group').remove();


        // ----------------- Controlling Button Colors -----------------

        d3.select("#b_gdp")
            .style("border-color", "whitesmoke");
        d3.select("#b_ss")
            .style("border-color", "whitesmoke");
        d3.select("#b_cur")
            .style("border-color", "whitesmoke");
        d3.select("#b_fre")
            .style("border-color", "whitesmoke");

        switch (selectedVar) {
            case 'Log GDP per capita':
                d3.select("#b_gdp")
                    .style("border-color", "dodgerblue");
                break;
            case 'Social support':
                d3.select("#b_ss")
                    .style("border-color", "dodgerblue");
                break;
            case 'Perceptions of corruption':
                d3.select("#b_cur")
                    .style("border-color", "dodgerblue");
                break;
            case 'Freedom to make life choices':
                d3.select("#b_fre")
                    .style("border-color", "dodgerblue");
                break;
            default:
            // code block
        }



        selectedItem = selectedVar;

        // Parse the Data
        d3.csv("world-happiness-report-cleaned.csv", function (data) {

            // data = data.filter(function (d) {
            //     if (d['year'] == selectedYear) {
            //         return true;
            //     } else {
            //         return false;
            //     }
            // })

            data = data.filter(function (d) { return d['year'] == selectedYear });


            maxIndex = d3.max(data, function (d) { return +d['Life Ladder']; });
            console.log(maxIndex)

            annotLabel = ""
            annotDirection = 1

            if (selectedVar == 'Perceptions of corruption') {
                selIndex = d3.min(data, function (d) { return +d[selectedVar]; });
                annotLabel = "Lowest"
                annotDirection = -1
            } else {
                selIndex = d3.max(data, function (d) { return +d[selectedVar]; });
                annotLabel = "Best"
                annotDirection = 1
            }

            happiestCountry = ""
            hx = 0
            hy = 0

            selectedCountry = ""
            sx = 0
            sy = 0


            data.forEach(function (d) {
                d['Log GDP per capita'] = +d['Log GDP per capita'];
                d['Perceptions of corruption'] = +d['Perceptions of corruption'];
                d['Healthy life expectancy at birth'] = +d['Healthy life expectancy at birth'];
                d['Generosity'] = +d['Generosity'];
                d['year'] = +d['year'];
                d['Life Ladder'] = +d['Life Ladder'];
                if (maxIndex == d['Life Ladder']) {
                    happiestCountry = d['Country name'];
                    hx = d['Life Ladder']
                    hy = d[selectedVar]
                }

                if (selIndex == d[selectedVar]) {
                    selectedCountry = d['Country name'];
                    sx = d['Life Ladder']
                    sy = d[selectedVar]
                }

            });

            console.log(happiestCountry)

            // X axis
            x.domain([d3.min(data, function (d) { return +d['Life Ladder'] }), d3.max(data, function (d) { return +d['Life Ladder'] })]);
            xAxis.transition().duration(1000).call(d3.axisBottom(x))

            // Add Y axis
            y.domain([d3.min(data, function (d) { return +d[selectedVar] }), 1.2 * d3.max(data, function (d) { return +d[selectedVar] })]);
            yAxis.transition().duration(1000).call(d3.axisLeft(y));


            // Features of the annotation
            const annotations = [
                {
                    note: {
                        label: "Happiest Country in " + selectedYear,
                        title: happiestCountry
                    },
                    x: x(hx),
                    y: y(hy),
                    dy: 110 * annotDirection,
                    dx: 40
                },
                {
                    note: {
                        label: annotLabel + " " + selectedVar,
                        title: selectedCountry
                    },
                    x: x(sx),
                    y: y(sy),
                    dy: -40,
                    dx: 100
                }
            ]

            // Add annotation to the chart
            const makeAnnotations = d3.annotation()
                .annotations(annotations)


            // variable u: map data to existing dots
            var dots = svg.selectAll("circle")
                .data(data)

            // update dots
            dots

                .enter()
                .append("circle")
                .on("click", function (d) {
                    tooltip
                        .transition()
                        .duration(200)
                        .style("opacity", 0)
                    showCountry(d['Country name'])
                    console.log(d['Country name']);
                })
                .merge(dots)
                .transition()
                .duration(1000)
                .attr("cx", function (d) { return x(d['Life Ladder']); })
                .attr("cy", function (d) { return y(d[selectedVar]); })
                .attr("r", function (d) {
                    if (d['Life Ladder'] < 3.5) { return 3 }
                    else if (d['Life Ladder'] < 4.5) { return 4.5 }
                    else if (d['Life Ladder'] < 6) { return 6 }
                    else if (d['Life Ladder'] < 7) { return 7.5 }
                    else { return 9 }
                })
                .style("fill", function (d) {
                    if (d['Life Ladder'] < 3.5) { return color("very-low") }
                    else if (d['Life Ladder'] < 4.5) { return color("low") }
                    else if (d['Life Ladder'] < 6) { return color("medium") }
                    else if (d['Life Ladder'] < 7) { return color("high") }
                    else if (d['Life Ladder'] < 10) { return color("very-high") }
                })
                .style("stroke", "black")



            dots
                //     .append("g")
                .on("mouseover", showTooltip)
                .on("mousemove", moveTooltip)
                .on("mouseleave", hideTooltip)


            svg
                .append("g")
                //       .transition()
                //       .duration(1000)
                .attr('class', 'annotation-group')
                .style('opacity', 0)
                .call(makeAnnotations)

            d3.select("#my_dataviz").selectAll('.annotation-group')
                .transition()
                .duration(2000)
                .style('opacity', 1)



        })

    }


    // Initialize plot
    update('Log GDP per capita')
    update('Log GDP per capita')
}

// A function that create / update the plot for a given variable:
