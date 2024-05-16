import React, { useState, useEffect }from 'react'
import { useNavigate } from 'react-router-dom';
import FavoritesSquare from './FavoritesSquare';
import SubmitButton from '../SubmitButton';

function Favorites({currUser}) {
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([])


    const getFavorites = async () => {
    try {
        const response = await fetch('/getFavorites', {
            method: 'GET',
        });
        if (response.ok) {
            const favoritesList = await response.json();
            setFavorites(favoritesList);
        } else {
            console.error('Error fetching favorites:', response.status);
        }
        } catch (error) {
        console.error('Error fetching favorites:', error);
        }
    };

    useEffect(() => {
        getFavorites();
      }, []);


  return (
    <div className='containerFavorite' style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center'
                                    }}
    >
        
            <>
                <h3 className='text-align-center'>Favorites</h3>
                <div className='favoritesContainer'>
                    {favorites.length > 0 && (favorites[0] || favorites[1])
                        ?
                        <>
                            { favorites[0] &&
                                <>
                                <h5 className='text-align-center'>Album</h5>   
                                <FavoritesSquare text={favorites[0].album_name} youtube_link={favorites[0].youtube_link} coverArt={favorites[0].album_name}/> 
                                </>}
                            { favorites[1] && 
                                <> 
                                <h5 className='text-align-center'>Song</h5>
                                <FavoritesSquare text={favorites[1].song_name}  youtube_link={favorites[1].youtube_link} coverArt={favorites[1].cover_art}/>
                                </>}
                        </>
                        :
                                    <h5
                            style={{
                            fontStyle: 'italic',
                            opacity: 0.5,
                            margin: 'auto',
                            width: '20vh',
                            height:'20vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center'
                            }}
                        >
                            No Rankings
                        </h5>}     
                        
                </div>
                <button 
                style={{maxWidth: '100%'}} 
                className='btn btn-outline-primary submitButton smallBtn' 
                onClick={(e) => navigate(`/user/${currUser}`)}>
                    See Profile
                </button> 
                
            </>
        
    </div>
  )
}

export default Favorites