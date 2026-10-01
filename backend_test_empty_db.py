#!/usr/bin/env python3
"""
Backend API Test Suite for Pan Królik Restaurant CMS - Empty DB Self-Heal Testing
Tests regression (all API endpoints) + critical empty-DB auto-seeding scenario
"""

import requests
import json
import sys
import re
import subprocess
import time

# Base URL from environment
BASE_URL = "https://elegant-rabbit.preview.emergentagent.com/api"
HOMEPAGE_URL = "https://elegant-rabbit.preview.emergentagent.com"
ADMIN_PASSWORD = "pankrolik2025"
DB_NAME = "your_database_name"

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

def drop_database():
    """Drop the MongoDB database"""
    print("\n=== Dropping Database ===")
    try:
        cmd = f'mongosh --quiet --eval \'db.getSiblingDB("{DB_NAME}").dropDatabase()\''
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
        print(f"Drop DB command output: {result.stdout}")
        if result.returncode != 0:
            print(f"Drop DB stderr: {result.stderr}")
            return False
        print_test("Database dropped successfully", True)
        return True
    except Exception as e:
        print_test("Drop database", False, f"Exception: {str(e)}")
        return False

def check_collection_counts():
    """Check collection counts in MongoDB"""
    print("\n=== Checking Collection Counts ===")
    try:
        cmd = f'''mongosh --quiet --eval 'db = db.getSiblingDB("{DB_NAME}"); print("content:", db.content.countDocuments()); print("menu:", db.menu.countDocuments()); print("gallery:", db.gallery.countDocuments()); print("reviews:", db.reviews.countDocuments());' '''
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, timeout=10)
        print(f"Collection counts:\n{result.stdout}")
        
        # Parse counts
        counts = {}
        for line in result.stdout.split('\n'):
            if ':' in line:
                parts = line.split(':')
                if len(parts) == 2:
                    collection = parts[0].strip()
                    count = parts[1].strip()
                    try:
                        counts[collection] = int(count)
                    except:
                        pass
        
        return counts
    except Exception as e:
        print_test("Check collection counts", False, f"Exception: {str(e)}")
        return {}

# ===== REGRESSION TESTS (from original backend_test.py) =====

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
        print_test("Response has required keys", has_keys)
        
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
        
        # Check count (30 items)
        count_ok = len(data) == 30
        print_test(f"Response has 30 items (actual: {len(data)})", count_ok)
        
        if len(data) > 0:
            item = data[0]
            # Check UUID
            is_uuid = is_valid_uuid(item.get('id', ''))
            print_test(f"Item id is UUID", is_uuid)
            
            # Check no _id
            no_underscore_id = '_id' not in item
            print_test("Items have no _id field", no_underscore_id)
            
            return passed and is_array and count_ok and is_uuid and no_underscore_id
        
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
        
        # Check count (20 items)
        count_ok = len(data) == 20
        print_test(f"Response has 20 items (actual: {len(data)})", count_ok)
        
        if len(data) > 0:
            item = data[0]
            # Check UUID
            is_uuid = is_valid_uuid(item.get('id', ''))
            print_test(f"Item id is UUID", is_uuid)
            
            # Check no _id
            no_underscore_id = '_id' not in item
            print_test("Items have no _id field", no_underscore_id)
            
            return passed and is_array and count_ok and is_uuid and no_underscore_id
        
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
        
        # Check count (3 items)
        count_ok = len(data) == 3
        print_test(f"Response has 3 items (actual: {len(data)})", count_ok)
        
        if len(data) > 0:
            item = data[0]
            # Check UUID
            is_uuid = is_valid_uuid(item.get('id', ''))
            print_test(f"Item id is UUID", is_uuid)
            
            # Check no _id
            no_underscore_id = '_id' not in item
            print_test("Items have no _id field", no_underscore_id)
            
            return passed and is_array and count_ok and is_uuid and no_underscore_id
        
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
            print_test("Response has success=true and token", success and has_token)
            return success and has_token
        else:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
    except Exception as e:
        print_test("Login with correct password", False, f"Exception: {str(e)}")
        return False

def test_auth_required():
    """Test that mutations require authentication"""
    print("\n=== Testing Auth Required on Mutations ===")
    
    # Test POST /api/menu without token
    try:
        response = requests.post(
            f"{BASE_URL}/menu",
            json={"category": "Test", "name": "Test Item"},
            timeout=10
        )
        passed = response.status_code == 401
        print_test("POST /api/menu without token returns 401", passed)
        return passed
    except Exception as e:
        print_test("POST /api/menu without token", False, f"Exception: {str(e)}")
        return False

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
            is_uuid = is_valid_uuid(created_id) if created_id else False
            print_test(f"Created item has UUID id", is_uuid)
            
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
            print_test(f"PUT /api/menu/{created_id} returns 200", passed)
            
            if not passed:
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
            print_test(f"DELETE /api/menu/{created_id} returns 200", passed)
            return passed
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
            print_test(f"Created item has UUID id", is_uuid)
            
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
            print_test(f"DELETE /api/gallery/{created_id} returns 200", passed)
            return passed
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
            print_test(f"Created item has UUID id", is_uuid)
            
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
            print_test(f"PUT /api/reviews/{created_id} returns 200", passed)
            
            if not passed:
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
            print_test(f"DELETE /api/reviews/{created_id} returns 200", passed)
            return passed
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
        return passed
    except Exception as e:
        print_test("PUT /api/content with token", False, f"Exception: {str(e)}")
        return False

# ===== CRITICAL EMPTY-DB SELF-HEAL TESTS =====

