import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Rankings from './Rankings';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import SubmitButton from './SubmitButton';

function UserProfile() {

    let params = useParams();
    const navigate = useNavigate();

    const [userExists, setUserExists] = useState(null)

    useEffect(() => {
        checkUser();
      }, []);
    

    const checkUser = async () => {
    try {
        const response = await fetch('/checkUser?username=' + params.username, {
            method: 'GET',
        });
        if (response.ok) {
            const exists = await response.json();
            setUserExists(exists);
        } else {
            console.error('Error fetching rankings:', response.status);
        }
        } catch (error) {
        console.error('Error fetching rankings:', error);
        }
    };


  return (
    <>
        {
            userExists 
                ?
                    <Rankings display={params.username + "'s"} route='/getUserRankings' user={params.username}/>
                :
                    <div className='app d-flex flex-column align-items-center justify-content-center'>
                        <h2>User Doesn't Exist</h2>
                        <SubmitButton
                            text='Return to Dashboard'
                            disabled={false}
                            onClick={ () => navigate('/dashboard')}
                        />
                    </div>

        }
    </>
    
  )
}

export default UserProfile