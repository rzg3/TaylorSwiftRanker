import React, { useEffect, useState, useRef } from 'react';
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

export const stateContext = React.createContext({})

export default function SorterPopUp({ open, onClose, albums, setAlbums }) {
    const [leftChoice, setLeftChoice] = useState(null);
    const [rightChoice, setRightChoice] = useState(null);
    const userChoiceRef = useRef(null);
    const [sortedArr, setSortedArr] = useState([]);

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
      
        console.log([ ...merged, ...left, ...right ]);
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
    };
      
    useEffect(() => {
        let isSortingCompleted = false;
    
        const sortAlbums = async () => {
            if (open && !isSortingCompleted) {
            const sortedAlbums = await mergeSort(albums);
            setSortedArr(sortedAlbums);
            isSortingCompleted = true;
            }
        };
        
        sortAlbums();
    }, [open, albums]);
      

    const handleClose = () => {
        if (sortedArr.length === albums.length) {
            setAlbums(sortedArr);
        }   
        onClose();
    };

    if (!open) return null;

    return ReactDOM.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES} className='contain2'>
            <div className="contain">
            {leftChoice && rightChoice ? (
                

                <>
                <div className="leftContent">
                    <div className="art">
                    <img className="album_art2" src={`album_art/${leftChoice.album_name}.png`} alt="Album Art" onClick={() => handleUserChoice(leftChoice)}/>
                    </div>
                    <div className="desc">
                    <div className="display_content2">{leftChoice.album_name}</div>
                    <div className="youtube_link2">
                        <a href={leftChoice.youtube_link} target="_blank" rel="noopener noreferrer">
                        <img className="youtube_logo2" src="youtubelogo.png" alt="YouTube Logo" />
                        </a>
                    </div>
                    </div>
                </div>
                <div className="middleContent">
                   Choose Your Favorite Album
                </div>
                <div className="rightContent">
                    <div className="art">
                    <img className="album_art2" src={`album_art/${rightChoice.album_name}.png`} alt="Album Art" onClick={() => handleUserChoice(rightChoice)}/>
                    </div>
                    <div className="desc">
                    <div className="display_content2">{rightChoice.album_name}</div>
                    <div className="youtube_link2">
                        <a href={rightChoice.youtube_link} target="_blank" rel="noopener noreferrer">
                        <img className="youtube_logo2" src="youtubelogo.png" alt="YouTube Logo" />
                        </a>
                    </div>
                    </div>
                </div>
                </>
            ) : (
                <div>Loading...</div>
            )}
            </div>
            <button className="btn btn-outline-primary submitButton manualButton" onClick={handleClose}>
            Rank Manually
            </button>
        </div>
        </>,
    document.getElementById('portal')
    );
}
