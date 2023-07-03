import { useState } from 'react';
import './UserSearch.css';
import { SearchBar } from './SearchBar';
import { SearchResultsLists } from './SearchResultsList';

function UserSearch() {

    const [results, setResults] = useState([]);
    
    const the_toat = [];

    return (
        <div className='search-bar-container'> 
            <SearchBar setResults={setResults} />
            <SearchResultsLists results={results} />
        </div>

    )
}

export default UserSearch