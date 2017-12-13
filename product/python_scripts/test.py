import unittest
from  create_listing import create_listing
from  create_offer import create_offer
from  create_products import create_product
from  create_member import create_member
from  create_offer import create_offer
from end_auction import end_auction
from get_details import get_details
import requests
import json

class auctionTest(unittest.TestCase):

    def clean(self):
        owners, products, productListing = get_details(True)
        for i in owners:
            print "Deleting Member: " + i['email']  
            r = requests.delete('http://localhost:3000/api/Member/' + i['email'])
            if r.status_code != 204:
                raise Exception("Cannot Delete Member: " + i['email'])
        
        for i in products:
            print "Deleting Asset: " + i['pid']
            r = requests.delete('http://localhost:3000/api/Product/' + i['pid'])
            if r.status_code != 204:
                raise Exception("Cannot Delete Asset: " + i['pid'])

        for i in productListing:
            print "Deleting Product Listing :" + i['listingId']
            r = requests.delete('http://localhost:3000/api/ProductListing/' + i['listingId'])
            if r.status_code != 204:
                raise Exception("Cannot Delete Asset: " + i['listingId'])

                

    def init(self):
        
        print("--------- Creating Members ----------")
        create_member("User1", "a@a.com", 10000)
        create_member("User2", "b@b.com", 10000)
        create_member("User3", "c@c.com", 10000)
        create_member("User4", "d@d.com", 10000)
        create_member("User5", "e@e.com", 10000)
        
        print("-------- Creating Products ----------")
        create_product("pro1", "a@a.com")
        create_product("pro2", "a@a.com")
        create_product("pro3", "a@a.com")

        create_product("pro4", "b@b.com")
        create_product("pro5", "b@b.com")
        create_product("pro6", "b@b.com")

        create_product("pro7", "c@c.com")
        create_product("pro8", "c@c.com")
        create_product("pro9", "c@c.com")


        print("-------- Creating Lisitng -----------")
        create_listing("list1", "First_Price", "pro1", "a@a.com", True)
        create_listing("list2", "First_Price", "pro2", "a@a.com", True)
        create_listing("list3", "First_Price", "pro3", "a@a.com", True)

        create_listing("list4", "Second_Price", "pro4", "b@b.com", True)
        create_listing("list5", "Second_Price", "pro5", "b@b.com", True)
        create_listing("list6", "Second_Price", "pro6", "b@b.com", True)
        
        create_listing("list7", "First_Sealed", "pro7", "c@c.com", True)
        create_listing("list8", "First_Sealed", "pro8", "c@c.com", True)
        create_listing("list9", "First_Sealed", "pro9", "c@c.com", True)
    

    def test_1_first_price(self):
        
        print "First Price auction list1"
        
        create_offer("b@b.com", "list1", "1000")
        print ("b@b.com bids 1000")
        create_offer("c@c.com", "list1", "2000")
        print ("b@b.com bids 1000")
        create_offer("d@d.com", "list1", "3000")
        print ("b@b.com bids 1000")

        product_id, owner = end_auction("list1")
        print ("End Auction")
        r = requests.get("http://localhost:3000/api/Product/pro1")
        if r.status_code != 200:
            raise Exception("Cannot get details")
        
        pro_details = json.loads(r.text)
        assert (pro_details['owner'][41:] == 'd@d.com'), "Wrong Winner First Price Auction | Failure"

        r = requests.get("http://localhost:3000/api/Member/d@d.com")
        if r.status_code != 200:
            raise Exception("Cannot fetch details")
        
        mem_details = json.loads(r.text)
        assert (int(mem_details['balance']) == 7000), "Incorrect Balance First Price Auction | Failure"

        print ("First Price Auction winner: d@d.com @ 3000")

    
    def test_2_first_price_fail(self):
        
        print "Reserve Not Met - Test"
        create_offer('b@b.com', 'list2', '100')
        create_offer('c@c.com', 'list2', '200')

        product_id, owner = end_auction("list2")

        r = requests.get("http://localhost:3000/api/Product/pro2")
        if r.status_code != 200:
            raise Exception("Cannot fetch details")
        
        pro_details = json.loads(r.text)
        assert (pro_details['owner'][41:] == 'a@a.com'), "Incorrect Owner"

        r = requests.get("http://localhost:3000/api/Member/a@a.com")
        if r.status_code != 200:
            raise Exception("Cannote fetch details")
        
        mem_details = json.loads(r.text)
        assert (int(mem_details['balance']) == 13000), "Incorrect balance of a@a.com"

        print "No Winner as Reserve not met | pro2 owned by a@a.com"

    def test_3_no_bids(self):
        
        end_auction("list3")
        r = requests.get("http://localhost:3000/api/Product/pro3")
        if r.status_code != 200:
            raise Exception("Cannot fetch details")
        
        pro_details = json.loads(r.text)
        assert (pro_details['owner'][41:] == 'a@a.com'), "Incorrect Owner of pro1"

        r = requests.get("http://localhost:3000/api/Member/a@a.com")
        if r.status_code != 200:
            raise Exception("Cannot fetch details")
        
        mem_details = json.loads(r.text)
        assert (int(mem_details['balance']) == 13000), "Incorrect balance of a@a.com"
        print "No Winner as no bids | pro3 owned by a@a.com"
    
    def test_4_second_price(self):
        
        create_offer("a@a.com", "list4", "1000")
        create_offer("c@c.com", "list4", "2000")
        create_offer("d@d.com", "list4", "3000")

        end_auction("list4")

        r = requests.get("http://localhost:3000/api/Product/pro4")
        if r.status_code != 200:
            raise Exception("Cannot fetch data")

        pro_details = json.loads(r.text)
        assert(pro_details['owner'][41:] == 'd@d.com'), "Wrong Winner"
        
        r = requests.get("http://localhost:3000/api/Member/d@d.com")
        if r.status_code != 200:
            raise Exception("Cannot fetch data")

        mem_details = json.loads(r.text)

        assert(int(mem_details['balance']) == 5000), "Incorrect winning price"

    def test_5_reserve_not_met(self):
        return
        print "Ending Auction list 5"
        print "Owner of pro5: b@b.com"
        pass
    
    def test_6_no_bids(self):
        return
        print "Ending Auction list 6 with no bids"
        print "Owner of pro6: b@b.com"
        pass


    def test_7_first_price_sealed(self):
        
        print "First Price Sealed - Test"
        create_offer("b@b.com", "list7", "1000")
        print ""
        create_offer("d@d.com", "list7", "2000")
        print ""
        create_offer("e@e.com", "list7", "3000")
        print ""
        
        product_id, owner = end_auction("list7")
        
        print ("End Auction")
        
        r = requests.get("http://localhost:3000/api/Product/pro7")
        if r.status_code != 200:
            raise Exception("Cannot get details")
        
        pro_details = json.loads(r.text)
        
        assert (pro_details['owner'][41:] == 'e@e.com'), "Wrong Winner First Price Auction | Failure"

        r = requests.get("http://localhost:3000/api/Member/e@e.com")
        if r.status_code != 200:
            raise Exception("Cannot fetch details")
        
        mem_details = json.loads(r.text)
        assert (int(mem_details['balance']) == 7000), "Incorrect Balance First Price Auction | Failure"

        print ("First Price Auction winner: e@e.com @ 3000")




    def test_0_init(self):
        
        print ("----- Testing initialization -----")
        self.clean()
        self.init()
        



    
        

    
    

if __name__ == '__main__':
    unittest.main()