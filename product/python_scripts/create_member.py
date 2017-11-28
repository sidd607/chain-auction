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
    if r.status_code != 200:
        raise Exception ("Cannot create Member")
    else:
        print "Member Created: " + name + " " + str(balance) + " " + email


if __name__ == '__main__':
    create_member(sys.argv[1], sys.argv[2], int(sys.argv[3]))
