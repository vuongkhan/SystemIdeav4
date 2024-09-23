import { Flowbite } from "flowbite-react";
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import theme from "./flowbite-theme.js";
import CreateIdea from "./pages/CreateIdea.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from './pages/Home.jsx';
import Privacy from "./pages/Privacy.jsx";
import Profile from "./pages/Profile.jsx";
import Tag from "./pages/Tag.jsx";
import ViewIdea from "./pages/ViewIdea.jsx";
import Login from "./pages/Login.jsx";
import EditIdea from "./pages/EditIdea.jsx";
import IdeasOfTag from "./pages/IdeasOfTag.jsx";

export default function App() {
  return (
    <Flowbite theme={{ theme }}>
      <BrowserRouter>
        <Routes>
       
            <Route path="/home" element={<Home />}/>
            <Route path="/tag" element={<Tag />}/>
            <Route path="/viewIdea/:id" element={<ViewIdea/>} />
            <Route path="/createIdea/:id" element={<CreateIdea />}/>
            <Route path="/editIdea/:id" element={<EditIdea />}/>
            <Route path="/ideasOfTag/:tagId" element={<IdeasOfTag />}/>
            
            <Route path="/profile/:id" element={<Profile />}/>
            <Route path="/" element={<Login />}/>

            <Route path="/privacy" element={<Privacy />}/>
            <Route path="/dashboard/:id" element={<Dashboard />}/>
         
        </Routes>
      </BrowserRouter>
    </Flowbite>
  );
}
