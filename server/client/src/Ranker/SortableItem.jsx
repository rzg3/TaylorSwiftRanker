import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../App.css';
import TextResizeComponent from './TextResizeComponent';

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
        <div className='rectangle' ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div className="left-content">
            <img className="album_art" src={`album_art/${props.cover_art}.png`} alt="Album Art" />
            </div>
           
            <div className="right-content">
                <TextResizeComponent text={`${props.rank}. ${props.display}`} maxSize={30}/>
                <div className="youtube_link">
                    <a href={props.youtube_link} target="_blank" rel="noopener noreferrer">
                        <img className="youtube_logo" src="youtubelogo.png" alt="YouTube Logo" />
                    </a>
                </div>
            </div>
        </div>
    )
}