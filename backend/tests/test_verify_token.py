import urllib.request
import urllib.error
import json
import random

BASE_URL = "http://localhost:3000/api"

def create_account():
    url = f"{BASE_URL}/users/create-account"
    username = f"user_{random.randint(10000, 99999)}"
    print(username)
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
    print("\nSending friend request...")
    url = f"{BASE_URL}/friends/add-friend"
    data = {"friend_token": friend_token}
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode("utf-8"), 
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {access_token}"}
    )
    try:
        response = urllib.request.urlopen(req)
        print("Success - Add Friend:", json.loads(response.read().decode("utf-8")))
    except urllib.error.HTTPError as e:
        print(f"Failed Add Friend: {e.read().decode('utf-8')}")

def accept_friend(access_token, friend_token):
    print("\nAccepting friend request...")
    url = f"{BASE_URL}/friends/accept-friend"
    data = {"friend_token": friend_token}
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode("utf-8"), 
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {access_token}"}
    )
    try:
        response = urllib.request.urlopen(req)
        print("Success - Accept Friend:", json.loads(response.read().decode("utf-8")))
    except urllib.error.HTTPError as e:
        print(f"Failed Accept Friend: {e.read().decode('utf-8')}")

def verify_token(access_token):
    print("\nTesting Verify Token Endpoint...")
    url = f"{BASE_URL}/users/verify-token"
    
    req = urllib.request.Request(
        url, 
        headers={"Authorization": f"Bearer {access_token}"}
    )
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode("utf-8"))
        print("Success - Verify Token:")
        print(json.dumps(result, indent=2))
        return result
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"Failed with status {e.code}: {error_msg}")
        return None

if __name__ == "__main__":
    print("Starting Verify Token API Test...\n")
    
    print("Creating User 1...")
    user1 = create_account()
    user1_login = login(user1["tokenUser"])
    access_token1 = user1_login["acessToken"]
    
    print("Creating User 2...")
    user2 = create_account()
    user2_login = login(user2["tokenUser"])
    access_token2 = user2_login["acessToken"]
    
    # User 1 sends request to User 2
    add_friend(access_token1, user2["tokenUser"])
    
    # User 2 accepts request from User 1
    accept_friend(access_token2, user1["tokenUser"])
    
    # Verify User 1 token to see updated friends and conversations
    verify_token(access_token1)
