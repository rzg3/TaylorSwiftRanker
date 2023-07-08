import React, { useState, useEffect }from 'react'
import RankCard from '../CardComponent';
import FavoritesSquare from './FavoritesSquare';

function Favorites() {

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
    <div>
        {favorites.length > 0 && (
            <>
                <FavoritesSquare text={favorites[0].album_name} youtube_link={favorites[0].youtube_link} coverArt={favorites[0].album_name}/>
                <FavoritesSquare text={favorites[1].song_name}  youtube_link={favorites[1].youtube_link} coverArt={favorites[1].cover_art}/>
            </>
        )}
        
    </div>
  )
}

export default Favorites