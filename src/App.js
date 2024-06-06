import './App.css';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import RandomizePage from "./views/RandomizePage"
import LoginPage from './views/LoginPage';
import SignUpPage from "./views/SignUpPage";
import AddEntry from './views/AddEntry';
import PageDetails from './views/PageDetails';
import PageFavs from "./views/PageFavs"
import PageUpdate from "./views/PageUpdate"
import PageAllRest from "./views/PageAllRest"

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RandomizePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/add" element={<AddEntry />} />
        <Route path="/posts/:id" element={<PageDetails />} />
        <Route path="/favs" element={<PageFavs />} />
        <Route path="/update/:id" element={<PageUpdate />} />
        <Route path="/allrest" element={<PageAllRest />} />
        
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
