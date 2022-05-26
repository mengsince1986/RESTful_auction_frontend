import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NotFound from "./components/NotFound";
import Auction from "./components/Auction";
import User from "./components/User";
import AuctionsDataGrid from "./components/AuctionsDataGrid";

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/auctions" element={<AuctionsDataGrid/>}/>
                        <Route path="/auctions/:id" element={<Auction/>}/>
                        <Route path="/User/" element={<User/>}/>
                        <Route path="/" element={<AuctionsDataGrid/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
