import React from 'react'
import LoginForm from './LoginForm'
import SubmitButton from './SubmitButton'
import { Container } from 'react-bootstrap';
import './App.css'
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './fonts/fonts.css';

function LandingPage() {
    const navigate = useNavigate()
      
  return (
    <div className="d-flex flex-column align-items-center justify-content-center app " style={{position: 'relative'}}>
        <h1 className='title' style={{
            fontSize: 'calc(3vw + 5vh)', 
            fontFamily: "'Lemon/Milk', 'Arial'",
            textAlign: 'center'
        }}>Taylor Swift Ranker</h1>
        <div className="d-flex align-items-center justify-content-center">
            <div className="d-flex flex-column align-items-center justify-content-center">
                <LoginForm />
                <SubmitButton text="Register New Account" disabled={false} onClick={event => navigate('/register')} />
            </div>

        </div>
          <p className='legal' style={{position: 'absolute', bottom: 0}}>All copyrighted content (i.e. album artwork) on Taylor Swift Ranker are owned by their respective owners (Taylor Swift / Record Labels).</p>
    </div>
)
}

export default LandingPage