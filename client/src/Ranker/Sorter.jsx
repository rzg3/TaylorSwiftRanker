import React, { useEffect, useState, useContext } from 'react';
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
    const [userChoice, setUserChoice] = useState(null);
    const [sortedArr, setSortedArr] = useState([]);

    const mergeSort = async (arr) => {

        if (arr.length <= 1) {
            return arr;
        }
    
        const mid = Math.floor(arr.length / 2);
        const left = arr.slice(0, mid);
        const right = arr.slice(mid);
    
        return await merge(await mergeSort(left), await mergeSort(right));
    };
    
    const merge = async (left, right) => {
        let i = 0;
        let j = 0;
        const merged = [];
      
        while (i < left.length && j < right.length) {
            setLeftChoice(left[i]);
            setRightChoice(right[j]);
            setUserChoice(null)
            
            while (userChoice === null) {
                await new Promise((resolve) => setTimeout(resolve, 500));
            }

            const chosenAlbum = userChoice === 1 ? left[i] : right[j];
                
            if (chosenAlbum === left[i]) {
                merged.push(left[i]);
                i++;
            } else {
                merged.push(right[j]);
                j++;
            }
        }
        
        while (i < left.length) {
          merged.push(left[i]);
          i++;
        }
      
        while (j < right.length) {
          merged.push(right[j]);
          j++;
        }
        console.log(merged)
        return merged;
      };
      
    const handleUserChoice = (chosenAlbum) => {
        setUserChoice(chosenAlbum);
        console.log("23232", userChoice)
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
        setAlbums(sortedArr);
        onClose();
    };

    if (!open) return null;

    return ReactDOM.createPortal(
        <>
        <div style={OVERLAY_STYLES} />
        <div style={MODAL_STYLES}>
            <div className="contain">
            {leftChoice && rightChoice ? (
                <>
                <div className="leftContent">
                    <div className="art">
                    <img className="album_art2" src={`album_art/${leftChoice.album_name}.png`} alt="Album Art" />
                    </div>
                    <div className="desc">
                    <div className="display_content">{leftChoice.album_name}</div>
                    <div className="youtube_link">
                        <a href={leftChoice.youtube_link} target="_blank" rel="noopener noreferrer">
                        <img className="youtube_logo2" src="youtubelogo.png" alt="YouTube Logo" />
                        </a>
                    </div>
                    </div>
                </div>
                <div className="middleContent">
                    {userChoice === null ? (
                    <div>
                        <div>{leftChoice.album_name}</div>
                        <button onClick={() => handleUserChoice(leftChoice)}>Prefer This</button>
                        <div>{rightChoice.album_name}</div>
                        <button onClick={() => handleUserChoice(rightChoice)}>Prefer That</button>
                    </div>
                    ) : (
                    <div>{console.log(userChoice)}</div>
                    )}
                </div>
                <div className="rightContent">
                    <div className="art">
                    <img className="album_art2" src={`album_art/${rightChoice.album_name}.png`} alt="Album Art" />
                    </div>
                    <div className="desc">
                    <div className="display_content">{rightChoice.album_name}</div>
                    <div className="youtube_link">
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
            <button className="btn btn-outline-primary submitButton" onClick={handleClose}>
            Rank Manually
            </button>
        </div>
        </>,
    document.getElementById('portal')
    );
}
