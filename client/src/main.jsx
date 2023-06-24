import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App.jsx'
import Dashboard from "./Dashboard";
import './index.css'
import ProtectedRoute from './ProtectedRoute';
import Register from './Register';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={
            <div className="app">
              <div className="container">
                <Register />
              </div>
            </div>
          }/>
        </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
