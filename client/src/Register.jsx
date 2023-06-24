import React, { useState } from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';
import { observer } from 'mobx-react';
import './App.css';
import { Navigate } from 'react-router-dom';

class Register extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      buttonDisabled: false
    }
  }

  setInputValue(property, val) {
    val = val.trim();
    if (val.length > 15) {
      return;
    }
    this.setState({
      [property]: val
    })
  }

  resetForm() {
    this.setState({
      username: '',
      password: '',
      buttonDisabled: false
    })
  }
  
  async doLogin() {

    if (!this.state.username) {
      return;
    }
    if (!this.state.password) {
      return;
    }

    this.setState({
      buttonDisabled: true
    })

    try {
      
      let res = await fetch('/register', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password
        })
      });

      let result = await res.json();
      if (result && result.success) {
        UserStore.isLoggedIn = true;
        UserStore.username = result.username;
      }

      else if (result && result.success === false){
        this.resetForm();
        alert(result.msg)
      }

    }

    catch(e) {
      console.log(e);
      this.resetForm();
    }

  }

  render() {
    if (UserStore.isLoggedIn) {
        return <Navigate to="/dashboard" />;
    }
    return (
        <div className="registerForm">
            
            Register
            <InputField
            type='text'
            placeholder='Username'
            value={this.state.username ? this.state.username : ''}
            onChange={ (val) => this.setInputValue ('username', val) }

            />

            <InputField
            type='password'
            placeholder='Password'
            value={this.state.password ? this.state.password : ''}
            onChange={ (val) => this.setInputValue ('password', val) }

            />  

            <SubmitButton
            text='Register'
            disabled={this.state.buttonDisabled}
            onClick={ () => this.doLogin() }
            />
        </div>
        );
  }

}

export default observer(Register)
