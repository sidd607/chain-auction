import React, { Component } from "react";
import { List, ListItem } from "material-ui/List";
import ActionGrade from "material-ui/svg-icons/action/grade";
import Divider from "material-ui/Divider";
import Dialog from "material-ui/Dialog";
import RaisedButton from "material-ui/RaisedButton";
import SelectField from "material-ui/SelectField";
import TextField from "material-ui/TextField";
import MenuItem from "material-ui/MenuItem";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import { Link } from "react-router-dom";
import config from "./../config";

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: {},
      users: [],
      user_map: {},

      auction_asset: "",
      dialog_open: false,
      auction_owner: "",
      auction_state: "PENDING",
      auction_reserve_price: 0,
      auction_desc: "",
      auction_id: "",
      auction_type: "First_Price"
    };
  }

  handle_click_auction = asset => {
    console.log(asset);
    this.setState({
      auction_asset: asset,
      dialog_open: true,
      auction_owner: this.state.products[asset]
    });
  };

  handle_close = () => {
    this.setState({ dialog_open: false, auction_asset: "" });
  };

  get_user_details = (another_fun) => {
    var url = config.url + "Member/";
    fetch(url)
      .then(results => {
        return results.json();
      })
      .then(result => {
        let tmp = {};
        var user = [];
        for (var i = 0; i < result.length; i++) {
          tmp[result[i].email] = result[i];
          user.push(result[i].email);
          tmp[result[i].email]["products"] = [];
        }
        this.setState({ user_map: tmp, users: user });
	this.get_product_details();
      })
      .catch(error => {
        alert("Something went Wrong" + error);
      });
  };

  get_product_details = () => {
    var url = config.url + "Product/";
    fetch(url)
      .then(results => {
        return results.json();
      })
      .then(result => {
        let tmp = this.state.user_map;
        let tmp2 = this.state.products;
        for (var i = 0; i < result.length; i++) {
          var owner = result[i].owner.substr(41);
          var pid = result[i].pid;

          if (!(pid in tmp2)) {
            tmp2[pid] = owner;
          }
          if (owner in tmp) {
            tmp[owner]["products"].push(result[i]);
          }
        }
        console.log(tmp2);
        this.setState({ user_map: tmp, products: tmp2 });
      });
  };

  get_list_items = user => {
    var tmp = [];
    for (var i = 0; i < this.state.user_map[user].products.length; i++) {
      var pid = this.state.user_map[user].products[i].pid;
      tmp.push(
        <RaisedButton
          key={i}
          primary={true}
          label={this.state.user_map[user].products[i].pid}
          onClick={() => {
            this.handle_click_auction(pid);
          }}
        />
      );
    }

    return tmp;
  };

  submit_auction = () => {
    var url = config.url + "ProductListing/";
    fetch(url, {
      body: '{"listingId": "' +
        this.state.auction_id +
        '","reservePrice": "' +
        this.state.auction_reserve_price +
        '","description": "' +
        this.state.auction_desc +
        '","state": "PENDING","auctionType": "' +
        this.state.auction_type +
        '","product": "' +
        this.state.auction_asset +
        '","seller": "' +
        this.state.auction_owner +
        '"}',
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST"
    })
      .then(results => {
        if (results.status != 200) {
          alert("Something went Wrong");
          throw "Err";
        }
        return results.json();
      })
      .then(result => {
        alert("Submitted");
        this.setState({ dialog_open: false });
      });
  };

  componentDidMount() {
    this.get_user_details(this.get_product_details());
  }

  render() {
    const actions = [
      <RaisedButton
        label="Submit Request"
        primary={true}
        onClick={this.submit_auction}
      />
    ];

    return (
      <div className="App">
        <p>Users </p>
        <div style={styles.root}>
          <Divider />
          {this.state.users.map(user => {
            return (
              <Card>
                <Link to={"/users/" + user}>
                  <CardHeader
                    title={this.state.user_map[user].firstName}
                    avatar="http://www.skywardimaging.com/wp-content/uploads/2015/11/default-user-image.png"
                  />
                </Link>
                <CardText>
                  Email: {this.state.user_map[user].email} <br />
                  Balance: {this.state.user_map[user].balance} <br />
                  Assets Owned:
                </CardText>
                <CardActions>
                  {this.get_list_items(user).map(element => {
                    console.log(element);
                    return element;
                  })}
                </CardActions>
              </Card>
            );
          })}
          <Dialog
            title={<p> Auction of Asset: {this.state.auction_asset} </p>}
            actions={actions}
            modal={false}
            open={this.state.dialog_open}
            onRequestClose={this.handle_close}
          >
            <TextField
              hintText="Listing ID"
              onChange={(event, newVal) => {
                this.setState({ auction_id: newVal });
              }}
            /> <br />
            <TextField
              hintText="Reserve Price"
              onChange={(event, newVal) => {
                this.setState({ auction_reserve_price: newVal });
              }}
            /> <br />

            <TextField
              disabled={true}
              hintText={<span>Owner: {this.state.auction_owner} </span>}
            />
            {" "}
            <br />
            <TextField
              hintText="Description"
              onChange={(event, newVal) => {
                this.setState({ auction_desc: newVal });
              }}
            /> <br />
            <TextField disabled={true} hintText="State : Pending" /> <br />
            <SelectField
              floatingLabelText="Auction Type"
              value={this.state.auction_type}
              onChange={(event, index, value) => {
                this.setState({ auction_type: value });
              }}
            >
              <MenuItem value="First_Price" primaryText="First_Price" />
              <MenuItem value="Second_Price" primaryText="Second Price" />
              <MenuItem value="First_Sealed" primaryText="First Price Sealed" />
            </SelectField>

          </Dialog>
        </div>
	<br/><br/>
	Click on Products to request auction
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

export default User;
