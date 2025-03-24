// import React from 'react'

import { Button } from "@mui/material"
import { useNavigate } from "react-router-dom";

function Start() {
  const navigate = useNavigate(); 
  const handleClick = () => {
    navigate("/login");
  }
  return (
    <div>
      <Button onClick={handleClick}>Start</Button>
    </div>
  )
}

export default Start
