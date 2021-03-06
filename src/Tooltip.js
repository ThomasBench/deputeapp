import React, { useContext } from 'react'
import node_data from "./node_data"
import Card from '@mui/material/Card'
import { contentContext } from './Content'
import { CardHeader, CardContent, Divider, Typography} from '@mui/material'
const Tooltip = () => {
  const context = useContext(contentContext)

  if (context.state.chosen_depute !== "") {
    const depute = node_data[context.state.chosen_depute]
    return (
      <Card
      variant = "outlined"
        style={
          {
            position: "absolute",
            top: '50px',
            left: "50px",
            // borderWidth: "5px",
            // borderStyle: "solid",
            width: "20%",
            verticalAlign: "middle",
            textAlign: "justify"
          }
        }
        id="tooltip"
      >
        <CardHeader title = {depute.name} subheader = {"Groupe parlementaire : " +  depute.group}>

        </CardHeader>
        <CardContent>
        Députés les plus proches:
        <br/>
        <br/>
         {depute.closest.map((x) => (
          <>
            <Typography>
              {x}
            </Typography>
            <Divider/>
          </>
          ))
          }
        </CardContent>

      </Card>
    )
  } else {
    return (
      <div>
      </div>
    )
  }

}

export default Tooltip