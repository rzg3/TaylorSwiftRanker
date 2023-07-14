import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { SortableItem } from './SortableItem';
import SubmitButton from '../SubmitButton';
import SorterPopUp from './Sorter'

function Ranker(props) {

    const getRoute = props.getRoute
    const postRoute = props.postRoute
    const [albums, setAlbums] = useState([]);
    const [openSorter, setOpenSorter] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      fetchRankings();
    }, []);
  
    const fetchRankings = async () => {
      try {
        const response = await fetch(getRoute, {
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

    const handleSave = async () => {
      try {
        const propertyToAccess = props.isAlbum ? 'album_name' : 'song_name';
        const albumNames = albums.map(album => album[propertyToAccess]);
        const response = await fetch(postRoute, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rankings: albumNames }) // Pass album names instead of the entire albums array
        });
    
        if (response.ok) {
          console.log('Rankings saved successfully!');
        } else {
          console.error('Error saving rankings:', response.status);
        }
      } catch (error) {
        console.error('Error saving rankings:', error);
      }
    };
    
    const handleDragEnd = (event) => {
        console.log("Drag end called");
        const { active, over } = event;

        if (active.id !== over.id) {
            setAlbums((items) => {
            const activeIndex = items.indexOf(active.id);
            const overIndex = items.indexOf(over.id);

            return arrayMove(items, activeIndex, overIndex);
            });
        }
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            
            <Container className="p-3" style={{"width": "50%"}} align="center">
                <SorterPopUp open={openSorter} onClose={() => setOpenSorter(false)} albums={albums} setAlbums={setAlbums} loaded={loaded} isAlbum={props.isAlbum}/>
                <h3 className='m-4'>Rank Taylor Swift's {props.rankDisplay}</h3>


                <div className='mt-3 mb-3 d-flex justify-content-center align-items-center' >
                    
                    <button className='btn btn-outline-primary submitButton smallBtn' onClick={event => navigate('/dashboard')}>Return</button> 
                    <button className='btn btn-outline-primary submitButton smallBtn' onClick={handleSave}>Save Rankings</button> 
                    <button className='btn btn-outline-primary submitButton smallBtn' onClick={() => setOpenSorter(true)}>Open Sorter</button> 
              
                </div>
                <div style={{     
                              border: '3.5px dashed rgba(0,0,0,.5)',
                              borderRadius: '1.5vh',
                            }}>
                  
                  <h5 className='mt-2'
                    style={{
                      fontStyle: 'italic',
                      opacity: 0.5,
                      margin: 'auto',
                    }}
                  >
                      Drag and Drop
                  </h5>

                  
                  <div className='d-flex justify-content-center flex-wrap'>
                  <SortableContext
                      items={albums}
                      strategy={rectSortingStrategy}
                  >
                      {/* We need components that use the useSortable hook */}
                      {albums.map((album, index) => 
                        <SortableItem
                        key={props.isAlbum ? album.album_name : album.song_name}
                        id={album}
                        display={props.isAlbum ? album.album_name : album.song_name}
                        cover_art={props.isAlbum ? album.album_name : album.cover_art}
                        youtube_link={album.youtube_link}
                        rank={index + 1}
                        />
                      )}
                  </SortableContext>
                  </div>
                </div>
                
            </Container>
            <p className='legal'>All copyrighted content (i.e. album artwork) on Taylor Swift Ranker are owned by their respective owners (Taylor Swift / Record Labels).</p>
        </DndContext>
        

    );
}

export default Ranker;