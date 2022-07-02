import React from 'react'
import { useEffect, useState } from 'react'
import createGraph from "./createGraph"
import data from "./data"
import * as d3 from "d3"
import Tooltip from './Tooltip'
const initialState = ""
const Content = () => {
    const network = data["elements"]
    const windowSize = 15.5*1000
    const [state, setState] = useState(initialState)
    function handleMouseSelect(depute){
        if (depute !== ""){
            setState(depute.name)
        }
        else{
            setState("")
        }
    }
    useEffect( 
        () =>   {
            d3.select("#mynetwork").selectAll("*").remove()
            createGraph(network["nodes"], network["edges"], windowSize,handleMouseSelect)
        },
        [network, windowSize]
    )    
  return (
      <>
        <Tooltip props = {state}/>
      <div id='mynetwork'></div>
      </>
  )
}

export default Content