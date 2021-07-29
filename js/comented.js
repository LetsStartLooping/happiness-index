/*

        function clearChart() {
            d3.select("#my_dataviz").selectAll("svg").remove();

            svg = d3.select("#my_dataviz")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");
            xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
            yAxis = svg.append("g")
                .attr("class", "myYaxis")

            tooltip = d3.select("#my_dataviz")
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

            showTooltip = function (d) {
                tooltip
                    .transition()
                    .duration(200)
                tooltip
                    .style("opacity", 1)
                    .html("Country: " + d['Country name'])
                    .style("top", (event.pageY + 20) + "px")
                    .style("left", (event.pageX + 20) + "px")
            }

        }
    */