import React from 'react';
import SubmitButton from './SubmitButton';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import UserStore from './stores/UserStore';
import UserSearch from './Search Bar/UserSearch';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Following from './Following';

class Dashboard extends React.Component {


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
        <div className='app d-flex just-content-around'> 
        <div className='centered' style={{marginLeft: '3vw', width: '50%'}}>Favorites</div>
        <div className="centered align-self-center">      
          <h3>Welcome {username}</h3>
          <div className='search-bar'>
            <UserSearch />
          </div>
          <SubmitButton text="Album Ranker" disabled={false} onClick={event => window.location.href='/albums'}/>
          <SubmitButton text="Global Rankings" disabled={false} onClick={event => window.location.href='/globalrankings'}/>
          <SubmitButton text="Log out" disabled={false} onClick={this.handleLogout} />
        </div>
        <div className='centered' style={{marginRight: '3vw', width: '50%'}}>
          <Following username={UserStore.username}/>
        </div>
        </div>
    );
  }
}

export default observer(Dashboard);
