import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Root from "./components/Root";
import Auctioneer from "./components/Auctioneer";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import User from "./components/User";
import Listing from "./components/Listing";
import UserDetails from "./components/UserDetails";
import ListingDetails from "./components/ListingDetails";

const About = () => (
  <div>
    <h2>About</h2>
  </div>
);

const App = () => (
  <MuiThemeProvider>
    <Router>
      <div>
        <Root />
        <Route exact path="/" component={Home} />
        <Route exact path="/auctioneer" component={Auctioneer} />
        <Route exact path="/users" component={User} />
        <Route path="/listing/:id" component={Listing} />
        <Route path="/listingDetails/:id" component = {ListingDetails}/>
        <Route path="/users/:id" component = {UserDetails}/>
      </div>
    </Router>
  </MuiThemeProvider>
);
export default App;
