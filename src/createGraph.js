import * as d3 from "d3"

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


function forceCluster() {
    const strength = 0.3;
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
function createGraph(nodes, edges, windowSize) {
    // const linkStroke = 1
    // const linkStrokeOpacity = 1
    // const linkStrokeLinecap = 1
    // const linkStrokeWidth = 20
    // const nodeFill = "blue"
    // const nodeStroke = 'red'
    // const nodeStrokeOpacity = 1
    const nodeStrokeWidth = 50
    const nodeRadius = 80

    const nodeStrength = -2
    const linkStrength = 0.1
    const simulationDuration = 120 * 1000
    let endTime = Date.now() + simulationDuration

    const visu_size = windowSize
    const visu_ratio = 1.8
    const color_node = d3.scaleOrdinal(d3.schemeTableau10)
    const color_link = d3.scaleSequential(d3.interpolateCool).domain([1, 5])
    const links = edges.map((edgeData) => ({ "source": edgeData["data"]["source"], 'target': edgeData["data"]["target"], "weight": edgeData["data"]["weight"] }))
    // function getArtistEdges(artist_name) {
    //     return links.filter((elem) => (elem.source.name === artist_name || elem.targetName === artist_name))
    // }


    // function getNeighbors(artist_name) {
    //     return Object.keys(nodedata[artist_name])
    // }
    const forceNode = d3.forceManyBody();
    const forceLink = d3.forceLink(links).id((node) => (node.id)).distance((d) => {
        return 150* (1/d.weight) ** 1.3
    });
    if (nodeStrength !== undefined) forceNode.strength(nodeStrength);
    if (linkStrength !== undefined) forceLink.strength(linkStrength);

    const node_d3 = nodes.map((n) => (n["data"]))
    const simulation = d3.forceSimulation(node_d3).alphaTarget(0.3)
        .force("link", forceLink)
        .force("charge", forceNode)
        .force("center", d3.forceCenter().strength(0.5))
        .force(
            "collision",
            d3.forceCollide().radius(d => 5*d.radius).strength(100)
        )
        .force("cluster", forceCluster())
        .velocityDecay(0.35)
        // .on("tick", ticked)
        .on("tick", ticked);
    // simulation.stop()
    const svg = d3.select("#mynetwork").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        // .attr('transform', 'translate(500,50)')
        .attr("viewBox", `-${visu_size}, -${visu_size/visu_ratio},${visu_size * 2},${visu_size * 2/visu_ratio}`)
        // // .attr("viewBox", ["-width / 2", -height / 2, width, height])
        .attr("style", "max-width: 100%; height: intrinsic;");
    let width = d3.select('svg').style("width");
    let height = d3.select('svg').style("height");

    width = width.substring(0, width.length - 2);
    height = height.substring(0, height.length - 2);

    // const node = svg.append("g")
    //     .attr("fill", nodeFill)
    //     .attr("stroke", nodeStroke)
    //     .attr("stroke-opacity", nodeStrokeOpacity)
    //     .attr("stroke-width", nodeStrokeWidth)
    //     .selectAll("circle")
    //     .data(nodes)
    //     .join("circle")
    //     .attr("r", nodeRadius)
    //     .call(drag(simulation));
    function drawLinks(data) {
        const link = svg.selectAll("line")
            .data(data)
            .join(
                enter => enter.append("line")
                    .attr("stroke", d => color_link(d.weight))
                    .attr("stroke-width",20)
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
    const actual_edges = links.filter((x) => {
        return x.weight > 0.25
    })
    let link = drawLinks([])

    const node = svg
        .selectAll("circle")
        .data(node_d3)
        .join("circle")
        .attr("r", (d) => (0.8 + (d.size) ** (0.7) * nodeRadius))
        .attr("fill", (d) => color_node(d.group))
        .attr("stroke", "black")
        .attr("strokeWidth", nodeStrokeWidth)
        .call(drag(simulation))
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)

    const tooltip = d3.select("#tooltip")

    function intern(value) {
        return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

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

        const radius = d3.select(this).attr("r")
        const xval = d3.select(this).node().getBoundingClientRect().x
        const yval = d3.select(this).node().getBoundingClientRect().y + radius + 10
        tooltip.transition()
            .duration(50)
            .style("opacity", 1);
        tooltip.html(node_data.name)
            .style("left", 50 + "px")
            .style("top", 50 + "px");

        // const neighbors = getNeighbors(node_name)
        // link = drawLinks(getArtistEdges(node_name))
        // d3.selectAll("circle").filter(d => neighbors.includes(d.name)).attr("stroke", "white")
    }
    function mouseout(event) {
        const node_name = event.target.__data__.name

        // link.remove()
        tooltip
            .transition()
            .duration(10).style("opacity", 0)
            .style("left",50 + "px")
            .style("top", 50+ "px");

        // const neighbors = getNeighbors(node_name)
        // d3.selectAll("circle").filter(d => neighbors.includes(d.name)).attr("stroke", "black")

        // .attr("stroke", "grey")
        // .attr("opacity", 0.2)

    }

    function drag(simulation) {
        function dragstarted(event) {
            console.log(event.subject.name)
            if (!event.active) simulation.alphaTarget(0.3).restart();
            endTime = Date.now()
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
            simulation.restart()
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0.3);
            event.subject.fx = null;
            event.subject.fy = null;
            // simulation.stop()
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }


    return;

}

export default createGraph