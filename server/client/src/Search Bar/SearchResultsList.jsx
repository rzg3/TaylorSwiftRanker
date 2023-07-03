import React from 'react';
import './SearchResultsList.css'
import { SearchResult } from './SearchResult';
import { useNavigate} from 'react-router-dom';

export const SearchResultsLists = ({ results }) => {

    const navigate = useNavigate();

    return (
        <div className='results-list'> 
            {
                results.map((result, index) => {
                    return <SearchResult result={result} key={index} onClick={(e) => navigate(`/user/${result}`)} />
                })
            }
        </div>
    )
}