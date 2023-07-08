import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react';
import RankCard from './CardComponent.jsx';
import './App.css';
import SubmitButton from './SubmitButton.jsx';
import { useNavigate } from 'react-router-dom';
import ScrollableRankings from './ScrollableRankings.jsx';

function Rankings(props) {

    const [albumRankings, setAlbumRankings] = useState([])
    const [albumSongRankings, setAlbumSongRankings] = useState([])
    const [songRankings, setSongRankings] = useState([])
    const navigate = useNavigate();
    const albumTitles = ['Taylor Swift', 'Fearless', 'Speak Now', 'Red', '1989', 'Reputation', 'Lover', 'folklore', 'evermore', 'Midnights']

    useEffect(() => {
        fetchRankings();
        
      }, []);

    const fetchRankings = async () => {
      try {
        const response = await fetch(props.route + '?username=' + props.user, {
          method: 'GET',
        });
        if (response.ok) {
          const rankings = await response.json();
          setAlbumRankings(rankings.albums);
          setAlbumSongRankings(rankings.albumSongs);
          setSongRankings(rankings.songs);
        } else {
          console.error('Error fetching rankings:', response.status);
        }
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };
    
      

    return (
        <Container className="p-2" style={{"width": "100vw"}} align="center">
        <div className='d-inline-flex flex-column justify-content-between align-content-center flex-wrap m-5' style={{boxSizing: 'border-box', width: 'calc(100% - 6rem)'}}>
        <div className='mb-3' style={{boxSizing: 'border-box', width: '100%'}}>
          <h2>{props.display} Rankings</h2>
          {props.followButton ? (
            <button className="btn btn-outline-primary submitButton" onClick={ () => props.followUnfollow()}>
            {props.btnText}
            </button>
          ) : ''}
        </div>

        <ScrollableRankings key={0} albumRankings={albumRankings} display='Albums' isAlbum={true}/>
        <ScrollableRankings key={0} albumRankings={songRankings} display='Songs' isAlbum={false}/>

        {albumSongRankings.map((albumSong, index) => <ScrollableRankings key={index + 2} albumRankings={albumSong} display={albumTitles[index]} isAlbum={false}/>)}

        
        <SubmitButton text="Return" disabled={false} onClick={event => navigate('/dashboard')}/>
        </div>
        </Container>

    )
}

export default Rankings