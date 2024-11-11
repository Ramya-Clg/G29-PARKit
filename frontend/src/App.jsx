import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import {Login} from './components/Login';
import { Home } from './components/Home';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />}  />
                    <Route path='/login' element={<Login />}  />
                    {/* <Route path='/' element={<Home />}  /> */}
                </Routes>
            </BrowserRouter>
        </div >
    );
}

export default App;
