import { Autocomplete, TextField } from '@mui/material'
import React, { useContext } from 'react'
import node_data from "./node_data"
import { contentContext } from './Content'
const SearchBar = () => {
    const deputes = Object.keys(node_data)
    const context = useContext(contentContext)
    function handleChange(value){
      if (value !== null){
        context.state.zoomFunc(value)
        context.state.highlight(value)
        context.dispatcher({type: "search", data: value})
        }
    }
  return (
    <div
                style={
                {
                  position: "absolute",
                  top: '50px',
                  right: "30px",
                  borderWidth: "2px",
                  borderStyle: "solid",
                  borderRadius: '5px',
                  padding: '5px',
                  width: "20%",
                  backgroundColor: "antiquewhite",
                  verticalAlign: "middle",
                  textAlign: "justify"
                }
            }>
        Cherchez un.e député.e : 
        <br/>
        <br/>
        <Autocomplete
            options = {deputes}
            renderInput = {(params) => <TextField {...params} label="Député.e" />}
            onChange = { (_, value) => handleChange(value)}

        />

    </div>
  )
}

export default SearchBar