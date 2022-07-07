import React from 'react'
import { useEffect, useReducer, createContext } from 'react'
import createGraph from "./createGraph"
import data from "./data"
import * as d3 from "d3"
import Tooltip from './Tooltip'
import SearchBar from './SearchBar'
const initialState = {chosen_depute: "", zoomed : false, zoomFunc: () => "" }
function reducer(state,action){
    switch(action.type){
        case "init":
            return {chosen_depute: state.chosen_depute, zoomed: state.zoomed, zoomFunc: action.data }
        case "mouseover":
            return {chosen_depute: action.data, zoomed: state.zoomed,zoomFunc: state.zoomFunc }
        case "mouseout": 
            return {chosen_depute: "", zoomed: state.zoomed, zoomFunc: state.zoomFunc}
        case "search":
            return {chosen_depute:action.data, zoomed: state.zoomed,zoomFunc: state.zoomFunc}
        default:
            console.log("frr")
            return state

    }
}
const contentContext = createContext()
const Content = () => {
    const network = data["elements"]
    const windowSize = 18*1000
    const [state, dispatcher] = useReducer(reducer, initialState)
    useEffect( 
        () =>   {
            d3.select("#mynetwork").selectAll("*").remove()
            createGraph(network["nodes"], network["edges"], windowSize,dispatcher)
        },
        [network, windowSize]
    )    
  return (
      <>
      <contentContext.Provider value={{state: state, dispatcher: dispatcher}}>
        <Tooltip/>
        <SearchBar/>
      <div id='mynetwork' style = {{width: "95%", height:"95%", borderWidth: "10px", borderStyle: "dotted", margin: "auto", verticalAlign: "bottom"}}></div>
      </contentContext.Provider>
      </>
  )
}
export {contentContext, Content}
