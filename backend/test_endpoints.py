import requests
import json
import os

BASE_URL = "http://localhost:3000/api"

def print_response(name, response):
    print(f"\n{'='*50}")
    print(f"Testing: {name}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response (text): {response.text}")
    print(f"{'='*50}\n")

def test_endpoints():
    print("Starting API tests...")
    
    # We'll use a random suffix to avoid username collisions if running multiple times
    import random
    suffix = str(random.randint(1000, 9999))
    username = f"testuser_{suffix}"
    password = "securepassword123"
    
    # 1. Create Account
    create_payload = {
        "username": username,
        "password": password
    }
    res = requests.post(f"{BASE_URL}/users/create-account", json=create_payload)
    print_response("Create Account", res)
    
    if res.status_code != 200:
        print("Failed to create account. Stopping tests.")
        return
        
    data = res.json().get("data", {})
    token_user = data.get("tokenUser")
    
    # 2. Login
    login_payload = {
        "tokenUser": token_user,
        "password": password
    }
    res = requests.post(f"{BASE_URL}/users/login", json=login_payload)
    print_response("Login", res)
    
    # 3. Update Public Key
    pub_key_payload = {
        "tokenUser": token_user,
        "publicKey": "my-mocked-public-key-xyz123"
    }
    res = requests.put(f"{BASE_URL}/users/update-public-key", json=pub_key_payload)
    print_response("Update Public Key", res)

if __name__ == "__main__":
    try:
        test_endpoints()
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to the server. Is it running on http://localhost:3000 ?")
