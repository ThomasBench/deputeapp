import React from 'react'
import { useEffect } from 'react'
import createGraph from "./createGraph"
import data from "./data"
import * as d3 from "d3"
const Content = () => {
    const network = data["elements"]
    const windowSize = 15*1000
    useEffect( 
        () =>   {
            d3.select("#mynetwork").selectAll("*").remove()
            createGraph(network["nodes"], network["edges"], windowSize)
        },
        []
    )    
  return (
      <>
      <div style = {{position: "absolute", top: '50px', 'left': "50px"}} id = "tooltip">
      </div>
      <div id='mynetwork'></div>
      </>
  )
}

export default Content