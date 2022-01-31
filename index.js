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

let drawCanvas = () =>{
    svg.attr("width", width)
    svg.attr("height", height)
}

let generateScales = () => {


    xScale = d3.scaleLinear()
                .range([padding, width - padding])
}

    yScale = d3.scaleTime()
            .range([padding, height - padding])

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

}

let generateAxis = () => {

    let xAxis = d3.axisBottom(xScale)

    svg.append('g')
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0,"+ (height - padding) + ")")

     let yAxis = d3.axisLeft(yScale)

     svg.append("g")
        .call(yAxis)
        .attr("id", "y-axis")
        .attr("transform", "translate(" + (padding) + ", 0)")
}