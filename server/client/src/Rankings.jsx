import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react';
import RankCard from './CardComponent.jsx';
import './App.css';
import SubmitButton from './SubmitButton.jsx';
import { useNavigate } from 'react-router-dom';

function Rankings(props) {

    const [albumRankings, setAlbumRankings] = useState([])
    const navigate = useNavigate();

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
          setAlbumRankings(rankings);
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
          {props.followButton ? (<SubmitButton text="Follow" disabled={false} onClick={event => props.insertFollow()}/>) : ''}
        </div>
        <div className='rank-row d-flex flex-column align-items-center mb-5'>
          <h3 className='align-self-start'>Albums</h3>
          <div 
            class='scrollable d-inline-flex p-2  align-items-center flex-wrap justify-content-center' 
            style={{
              border: '3.5px dashed rgba(0,0,0,.5)', borderRadius: '1.5vh' ,boxSizing: 'border-box', width: '100%'
            }}
          >
            { albumRankings.length !== 0 
              ?
              albumRankings.map((album, index)=> 
                <RankCard display={album.album_name} youtube_link={album.youtube_link} rank={index + 1} />
                )
              : (
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
        </div>

        <div className='rank-row d-flex flex-column align-items-center mb-5'>
          <h3 className='align-self-start'>Songs</h3>
          <div 
            class='scrollable d-inline-flex p-2  align-items-center flex-wrap justify-content-center' 
            style={{
              border: '3.5px dashed rgba(0,0,0,.5)', borderRadius: '1.5vh' ,boxSizing: 'border-box', width: '100%'
            }}
          >
            { albumRankings.length !== 0 
              ?
              albumRankings.map((album, index)=> 
                <RankCard display={album.album_name} youtube_link={album.youtube_link} rank={index + 1} />
                )
              : (
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
        </div>

        <div className='rank-row d-flex flex-column align-items-center mb-3'>
          <h3 className='align-self-start'>The Eras Tour Setlist</h3>
          <div 
            class='scrollable d-inline-flex p-2  align-items-center flex-wrap justify-content-center' 
            style={{
              border: '3.5px dashed rgba(0,0,0,.5)', borderRadius: '1.5vh' ,boxSizing: 'border-box', width: '100%'
            }}
          >
            { albumRankings.length !== 0 
              ?
              albumRankings.map((album, index)=> 
                <RankCard display={album.album_name} youtube_link={album.youtube_link} rank={index + 1} />
                )
              : (
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
        </div>
        <SubmitButton text="Return" disabled={false} onClick={event => navigate('/dashboard')}/>
        </div>
        </Container>

    )
}

export default Rankings