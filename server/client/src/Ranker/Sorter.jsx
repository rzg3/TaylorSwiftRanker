import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import SubmitButton from '../SubmitButton';
import "./Sorter.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import TextResizeComponent from './TextResizeComponent';

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
    zIndex: 1000
}

export const stateContext = React.createContext({})

export default function SorterPopUp({ open, onClose, albums, setAlbums, loaded, isAlbum }) {
    const [leftChoice, setLeftChoice] = useState(null);
    const [rightChoice, setRightChoice] = useState(null);
    const userChoiceRef = useRef(null);
    const [sortedArr, setSortedArr] = useState([]);
    const [sortingComplete, setSortingComplete] = useState(false);
    const [battleCounter, setBattleCcounter] = useState(0);

    const merge = async (left, right) => {
        const merged = [];
      
        while (left.length && right.length) {
            setLeftChoice(left[0]);
            setRightChoice(right[0]);
            userChoiceRef.current = null;
        
            while (userChoiceRef.current === null) {
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
        
            const chosenAlbum = userChoiceRef.current;
            
            if (chosenAlbum === left[0]) {
                merged.push(left.shift());
            } else {
                merged.push(right.shift());
            }
        }
      
        // console.log([ ...merged, ...left, ...right ]);
        return [ ...merged, ...left, ...right ]
      };
      
    const mergeSort = async (arr) => {
        if (arr.length <= 1) {
            return arr;
        }
        
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        
        return await merge(await mergeSort(left), await mergeSort(right));
    };

    const handleUserChoice = (chosenAlbum) => {
        userChoiceRef.current = chosenAlbum;
        setBattleCcounter(battleCounter + 1);
    };
      
    useEffect(() => {
        
        const sortAlbums = async () => {
            if (open && !sortingComplete) {
            const sortedAlbums = await mergeSort(albums);
            if (sortedAlbums.length === albums.length) {
                setSortedArr(sortedAlbums);
                setSortingComplete(true);
            } 
            }
        };
        if (loaded) {
        sortAlbums();
        }
    }, [open, albums, sortedArr]);
      

    const handleResort = () => {
        setSortingComplete(false);
        setSortedArr([])
    }
    const handleClose = () => {
        if (sortedArr.length === albums.length) {
            setAlbums(sortedArr);
        }
        setSortingComplete(false);
        onClose();
    };

    const chooseRandom = () => {
        handleUserChoice([leftChoice, rightChoice][Math.floor(Math.random() * 2)]);
    }

    if (!open) return null;


    return ReactDOM.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className='contain2'>
            <h2 className='custom-margin'>Choose Your Favorite</h2>
            <div className="contain">
            {leftChoice && rightChoice ? (

                !sortingComplete ? (

                <>
                <div className="leftContent">
                    <div className="art">
                    <img 
                        className="album_art2" 
                        src={`album_art/${isAlbum ? leftChoice.album_name : leftChoice.cover_art}.png`} 
                        alt="Album Art" 
                        onClick={() => handleUserChoice(leftChoice)} 
                    />
                    </div>
                    <div className="desc">
                    <div className="display_content2">{
                        isAlbum ? <TextResizeComponent text={leftChoice.album_name} maxSize={50} /> : <TextResizeComponent text={leftChoice.song_name} maxSize={50}/>
                    }</div>

                    <div className="youtube_link2">
                        <a href={leftChoice.youtube_link} target="_blank" rel="noopener noreferrer">
                        <img className="youtube_logo2" src="youtubelogo.png" alt="YouTube Logo" />
                        </a>
                    </div>
                    </div>
                </div>
                <div className="middleContent d-flex flex-column">
                    <button className="btn-square-md" onClick={() => chooseRandom()}>
                        Choose Random
                    </button>
                    <h5>Battles: {battleCounter}</h5>
                    <h5>Max Battles: {Math.trunc(albums.length * Math.log2(albums.length))}</h5>
                </div>
                <div className="rightContent">
                    <div className="art">
                    <img 
                        className="album_art2" 
                        src={`album_art/${isAlbum ? rightChoice.album_name : rightChoice.cover_art}.png`} 
                        alt="Album Art" 
                        onClick={() => handleUserChoice(rightChoice)} 
                    />
                    </div>
                    <div className="desc">
                    <div className="display_content2">{
                        isAlbum ? <TextResizeComponent text={rightChoice.album_name} maxSize={50} /> : <TextResizeComponent text={rightChoice.song_name} maxSize={50}/>
                    }</div>
                    <div className="youtube_link2">
                        <a href={rightChoice.youtube_link} target="_blank" rel="noopener noreferrer">
                        <img className="youtube_logo2" src="youtubelogo.png" alt="YouTube Logo" />
                        </a>
                    </div>
                    </div>
                </div>
                </>

            ): <div>
                <button id='btn2' className="btn btn-outline-primary submitButton" onClick={handleResort}>
                Sort Again
                </button>
                <button id='btn2' className="btn btn-outline-primary submitButton" onClick={handleClose}>
                See New Rankings
                </button>
            </div>
            ) : (
                <div class='loading'>Loading...</div>
            )}
            </div>
            {!sortingComplete ? <button id='btn2' className="btn btn-outline-primary submitButton rankButton"  onClick={handleClose}>
                Rank Manually
            </button> : ''}
            
        </div>
        </>,
    document.getElementById('portal')
    );
}
