import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Auction from "./components/Auction";
import Profile from "./components/Profile";
import AuctionsDataGrid from "./components/AuctionsDataGrid";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import CreateAuction from "./components/CreateAuction";
import MyAuctions from "./components/MyAuctions";
import EditAuction from "./components/EditAuction";
import BidAuction from "./components/BidAuction";
import MessagePage from "./components/MessagePage";
import EditUser from "./components/EditUser";

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/auctions" element={<AuctionsDataGrid/>}/>
                        <Route path="/auctions/:id" element={<Auction/>}/>
                        <Route path="/auctions/create" element={<CreateAuction/>}/>
                        <Route path="/auctions/:id/edit" element={<EditAuction/>}/>
                        <Route path="/auctions/:id/bid" element={<BidAuction/>}/>
                        <Route path="/auctions/my" element={<MyAuctions/>}/>
                        <Route path="/signup/" element={<SignUp/>}/>
                        <Route path="/signin/" element={<SignIn/>}/>
                        <Route path="/profile/" element={<Profile/>}/>
                        <Route path="/profile/edit" element={<EditUser/>}/>
                        <Route path="/message/" element={<MessagePage/>}/>
                        <Route path="/" element={<AuctionsDataGrid/>}/>
                        <Route path="*" element={<AuctionsDataGrid/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}

export default App;
