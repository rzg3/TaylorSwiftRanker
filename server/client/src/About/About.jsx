import React from 'react'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'
import SubmitButton from '../SubmitButton';

function About() {
    const navigate = useNavigate()
  return (
    <div style={{height: '100%'}} className='d-flex flex-column align-items-center justify-content-center p-3'>
        <h2>About</h2>
        <div style={{maxWidth: '50%', textAlign: 'center'}}>Hi! This is a personal project made by a Rice University CS Student. 
        Please email <a>rzg3@rice.edu</a> for any questions/concerns/suggestions or if you have any advice about SWE. Thanks for visiting, check out the GitHub below</div>
        <a target="_blank" rel="noopener" href="https://github.com/rzg3/TaylorSwiftRanker">
            <img className='m-3' style={{height: '50px', width: '50px'}}  src={'github.png'} ></img>
        </a>
        <button className='btn btn-outline-primary submitButton smallBtn' onClick={(e) => navigate('/')}>Return</button> 
        <footer>
          <p className='legal' >All copyrighted content (i.e. album artwork) on Taylor Swift Ranker are owned by their respective owners (Taylor Swift / Record Labels).</p>
        </footer>
        
    </div>
    
  )
}

export default About