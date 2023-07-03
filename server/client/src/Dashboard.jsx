import React from 'react';
import SubmitButton from './SubmitButton';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import UserStore from './stores/UserStore';
import UserSearch from './SearchBar/UserSearch';
import './App.css'

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

        <div className="centered">
          <h3>Welcome {username}</h3>
          <div className='search-bar'>
            <UserSearch />
          </div>
          <SubmitButton text="Album Ranker" disabled={false} onClick={event => window.location.href='/albums'}/>
          <SubmitButton text="Global Rankings" disabled={false} onClick={event => window.location.href='/globalrankings'}/>
          <SubmitButton text="Log out" disabled={false} onClick={this.handleLogout} />
        </div>
    );
  }
}

export default observer(Dashboard);
