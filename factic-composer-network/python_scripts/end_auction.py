import json
import sys
import requests



def end_auction(listing_id):
    payload = {
        "$class": "org.acme.product.auction.CloseBidding",
        "listing": listing_id
    }

    r = requests.post('http://localhost:3000/api/CloseBidding', data=payload)
    print(r.status_code, r.reason)
    if r.status_code != 200:
        print (r.text)

    else:
        listing = requests.get('http://localhost:3000/api/ProductListing/' + listing_id)
        print(listing.status_code, listing.reason)
        listing = json.loads(listing.text)
        product_id = listing['product'].split("#")[-1]
        product = requests.get('http://localhost:3000/api/Product/'+product_id)
        product = json.loads(product.text)
        owner = product['owner']
        print("Product " + product_id + " is now owned by " + owner)

if __name__ == "__main__":
    end_auction(sys.argv[1])