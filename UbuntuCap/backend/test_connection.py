# test_connection.py
import requests
import json

def test_backend():
    print("🧪 Testing Django Backend Connection...")
    
    # Test 1: Basic API root
    try:
        response = requests.get('http://localhost:8000/api/auth/')
        print(f"✅ API Root: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ API Root Failed: {e}")
    
    # Test 2: Registration endpoint
    test_data = {
        "phone_number": "254700000001",
        "email": "test@example.com",
        "password": "testpass123",
        "first_name": "Test",
        "last_name": "User",
        "business_name": "Test Business",
        "business_type": "Retail",
        "business_location": "Nairobi",
        "business_age_months": 12
    }
    
    try:
        response = requests.post(
            'http://localhost:8000/api/auth/register/',
            json=test_data,
            headers={'Content-Type': 'application/json'}
        )
        print(f"✅ Registration: {response.status_code}")
        if response.status_code == 201:
            print("🎉 Registration successful!")
            data = response.json()
            print(f"User: {data['user']['phone_number']}")
            print(f"Access Token: {data['access'][:50]}...")
        else:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Registration Failed: {e}")

if __name__ == "__main__":
    test_backend()