# Chain Auction
Chain auction is a decentralized auction engine built on a Hyperledger Fabric Network.
Hyperledger Fabric is an implementation of blockchain technology, leveraging familiar and proven technologies. It is a modular architecture allowing pluggable implementations of various function. It features powerful container technology to host any mainstream language for smart contracts development. Smart Contracts are defined on Hyperledger Fabric Composer.


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





