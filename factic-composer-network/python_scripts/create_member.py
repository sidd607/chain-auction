import requests
import sys

def create_member(name, email, balance):
    payload = {
            '$class': 'org.acme.product.auction.Member',
            'balance': balance,
            'email': email,
            'firstName': name,
            'lastName': name
            }
    r = requests.post('http://localhost:3000/api/Member', data = payload)
    print(r.status_code, r.reason)


if __name__ == '__main__':
    create_member(sys.argv[1], sys.argv[2], int(sys.argv[3]))
