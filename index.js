let url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"

let fetchdata = fetch(url).then(res => res.json()).then(data => {
    console.log(data)
    return data
})

window.onload = async() => {
    let data = await fetchdata
    values = data
    drawCanvas()
    generateScales()
    drawPoints()
    generateAxis()
}

let values

let xScale
let yScale

let width = 800
let height = 600
let padding = 40

let svg = d3.select('svg')
let tooltip = d3.select("#tooltip")

let drawCanvas = () => {
    svg.attr("width", width)
    svg.attr("height", height)
}

let generateScales = () => {


    xScale = d3.scaleLinear()
                .domain([d3.min(values, item => {
                    return item.Year
                }) -1, d3.max(values, item => {
                    return item.Year
                }) +1])
                .range([padding, width - padding])

    yScale = d3.scaleTime()
                .domain([d3.min(values, item => {
                    return new Date(item.Seconds * 1000)
                }), d3.max(values, item => {
                    return new Date(item.Seconds * 1000)
                })])
                .range([padding, height - padding])
}


let drawPoints = () => {

    svg.selectAll('circle')
        .data(values)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", "5")
        .attr("data-xvalue", item => {
            return item['Year']
        } )
        .attr("data-yvalue", item => {
            return new Date( item['Seconds'] * 1000 )
        })
        .attr("cx", item => {
            return xScale(item.Year)
        })
        .attr("cy", item =>  {
            return yScale(new Date(item.Seconds * 1000))
        })
        .attr("fill", item => {
            if(item.Doping != ""){
                return "orange"
            }else{
                return "green"
            }
        })
        .on("mouseover", (event, item) => {
            tooltip.transition()
                    .style("visibility", "visible")

                    if(item.Doping != ""){
                        tooltip.text(item.Year + "-" + item.Name + "-" + item.Time + "-" + item.Doping)
                    }else{
                        tooltip.text(item.Year + "-" + item.Name + "-" + item.Time + "-" + "No Allegations")
                    }

                    tooltip.attr("data-year", item.Year)
        })
        .on("mouseout", (item) => {
            tooltip.transition()
            .style("visibility", "hidden")
        })

}

let generateAxis = () => {

    let xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))

    svg.append('g')
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0,"+ (height - padding) + ")")

     let yAxis = d3.axisLeft(yScale)
                    .tickFormat(d3.timeFormat("%M:%S"))

     svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + (padding) + ", 0)")
}
