import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NotFound from "./components/NotFound";
import Auction from "./components/Auction";
import User from "./components/User";
import AuctionsDataGrid from "./components/AuctionsDataGrid";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import CreateAuction from "./components/CreateAuction";

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/auctions" element={<AuctionsDataGrid/>}/>
                        <Route path="/auctions/:id" element={<Auction/>}/>
                        <Route path="/auctions/create" element={<CreateAuction/>}/>
                        <Route path="/signup/" element={<SignUp/>}/>
                        <Route path="/signin/" element={<SignIn/>}/>
                        <Route path="/user/" element={<User/>}/>
                        <Route path="/" element={<AuctionsDataGrid/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
