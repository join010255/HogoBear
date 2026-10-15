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

def update_ip_files():
    local_ip = get_local_ip()
    print(f"Local IP detected: {local_ip}")
    
    script_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.abspath(os.path.join(script_dir, '..'))

    # 1. Update frontend/.env
    env_path = os.path.join(frontend_dir, '.env')
    env_content = f"EXPO_PUBLIC_API_URL=http://{local_ip}:3000/api\nEXPO_PUBLIC_SOCKET_URL=http://{local_ip}:3000\n"
    with open(env_path, 'w', encoding='utf-8') as f:
        f.write(env_content)
    print(f"Updated {env_path}")

    # 2. Update config.js fallback IP if present
    config_path = os.path.join(frontend_dir, 'src', 'constants', 'config.js')
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = re.sub(r"return '\d+\.\d+\.\d+\.\d+';", f"return '{local_ip}';", content)
        if content != new_content:
            with open(config_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated fallback in {config_path}")

if __name__ == "__main__":
    update_ip_files()
