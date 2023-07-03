import React from 'react'
import { useParams } from 'react-router-dom'
import Rankings from './Rankings';

function UserProfile() {

    let params = useParams();


  return (
    <Rankings display={params.username + "'s"} route='/getUserRankings' user={params.username}/>
  )
}

export default UserProfile