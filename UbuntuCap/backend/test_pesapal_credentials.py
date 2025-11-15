import requests
import base64
import json

def test_pesapal_credentials():
    consumer_key = "rbpmoIN0Dn5o2+ymhWN85VK4pSuOnVrK"
    consumer_secret = "mPd/AKquZa4lIwcL7cmFpUf2aGU="
    
    print("🧪 Testing PesaPal Credentials...")
    print(f"Consumer Key: {consumer_key}")
    print(f"Consumer Secret: {consumer_secret}")
    
    # Try both sandbox and live endpoints
    endpoints = [
        "https://pay.pesapal.com/v3/api/Auth/RequestToken",  # Live
        "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken"  # Sandbox
    ]
    
    for endpoint in endpoints:
        print(f"\n🔗 Testing endpoint: {endpoint}")
        
        try:
            auth_string = f"{consumer_key}:{consumer_secret}"
            encoded_auth = base64.b64encode(auth_string.encode()).decode()
            
            headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': f'Basic {encoded_auth}'
            }
            
            payload = {
                "consumer_key": consumer_key,
                "consumer_secret": consumer_secret
            }
            
            response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
            
            print(f"Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            
            if response.status_code == 200:
                print("✅ SUCCESS! Valid credentials")
                data = response.json()
                print(f"Token: {data.get('token', 'No token')}")
                return endpoint
            else:
                print("❌ Failed with this endpoint")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    return None

if __name__ == "__main__":
    result = test_pesapal_credentials()
    if result:
        print(f"\n🎉 Use this base URL: {result.replace('/api/Auth/RequestToken', '')}")
    else:
        print("\n❌ Both endpoints failed. Credentials may be invalid.")
