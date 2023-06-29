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

export default function SorterPopUp( {open, onClose }) {
    if (!open) return null
    
    return ReactDOM.createPortal(
        <>
            <div style={OVERLAY_STYLES} />
            <div style={MODAL_STYLES}>
            
            <button className='btn btn-outline-primary submitButton' onClick={onClose}>Close Modal</button>
            
            </div>
        </>,
        document.getElementById('portal')
    )
}

