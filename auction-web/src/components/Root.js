import React, { Component } from "react";
import { AppBar, Drawer, MenuItem } from "material-ui";
import { Link } from "react-router-dom";

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }
  handleToggle = () => {
    this.setState({ open: !this.state.open });
  };
  render() {
    return (
      <div>
        <AppBar
          title="Auction-Web"
          onLeftIconButtonTouchTap={this.handleToggle}
        />
        <Drawer open={this.state.open} openSecondary={true}>
          <Link to="/"><MenuItem> Home </MenuItem></Link>
          <Link to="/auctioneer"><MenuItem> Auctioneer </MenuItem></Link>
          <Link to="/users"> <MenuItem> Users </MenuItem> </Link>
        </Drawer>
        {this.props.children}
      </div>
    );
  }
}

export default Root;
