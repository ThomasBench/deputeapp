import React, { useContext } from 'react'
import { Fab } from '@mui/material'
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { contentContext } from './Content';
const ResetButton = () => {
    const context = useContext(contentContext)

  return (
    <Fab color="success" aria-label="add" style = {{
        position: "absolute",
        bottom: '100px',
        right: "100px",
        maxWidth: '500px',
         maxHeight: '500px'    
        }}>
    <ZoomOutIcon onClick = {() => context.dispatcher({type: 'resetZoom'})} />
    </Fab>
  )
}

export default ResetButton