import urllib.request
import urllib.error
import json
import random

BASE_URL = "http://localhost:3000/api/users"

def test_create_account():
    print("Testing Create Account...")
    url = f"{BASE_URL}/create-account"
    
    # Random username bach mantihouch f' mouchkil dial "Username already exists"
    username = f"testuser_{random.randint(1000, 9999)}"
    
    data = {
        "username": username,
        "password": "Password123!"
    }
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode("utf-8"), 
        headers={"Content-Type": "application/json"}
    )
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode("utf-8"))
        print("Success - Create Account:")
        print(json.dumps(result, indent=2))
        return result
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"Failed with status {e.code}: {error_msg}")
        return None

def test_login(tokenUser):
    print("\nTesting Login...")
    url = f"{BASE_URL}/login"
    
    data = {
        "tokenUser": tokenUser,
        "password": "Password123!"
    }
    
    req = urllib.request.Request(
        url, 
        data=json.dumps(data).encode("utf-8"), 
        headers={"Content-Type": "application/json"}
    )
    
    try:
        response = urllib.request.urlopen(req)
        result = json.loads(response.read().decode("utf-8"))
        print("Success - Login:")
        print(json.dumps(result, indent=2))
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode("utf-8")
        print(f"Failed with status {e.code}: {error_msg}")

if __name__ == "__main__":
    print("Starting API Tests...\n")
    # 1. Njewrbou Inchaa 7isab (Create Account)
    account_result = test_create_account()
    
    # 2. Njerbou Login b' tokenUser li tcreya
    if account_result and "data" in account_result and "tokenUser" in account_result["data"]:
        test_login(account_result["data"]["tokenUser"])
