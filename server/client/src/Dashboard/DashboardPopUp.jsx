import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactDOM from 'react-dom';
import SubmitButton from '../SubmitButton';
import "../Ranker/Sorter.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const MODAL_STYLES = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#FFF',
    padding: '10px',
    zIndex: 1000,
    borderRadius: '2.5vh',
    maxHeight: '90vh'
}

const OVERLAY_STYLES = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0, .7)',
    backdropFilter: 'blur(.3vh)',
    zIndex: 1000
}

export const stateContext = React.createContext({})

export default function DashboardPopUp({ open, togglePopUp }) {
    

    if (!open) return null;

    const navigate = useNavigate();

    return ReactDOM.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className='contain2'>
            <div 
                class='scrollable px-4 py-3' style={{height: '100%'}}
            >
                <SubmitButton text="Album Ranker" disabled={false} onClick={event => navigate('/albums')}/>
                <SubmitButton text="Song Ranker" disabled={false} onClick={event => navigate('/songs')}/>
                <SubmitButton text="Taylor Swift Ranker" disabled={false} onClick={event => navigate('/taylorswift')}/>
                <SubmitButton text="Fearless Ranker" disabled={false} onClick={event => navigate('/fearless')}/>
                <SubmitButton text="Speak Now Ranker" disabled={false} onClick={event => navigate('/speaknow')}/>
                <SubmitButton text="Red Ranker" disabled={false} onClick={event => navigate('/red')}/>
                <SubmitButton text="1989 Ranker" disabled={false} onClick={event => navigate('/1989')}/>
                <SubmitButton text="Reputation Ranker" disabled={false} onClick={event => navigate('/reputation')}/>
                <SubmitButton text="Lover Ranker" disabled={false} onClick={event => navigate('/lover')}/>
                <SubmitButton text="folklore Ranker" disabled={false} onClick={event => navigate('/folklore')}/>
                <SubmitButton text="evermore Ranker" disabled={false} onClick={event => navigate('/evermore')}/>
                <SubmitButton text="Midnights Ranker" disabled={false} onClick={event => navigate('/midnights')}/>
                <SubmitButton text="TTPD Ranker" disabled={false} onClick={event => navigate('/thetorturedpoetsdepartment')} style={{ wordWrap: 'break-word' }} />
                <br />
                <SubmitButton text="Back to Dashboard" disabled={false} onClick={togglePopUp}/>
            </div>
        </div>
        </>,
    document.getElementById('portal')
    );
}
