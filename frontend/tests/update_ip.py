import socket
import re
import os

def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Doesn't need to be reachable
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except Exception:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

def update_api_file(file_path):
    local_ip = get_local_ip()
    print(f"Local IP detected: {local_ip}")
    
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to match http://<any-ip-or-localhost>:<port>/api
    new_url = f"http://{local_ip}:3000/api"
    new_content = re.sub(r'http://[a-zA-Z0-9\.]+:\d+/api', new_url, content)

    if content != new_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path} with new IP: {local_ip}")
    else:
        print("IP is already up to date or no matching URL found.")

if __name__ == "__main__":
    # Assuming script is in frontend/tests and api.js is in frontend/src/api
    script_dir = os.path.dirname(os.path.abspath(__file__))
    api_file_path = os.path.abspath(os.path.join(script_dir, '..', 'src', 'api', 'api.js'))
    
    update_api_file(api_file_path)
