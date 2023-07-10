import React from 'react'
import '../App.css';
import TextResizeComponent from '../Ranker/TextResizeComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

function FavoritesSquare({ text, coverArt, youtube_link}) {
  return (
    <div className='favoritesSquare'>    
            <img className="favoritesCoverArt" src={`/album_art/${coverArt}.png`} alt="Album Art" />
            <div className='d-flex justify-content-center text-align-center favoritesText'>
                <TextResizeComponent text={text} maxSize={20} defFontSize={2}/>
            </div>
    </div>
  )

}

export default FavoritesSquare