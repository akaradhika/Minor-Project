import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Index from './pages/Index' 
import Colorpallete from './pages/Colorpallete'
import Artworkanalysis from './pages/Artworkanalysis'
import Creativecollaboration from './pages/Creativecollaboration';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import FileUpload from './pages/FileUpload';
import Community from './pages/Community';
import GenerateAudio from './pages/GenerateAudio';
import UserProfile from './pages/UserProfile';
import ArtistProfile from './pages/ArtistProfile';
import MyCollabs from './pages/Mycollabs';

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/home" element={<Index />} />
          <Route path="/Signup" element={<SignupPage />} />
          <Route path="/Login" element={<LoginPage onLogin={() => localStorage.clear()}/>} />
          <Route path="/color-palette" element={<Colorpallete />} />
          <Route path="/artwork-analysis" element={<Artworkanalysis />} />
          <Route path='/creative-collaboration' element={<Creativecollaboration/>}/>
          <Route path='/file-upload' element={<FileUpload/>}/>
          <Route path='/my-collabs' element={<MyCollabs/>}/>
          <Route path='/community' element={<Community/>}/>
          <Route path='/analyze-audio' element={<GenerateAudio/>}/>
          <Route path='/userprofile' element={<UserProfile/>}/>
          <Route path='/artist/:id' element={<ArtistProfile/>}/>


        </Routes>
      </Router>
    </div>
  );
};

export default App;