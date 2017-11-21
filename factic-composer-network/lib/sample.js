/**
 * Make an Offer for a VehicleListing
 * @param {org.acme.product.auction.CloseAuction} closeAuctions - the CloseBidding
 * @transaction
 */

function closeAuction(closeBidding) {
    var listing = closeBidding.listing;
    if (listing.state !== 'APPROVED') {
        throw new Error('Listing is not FOR SALE');
    }
  // by default we mark the listing as RESERVE_NOT_MET
    if ((listing.auctionType == 'First_Price') || (listing.auctionType == 'First_Sealed') ) {
        listing.state = 'RESERVE_NOT_MET';
        var highestOffer = null;
        var buyer = null;
        var seller = null;
        if (listing.offers && listing.offers.length > 0) {
      // sort the bids by bidPrice
            listing.offers.sort(function(a, b) {
                return b.bidPrice - a.bidPrice;
            });
            highestOffer = listing.offers[0];
            if (highestOffer.bidPrice >= listing.reservePrice) {
        // mark the listing as SOLD
                listing.state = 'SOLD';
                buyer = highestOffer.member;
                seller = listing.product.owner;
        // update the balance of the seller
                console.log('#### seller balance before: ' + seller.balance);
                seller.balance += highestOffer.bidPrice;
                console.log('#### seller balance after: ' + seller.balance);
        // update the balance of the buyer
                console.log('#### buyer balance before: ' + buyer.balance);
                buyer.balance -= highestOffer.bidPrice;
                console.log('#### buyer balance after: ' + buyer.balance);
        // transfer the vehicle to the buyer
                listing.product.owner = buyer;
        // clear the offers
                //listing.offers = null;
                listing.winner = buyer;
                listing.winPrice = highestOffer.bidPrice;
            }
        }
        return getAssetRegistry('org.acme.product.auction.Product')
      .then(function(productRegistry) {
        // save the vehicle
          if (highestOffer) {
              return productRegistry.update(listing.product);
          } else {
              return true;
          }
      })
      .then(function() {
          return getAssetRegistry('org.acme.product.auction.ProductListing');
      })
      .then(function(ProductListingRegistry) {
        // save the vehicle listing
          return ProductListingRegistry.update(listing);
      })
      .then(function() {
          return getParticipantRegistry('org.acme.product.auction.Member');
      })
      .then(function(userRegistry) {
        // save the buyer
          if (listing.state == 'SOLD') {
              return userRegistry.updateAll([buyer, seller]);
          } else {
              return true;
          }
      });
    } else if (listing.auctionType == 'Second_Price') {
        listing.state = 'RESERVE_NOT_MET';
        var highestOffer = null;
        var secondHighestOffer = null;
        var buyer = null;
        var seller = null;
    // sort the bids by bidPrice
        listing.offers.sort(function(a, b) {
            return b.bidPrice - a.bidPrice;
        });
        highestOffer = listing.offers[0];
        secondHighestOffer = listing.offers[1];
        listing.state = 'SOLD';
        buyer = highestOffer.member;
        seller = listing.product.owner;

    // Updating Balances
        seller.balance += secondHighestOffer.bidPrice;
        buyer.balance -= secondHighestOffer.bidPrice;
        listing.product.owner = buyer;
        //listing.offers = null;
        listing.winner = buyer;
        listing.winPrice = secondHighestOffer.bidPrice;
        return getAssetRegistry('org.acme.product.auction.Product')
      .then(function(productRegistry) {
        // save the vehicle
          if (highestOffer) {
              return productRegistry.update(listing.product);
          } else {
              return true;
          }
      })
      .then(function() {
          return getAssetRegistry('org.acme.product.auction.ProductListing');
      })
      .then(function(ProductListingRegistry) {
        // save the vehicle listing
          return ProductListingRegistry.update(listing);
      })
      .then(function() {
          return getParticipantRegistry('org.acme.product.auction.Member');
      })
      .then(function(userRegistry) {
          if (listing.state == 'SOLD') {
              return userRegistry.updateAll([buyer, seller]);
          } else {return true;}
      });
    }
}

/**
 * Approve an AuctionListing
 * @param {org.acme.product.auction.ApproveListing} approveListing - the lising
 * @transaction
 */
function approveListing(listing){
    var listing_to_update = listing.listing;
  	listing_to_update.state = 'APPROVED';
    return getAssetRegistry('org.acme.product.auction.ProductListing')
    .then(function(productListingRegistry){
        return productListingRegistry.update(listing_to_update);
    })
}

/**
 * Make an Offer for a VehicleListing
 * @param {org.acme.product.auction.Offer} offer - the offer
 * @transaction
 */
function makeOffer(offer) {
    var listing = offer.listing;
    if (listing.state !== 'APPROVED') {
        throw new Error('Listing is not FOR SALE');
    }
    if (listing.offers == null) {
        listing.offers = [];
    }
    if (listing.auctionType != 'First_Price'){
        for(var i=0; i< listing.offers.length; i++){
            if (listing.offers[i].member == offer.member){
                throw new Error('You can only bid once');
            }
        }
    }
    listing.offers.push(offer);
    return getAssetRegistry(
    'org.acme.product.auction.ProductListing'
  ).then(function(productListingRegistry) {
    // save the vehicle listing
      return productListingRegistry.update(listing);
  });
}
