import './App.css';

import 'antd/dist/reset.css';
import HomePage from "./components/HomePage.js";
import NewLand from "./components/NewLand.js";
import Auction from "./components/Auction.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Web3 from 'web3';

function App() {

  const ethereum = window.ethereum;

  const myContractJSON = require("./build/LandSale.json");
  const myContractAddress = myContractJSON.networks["5"].address;
  const myContractAbi = myContractJSON.abi;

  const web3 = new Web3(ethereum);
  const myContract = new web3.eth.Contract(myContractAbi,myContractAddress);

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            <HomePage myContract={myContract} />
          </Route>
          <Route path="/register">
            <NewLand myContract={myContract} web3={web3} />
          </Route>
          <Route path="/land/:landId">
            <Auction myContract={myContract} web3={web3} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;