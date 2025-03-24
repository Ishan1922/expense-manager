import './App.css'
import { Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Start from './components/Start'
import Home from './components/Home'

function App() {

  return (
    <Routes>
      <Route path='/' element={<Start/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/home/:id' element={<Home/>}/>
    </Routes>
  )
}

export default App
