import React, { Component } from "react";
import logo from "./../logo.svg";
import "./../App.css";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import { Link } from "react-router-dom";
import config from "./../config"

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auctions: []
    };
  }

  get_auction = () => {
    var url = config.url + "ProductListing/"
    fetch(url)
      .then(results => {
        if (results.status != 200) {
          alert("Something Went Wrong");
          throw "Something Went Wrong";
        }
        return results.json();
      })
      .then(result => {
        var tmp = [];
        for (var i = 0; i < result.length; i++) {
          if (result[i].state === "APPROVED") {
            tmp.push(result[i]);
          }
        }
        this.setState({ auctions: tmp });
        console.log(this.state.auctions);
      });
  };

  componentDidMount() {
    this.get_auction();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Auction Web</h1>
        </header>

        <h3> Ongoing Auctions</h3>
        {this.state.auctions.map(auction => {
          return (
            <div style={styles.root}>
              <Card>
                <CardTitle title={auction.listingId} />
                <CardText>
                  Seller: <b>{auction.seller.substr(41)} </b><br />
                  Item: <b> {auction.product.substr(42)}</b><br />
                  Auction Type: <b>{auction.auctionType}</b><br />
                  Reserve Price: <b> {auction.reservePrice}</b><br /><br />
                  <Link to={"/listing/" + auction.listingId}>
                    <RaisedButton
                      label="Goto Auction"
                      primary={true}
                      fullWidth={true}
                    />
                  </Link>
                </CardText>
              </Card>

            </div>
          );
        })}
      </div>
    );
  }
}

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around"
  },
  gridList: {
    display: "flex",
    flexWrap: "nowrap",
    overflowX: "auto"
  },
  titleStyle: {
    color: "rgb(0, 188, 212)"
  }
};

export default Home;
