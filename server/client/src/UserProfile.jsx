import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Rankings from './Rankings';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import SubmitButton from './SubmitButton';

function UserProfile() {

    let params = useParams();
    const navigate = useNavigate();

    const [userExists, setUserExists] = useState(null);
    const [following, setFollowing] = useState('');
    
    const checkFollowing = async () => {
        try {
            const response = await fetch('/checkFollowing?username=' + params.username, {
            method: 'GET',
            });
            if (response.ok) {
                const follows = await response.json()
                setFollowing(follows);
            } else {
                console.error('Error fetching following:', response.status);
            }
        } catch (error) {
            console.error('Error fetching following:', error);
        }
    };

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

    useEffect(() => {
        checkUser();
      }, []);
    
    useEffect(() => {
        checkFollowing();
    }, [following]);

    const insertFollow = async () => {
        try {
            const response = await fetch('/insertFollow?username=' + params.username, {
                method: 'GET',
            });
            if (response.ok) {
                setFollowing(true)
                console.log(following)
            } else {
                console.error('Error fetching rankings:', response.status);
            }
            } catch (error) {
            console.error('Error fetching rankings:', error);
            }
    };

    const removeFollow = async () => {
        try {
            const response = await fetch('/removeFollow?username=' + params.username, {
                method: 'GET',
            });
            if (response.ok) {
                setFollowing(false)
                console.log(following)
            } else {
                console.error('Error fetching rankings:', response.status);
            }
            } catch (error) {
            console.error('Error fetching rankings:', error);
            }
    };


    if (userExists === null || following === null) {
        return null;
      }

    return (
        <>
            {
                userExists 
                    ?
                        ( 
                            following
                                ?
                                    (
                                        <Rankings 
                                            display={params.username + "'s"} 
                                            route='/getUserRankings' 
                                            user={params.username} 
                                            followButton={true} 
                                            followUnfollow={removeFollow} 
                                            btnText={'Unfollow'}
                                            setFollowing={setFollowing}
                                        />
                                    )
                                :
                                    (
                                        <Rankings 
                                            display={params.username + "'s"} 
                                            route='/getUserRankings' 
                                            user={params.username} 
                                            followButton={true} 
                                            followUnfollow={insertFollow} 
                                            btnText={'Follow'}
                                            setFollowing={setFollowing}
                                        />
                                    )
                        )
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