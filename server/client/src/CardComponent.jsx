import './App.css';
import TextResizeComponent from './Ranker/TextResizeComponent';

function RankCard(props) {

    return (
        <div className='rectangle'>
        <div className="left-content">
        <img className="album_art" src={`/album_art/${props.coverArt}.png`} alt="Album Art" />
        
        </div>
       
        <div className="right-content">
            <TextResizeComponent text={`${props.rank}. ${props.display}`} maxSize={30}/>
            <div className="youtube_link">
                <a href={props.youtube_link} target="_blank" rel="noopener noreferrer">
                    <img className="youtube_logo" src="/youtubelogo.png" alt="YouTube Logo" />
                </a>
            </div>
        </div>
        </div>
    )
}

export default RankCard