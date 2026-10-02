#!/usr/bin/env python3
"""
DB Outage Resilience Test for Pan Królik Restaurant CMS
Tests that admin login works even when MongoDB is down
"""

import requests
import json
import sys
import subprocess
import time

# Base URL from environment
BASE_URL = "https://elegant-rabbit.preview.emergentagent.com/api"
HOMEPAGE_URL = "https://elegant-rabbit.preview.emergentagent.com"
ADMIN_PASSWORD = "pankrolik2025"

def print_test(name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   {details}")
    return passed

def stop_mongodb():
    """Stop MongoDB service"""
    print("\n🛑 Stopping MongoDB service...")
    try:
        result = subprocess.run(
            ["sudo", "supervisorctl", "stop", "mongodb"],
            capture_output=True,
            text=True,
            timeout=10
        )
        print(f"   {result.stdout.strip()}")
        time.sleep(2)  # Wait for service to stop
        return True
    except Exception as e:
        print(f"   ❌ Failed to stop MongoDB: {str(e)}")
        return False

def start_mongodb():
    """Start MongoDB service"""
    print("\n🟢 Starting MongoDB service...")
    try:
        result = subprocess.run(
            ["sudo", "supervisorctl", "start", "mongodb"],
            capture_output=True,
            text=True,
            timeout=10
        )
        print(f"   {result.stdout.strip()}")
        time.sleep(3)  # Wait for service to start
        return True
    except Exception as e:
        print(f"   ❌ Failed to start MongoDB: {str(e)}")
        return False

def test_normal_login():
    """Test normal login (with DB running)"""
    print("\n=== Test 1: Normal Login (DB Running) ===")
    
    all_passed = True
    
    # Test correct password
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"password": ADMIN_PASSWORD},
            timeout=10
        )
        passed = response.status_code == 200
        print_test("Login with correct password returns 200", passed)
        
        if passed:
            data = response.json()
            success = data.get('success') == True
            has_token = data.get('token') == ADMIN_PASSWORD
            print_test("Response has success=true", success)
            print_test(f"Response has token='{ADMIN_PASSWORD}'", has_token)
            all_passed = all_passed and success and has_token
        else:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            all_passed = False
    except Exception as e:
        print_test("Login with correct password", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test wrong password
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"password": "wrongpassword"},
            timeout=10
        )
        passed = response.status_code == 401
        print_test("Login with wrong password returns 401", passed)
        
        if passed:
            data = response.json()
            success = data.get('success') == False
            has_error = 'error' in data
            print_test("Response has success=false", success)
            print_test("Response has error field", has_error)
            all_passed = all_passed and success and has_error
        else:
            print(f"   Expected 401, got {response.status_code}")
            all_passed = False
    except Exception as e:
        print_test("Login with wrong password", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_db_outage_login():
    """Test login during DB outage (CRITICAL TEST)"""
    print("\n=== Test 2: CRITICAL - Login During DB Outage ===")
    
    all_passed = True
    
    # Test correct password during outage
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"password": ADMIN_PASSWORD},
            timeout=10
        )
        passed = response.status_code == 200
        print_test("🔥 CRITICAL: Login with correct password returns 200 (DB DOWN)", passed)
        
        if passed:
            data = response.json()
            success = data.get('success') == True
            has_token = data.get('token') == ADMIN_PASSWORD
            print_test("Response has success=true", success)
            print_test(f"Response has token='{ADMIN_PASSWORD}'", has_token)
            all_passed = all_passed and success and has_token
        else:
            print(f"   ❌ CRITICAL FAILURE: Status: {response.status_code}, Body: {response.text[:200]}")
            all_passed = False
    except Exception as e:
        print_test("🔥 CRITICAL: Login with correct password (DB DOWN)", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test wrong password during outage
    try:
        response = requests.post(
            f"{BASE_URL}/admin/login",
            json={"password": "wrongpassword"},
            timeout=10
        )
        passed = response.status_code == 401
        print_test("Login with wrong password returns 401 (DB DOWN)", passed)
        
        if passed:
            data = response.json()
            success = data.get('success') == False
            print_test("Response has success=false", success)
            all_passed = all_passed and success
        else:
            print(f"   Expected 401, got {response.status_code}")
            all_passed = False
    except Exception as e:
        print_test("Login with wrong password (DB DOWN)", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test that other endpoints fail as expected during outage
    try:
        response = requests.get(f"{BASE_URL}/menu", timeout=5)
        # During outage, we expect either 500 or timeout (both are acceptable)
        passed = response.status_code == 500
        print_test("GET /api/menu returns 500 during outage (expected)", passed)
        all_passed = all_passed and passed
    except requests.exceptions.Timeout:
        # Timeout is also acceptable during DB outage
        print_test("GET /api/menu times out during outage (expected)", True)
    except Exception as e:
        print_test("GET /api/menu during outage", False, f"Unexpected exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_post_outage_regression():
    """Test that everything works after DB is back online"""
    print("\n=== Test 3: Post-Outage Regression (DB Restored) ===")
    
    all_passed = True
    
    # Test GET endpoints
    try:
        response = requests.get(f"{BASE_URL}/menu", timeout=10)
        passed = response.status_code == 200
        print_test("GET /api/menu returns 200", passed)
        
        if passed:
            data = response.json()
            count = len(data)
            count_ok = count >= 25 and count <= 35
            print_test(f"GET /api/menu returns ~30 items (actual: {count})", count_ok)
            all_passed = all_passed and count_ok
        else:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            all_passed = False
    except Exception as e:
        print_test("GET /api/menu", False, f"Exception: {str(e)}")
        all_passed = False
    
    try:
        response = requests.get(f"{BASE_URL}/content", timeout=10)
        passed = response.status_code == 200
        print_test("GET /api/content returns 200", passed)
        
        if passed:
            data = response.json()
            has_id = data.get('id') == 'site'
            print_test("Content has id='site'", has_id)
            all_passed = all_passed and has_id
        else:
            all_passed = False
    except Exception as e:
        print_test("GET /api/content", False, f"Exception: {str(e)}")
        all_passed = False
    
    try:
        response = requests.get(f"{BASE_URL}/gallery", timeout=10)
        passed = response.status_code == 200
        print_test("GET /api/gallery returns 200", passed)
        
        if passed:
            data = response.json()
            count = len(data)
            count_ok = count >= 15 and count <= 25
            print_test(f"GET /api/gallery returns ~20 items (actual: {count})", count_ok)
            all_passed = all_passed and count_ok
        else:
            all_passed = False
    except Exception as e:
        print_test("GET /api/gallery", False, f"Exception: {str(e)}")
        all_passed = False
    
    try:
        response = requests.get(f"{BASE_URL}/reviews", timeout=10)
        passed = response.status_code == 200
        print_test("GET /api/reviews returns 200", passed)
        
        if passed:
            data = response.json()
            count = len(data)
            count_ok = count >= 2 and count <= 5
            print_test(f"GET /api/reviews returns ~3 items (actual: {count})", count_ok)
            all_passed = all_passed and count_ok
        else:
            all_passed = False
    except Exception as e:
        print_test("GET /api/reviews", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test menu CRUD with token
    headers = {"x-admin-token": ADMIN_PASSWORD}
    created_id = None
    
    try:
        response = requests.post(
            f"{BASE_URL}/menu",
            json={
                "category": "Desery",
                "name": "Test Item Post-Outage",
                "description": "Test",
                "price": "15 zł",
                "image": ""
            },
            headers=headers,
            timeout=10
        )
        passed = response.status_code == 200
        print_test("POST /api/menu with token returns 200", passed)
        
        if passed:
            data = response.json()
            created_id = data.get('id')
            all_passed = all_passed and (created_id is not None)
        else:
            all_passed = False
    except Exception as e:
        print_test("POST /api/menu with token", False, f"Exception: {str(e)}")
        all_passed = False
    
    if created_id:
        try:
            response = requests.put(
                f"{BASE_URL}/menu/{created_id}",
                json={"name": "Updated Test Item"},
                headers=headers,
                timeout=10
            )
            passed = response.status_code == 200
            print_test(f"PUT /api/menu/{created_id} with token returns 200", passed)
            all_passed = all_passed and passed
        except Exception as e:
            print_test(f"PUT /api/menu/{created_id}", False, f"Exception: {str(e)}")
            all_passed = False
        
        try:
            response = requests.delete(
                f"{BASE_URL}/menu/{created_id}",
                headers=headers,
                timeout=10
            )
            passed = response.status_code == 200
            print_test(f"DELETE /api/menu/{created_id} with token returns 200", passed)
            all_passed = all_passed and passed
        except Exception as e:
            print_test(f"DELETE /api/menu/{created_id}", False, f"Exception: {str(e)}")
            all_passed = False
    
    # Test protected routes without token
    try:
        response = requests.post(
            f"{BASE_URL}/menu",
            json={"name": "Test"},
            timeout=10
        )
        passed = response.status_code == 401
        print_test("POST /api/menu without token returns 401", passed)
        all_passed = all_passed and passed
    except Exception as e:
        print_test("POST /api/menu without token", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test homepage
    try:
        response = requests.get(HOMEPAGE_URL, timeout=10)
        passed = response.status_code == 200
        print_test("GET homepage returns 200", passed)
        
        if passed:
            content = response.text
            has_content = "Pan Królik" in content or "Królik" in content
            print_test("Homepage contains real content", has_content)
            all_passed = all_passed and has_content
        else:
            all_passed = False
    except Exception as e:
        print_test("GET homepage", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def main():
    """Run all DB outage resilience tests"""
    print("=" * 70)
    print("Pan Królik - DB Outage Resilience Test Suite")
    print(f"Base URL: {BASE_URL}")
    print("=" * 70)
    
    results = {}
    mongodb_stopped = False
    
    try:
        # Test 1: Normal login with DB running
        results['Normal Login (DB Running)'] = test_normal_login()
        
        # Test 2: Stop MongoDB and test login resilience
        mongodb_stopped = stop_mongodb()
        if mongodb_stopped:
            results['CRITICAL: Login During DB Outage'] = test_db_outage_login()
        else:
            print("❌ Failed to stop MongoDB, skipping outage tests")
            results['CRITICAL: Login During DB Outage'] = False
        
    finally:
        # ALWAYS restart MongoDB
        if mongodb_stopped:
            start_mongodb()
        
        # Test 3: Post-outage regression
        results['Post-Outage Regression'] = test_post_outage_regression()
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("\n" + "=" * 70)
    print(f"Total: {passed}/{total} test groups passed")
    print("=" * 70)
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
