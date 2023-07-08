import React, { useState }from 'react'
import RankCard from './CardComponent'
import './App.css';
import AllRankingsPopUp from './AllRankingsPopUp';
import SubmitButton from './SubmitButton';

function ScrollableRankings({ albumRankings, display, isAlbum }) {
  const [openPopUp, setOpenPopUp] = useState(false)

  return (
    <div className='rank-row d-flex flex-column align-items-center mb-5'>
    <h3 className='align-self-start'>{display}</h3>
    <div 
      class='scrollable d-inline-flex p-2  align-items-center flex-wrap justify-content-center' 
      style={{
        border: '3.5px dashed rgba(0,0,0,.5)', borderRadius: '1.5vh' ,boxSizing: 'border-box', width: '100%'
      }}
    >
      <AllRankingsPopUp open={openPopUp} togglePopUp={setOpenPopUp} albumRankings={albumRankings} isAlbum={isAlbum} display={display}/>
      { albumRankings.length !== 0 
        ?
          albumRankings.map((album, index)=> 
            <RankCard display={isAlbum ? album.album_name : album.song_name} youtube_link={album.youtube_link} rank={index + 1} coverArt={isAlbum ? album.album_name : album.cover_art}/>
            )

        : (
            <h4
              style={{
                fontStyle: 'italic',
                opacity: 0.5,
                margin: 'auto',
              }}
            >
              No Rankings Yet
            </h4>
          )
        }
    </div>
    <SubmitButton text="See All" disabled={false} onClick={event => setOpenPopUp(true)}/>
  </div>
  )
}

export default ScrollableRankings