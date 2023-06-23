import React from 'react';
import SubmitButton from './SubmitButton';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import UserStore from './stores/UserStore';

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
      <div className="app">
        <div className="container">
          Welcome {username}

          <SubmitButton text="Log out" disabled={false} onClick={this.handleLogout} />
        </div>
      </div>
    );
  }
}

export default observer(Dashboard);
