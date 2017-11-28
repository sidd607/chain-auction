import requests
import json


def view_transactions():
    r = requests.get("http://localhost:3000/api/system/transactions")
    if r.status_code != 200:
        return

    data = json.loads(r.text)
    data = sorted(data, key = lambda k:k['timestamp'])
    for i in data:
        print(i)
        print("\n")
    return data


if __name__ == "__main__":
    view_transactions()