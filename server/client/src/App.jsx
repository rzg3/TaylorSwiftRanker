import React, { Suspense  } from 'react';
import { observer } from 'mobx-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate, useNavigate, useLocation  } from 'react-router-dom';
import UserStore from './stores/UserStore';
import './App.css'
import Dashboard from './Dashboard/Dashboard';
import Ranker from './Ranker/Ranker';
import Register from './Register';
import { Container, Row, Col } from 'react-bootstrap';
import Rankings from './Rankings';
import UserProfile from './UserProfile';
import LandingPage from './LandingPage';
import About from './About/About';

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
          <div className="container centered">
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
                    <LandingPage />
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment ? 
                    
                      <Dashboard username={UserStore.username}/>
                   : 
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
                <Route 
                  path="/globalrankings" 
                  element={
                    <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh', width: '100%', maxWidth: '10000px' }}>
                      <Rankings display='Global' route='/getGlobalRankings'/> 
                    </Container>
                  } 
                />
                <Route 
                  path="/albums" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
   
                      <Ranker 
                        getRoute="/getRankings" 
                        postRoute="saveRankings"
                        isAlbum={true}
                        rankDisplay='Albums'
                      />  
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />

                <Route 
                  path="/songs" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 

                      <Ranker 
                        getRoute="/getSongRankings" 
                        postRoute="saveSongRankings"
                        isAlbum={false}
                        rankDisplay='Songs'
                        isSongRanking={true}
                      />  
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />
                
                <Route 
                  path="/taylorswift" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=1" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='Taylor Swift Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />

                <Route 
                  path="/fearless" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=2" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='Fearless Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />

                <Route 
                  path="/speaknow" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=3" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='Speak Now Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />

                <Route 
                  path="/red" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=4" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='Red Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />

                <Route 
                  path="/1989" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=5" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='1989 Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />
                <Route 
                  path="/reputation" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=6" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='Reputation Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />
                <Route 
                  path="/lover" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=7" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='Lover Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />
                <Route 
                  path="/folklore" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=8" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='folklore Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />
                <Route 
                  path="/evermore" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=9" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='evermore Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />
                <Route 
                  path="/midnights" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=10" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='Midnights Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />
                <Route 
                  path="/thetorturedpoetsdepartment" 
                  element={
                    UserStore.isLoggedIn || UserStore.isDevelopment 
                    ? 
                      <Ranker 
                        getRoute="/getAlbumSongRankings?album_id=11" 
                        postRoute="saveAlbumSongRankings"
                        isAlbum={false}
                        rankDisplay='THE TORTURED POETS DEPARTMENT Album'
                      /> 
                    : 
                      <Navigate to="/" replace={true} />
                  } 
                />

                <Route 
                  path="/user/:username" 
                  element={
                    UserStore.isLoggedIn ? <UserProfile currUser={UserStore.username}/> : <Navigate to="/" replace={true} />
                  }/>

                <Route 
                  path="/about" 
                  element={<About />}/>
              </Routes>
            </Router>
          </div>
        );
        
    }


  }

}

export default observer(App);
