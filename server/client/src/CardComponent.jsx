import './App.css';

function RankCard(props) {

    return (
        <div className='rectangle'>
        <div className="left-content">
        <img className="album_art" src={`/album_art/${props.display}.png`} alt="Album Art" />
        
        </div>
       
        <div className="right-content">
            <div className="display_content">{props.rank}. {props.display}</div>
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