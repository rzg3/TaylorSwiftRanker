import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Card from 'react-bootstrap/Card';
import './App.css';

export function SortableItem(props){
    // props.id
    // 1989

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className='m-3 card_class'>
                <div className='card_content'>
                <div className='display_content'>{props.display}</div>
                <a className='youtube_link' href={props.youtube_link} target="_blank" rel="noopener noreferrer">
                    <img className='youtube_logo' src="youtubelogo.png" alt="YouTube Logo" />
                </a>
                </div>
            </Card>
        </div>
    )
}