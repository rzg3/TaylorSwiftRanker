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

export default function SorterPopUp({ open, onClose, albums, setAlbums, loaded, isAlbum, isSongRanking }) {
    const [leftChoice, setLeftChoice] = useState(null);
    const [rightChoice, setRightChoice] = useState(null);
    const userChoiceRef = useRef(null);
    const [sortedArr, setSortedArr] = useState([]);
    const [sortingComplete, setSortingComplete] = useState(false);
    const [battleCounter, setBattleCcounter] = useState(1);
    const [songSorterChoice, setSongSorterChoice] = useState(!isSongRanking ? true : null);
    const [preSortedAlbums, setPreSortedAlbums] = useState([])
    const [preLoaded, setPreLoaded] = useState(isSongRanking ? false : true)

    const fetchPreSorted = async () => {
        try {
          const response = await fetch('getPreSorted', {
            method: 'GET',
          });
          if (response.ok) {
            const rankings = await response.json();
            setPreSortedAlbums(rankings)
            setPreLoaded(true)
          } else {
            console.error('Error fetching presorted:', response.status);
          }
        } catch (error) {
          console.error('Error fetching presorted', error);
        }
      };
    
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

    const mergeSort2 = async (arr) => {
        if (arr.length === 0) {
            return arr
        }
        if (arr.length === 1) {
            return arr[0];
        }
        
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
        
        return await merge(await mergeSort2(left), await mergeSort2(right));
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
            if (open && !sortingComplete && songSorterChoice === true) {
                const sortedAlbums = await mergeSort(albums);
                if (sortedAlbums.length === albums.length) {
                    setSortedArr(sortedAlbums);
                    setBattleCcounter(1)
                    setSortingComplete(true);
                }
            }
            else if (open && !sortingComplete && songSorterChoice === false) {
                if (!preLoaded){
                    fetchPreSorted()
                }
                if (preLoaded) {
  
                    const sortedAlbums = await mergeSort2(preSortedAlbums);
                    if (sortedAlbums.length === albums.length) {

                        setSortedArr(sortedAlbums);
                        setBattleCcounter(1)
                        setSortingComplete(true);
                    }
                }
            }
        };
        if (loaded && (songSorterChoice !== null)) {
            sortAlbums();
        }
    }, [open, albums, sortedArr, songSorterChoice, preLoaded]);
      

    const handleResort = () => {
        setSortingComplete(false);
        setBattleCcounter(0)
        setSongSorterChoice(null)
        setSortedArr([])
    }
    const handleClose = () => {
        if (sortedArr.length === albums.length) {
            setAlbums(sortedArr);
        }
        setBattleCcounter(0)
        setSortingComplete(false);
        setSongSorterChoice(null)
        onClose();
    };

    const chooseRandom = () => {
        handleUserChoice([leftChoice, rightChoice][Math.floor(Math.random() * 2)]);
    }

    if (!open) return null;

    if (songSorterChoice === null) {
        return ReactDOM.createPortal(
            <>
                <div style={OVERLAY_STYLES} />
                <div style={MODAL_STYLES} className='contain2'>
                    <div className='d-flex justify-content-around' style={{maxWidth: '80vw', width: '45vh', border: '3.5px dashed rgba(0,0,0,.5)', borderRadius: '1.5vh',}}>
                        <div style={{textAlign: 'center', width: '50%'}}>
                            <button style={{marginBottom: '10px', width: '12.5vh', height: '12.5vh'}} className="btn-square-md" onClick={() => setSongSorterChoice(true)}>
                                Sort From Scratch
                            </button>
                            <p style={{padding: '10px', fontSize: '12px',color: '#777', textAlign: 'center'}}>
                                Choose this option if you have not done any song rankings on individual albums or want to start from scratch
                            </p>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <button style={{marginBottom: '10px', width: '12.5vh', height: '12.5vh'}} className="btn-square-md" onClick={() => setSongSorterChoice(false)}>
                                Import Album Song Rankings
                            </button>
                            <p style={{padding: '10px', fontSize: '12px',color: '#777', textAlign: 'center'}}>
                                Choose this option if you have done song rankings on individual albums (faster)
                            </p>
                        </div>
                    </div>
                </div>
            </>, document.getElementById('portal')
        )
    };

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
                    <h5>Battle #{battleCounter}</h5>
                    <h5>Max Battles: {songSorterChoice ? Math.trunc(albums.length * Math.log2(albums.length)) :
                                      Math.trunc(albums.length * Math.log2(preSortedAlbums.length))  }</h5>
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
