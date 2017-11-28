import requests
import json

def get_details(test = False):
    r = requests.get("http://localhost:3000/api/Member")
    if r.status_code != 200:
        print r.text
        raise Exception("Cannot fetch details")
    owners = json.loads(r.text)
    if not test:
        print("------------ Members ---------------")
        for i in owners:
            print i['lastName'], i['firstName'], i['email'], i['balance']
        
    r = requests.get("http://localhost:3000/api/Product")
    if r.status_code != 200:
        print r.text
        raise Exception("Cannot fetch details")
    products = json.loads(r.text)

    if not test:
        print("----------- products ---------")
        for i in products:
            print i['pid'], i['owner']
        
    r = requests.get("http://localhost:3000/api/ProductListing")
    if r.status_code != 200:
        print r.text
        raise Exception("Cannot fetch details")

    productListing = json.loads(r.text)

    if not test:
        print ("---------- ProductListing -------")
        for i in productListing:
            print i['listingId'], i['state']

    return owners, products, productListing


if __name__ == "__main__":
    get_details()