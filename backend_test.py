#!/usr/bin/env python3
"""
Backend API Test Suite for Pan Królik Restaurant CMS
Tests all API endpoints including auth, CRUD operations, and data validation
"""

import requests
import json
import sys
import re

# Base URL from environment
BASE_URL = "https://elegant-rabbit.preview.emergentagent.com/api"
ADMIN_PASSWORD = "pankrolik2025"

def print_test(name, passed, details=""):
    """Print test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"   {details}")
    return passed

def is_valid_uuid(value):
    """Check if value is a valid UUID"""
    uuid_pattern = re.compile(r'^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', re.IGNORECASE)
    return bool(uuid_pattern.match(str(value)))

def test_get_content():
    """Test GET /api/content"""
    print("\n=== Testing GET /api/content ===")
    try:
        response = requests.get(f"{BASE_URL}/content", timeout=10)
        passed = response.status_code == 200
        print_test("GET /api/content returns 200", passed)
        
        if not passed:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
        
        data = response.json()
        
        # Check required keys
        required_keys = ['hero', 'about', 'contact', 'social', 'footer']
        has_keys = all(key in data for key in required_keys)
        print_test("Response has required keys (hero, about, contact, social, footer)", has_keys)
        
        # Check id field
        has_id = data.get('id') == 'site'
        print_test("Response has id='site'", has_id)
        
        # Check no _id field
        no_underscore_id = '_id' not in data
        print_test("Response has no _id field", no_underscore_id)
        
        return passed and has_keys and has_id and no_underscore_id
    except Exception as e:
        print_test("GET /api/content", False, f"Exception: {str(e)}")
        return False

def test_get_menu():
    """Test GET /api/menu"""
    print("\n=== Testing GET /api/menu ===")
    try:
        response = requests.get(f"{BASE_URL}/menu", timeout=10)
        passed = response.status_code == 200
        print_test("GET /api/menu returns 200", passed)
        
        if not passed:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
        
        data = response.json()
        
        # Check it's an array
        is_array = isinstance(data, list)
        print_test("Response is an array", is_array)
        
        # Check count (~30 items)
        count_ok = len(data) >= 25 and len(data) <= 35
        print_test(f"Response has ~30 items (actual: {len(data)})", count_ok)
        
        if len(data) > 0:
            item = data[0]
            required_fields = ['id', 'category', 'name', 'description', 'price', 'image', 'order']
            has_fields = all(field in item for field in required_fields)
            print_test("Items have required fields", has_fields)
            
            # Check UUID
            is_uuid = is_valid_uuid(item.get('id', ''))
            print_test(f"Item id is UUID: {item.get('id', '')[:36]}", is_uuid)
            
            # Check no _id
            no_underscore_id = '_id' not in item
            print_test("Items have no _id field", no_underscore_id)
            
            return passed and is_array and count_ok and has_fields and is_uuid and no_underscore_id
        
        return passed and is_array and count_ok
    except Exception as e:
        print_test("GET /api/menu", False, f"Exception: {str(e)}")
        return False

def test_get_gallery():
    """Test GET /api/gallery"""
    print("\n=== Testing GET /api/gallery ===")
    try:
        response = requests.get(f"{BASE_URL}/gallery", timeout=10)
        passed = response.status_code == 200
        print_test("GET /api/gallery returns 200", passed)
        
        if not passed:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
        
        data = response.json()
        
        # Check it's an array
        is_array = isinstance(data, list)
        print_test("Response is an array", is_array)
        
        # Check count (~20 items)
        count_ok = len(data) >= 15 and len(data) <= 25
        print_test(f"Response has ~20 items (actual: {len(data)})", count_ok)
        
        if len(data) > 0:
            item = data[0]
            required_fields = ['id', 'url', 'order']
            has_fields = all(field in item for field in required_fields)
            print_test("Items have required fields (id, url, order)", has_fields)
            
            # Check UUID
            is_uuid = is_valid_uuid(item.get('id', ''))
            print_test(f"Item id is UUID: {item.get('id', '')[:36]}", is_uuid)
            
            # Check no _id
            no_underscore_id = '_id' not in item
            print_test("Items have no _id field", no_underscore_id)
            
            return passed and is_array and count_ok and has_fields and is_uuid and no_underscore_id
        
        return passed and is_array and count_ok
    except Exception as e:
        print_test("GET /api/gallery", False, f"Exception: {str(e)}")
        return False

def test_get_reviews():
    """Test GET /api/reviews"""
    print("\n=== Testing GET /api/reviews ===")
    try:
        response = requests.get(f"{BASE_URL}/reviews", timeout=10)
        passed = response.status_code == 200
        print_test("GET /api/reviews returns 200", passed)
        
        if not passed:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
        
        data = response.json()
        
        # Check it's an array
        is_array = isinstance(data, list)
        print_test("Response is an array", is_array)
        
        # Check count (~3 items)
        count_ok = len(data) >= 2 and len(data) <= 5
        print_test(f"Response has ~3 items (actual: {len(data)})", count_ok)
        
        if len(data) > 0:
            item = data[0]
            required_fields = ['id', 'name', 'rating', 'text']
            has_fields = all(field in item for field in required_fields)
            print_test("Items have required fields (id, name, rating, text)", has_fields)
            
            # Check UUID
            is_uuid = is_valid_uuid(item.get('id', ''))
            print_test(f"Item id is UUID: {item.get('id', '')[:36]}", is_uuid)
            
            # Check no _id
            no_underscore_id = '_id' not in item
            print_test("Items have no _id field", no_underscore_id)
            
            return passed and is_array and count_ok and has_fields and is_uuid and no_underscore_id
        
        return passed and is_array and count_ok
    except Exception as e:
        print_test("GET /api/reviews", False, f"Exception: {str(e)}")
        return False

def test_admin_login():
    """Test POST /api/admin/login"""
    print("\n=== Testing POST /api/admin/login ===")
    
    # Test successful login
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
            
            if not (success and has_token):
                return False
        else:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
    except Exception as e:
        print_test("Login with correct password", False, f"Exception: {str(e)}")
        return False
    
    # Test failed login
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
            print_test("Response has success=false", success)
            return success
        else:
            print(f"   Expected 401, got {response.status_code}")
            return False
    except Exception as e:
        print_test("Login with wrong password", False, f"Exception: {str(e)}")
        return False

def test_auth_required():
    """Test that mutations require authentication"""
    print("\n=== Testing Auth Required on Mutations ===")
    
    all_passed = True
    
    # Test POST /api/menu without token
    try:
        response = requests.post(
            f"{BASE_URL}/menu",
            json={"category": "Test", "name": "Test Item"},
            timeout=10
        )
        passed = response.status_code == 401
        print_test("POST /api/menu without token returns 401", passed)
        all_passed = all_passed and passed
    except Exception as e:
        print_test("POST /api/menu without token", False, f"Exception: {str(e)}")
        all_passed = False
    
    # Test PUT /api/content without token
    try:
        response = requests.put(
            f"{BASE_URL}/content",
            json={"id": "site", "hero": {"title": "Test"}},
            timeout=10
        )
        passed = response.status_code == 401
        print_test("PUT /api/content without token returns 401", passed)
        all_passed = all_passed and passed
    except Exception as e:
        print_test("PUT /api/content without token", False, f"Exception: {str(e)}")
        all_passed = False
    
    return all_passed

def test_menu_crud():
    """Test menu CRUD operations with auth"""
    print("\n=== Testing Menu CRUD with Auth ===")
    
    headers = {"x-admin-token": ADMIN_PASSWORD}
    created_id = None
    
    # Create
    try:
        response = requests.post(
            f"{BASE_URL}/menu",
            json={
                "category": "Desery",
                "name": "Test Deser",
                "description": "Testowy opis",
                "price": "10 zł",
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
            has_id = created_id is not None
            is_uuid = is_valid_uuid(created_id) if created_id else False
            print_test(f"Created item has UUID id: {created_id}", is_uuid)
            
            if not is_uuid:
                return False
        else:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
    except Exception as e:
        print_test("POST /api/menu with token", False, f"Exception: {str(e)}")
        return False
    
    # Update
    if created_id:
        try:
            response = requests.put(
                f"{BASE_URL}/menu/{created_id}",
                json={"name": "Updated Test Deser"},
                headers=headers,
                timeout=10
            )
            passed = response.status_code == 200
            print_test(f"PUT /api/menu/{created_id} with token returns 200", passed)
            
            if passed:
                data = response.json()
                success = data.get('success') == True
                print_test("Update response has success=true", success)
                
                if not success:
                    return False
            else:
                print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
                return False
        except Exception as e:
            print_test(f"PUT /api/menu/{created_id}", False, f"Exception: {str(e)}")
            return False
    
    # Delete
    if created_id:
        try:
            response = requests.delete(
                f"{BASE_URL}/menu/{created_id}",
                headers=headers,
                timeout=10
            )
            passed = response.status_code == 200
            print_test(f"DELETE /api/menu/{created_id} with token returns 200", passed)
            
            if passed:
                data = response.json()
                success = data.get('success') == True
                print_test("Delete response has success=true", success)
                return success
            else:
                print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
                return False
        except Exception as e:
            print_test(f"DELETE /api/menu/{created_id}", False, f"Exception: {str(e)}")
            return False
    
    return True

def test_gallery_crud():
    """Test gallery CRUD operations with auth"""
    print("\n=== Testing Gallery CRUD with Auth ===")
    
    headers = {"x-admin-token": ADMIN_PASSWORD}
    created_id = None
    
    # Create
    try:
        response = requests.post(
            f"{BASE_URL}/gallery",
            json={"url": "https://example.com/test-image.jpg"},
            headers=headers,
            timeout=10
        )
        passed = response.status_code == 200
        print_test("POST /api/gallery with token returns 200", passed)
        
        if passed:
            data = response.json()
            created_id = data.get('id')
            is_uuid = is_valid_uuid(created_id) if created_id else False
            print_test(f"Created item has UUID id: {created_id}", is_uuid)
            
            if not is_uuid:
                return False
        else:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
    except Exception as e:
        print_test("POST /api/gallery with token", False, f"Exception: {str(e)}")
        return False
    
    # Delete
    if created_id:
        try:
            response = requests.delete(
                f"{BASE_URL}/gallery/{created_id}",
                headers=headers,
                timeout=10
            )
            passed = response.status_code == 200
            print_test(f"DELETE /api/gallery/{created_id} with token returns 200", passed)
            
            if passed:
                data = response.json()
                success = data.get('success') == True
                print_test("Delete response has success=true", success)
                return success
            else:
                print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
                return False
        except Exception as e:
            print_test(f"DELETE /api/gallery/{created_id}", False, f"Exception: {str(e)}")
            return False
    
    return True

def test_reviews_crud():
    """Test reviews CRUD operations with auth"""
    print("\n=== Testing Reviews CRUD with Auth ===")
    
    headers = {"x-admin-token": ADMIN_PASSWORD}
    created_id = None
    
    # Create
    try:
        response = requests.post(
            f"{BASE_URL}/reviews",
            json={"name": "Tester", "rating": 5, "text": "Super test review"},
            headers=headers,
            timeout=10
        )
        passed = response.status_code == 200
        print_test("POST /api/reviews with token returns 200", passed)
        
        if passed:
            data = response.json()
            created_id = data.get('id')
            is_uuid = is_valid_uuid(created_id) if created_id else False
            print_test(f"Created item has UUID id: {created_id}", is_uuid)
            
            if not is_uuid:
                return False
        else:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
    except Exception as e:
        print_test("POST /api/reviews with token", False, f"Exception: {str(e)}")
        return False
    
    # Update
    if created_id:
        try:
            response = requests.put(
                f"{BASE_URL}/reviews/{created_id}",
                json={"text": "Updated test review"},
                headers=headers,
                timeout=10
            )
            passed = response.status_code == 200
            print_test(f"PUT /api/reviews/{created_id} with token returns 200", passed)
            
            if passed:
                data = response.json()
                success = data.get('success') == True
                print_test("Update response has success=true", success)
                
                if not success:
                    return False
            else:
                print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
                return False
        except Exception as e:
            print_test(f"PUT /api/reviews/{created_id}", False, f"Exception: {str(e)}")
            return False
    
    # Delete
    if created_id:
        try:
            response = requests.delete(
                f"{BASE_URL}/reviews/{created_id}",
                headers=headers,
                timeout=10
            )
            passed = response.status_code == 200
            print_test(f"DELETE /api/reviews/{created_id} with token returns 200", passed)
            
            if passed:
                data = response.json()
                success = data.get('success') == True
                print_test("Delete response has success=true", success)
                return success
            else:
                print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
                return False
        except Exception as e:
            print_test(f"DELETE /api/reviews/{created_id}", False, f"Exception: {str(e)}")
            return False
    
    return True

def test_content_update():
    """Test content update with auth"""
    print("\n=== Testing Content Update with Auth ===")
    
    headers = {"x-admin-token": ADMIN_PASSWORD}
    
    # First get current content
    try:
        response = requests.get(f"{BASE_URL}/content", timeout=10)
        if response.status_code != 200:
            print_test("GET /api/content for update test", False, "Failed to fetch content")
            return False
        
        content = response.json()
    except Exception as e:
        print_test("GET /api/content for update test", False, f"Exception: {str(e)}")
        return False
    
    # Update content
    try:
        response = requests.put(
            f"{BASE_URL}/content",
            json=content,
            headers=headers,
            timeout=10
        )
        passed = response.status_code == 200
        print_test("PUT /api/content with token returns 200", passed)
        
        if passed:
            data = response.json()
            success = data.get('success') == True
            print_test("Update response has success=true", success)
            return success
        else:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
    except Exception as e:
        print_test("PUT /api/content with token", False, f"Exception: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("Pan Królik Restaurant CMS - Backend API Test Suite")
    print(f"Base URL: {BASE_URL}")
    print("=" * 60)
    
    results = {}
    
    # Run all tests
    results['GET /api/content'] = test_get_content()
    results['GET /api/menu'] = test_get_menu()
    results['GET /api/gallery'] = test_get_gallery()
    results['GET /api/reviews'] = test_get_reviews()
    results['Admin Login'] = test_admin_login()
    results['Auth Required'] = test_auth_required()
    results['Menu CRUD'] = test_menu_crud()
    results['Gallery CRUD'] = test_gallery_crud()
    results['Reviews CRUD'] = test_reviews_crud()
    results['Content Update'] = test_content_update()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("\n" + "=" * 60)
    print(f"Total: {passed}/{total} tests passed")
    print("=" * 60)
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
