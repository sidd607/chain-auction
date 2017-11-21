import React, { Component } from "react";
import { BusinessNetworkConnection } from "composer-client";
import { GridList, GridTile } from "material-ui/GridList";
import Divider from "material-ui/Divider";
import Snackbar from "material-ui/Snackbar";
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import IconButton from "material-ui/IconButton";
import StarBorder from "material-ui/svg-icons/toggle/star-border";
import Paper from "material-ui/Paper";

class Auctioneer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      auction_listing: [],
      auction_count: 0,
      approved: [],
      finished: [],
      open: false,
      message: "Request Completed"
    };
  }

  end_auction = auction => {
    fetch("http://localhost:3000/api/CloseAuction", {
      body: '{"listing":"' + auction.listingId + '"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    })
      .then(results => {
        if (results.status == 200) {
          return results.json();
        } else {
          alert("Some Error Occured");
          throw "Err";
        }
      })
      .then(result => {
        this.setState({ open: true });
      });
  };

  approve_auction = auction => {
    console.log("Hello World");
    let post_data = {
      listing: "list1"
    };

    fetch("http://localhost:3000/api/ApproveListing", {
      body: '{"listing":"' + auction.listingId + '"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    })
      .then(results => {
        if (results.status == 200) {
          return results.json();
        } else {
          alert("Some Error Occured");
          throw "Err";
        }
      })
      .then(result => {
        this.setState({ open: true });
      });
  };

  handleRequestClose = () => {
    this.setState({ open: false });
  };

  get_auction_listings = () => {
    fetch("http://localhost:3000/api/ProductListing/")
      .then(results => {
        return results.json();
      })
      .then(data => {
        console.log(data);
        var tmp = [];
        var tmp2 = [];
        var tmp3 = [];
        for (var i = 0; i < data.length; i++) {
          if (data[i].state == "PENDING") {
            tmp.push(data[i]);
          } else if (data[i].state == "APPROVED") {
            tmp2.push(data[i]);
          } else {
            tmp3.push(data[i]);
          }
        }
        console.log(tmp);
        this.setState({
          auction_count: tmp.length,
          auction_listing: tmp,
          approved: tmp2,
          finished: tmp3
        });
      });
  };
  componentDidMount() {
    this.get_auction_listings();
  }
  render() {
    return (
      <div>
        <header style={{ textAlign: "center" }}>
          <h2> Pending Requests </h2>
        </header>
        <div style={styles.root}>

          {this.state.auction_listing.map(auction => {
            return (
              <Card>
                <Link to={"/listingDetails/" + auction.listingId}>
                  <CardTitle
                    title={auction.listingId}
                    subtitle={auction.auctionType}
                  />
                </Link>
                <CardText>
                  <p> Auction: {auction.auctionType} </p>
                  <p> Reserve Price: {auction.reservePrice} </p>
                  <p> Asset: {auction.product}</p>
                  <p> Description: {auction.description} </p>
                  <p> Status: {auction.state} </p>
                </CardText>
                <CardActions>
                  <RaisedButton
                    label="Approve"
                    primary={true}
                    onClick={() => {
                      this.approve_auction(auction);
                    }}
                  />
                </CardActions>
              </Card>
            );
          })}

        </div>
        <header style={{ textAlign: "center" }}>
          <h2> Approved Requests </h2>
        </header>
        <div style={styles.root}>

          {this.state.approved.map(auction => {
            return (
              <Card>
                <Link to={"/listingDetails/" + auction.listingId}>
                  <CardTitle
                    title={auction.listingId}
                    subtitle={auction.auctionType}
                  />
                </Link>
                <CardText>
                  <p> Auction: {auction.auctionType} </p>
                  <p> Reserve Price: {auction.reservePrice} </p>
                  <p> Asset: {auction.product}</p>
                  <p> Description: {auction.description} </p>
                  <p> Status: {auction.state} </p>
                </CardText>
                <CardActions>
                  <RaisedButton
                    label="End Auction"
                    primary={true}
                    onClick={() => {
                      this.end_auction(auction);
                    }}
                  />
                </CardActions>
              </Card>
            );
          })}
        </div>
        <header style={{ textAlign: "center" }}>
          <h2> Successful Auctions </h2>
        </header>
        <div style={styles.root}>

          {this.state.finished.map(auction => {
            return (
              <Card>
                <Link to={"/listingDetails/" + auction.listingId}>
                  <CardTitle
                    title={auction.listingId}
                    subtitle={auction.auctionType}
                  />
                </Link>
                <CardText>
                  <p> Auction: {auction.auctionType} </p>
                  <p> Reserve Price: {auction.reservePrice} </p>
                  <p> Asset: {auction.product}</p>
                  <p> Description: {auction.description} </p>
                  <p> Status: {auction.state} </p>
                </CardText>
              </Card>
            );
          })}
        </div>
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
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

export default Auctioneer;
