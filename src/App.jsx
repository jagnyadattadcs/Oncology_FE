import { useState } from 'react'
import './App.css'
import Navbar from './shared/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './components/Home'
import Footer from './shared/Footer'


function App() {

  return (
    <>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App
