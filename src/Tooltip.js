import React from 'react'
import node_data from './node_data'
const Tooltip = (props) => {
  const depute = node_data[props.props]
  if (props.props !== "") {
    return (
      <div
        style={
          {
            position: "absolute",
            top: '50px',
            left: "50px",
            width: "300px",
            height: "100px",
            // borderWidth: "5px",
            // borderStyle: "solid",
            verticalAlign: "middle",
            textAlign: "justify"
          }
        }
        id="tooltip"
      >
        Député : {depute.name}
        <br/>
        Groupe parlementaire : {depute.group}
        <br/>
        Députés les plus proches : {depute.closest}
      </div>
    )
  } else {
    return (
        <div
        style={
          {
            position: "absolute",
            top: '50px',
            left: "50px",
            width: "300px",
            height: "100px",
            // borderWidth: "5px",
            // borderStyle: "solid",
            verticalAlign: "middle"
          }
        }
        id="tooltip"
      >
      </div>
    )
  }

}

export default Tooltip