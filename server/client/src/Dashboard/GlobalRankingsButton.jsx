import React from 'react'
import SubmitButton from '../SubmitButton'
import { useNavigate  } from 'react-router-dom'

function GlobalRankingsButton() {
    const navigate = useNavigate()
  return (
    <SubmitButton text="Global Rankings" disabled={false} onClick={event => navigate('/globalrankings')}/>
  )
}

export default GlobalRankingsButton