def test_empty_db_homepage_recovery():
    """Test empty-DB self-heal via homepage (SSR)"""
    print("\n" + "=" * 60)
    print("CRITICAL TEST: Empty-DB Self-Heal via Homepage (SSR)")
    print("=" * 60)
    
    # Step 1: Drop database
    if not drop_database():
        return False
    
    # Wait a moment for DB to be dropped
    time.sleep(1)
    
    # Step 2: GET homepage - must return 200 with real content
    print("\n=== Testing Homepage After DB Drop ===")
    try:
        response = requests.get(HOMEPAGE_URL, timeout=15)
        passed = response.status_code == 200
        print_test("GET / returns 200 (not error page)", passed)
        
        if not passed:
            print(f"   Status: {response.status_code}")
            print(f"   Body preview: {response.text[:500]}")
            return False
        
        # Check for real content (not Next.js error page)
        html = response.text
        has_content = 'Pan Królik' in html or 'Pan Kr' in html
        has_no_error = 'Application error' not in html and 'Error:' not in html[:1000]
        
        print_test("Homepage contains 'Pan Królik' text", has_content)
        print_test("Homepage has no error messages", has_no_error)
        
        if not (has_content and has_no_error):
            print(f"   HTML preview: {html[:1000]}")
            return False
        
    except Exception as e:
        print_test("GET / after DB drop", False, f"Exception: {str(e)}")
        return False
    
    # Step 3: Verify collections were auto re-seeded
    print("\n=== Verifying Auto Re-Seeding ===")
    time.sleep(2)  # Give it a moment to seed
    
    counts = check_collection_counts()
    
    content_ok = counts.get('content', 0) == 1
    menu_ok = counts.get('menu', 0) == 30
    gallery_ok = counts.get('gallery', 0) == 20
    reviews_ok = counts.get('reviews', 0) == 3
    
    print_test("content collection has 1 document", content_ok)
    print_test("menu collection has 30 documents", menu_ok)
    print_test("gallery collection has 20 documents", gallery_ok)
    print_test("reviews collection has 3 documents", reviews_ok)
    
    return content_ok and menu_ok and gallery_ok and reviews_ok

def test_empty_db_api_recovery():
    """Test empty-DB self-heal via API endpoint"""
    print("\n" + "=" * 60)
    print("CRITICAL TEST: Empty-DB Self-Heal via API")
    print("=" * 60)
    
    # Step 1: Drop database again
    if not drop_database():
        return False
    
    # Wait a moment for DB to be dropped
    time.sleep(1)
    
    # Step 2: Call GET /api/menu - must return 30 items (API auto-seeds)
    print("\n=== Testing API After DB Drop ===")
    try:
        response = requests.get(f"{BASE_URL}/menu", timeout=15)
        passed = response.status_code == 200
        print_test("GET /api/menu returns 200 after DB drop", passed)
        
        if not passed:
            print(f"   Status: {response.status_code}, Body: {response.text[:200]}")
            return False
        
        data = response.json()
        count_ok = len(data) == 30
        print_test(f"GET /api/menu returns 30 items (actual: {len(data)})", count_ok)
        
        if not count_ok:
            return False
        
    except Exception as e:
        print_test("GET /api/menu after DB drop", False, f"Exception: {str(e)}")
        return False
    
    # Step 3: Verify all collections were seeded
    print("\n=== Verifying Auto Re-Seeding via API ===")
    time.sleep(1)
    
    counts = check_collection_counts()
    
    content_ok = counts.get('content', 0) == 1
    menu_ok = counts.get('menu', 0) == 30
    gallery_ok = counts.get('gallery', 0) == 20
    reviews_ok = counts.get('reviews', 0) == 3
    
    print_test("content collection has 1 document", content_ok)
    print_test("menu collection has 30 documents", menu_ok)
    print_test("gallery collection has 20 documents", gallery_ok)
    print_test("reviews collection has 3 documents", reviews_ok)
    
    return content_ok and menu_ok and gallery_ok and reviews_ok

def main():
    """Run all tests"""
    print("=" * 60)
    print("Pan Królik - Backend API + Empty-DB Self-Heal Test Suite")
    print(f"Base URL: {BASE_URL}")
    print(f"Homepage: {HOMEPAGE_URL}")
    print("=" * 60)
    
    results = {}
    
    # PART 1: REGRESSION TESTS - All API endpoints still work after refactor
    print("\n" + "=" * 60)
    print("PART 1: REGRESSION TESTS")
    print("=" * 60)
    
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
    
    # PART 2: CRITICAL EMPTY-DB SELF-HEAL TESTS
    print("\n" + "=" * 60)
    print("PART 2: CRITICAL EMPTY-DB SELF-HEAL TESTS")
    print("=" * 60)
    
    results['Empty-DB Homepage Recovery'] = test_empty_db_homepage_recovery()
    results['Empty-DB API Recovery'] = test_empty_db_api_recovery()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for v in results.values() if v)
    total = len(results)
    
    print("\nREGRESSION TESTS:")
    for test_name in ['GET /api/content', 'GET /api/menu', 'GET /api/gallery', 'GET /api/reviews', 
                      'Admin Login', 'Auth Required', 'Menu CRUD', 'Gallery CRUD', 'Reviews CRUD', 'Content Update']:
        result = results.get(test_name, False)
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("\nCRITICAL EMPTY-DB SELF-HEAL TESTS:")
    for test_name in ['Empty-DB Homepage Recovery', 'Empty-DB API Recovery']:
        result = results.get(test_name, False)
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status}: {test_name}")
    
    print("\n" + "=" * 60)
    print(f"Total: {passed}/{total} tests passed")
    print("=" * 60)
    
    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == "__main__":
    main()
