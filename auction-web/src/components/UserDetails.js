import React, { Component } from "react";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import RaisedButton from "material-ui/RaisedButton";
import Divider from "material-ui/Divider";
import { Link } from "react-router-dom";

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: this.props.match.params.id,
      user_details: {},
      user_bids: []
    };
  }

  get_user_details = () => {
    var user_id = this.props.match.params.id;
    fetch("http://localhost:3000/api/Member/" + user_id)
      .then(results => {
        if (results.status != 200) {
          alert("Something Went Wrong");
          this.setState({ error: true });
          throw "Err";
        }
        return results.json();
      })
      .then(result => {
        this.setState({ user_details: result });
        console.log(this.state.user_details);
      });
  };

  get_user_bids = () => {
    var resource_str =
      "resource:org.acme.product.auction.Member#" + this.state.user_id;
    fetch("http://localhost:3000/api/ProductListing")
      .then(results => {
        if (results.status != 200) {
          alert("Something Went Wrong!!");
          throw "Something Went Wrong";
        }
        return results.json();
      })
      .then(result => {
        var res = [];
        console.log(result);
        for (var i = 0; i < result.length; i++) {
          console.log(result[i]);

          if("offers" in result[i])
            var offers = result[i].offers;
          else{
            var offers = []
          }
          var tmp = {
            auction: result[i].listingId,
            state: result[i].state,
            asset: result[i].product.substr(42),
            seller: result[i].seller.substr(41),
            desc: result[i].description,
            type: result[i].auctionType,
            offer: []
          };
          if (result[i].state === "SOLD") {
            tmp["winner"] = result[i].winner.substr(41);
            tmp["win_bid"] = result[i].winPrice;
          }
          var cnt = 0;
          
          for (var j = 0; j < offers.length; j++) {
            if (offers[j].member === resource_str) {
              tmp["offer"].push({
                bid_amount: offers[j].bidPrice,
                timestamp: offers[j].timestamp
              });
              cnt += 1;
            }
          }
          if (cnt > 0) {
            res.push(tmp);
          }
        }
        this.setState({ user_bids: res });
        console.log(this.state.user_bids);
      });
  };

  componentDidMount() {
    this.get_user_details();
    this.get_user_bids();
  }

  render() {
    return (
      <Card>
        <CardTitle title={this.state.user_details.firstName} />
        <CardText>
          Email: {this.state.user_details.email}<br />
          Balance: {this.state.user_details.balance}
          <p>Auctions Participation </p>
          <div style={styles.root}>
            {this.state.user_bids.map(bid => {
              var state = "";
              if (bid.state === "APPROVED") {
                state = "On-Going";
              } else {
                state = bid.state;
              }
              return (
                <Card>
                  <CardTitle
                    title={bid.auction}
                    subtitle={<p>{bid.type} | {state} </p>}
                  />
                  <CardText>
                    {bid.state === "SOLD" &&
                      <p>
                        Winner: {bid.winner}<br />Winning Bid: {bid.win_bid}
                      </p>}
                    Product: {bid.asset} <br />
                    Seller: {bid.seller} <br />
                    Description: {bid.desc} <br /> <br />
                    <Divider />
                    {bid.offer.map(offer => {
                      console.log(offer);
                      return (
                        <p>
                          {" "}
                          TimeStamp:
                          {" "}
                          {offer.timestamp}
                          {" "}
                          <br />
                          Bid:
                          {" "}
                          {offer.bid_amount}
                        </p>
                      );
                    })}
                  </CardText>
                  {bid.state == "APPROVED" &&
                    <CardActions>
                      <Link to={"/listing/" + bid.auction}>
                        <RaisedButton primary={true} label="Go to Auction" />
                      </Link>
                    </CardActions>}
                </Card>
              );
            })}
          </div>
        </CardText>

      </Card>
    );
  }
}

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "initial"
  },
  gridList: {
    display: "flex",
    overflowX: "auto"
  },
  titleStyle: {
    color: "rgb(0, 188, 212)"
  }
};

export default UserDetails;
