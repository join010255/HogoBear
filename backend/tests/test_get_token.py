import requests
import json
import random

BASE_URL = "http://localhost:3000"

def run_tests():
    print("Starting End-to-End API Test...")
    
    # Generate a random username to avoid collisions
    username = f"testuser_{random.randint(10000, 99999)}"
    password = "TestPassword123!"
    
    print("\n" + "="*50)
    print("1. CREATE ACCOUNT")
    print("="*50)
    create_payload = {
        "username": username,
        "password": password
    }
    print(f"POST /api/users/create-account")
    print(f"Payload: {json.dumps(create_payload)}")
    response = requests.post(f"{BASE_URL}/api/users/create-account", json=create_payload)
    print(f"Status: {response.status_code}")
    create_data = response.json()
    print(json.dumps(create_data, indent=2))
    
    if response.status_code != 200:
        print("\n[!] Failed to create account. Stopping tests.")
        return
        
    token_user = create_data.get("data", {}).get("tokenUser")
    
    print("\n" + "="*50)
    print("2. LOGIN")
    print("="*50)
    login_payload = {
        "tokenUser": token_user,
        "password": password
    }
    print(f"POST /api/users/login")
    print(f"Payload: {json.dumps(login_payload)}")
    response = requests.post(f"{BASE_URL}/api/users/login", json=login_payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    
    if response.status_code != 200:
        print("\n[!] Failed to login. Stopping tests.")
        return

    print("\n" + "="*50)
    print("3. UPDATE PUBLIC KEY")
    print("="*50)
    update_payload = {
        "tokenUser": token_user,
        "publicKey": "dummy-public-key-base64-encoded"
    }
    print(f"PUT /api/users/update-public-key")
    print(f"Payload: {json.dumps(update_payload)}")
    response = requests.put(f"{BASE_URL}/api/users/update-public-key", json=update_payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

    print("\n" + "="*50)
    print("4. GET TOKEN")
    print("="*50)
    get_token_payload = {
        "tokenUser": token_user,
        "password": password
    }
    print(f"POST /api/users/get-token")
    print(f"Payload: {json.dumps(get_token_payload)}")
    response = requests.post(f"{BASE_URL}/api/users/get-token", json=get_token_payload)
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))

if __name__ == "__main__":
    try:
        run_tests()
    except requests.exceptions.ConnectionError:
        print(f"\nError: Could not connect to {BASE_URL}.")
        print("Please ensure the backend server is running.")
