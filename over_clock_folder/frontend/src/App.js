import './App.css';
import React from 'react';
import {Routes, Route} from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Leaderboard from './pages/Leaderboard';
import Teams from './pages/Teams';
import AdjustPunch from './pages/AdjustPunch';
import AttendanceHistory from './pages/AttendanceHistory';
import UserSettings from './pages/UserSettings';


function App() {
  return (
    
    <>
      <NavBar/>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home/>}/>
      <Route path="/Leaderboard" element={<Leaderboard/>}/>
      <Route path="/Teams" element={<Teams/>}/>
      <Route path="/AdjustPunch" element={<AdjustPunch/>}/>
      <Route path="/AttendanceHistory" element={<AttendanceHistory/>}/>
      <Route path="/UserSettings" element={<UserSettings/>}/>
    </Routes>
    </>
  );
}

export default App;
