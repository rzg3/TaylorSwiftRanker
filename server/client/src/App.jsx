import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate, useNavigate, useLocation  } from 'react-router-dom';
import UserStore from './stores/UserStore';
import LoginForm from './LoginForm';
import SubmitButton from './SubmitButton';
import './App.css'
import Dashboard from './Dashboard';
import Ranker from './Ranker/Ranker';
import Register from './Register';
import { Container, Row, Col } from 'react-bootstrap';

import ProtectedRoute from './ProtectedRoute';

class App extends React.Component{

  async componentDidMount() {
    try {
      let res = await fetch('/isLoggedIn', {
        method: 'post',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.loading = false;
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
      } else {
        UserStore.loading = false;
        UserStore.isLoggedIn = false;
      }
    } catch (e) {
      UserStore.loading = false;
      UserStore.isLoggedIn = false;
    }
  };
  
  async doLogout() {

    try {

      let res = await fetch('/logout', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      let result = await res.json();

      if (result && result.success) {
        UserStore.isLoggedIn = false;
        UserStore.username = '';
      }

    }
      

    catch(e) {
      console.log(e)
    }

  }

  render() {

    if (UserStore.loading){
      return (
        <div className="app">
          <div className="container">
            Loading, please wait...
          </div>
        </div>
      );
    }

    else {

        return (
          <div className="app">
            <Router>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    UserStore.isLoggedIn ? <Navigate to="/dashboard" replace={true} /> : 
                    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', width: '100%', maxWidth: '10000px' }}>
                      <LoginForm />
                      <SubmitButton text="Register New Account" disabled={false} onClick={event => window.location.href='/register'} />
                    </Container>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment ? 
                    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh;"}}>
                      <Dashboard />
                    </Container> : 
                    <Navigate to="/" replace={true} />

                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    UserStore.isLoggedIn ? <Navigate to="/dashboard" replace={true} /> :
                    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', width: '100%', maxWidth: '10000px' }}>
                      <Register /> 
                    </Container>
                  } 
                />
                <Route path="/albums" element={UserStore.isLoggedIn || UserStore.isDevelopment ? <Ranker getRoute="/getRankings" postRoute="saveRankings"/>  : <Navigate to="/" replace={true} />} />
              </Routes>
            </Router>
          </div>
        );
        
      
      return (
        <div className="app">
          <div className="container">
           <LoginForm />
           <SubmitButton text="Register New Account" disabled={false} onClick={event => window.location.href='/register'}/>
          </div>
      </div>
      );
    }


  }

}

export default observer(App);
