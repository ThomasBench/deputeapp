import * as d3 from "d3"
import node_data from "./node_data"


function centroid(nodes) {
    let x = 0;
    let y = 0;
    let z = 0;
    for (const d of nodes) {

        let k = d.size ** 2;
        x += d.x * k;
        y += d.y * k;
        z += k;
    }
    return { x: x / z, y: y / z };
}


function forceCluster(strength) {
    let nodes;

    function force(alpha) {
        const centroids = d3.rollup(nodes, centroid, d => d.group);
        let l = alpha * strength;
        for (const d of nodes) {
            const { x: cx, y: cy } = centroids.get(d.group);
            if (d.group === 5) {
                l = 0.0
            }
            d.vx -= (d.x - cx) * l;
            d.vy -= (d.y - cy) * l;
        }
    }

    force.initialize = _ => nodes = _;

    return force;
}

function keyHandler(keyEvent, simu, simu_on) {
    const code = keyEvent.code
    if (code === 'Space') {
        if (simu_on.on) {
            // simu.stop()
            simu_on.on = true
        }
        else {
            // simu.restart()
            simu_on.on = true
        }
    }
}
// function handleZoom(e,s) {
//     s.attr('transform', e.transform);
//   }
function createGraph(nodes, edges, windowSize, handler) {
    // const linkStroke = 1
    // const linkStrokeOpacity = 1
    // const linkStrokeLinecap = 1
    const linkStrokeWidth = 50
    // const nodeFill = "blue"
    // const nodeStroke = 'red'
    // const nodeStrokeOpacity = 1
    const nodeStrokeWidth = 50
    const nodeRadius = 100

    const nodeStrength = -1
    const linkStrength = 0.15
    // const simulationDuration = 120 * 1000
    // let endTime = Date.now() + simulationDuration

    const visu_size = windowSize
    const visu_ratio = 1.77
    const color_node = d3.scaleOrdinal(d3.schemeTableau10)
    const color_link = d3.scaleSequential(d3.interpolateCool).domain([0, 0.5])
    const links = edges.map((edgeData) => ({ "source": edgeData["data"]["source"], 'target': edgeData["data"]["target"], "weight": edgeData["data"]["weight"] }))
    function getDeputeEdges(depute_name, neighbors) {
        const candidates = links.filter((elem) => (elem.source.name === depute_name)).sort((a, b) => b.weight - a.weight)
        return candidates.slice(0, Math.min(candidates.length, 50))
    }


    function getNeighbors(depute_name) {
        return node_data[depute_name].closest
    }
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id((node) => (node.id)).distance((d) => {
        return 1.3 * (150 * (1 / d.weight) ** 1.3)
    });
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength).theta(1.7);
    if (linkStrength !== undefined) forceLink.strength(linkStrength).iterations(5);

    const node_d3 = nodes.map((n) => (n["data"]))
    const simulation = d3.forceSimulation(node_d3)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("cluster", forceCluster(2))
        .force("center", d3.forceCenter().strength(0.2).x(300))
        .force("collision", d3.forceCollide().radius(d => nodeRadius + 10).strength(0.1))
        .velocityDecay(0.4)
        // .alphaDecay(0.001)
        .on("tick", ticked);

    let simulation_on = { on: true };
    const svgMain = d3.select("#mynetwork").append("svg")
        // .attr("width", "100%")
        // .attr("height", "100%")
        .attr("display", "block")
        .attr("viewBox", `-${visu_size}, -${visu_size / visu_ratio},${visu_size * 2},${visu_size * 2 / visu_ratio}`)
        .attr("style", "max-width: 99%; height: intrinsic;")
    const svg = svgMain.append("g")//.attr('transform', "translate(0,0) scale(1) ")
    d3.select("body").on("keydown", (event) => keyHandler(event, simulation, simulation_on))

    // let width = d3.select('svg').style("width");
    // let height = d3.select('svg').style("height");

    // width = width.substring(0, width.length - 2);
    // height = height.substring(0, height.length - 2);

    function drawLinks(data) {
        const link = svg.selectAll("line")
            .data(data)
            .join(
                enter => enter.append("line")
                    .attr("stroke", d => color_link(d.weight))
                    .attr("stroke-width", linkStrokeWidth)
                    .attr("opacity", 1)
                    .attr("x1", d => d.source.x)
                    .attr("y1", d => d.source.y)
                    .attr("x2", d => d.target.x)
                    .attr("y2", d => d.target.y)
                // .transition(15).attr("opacity", 1)
                ,
                // update => update.transition(20).attr("opacity", 0.2),
                exit => exit.remove()
            ).lower()
        return link
    }
    // const actual_edges = links.filter((x) => {
    //     console.log(x.source.name)
    //     return x.weight > 0.25 && 
    // })
    let link = drawLinks([])

    const node = svg
        .selectAll("circle")
        .data(node_d3)
        .join("circle")
        .attr("r", (d) => nodeRadius)
        .attr("fill", (d) => color_node(d.group))
        .attr("stroke", "black")
        .attr("identifier", (d) => d.name)
        .attr("stroke-width", nodeStrokeWidth)
        .call(drag(simulation))
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)


    function ticked() {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);
    }
    function mouseover(event) {
        const node_data = event.target.__data__
        const node_name = node_data.name
        const neighbors = getNeighbors(node_name)
        const edges = getDeputeEdges(node_name, neighbors)
        // console.log(edges)
        link = drawLinks(edges)
        handler({ type: "mouseover", data: node_data.name })
    }
    function mouseout(event) {
        handler({ type: "mouseout", data: "" })

    }

    function drag(simulation) {
        function dragstarted(event) {
            console.log(event)
            if (!event.active) simulation.alphaTarget(0.1).restart()
                ;
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
            // simulation.restart()
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0.05);
            event.subject.fx = null;
            event.subject.fy = null;
            // simulation.stop()
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
    function handleZoom(e) {
        svg.transition().duration(0).attr("transform", e.transform)
    }
    const zoom = d3.zoom().on("zoom", handleZoom).filter( (event) =>{
        const eventType = event.type
        console.log(svg.attr("transform"))
        switch(eventType){
            case "mousedown":
                return true
            case "wheel":
                return false
            case "touchstart":
                return event.touches.length <2
            case "dblclick":
                return false
            default:
                console.log(eventType)
                return true
        }
    })
    svgMain.call(zoom)
    function zoomOnDepute(depute_name) {
        // First we need to find the right node
        const selected_node = svg.selectAll(`circle[identifier="${depute_name}"]`)
        const x = selected_node.attr("cx")
        const y = selected_node.attr("cy")
        const zoomValue = 2.1
        // const t = d3.zoomIdentity.translate(-x, -y).scale(zoomValue);
        svg.transition().duration(3000).attr("transform", `translate(${svg.attr("width")/2-x*zoomValue},${svg.attr("height")/2-y*zoomValue}), scale(${zoomValue})`)



    }
    function highlightNode(node_name){
        const selected_node = svg.selectAll(`circle[identifier="${node_name}"]`)
        selected_node.transition().duration(180)
            .attr("r", nodeRadius * 2)
    }
    function removeHighlight(node_name){
        const selected_node = svg.selectAll(`circle[identifier="${node_name}"]`)
        selected_node
        .transition().duration(250)
        .attr("r", nodeRadius)
        svg.selectAll("line").remove()

    }
    handler({ type: "init", data: {zoom: zoomOnDepute, highlight: highlightNode,  remove: removeHighlight} })
    return;

}

export default createGraph