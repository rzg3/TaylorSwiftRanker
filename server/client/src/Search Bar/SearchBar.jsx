import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import './SearchBar.css'

export const SearchBar = ({ setResults }) => {
    const [input, setInput] = useState('');

    const fetchData = (value) => {
        fetch(`/getUsers?username=${encodeURIComponent(value)}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(json => {
                const results = json;
                setResults(results.map(user => user.username));
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleChange = (value) => {
        setInput(value)
        fetchData(value)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          console.log('Enter key pressed! Do something...');
        }
      };

    return (
        <div className='input-wrapper'>
            <FaSearch id='search-icon'/>
            <input placeholder='Search users...' value={input} onChange={(e) => handleChange(e.target.value)} onKeyDown={handleKeyDown}/>
        </div>
    )
}