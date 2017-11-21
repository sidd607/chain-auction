from  create_listing import create_listing
from  create_offer import create_offer
from  create_products import create_product
from  create_member import create_member
from get_details import get_details

def init():

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
    print("-------- Creating Lisitng -----------")

    create_listing("list1", "First_Price", "pro1", "a@a.com")
    create_listing("list2", "Second_Price", "pro2", "a@a.com")
    print("-------------------------------------")
    get_details()


if __name__ == "__main__":
    init()
