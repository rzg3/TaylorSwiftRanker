import React from 'react'
import '../App.css';
import TextResizeComponent from '../Ranker/TextResizeComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

function FavoritesSquare({ text, coverArt, youtube_link}) {
  return (
    <div className='favoritesSquare'>    
            <img className="favoritesCoverArt" src={`/album_art/${coverArt}.png`} alt="Album Art" />
            <div className='d-flex justify-content-center text-align-center'>
                <TextResizeComponent text={text} maxSize={30} defFontSize={2}/>
                <div style={{width: '4vh', height: '4vh', alignSelf: 'center'}}>
                    <a href={youtube_link} target="_blank" rel="noopener noreferrer">
                        <img className="youtube_logo" src="/youtubelogo.png" alt="YouTube Logo" />
                    </a>
                </div>
            </div>
    </div>
  )

}

export default FavoritesSquare