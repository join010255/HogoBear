from cryptography.hazmat.primitives.asymmetric import x25519

# ===== User A =====
private_key_A = x25519.X25519PrivateKey.generate()
public_key_A = private_key_A.public_key()

# ===== User B =====
private_key_B = x25519.X25519PrivateKey.generate()
public_key_B = private_key_B.public_key()

# ===== Shared Secret =====
shared_secret_A = private_key_A.exchange(public_key_B)
shared_secret_B = private_key_B.exchange(public_key_A)

print(shared_secret_A.hex())
print(shared_secret_B.hex())

print(shared_secret_A == shared_secret_B)
