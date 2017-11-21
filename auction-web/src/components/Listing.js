import React, { Component } from "react";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Divider from "material-ui/Divider";
import { Link } from "react-router-dom";

class Listing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: {},
      error: false,
      user_id: "",
      bid_price: "0",
      loading: false
    };
  }

  get_listing_details = () => {
    var list_id = this.props.match.params.id;
    fetch("http://localhost:3000/api/ProductListing/" + list_id)
      .then(results => {
        if (results.status != 200) {
          alert("Something Went Wrong");
          this.setState({ error: true });
          throw "Err";
        }
        return results.json();
      })
      .then(result => {
        console.log(result);
        this.setState({ listing: result, loading: true });
        if (result.state != "APPROVED") {
          this.setState({ error: true });
          alert("The Auction is either over or not yet approved");
        }
      });
  };

  submit_bid = () => {
    fetch("http://localhost:3000/api/Offer", {
      body: '{"bidPrice": "' +
        this.state.bid_price +
        '","listing": "' +
        this.state.listing.listingId +
        '","member": "' +
        this.state.user_id +
        '"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    })
      .then(results => {
        if (results.status != 200) {
          alert("Something went wrong");
          this.setState({ bid_price: "0", user_id: "" });
          throw "Err";
        }
        return results.json();
      })
      .then(result => {
        alert("Bid Submited");
        this.setState({ bid_price: "0", user_id: "" });
      });
  };

  componentDidMount() {
    this.get_listing_details();
  }
  render() {
    console.log("---", this.state.listing);
    if (this.state.loading == false) {
      return <div>Hello</div>;
    }
    return (
      <div>
        {!this.state.error
          ? <div style={styles.root}>
              <Card>

                <CardTitle
                  title={this.state.listing.listingId}
                  subtitle={this.state.listing.auctionType}
                />
                <CardText>
                  Description: <b>{this.state.listing.description}</b> <br />
                  Reserve Price: <b>{this.state.listing.reservePrice}</b><br />
                  Asset: <b>{this.state.listing.product}</b><br />
                  Seller: <b>{this.state.listing.seller}</b><br />
                  State: <b>{this.state.listing.state}</b> <br />
                  <br /><Divider /><br />

                  {"offers" in this.state.listing &&
                    this.state.listing.auctionType === "First_Price" &&
                    <div>
                      <h3> Bids Placed </h3>
                      {this.state.listing.offers.map(bid => {
                        return (
                          <div>
                            Bidder: <b>{bid.member.substr(41)}</b><br />
                            Bid: <b>{bid.bidPrice}</b><br />
                            TimeStamp: <b> {bid.timestamp}</b> <br />
                            <br/>
                          </div>
                        
                        );
                      })}
                      <br />

                      <RaisedButton
                        onClick = {this.get_listing_details()}
                        label="Refresh"
                        fullWidth={true}
                        primary={true}
                      />

                    </div>}

                </CardText>
              </Card>
              <Card>
                <CardTitle title="Place Your Bids" />
                <CardText>
                  <TextField
                    hintText="User ID"
                    onChange={(event, new_val) => {
                      this.setState({ user_id: new_val });
                    }}
                  />
                  <TextField
                    hintText="Bid"
                    onChange={(event, new_val) => {
                      this.setState({ bid_price: new_val });
                    }}
                  /> <br />
                  <RaisedButton primary={true} onClick={this.submit_bid}>
                    {" "}Submit{" "}
                  </RaisedButton>
                </CardText>
              </Card>
            </div>
          : <p> Auction is not available </p>}
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
    overflowX: "auto"
  },
  titleStyle: {
    color: "rgb(0, 188, 212)"
  }
};

export default Listing;
