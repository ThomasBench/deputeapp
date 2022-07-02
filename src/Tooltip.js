import React from 'react'

const Tooltip = (props) => {
  return (
    <div 
      style = {
        {
          position: "absolute", 
          top: '50px', 
          left: "50px", 
          width : "300px", 
          height: "100px", 
          borderWidth : "5px", 
          borderStyle: "solid",
          verticalAlign: "middle"
        }
      } 
      id = "tooltip"
      >
      {props.props}
    </div>
  )
}

export default Tooltip