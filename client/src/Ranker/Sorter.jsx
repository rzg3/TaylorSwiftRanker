import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import SubmitButton from '../SubmitButton';
import "./Sorter.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    padding: '50px',
    zIndex: 1000
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0, .7)',
    zIndex: 1000
}

export default function SorterPopUp( {open, onClose, albums, setAlbums }) {
    if (!open) return null
    
    return ReactDOM.createPortal(
        <>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES}>
                <div className='contain'>
                    <div className='leftContent'>
                        <div className="art">
                            <img className="album_art2" src={`album_art/${albums[0].album_name}.png`} alt="Album Art" />
                        </div>
                        
                        <div className="desc">
                            <div className="display_content">{albums[0].album_name}</div>
                            <div className="youtube_link">
                                <a href={albums[0].youtube_link} target="_blank" rel="noopener noreferrer">
                                    <img className="youtube_logo2" src="youtubelogo.png" alt="YouTube Logo" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className='middleContent'>

                    </div>
                    <div className='rightContent'>
                    <div className="art">
                            <img className="album_art2" src={`album_art/${albums[1].album_name}.png`} alt="Album Art" />
                        </div>
                        
                        <div className="desc">
                            <div className="display_content">{albums[1].album_name}</div>
                            <div className="youtube_link">
                                <a href={albums[1].youtube_link} target="_blank" rel="noopener noreferrer">
                                    <img className="youtube_logo2" src="youtubelogo.png" alt="YouTube Logo" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <button className='btn btn-outline-primary submitButton' onClick={onClose}>Rank Manually</button>
            
            </div>
        </>,
        document.getElementById('portal')
    )
}

