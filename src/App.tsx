import React from 'react';
import './App.css';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import NotFound from "./components/NotFound";
import AuctionList from "./components/AuctionList";
import Auction from "./components/Auction";
import User from "./components/User";
import AuctionsTable from "./components/AuctionsTable";
import AuctionsDataGrid from "./components/AuctionsDataGrid";

function App() {
    return (
        <div className="App">
            <Router>
                <div>
                    <Routes>
                        <Route path="/auctions" element={<AuctionsTable/>}/>
                        <Route path="/auctions/:id" element={<Auction/>}/>
                        <Route path="/User/" element={<User/>}/>
                        <Route path="*" element={<NotFound/>}/>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}




/*function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}*/

export default App;
