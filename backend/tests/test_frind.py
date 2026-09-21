import urllib.request
import urllib.error
import json
import random

BASE_URL = "http://localhost:3000/api"

def create_account():
    url = f"{BASE_URL}/users/create-account"
    username = f"user_{random.randint(10000, 99999)}"
    data = {"username": username, "password": "Password123!"}
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode("utf-8"), 
        headers={"Content-Type": "application/json"}
    )
    response = urllib.request.urlopen(req)
    return json.loads(response.read().decode("utf-8"))["data"]

def login(tokenUser):
    url = f"{BASE_URL}/users/login"
    data = {"tokenUser": tokenUser, "password": "Password123!"}
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode("utf-8"), 
        headers={"Content-Type": "application/json"}
    )
    response = urllib.request.urlopen(req)
    return json.loads(response.read().decode("utf-8"))["data"]

def add_friend(access_token, friend_token):
    print("\nTesting Add Friend Endpoint...")
    url = f"{BASE_URL}/friends/add-friend"
    # print(access_token)
    # print(friend_token)
    data = {"friend_token": friend_token}
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode("utf-8"), 
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        }
    )
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode("utf-8"))
        print("Success - Add Friend:")
        print(json.dumps(result, indent=2))
        return result
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"Failed with status {e.code}: {error_msg}")
        return None

def get_friends(access_token):
    print("\nTesting Get Friends Endpoint...")
    url = f"{BASE_URL}/friends/get-friends"
    
    req = urllib.request.Request(
        url, 
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode("utf-8"))
        print("Success - Get Friends:")
        print(json.dumps(result, indent=2))
        return result
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"Failed with status {e.code}: {error_msg}")
        return None

def block_friend(access_token, friend_token):
    print("\nTesting Block Friend Endpoint...")
    url = f"{BASE_URL}/friends/block-friend"
    data = {"friend_token": friend_token}
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode("utf-8"), 
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {access_token}"
        },
        method="PUT"
    )
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode("utf-8"))
        print("Success - Block Friend:")
        print(json.dumps(result, indent=2))
        return result
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"Failed with status {e.code}: {error_msg}")
        return None

if __name__ == "__main__":
    print("Starting Friends API Tests...\n")
    
    print("Creating User 1 (Me)...")
    user1 = create_account()
    user1_login = login(user1["tokenUser"])
    access_token = user1_login["acessToken"]
    
    print("Creating User 2 (Friend)...")
    user2 = create_account()
    friend_token = user2["tokenUser"]
    
    print(f"User 1 Access Token: {access_token[:15]}...")
    print(f"User 2 Friend Token (tokenUser): {friend_token[:15]}...")
    
    add_friend(access_token, friend_token)
    get_friends(access_token)
    block_friend(access_token, friend_token)
