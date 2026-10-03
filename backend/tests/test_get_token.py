import requests
import json

# Configuration
BASE_URL = "http://localhost:3000/api/users" # Adjust the base URL and port if needed
ENDPOINT = f"{BASE_URL}/get-token"

# Test data (replace with an actual tokenUser and password from your database)
PAYLOAD = {
    "tokenUser": "TEST_TOKEN_USER_HERE",
    "password": "TEST_PASSWORD_HERE"
}

def test_get_token():
    print(f"Testing POST {ENDPOINT}...")
    try:
        headers = {
            "Content-Type": "application/json"
        }
        
        response = requests.post(ENDPOINT, json=PAYLOAD, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        
        try:
            print("Response JSON:")
            print(json.dumps(response.json(), indent=2))
        except ValueError:
            print("Response Text:")
            print(response.text)
            
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_get_token()
