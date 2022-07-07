import React from 'react'
import { useEffect, useReducer, createContext } from 'react'
import createGraph from "./createGraph"
import data from "./data"
import * as d3 from "d3"
import Tooltip from './Tooltip'
import SearchBar from './SearchBar'
import ResetButton from './ResetButton'
const initialState = {chosen_depute: "", zoomed : false, zoomFunc: () => "", highlight: () => "" , remove: () => ""}
function reducer(state,action){
    switch(action.type){
        case "init":
            return {chosen_depute: state.chosen_depute, zoomed: state.zoomed, zoomFunc: action.data.zoom, highlight: action.data.highlight, remove: action.data.remove}
        case "mouseover":
            if (state.chosen_depute !== ""){
                state.remove(state.chosen_depute)
            }
            state.highlight(action.data)
            return {chosen_depute: action.data, zoomed: state.zoomed,zoomFunc: state.zoomFunc,  highlight: state.highlight, remove: state.remove }
        case "mouseout": 
            state.remove(state.chosen_depute)
            return {chosen_depute: "", zoomed: state.zoomed, zoomFunc: state.zoomFunc,  highlight: state.highlight, remove: state.remove }
        case "search":
            if (state.chosen_depute !== ""){
                state.remove(state.chosen_depute)
            }
            state.highlight(action.data)
            return {chosen_depute:action.data, zoomed: state.zoomed,zoomFunc: state.zoomFunc,  highlight: state.highlight, remove: state.remove }
        case "resetZoom":
            d3.select("g").transition().duration(1000).attr("transform", `translate(0,0), scale(1)`)
            return state
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
        <ResetButton/>
      <div id='mynetwork' style = {{width: "95%", height:"95%", borderWidth: "0px", borderStyle: "dotted", margin: "auto", verticalAlign: "bottom"}}></div>
      </contentContext.Provider>
      </>
  )
}
export {contentContext, Content}
