# Chain Auction - WIP
Chain auction is a decentralized auction engine built on a Hyperledger Fabric Network.
Hyperledger Fabric is an implementation of blockchain technology, leveraging familiar and proven technologies. It is a modular architecture allowing pluggable implementations of various function. It features powerful container technology to host any mainstream language for smart contracts development. Smart Contracts are defined on Hyperledger Fabric Composer.

## Demo Links
Link: `104.211.186.61:3001`

API:  `104.211.186.61:3000`

The demo contains 5 users along with 3 Products that can be auctioned. For see users and ownership see '104.211.186.61:3001/users'
Slides: [Google Slides](https://goo.gl/rr9oTE)


## Auction Process
- The user from `/users` clicks on the product to create an Auction Listing for the product.
- The user then fills in details regarding the auction.
    - Right now the listing id is not generated automatically, assign a listingid "list\<any non used number\>", ex "list4"
    - Set the Reserve Price
    - The state of the Auction Listing is set to  **PENDING**, Pendeing approval from the auctioneer
    - Auction type specifies the type of auction the user wants.
- Upon successful creation of an Aution LIsting, it is listed at `/auctioneer`, where the auctioneer has the option to approve a requested Auction Listing upon which the state is change to **APPROVED**
- `/` Listis all the currently open (APPRIVED) auctions in which the users can participate.
- Users can place bids on a particular Auction Listing at `/listing/<lisingId>/`
    - Here the 'User ID' is the user's email id and the 'Bid' the amount he is willing to bid for the item.
- `/auctioneer` also has the option for the auctioneer to end an ongoing acution. 
- Upon ending the auction by the auctioneer, the state of the Auction Listing is set to either **RESERVE_NOT_MET** or **SOLD** depending on the outcome of the auction.
- After updating the new ownership and balance can be seen at `/users`
- `/listingDetails/<listingId>` displays the details about the AuctionListing specified by listingId.
- `/users/<user_email_id>` displays details about the user specified by the email id.

## Structure 
`fabric-composer-network` contains files for defining the business network (Smart Contracts) for the application.

`auction-web` contains files for the web application built with React JS

## Running the Application
### Fork the repository
`$ git clone https://github.com/sidd607/chain-auction.git` 
### Setting up the Fabric Nerwork
Follow the steps from [Hyperledger Composer docs](https://hyperledger.github.io/composer/installing/development-tools.html) to setup a Fabric Network
### Developing and deploying the Busines Network
The Business Network definition consists of 3 major components
- Model Files - Define the structure and realationship between model elements
- Script Files - Implement the Business Logic for the application.
- Access Control File - A set of access control rules that define the rights of different participants in the business network.
