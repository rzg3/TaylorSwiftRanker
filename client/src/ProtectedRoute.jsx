import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import UserStore from './stores/UserStore';

const ProtectedRoute = ({ children }) => {
  if (!UserStore.isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return children;
};
export default observer(ProtectedRoute);