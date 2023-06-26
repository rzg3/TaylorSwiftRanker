import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';
import { SortableItem } from './SortableItem';

function Ranker() {
    const [albums, setAlbums] = useState(["Taylor Swift", "Fearless", "Speak Now", "Red", "1989", "Reputation", "Lover", "folklore", "evermore", "Midnights"]);

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
                    {albums.map(album => <SortableItem key={album} id={album}/>)}
                </SortableContext>
            </Container>
            
        </DndContext>
    );

    function handleDragEnd(event) {
        console.log("Drag end called");
        const {active, over} = event;

        if (active.id !== over.id) {
            setAlbums((items) => {
                const activeIndex = items.indexOf(active.id);
                const overIndex = items.indexOf(over.id);

                return arrayMove(items, activeIndex, overIndex);
            });
        }
    }
}

export default Ranker;