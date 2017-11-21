import sys
import requests

def create_product(pid, owner):
    payload = {
            "$class": "org.acme.product.auction.Product",
            "pid": pid,
            "owner": owner
            }
    r = requests.post('http://localhost:3000/api/Product', data = payload)
    print(r.status_code, r.reason)

if __name__ == '__main__':
    create_product(sys.argv[1], sys.argv[2])
