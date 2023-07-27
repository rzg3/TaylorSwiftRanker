import React, { useState } from 'react';
import SubmitButton from '../SubmitButton';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import UserStore from '../stores/UserStore';
import UserSearch from '../Search Bar/UserSearch';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'
import Following from './Following';
import DashboardPopUp from './DashboardPopUp';
import Favorites from './Favorites';
import AboutButton from './AboutButton';

class Dashboard extends React.Component {

  state = {
    openPopUp: false
  }

  togglePopUp = () => {
    this.setState({
      openPopUp: !this.state.openPopUp
    })
  }

  

  handleLogout = async () => {
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
        // Redirect to the root login page
        window.location.href = '/';
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { username } = this.props;

    return (
        <div className='dashContainer app d-flex just-content-around' > 
        <DashboardPopUp open={this.state.openPopUp} togglePopUp = {this.togglePopUp}/>
        <div className='centered leftContain' style={{ width: '50%'}}>
          <Favorites currUser={UserStore.username}/>
        </div>
        <div className="centered align-self-center searchContain">      
          <h3>Welcome {username}</h3>
          <div className='search-bar'>
            <UserSearch />
          </div>
          <SubmitButton text="Rank Now" disabled={false} onClick={this.togglePopUp}/>
          <SubmitButton text="Global Rankings" disabled={false} onClick={event => window.location.href='/globalrankings'}/>
          <SubmitButton text="Log out" disabled={false} onClick={this.handleLogout} />
        </div>
        <div className='centered rightContain' style={{ width: '50%'}}>
          <Following username={UserStore.username}/>
        </div>
        
        <footer>
        <AboutButton />
          <p className='legal' >All copyrighted content (i.e. album artwork) on Taylor Swift Ranker are owned by their respective owners (Taylor Swift / Record Labels).</p>
        </footer>
        </div>
        
    );
  }
}

export default observer(Dashboard);
