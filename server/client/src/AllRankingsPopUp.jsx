import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import SubmitButton from './SubmitButton';
import RankCard from './CardComponent'
import "./Ranker/Sorter.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    padding: '50px',
    zIndex: 1000,
    borderRadius: '2.5vh'
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0, .7)',
    backdropFilter: 'blur(.3vh)',
    zIndex: 1000,
}

export const stateContext = React.createContext({})

export default function AllRankingsPopUp({ open, togglePopUp, albumRankings, isAlbum, display }) {
    

    if (!open) return null;

    const navigate = useNavigate();

    return ReactDOM.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className='contain2'>
            <h3 className='align-self-center custMarginTop'>{display}</h3>
            <div 
                class='seeAllScrollable d-inline-flex p-2  align-items-center flex-wrap justify-content-center' 
                style={{
                    border: '3.5px dashed rgba(0,0,0,.5)', borderRadius: '1.5vh' ,boxSizing: 'border-box'
                }} 
            >
                { albumRankings.length !== 0 
                ?
                    albumRankings.map((album, index)=> 
                    <RankCard display={isAlbum ? album.album_name : album.song_name} youtube_link={album.youtube_link} rank={index + 1} coverArt={isAlbum ? album.album_name : album.cover_art}/>
                    )
                :
                (
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
            <div className='custMarginBot'>
            <SubmitButton text="Back to Rankings" disabled={false} onClick={e => togglePopUp(false)}/>
            </div>
        </div>
                
        </>,
    document.getElementById('portal')
    );
}
