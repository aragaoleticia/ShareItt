import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import  Login  from './components/Login';
import { Home } from './container/Home';
import { fetchUser } from './utils/fetchUser';

const App = () => {
  const navitage = useNavigate();

  useEffect(() => {
    const user = fetchUser();

    if(!user) navitage('/login');
  }, []);
  
  return (
    <Routes>
      <Route path='login' element={<Login/>}/>
      <Route path='/*' element={<Home/>}/>
    </Routes>
  )
}

export default App;