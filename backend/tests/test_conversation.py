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
    print("\nAdding friend to create a conversation...")
    url = f"{BASE_URL}/friends/add-friend"
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
        return json.loads(response.read().decode("utf-8"))
    except Exception as e:
        pass

def get_conversations(access_token):
    print("\nTesting Get Conversations Endpoint...")
    url = f"{BASE_URL}/conversations/get-conversations"
    
    req = urllib.request.Request(
        url, 
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode("utf-8"))
        print("Success - Get Conversations:")
        print(json.dumps(result, indent=2))
        return result
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"Failed with status {e.code}: {error_msg}")
        return None

if __name__ == "__main__":
    print("Starting Conversation API Tests...\n")
    
    print("Creating User 1 (Me)...")
    user1 = create_account()
    user1_login = login(user1["tokenUser"])
    access_token1 = user1_login["acessToken"]
    
    print("Creating User 2 (Friend)...")
    user2 = create_account()
    friend_token2 = user2["tokenUser"]
    
    add_friend(access_token1, friend_token2)
    
    get_conversations(access_token1)
