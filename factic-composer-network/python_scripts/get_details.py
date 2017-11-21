import requests
import json

def get_details():
    r = requests.get("http://localhost:3000/api/Member")
    if r.status_code != 200:
        print r.text
        return
    owners = json.loads(r.text)
    print("------------ Members ---------------")
    for i in owners:
        print i['lastName'], i['firstName'], i['email'], i['balance']
    
    r = requests.get("http://localhost:3000/api/Product")
    if r.status_code != 200:
        print r.text
        return
    products = json.loads(r.text)
    print("----------- products ---------")
    for i in products:
        print i['pid'], i['owner']


if __name__ == "__main__":
    get_details()