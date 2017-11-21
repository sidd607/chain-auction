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

class ListingDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listingId: this.props.match.params.id,
      listing: {},
      det: false
    };
  }

  get_details = () => {
    var url =
      "http://localhost:3000/api/ProductListing/" + this.state.listingId;
    fetch(url)
      .then(results => {
        if (results.status != 200) {
          alert("Something Went Wrong");
          throw "Err";
        }
        return results.json();
      })
      .then(result => {
        console.log(result);
        this.setState({ listing: result });
        this.setState({ det: true });
      });
  };

  print_add_details = () => {
    if (
      this.state.listing.state != "PENDING" && "winner" in this.state.listing
    ) {
      return { Winner: <b> {this.state.listing.winner} </b> };
    }
  };

  componentDidMount() {
    this.get_details();
  }

  render() {
    if (this.state.det) {
      return (
        <div>
          <Card>
            <CardTitle title={this.state.listingId} />
            <CardText>
              Listing Id: <b> {this.state.listingId}</b><br />
              Auction Type: <b> {this.state.listing.auctionType} </b><br />
              Seller: <b> {this.state.listing.seller.substr(41)} </b><br />
              Asset:
              {" "}
              <b> {this.state.listing.product.substr(42)} </b>
              <br />
              <br />
              <Divider /> <br />

              State: <b> {this.state.listing.state} </b> <br />
              {this.state.listing.state === "SOLD" &&
                <div>
                  {" "}
                  Winner: <b> {this.state.listing.winner} </b><br />
                  Winning Bid: <b>{this.state.listing.winPrice}</b> <br />
                </div>}
              <br />
              <Divider /> <br />

              {"offers" in this.state.listing &&
                <div>
                  <h3>Bids Made </h3>
                  {this.state.listing.offers.map(offer => {
                    return (
                      <div>
                        {" "}<br />
                        Bidder:<b> {offer.member.substr(41)} </b><br />
                        BidPrice: <b> {offer.bidPrice} </b> <br />
                        Timestamp: <b> {offer.timestamp} </b> <br />
                        <br />
                      </div>
                    );
                  })}
                </div>}
            </CardText>
          </Card>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

export default ListingDetails;
