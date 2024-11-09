import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import {Login} from './components/Login';

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/login' element={<Login />}  />
                </Routes>
            </BrowserRouter>
        </div >
    );
}

export default App;
