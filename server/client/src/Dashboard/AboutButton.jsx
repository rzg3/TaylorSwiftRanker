import React from 'react'
import { useNavigate } from 'react-router-dom'

function AboutButton() {
    const navigate = useNavigate()
  return (
    <button style={{maxWidth: '50px'}} className='btn btn-outline-primary submitButton smallBtn' onClick={(e) => navigate('/about')}>About</button> 
  )
}

export default AboutButton