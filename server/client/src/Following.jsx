import React, { useEffect, useState} from 'react'
import './App.css'

function Following(props) {

    const [following, setFollowing] = useState([]);
    
    useEffect(() => {
        fetchFollowing();
      }, []);

    const fetchFollowing = async () => {
    try {
        const response = await fetch('/getFollowing?username=' + props.username, {
        method: 'GET',
        });
        if (response.ok) {
            const follows = await response.json();
            setFollowing(follows);
        } else {
            console.error('Error fetching following:', response.status);
        }
    } catch (error) {
        console.error('Error fetching following:', error);
    }
    };
    
    return (
        <div className='align-self-end' style={{ width: '50%'}}>
            <h3>Following</h3>
            <div 
                class='scrollable d-inline-flex p-2  flex-column align-items-center flex-wrap justify-content-center' 
                style={{
                border: '3.5px dashed rgba(0,0,0,.5)', borderRadius: '1.5vh' ,boxSizing: 'border-box', width: '100%'
                }}
            >
                {
                    following.length !== 0 ? (
                        following.map(follow => <h5>{follow['username']}</h5>)
                    ) :
                    (<h5
                        style={{
                          fontStyle: 'italic',
                          opacity: 0.5,
                          margin: 'auto',
                        }}
                      >
                        No Followings
                      </h5>)
                }
            </div>

        </div>
    )
}

export default Following