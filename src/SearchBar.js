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
        context.dispatcher({type: "search", data: value})
        }
    }
  return (
    <div
                style={
                {
                  position: "absolute",
                  top: '50px',
                  right: "10px",
                  // borderWidth: "5px",
                  // borderStyle: "solid",
                  width: "20%",
                  verticalAlign: "middle",
                  textAlign: "justify"
                }
            }>
        Cherche ton député frr:
        <Autocomplete
            options = {deputes}
            renderInput = {(params) => <TextField {...params} label="Député.e" />}
            onChange = { (_, value) => handleChange(value)}

        />

    </div>
  )
}

export default SearchBar