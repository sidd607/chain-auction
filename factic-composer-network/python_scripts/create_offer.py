import requests
import sys

def create_offer(member, listing_id, bid):
    payload = {
                "$class": "org.acme.product.auction.Offer",
                "bidPrice": bid,
                "listing": listing_id,
                "member": member
            }
    r = requests.post('http://localhost:3000/api/Offer', data = payload)
    print(r.status_code, r.reason)
    if r.status_code != 200:
        print(r.text)
    else:
        r = requests.get('http://localhost:3000/api/ProductListing/' + listing_id)
        if r.status_code == 200:
            import json
            data = json.loads(r.text)
            data = data['offers']
            for i in data:
                member = i['member'].split('#')[-1]
                print member, i['bidPrice']




if __name__ == "__main__":
    create_offer(sys.argv[1], sys.argv[2], int(sys.argv[3]))

