import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { SortableItem } from './SortableItem';
import SubmitButton from './SubmitButton';

function Ranker(props) {
    const getRoute = props.getRoute
    const postRoute = props.postRoute
    const [albums, setAlbums] = useState([]);

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
        } else {
          console.error('Error fetching rankings:', response.status);
        }
      } catch (error) {
        console.error('Error fetching rankings:', error);
      }
    };

    const handleSave = async () => {
      try {
        const albumNames = albums.map(album => album.album_name); // Extract album names
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
                <h3>Rank Taylor Swift Albums</h3>
                <SortableContext
                    items={albums}
                    strategy={verticalListSortingStrategy}
                >
                    {/* We need components that use the useSortable hook */}
                    {albums.map(album => 
                      <SortableItem key={album.album_name} id={album} display={album.album_name} youtube_link={album.youtube_link}/>)}
                </SortableContext>
                <SubmitButton text="Save Rankings" disabled={false} onClick={handleSave}/>
                <SubmitButton className="custom-padding" text="Return to Dashboard" disabled={false} onClick={event => window.location.href='/dashboard'}/>
            </Container>
            
        </DndContext>

    );
}

export default Ranker;