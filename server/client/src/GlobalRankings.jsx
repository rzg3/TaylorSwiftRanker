import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react';

function GlobalRankings(props) {

    useEffect(() => {
        fetchRankings();
      }, []);

    const fetchRankings = async () => {
        try {
          const response = await fetch('/getGlobalRankings', {
            method: 'GET',
          });
          if (response.ok) {
            const rankings = await response.json();
            setAlbums(rankings);
            setLoaded(true);
          } else {
            console.error('Error fetching rankings:', response.status);
          }
        } catch (error) {
          console.error('Error fetching rankings:', error);
        }
      };

    return (
        <Container className="p-3" style={{"width": "50%"}} align="center">
        <h2>Global Album Rankings</h2>
        
        </Container>
    )
}

export default GlobalRankings