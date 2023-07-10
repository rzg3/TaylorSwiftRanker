import React from 'react'
import SubmitButton from './SubmitButton'
import './App.css'
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
    const navigate = useNavigate()
  return (
    <div >  
        <SubmitButton
            text="Back to Login" 
            disabled={false} 
            onClick={event => navigate('/')}/>

        <footer>
            <p className='legal'>All copyrighted content (i.e. album artwork) on Taylor Swift Ranker are owned by their respective owners (Taylor Swift / Record Labels).</p>
        </footer>
    
    </div>

  )
}

export default RegisterPage