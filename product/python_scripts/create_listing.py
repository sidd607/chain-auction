import requests
import sys

def create_listing(listing_id, auction_type, product, seller, test = False):
    if not test:
        payload = {
                "$class": "org.acme.product.auction.ProductListing",
                "listingId": listing_id,
                "reservePrice": 1000,
                "description": "This is " + listing_id,
                "state": "PENDING",
                "offers": [],
                "auctionType": auction_type,
                "product": product, 
                "seller": seller
                }
    else:
        payload = {
                "$class": "org.acme.product.auction.ProductListing",
                "listingId": listing_id,
                "reservePrice": 1000,
                "description": "This is " + listing_id,
                "state": "APPROVED",
                "offers": [],
                "auctionType": auction_type,
                "product": product, 
                "seller": seller
                }


    r = requests.post("http://localhost:3000/api/ProductListing", data = payload)
    print(r.status_code, r.reason)
    if r.status_code != 200:
        print(r.text)


if __name__ == "__main__":
    create_listing(sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4])
