#!/usr/bin/env python3
"""
Backend test suite for Pan Królik data migration v4
Tests the 5 real gallery photos and complete migration chain v2->v3->v4
"""
import requests
import json
import subprocess
import time

# Configuration
BASE_URL = "http://localhost:3000"
API_URL = f"{BASE_URL}/api"
ADMIN_TOKEN = "pankrolik2025"
DB_NAME = "your_database_name"

def print_test(name):
    print(f"\n{'='*80}")
    print(f"TEST: {name}")
    print('='*80)

def print_success(msg):
    print(f"✅ {msg}")

def print_error(msg):
    print(f"❌ {msg}")

def print_info(msg):
    print(f"ℹ️  {msg}")

def drop_database():
    """Drop the entire database using mongosh"""
    print_info("Dropping database...")
    cmd = f'mongosh --quiet --eval "db.getSiblingDB(\'{DB_NAME}\').dropDatabase()"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        print_success(f"Database '{DB_NAME}' dropped successfully")
        time.sleep(2)  # Wait for DB to fully drop
        return True
    else:
        print_error(f"Failed to drop database: {result.stderr}")
        return False

def check_meta_version(expected_version):
    """Check meta collection version using mongosh"""
    print_info(f"Checking meta.version in database (expecting {expected_version})...")
    cmd = f'mongosh --quiet --eval "db.getSiblingDB(\'{DB_NAME}\').meta.findOne({{id: \'meta\'}})"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        print_info(f"Meta collection: {result.stdout.strip()}")
        if f'"version": {expected_version}' in result.stdout or f'version: {expected_version}' in result.stdout:
            print_success(f"meta.version is {expected_version}")
            return True
        else:
            print_error(f"meta.version is not {expected_version}: {result.stdout}")
            return False
    else:
        print_error(f"Failed to check meta: {result.stderr}")
        return False

def test_gallery_5_items():
    """Test 1: GET /api/gallery returns exactly 5 items with g1-g5, orders 0-4, no duplication"""
    print_test("Test 1: GET /api/gallery - 5 Real Gallery Photos")
    
    try:
        # Call GET /api/gallery 3+ times to verify no duplication
        for attempt in range(4):
            print_info(f"GET /api/gallery attempt {attempt+1}...")
            response = requests.get(f"{API_URL}/gallery", timeout=10)
            print_info(f"Status: {response.status_code}")
            
            if response.status_code != 200:
                print_error(f"Expected 200, got {response.status_code}")
                return False
            
            gallery = response.json()
            
            # Check exactly 5 items
            if len(gallery) != 5:
                print_error(f"Expected exactly 5 items, got {len(gallery)}")
                return False
            print_success(f"Attempt {attempt+1}: Gallery has exactly 5 items")
            
            # Check URLs are /gallery/g1.jpg through /gallery/g5.jpg
            expected_urls = ['/gallery/g1.jpg', '/gallery/g2.jpg', '/gallery/g3.jpg', '/gallery/g4.jpg', '/gallery/g5.jpg']
            actual_urls = [item.get('url') for item in gallery]
            
            if actual_urls != expected_urls:
                print_error(f"URLs mismatch. Expected: {expected_urls}, Got: {actual_urls}")
                return False
            print_success(f"Attempt {attempt+1}: URLs are correct (g1.jpg through g5.jpg)")
            
            # Check orders are 0-4 ascending
            expected_orders = [0, 1, 2, 3, 4]
            actual_orders = [item.get('order') for item in gallery]
            
            if actual_orders != expected_orders:
                print_error(f"Orders mismatch. Expected: {expected_orders}, Got: {actual_orders}")
                return False
            print_success(f"Attempt {attempt+1}: Orders are correct (0-4 ascending)")
            
            time.sleep(0.5)
        
        print_success("Test 1 PASSED: Gallery has exactly 5 items (g1-g5, orders 0-4), no duplication across 4 calls")
        return True
        
    except Exception as e:
        print_error(f"Test 1 FAILED: {str(e)}")
        return False

def test_static_files():
    """Test 2: Static files g1-g5.jpg, about.jpg, logo-transparent.png return 200"""
    print_test("Test 2: Static Files (Gallery Images, About, Logo)")
    
    try:
        # Test gallery images g1-g5.jpg
        for i in range(1, 6):
            url = f"{BASE_URL}/gallery/g{i}.jpg"
            print_info(f"GET {url}...")
            response = requests.get(url, timeout=10)
            
            if response.status_code != 200:
                print_error(f"Expected 200, got {response.status_code} for g{i}.jpg")
                return False
            
            content_type = response.headers.get('content-type', '')
            if 'image/jpeg' not in content_type.lower():
                print_error(f"Expected image/jpeg, got {content_type} for g{i}.jpg")
                return False
            
            size = len(response.content)
            print_success(f"g{i}.jpg: 200, image/jpeg, {size} bytes")
        
        # Test about.jpg
        print_info(f"GET {BASE_URL}/about.jpg...")
        response = requests.get(f"{BASE_URL}/about.jpg", timeout=10)
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code} for about.jpg")
            return False
        content_type = response.headers.get('content-type', '')
        if 'image/jpeg' not in content_type.lower():
            print_error(f"Expected image/jpeg, got {content_type} for about.jpg")
            return False
        print_success(f"about.jpg: 200, image/jpeg, {len(response.content)} bytes")
        
        # Test logo-transparent.png
        print_info(f"GET {BASE_URL}/logo-transparent.png...")
        response = requests.get(f"{BASE_URL}/logo-transparent.png", timeout=10)
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code} for logo-transparent.png")
            return False
        content_type = response.headers.get('content-type', '')
        if 'image/png' not in content_type.lower():
            print_error(f"Expected image/png, got {content_type} for logo-transparent.png")
            return False
        print_success(f"logo-transparent.png: 200, image/png, {len(response.content)} bytes")
        
        print_success("Test 2 PASSED: All static files accessible (g1-g5.jpg, about.jpg, logo-transparent.png)")
        return True
        
    except Exception as e:
        print_error(f"Test 2 FAILED: {str(e)}")
        return False

def test_fresh_db_migration_chain():
    """Test 3: CRITICAL - Drop DB, GET /api/content once, verify migration chain v2->v3->v4"""
    print_test("Test 3: CRITICAL - Fresh DB Migration Chain (v2->v3->v4)")
    
    try:
        # Drop the database
        if not drop_database():
            print_error("Failed to drop database")
            return False
        
        # Trigger fresh seed by calling GET /api/content ONCE
        print_info("Triggering fresh seed with GET /api/content (ONCE)...")
        response = requests.get(f"{API_URL}/content", timeout=15)
        print_info(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        # Verify v2 migration: contact data
        print_info("Verifying v2 migration (contact data)...")
        address = data.get('contact', {}).get('address', '')
        phone = data.get('contact', {}).get('phone', '')
        
        if address != 'Aleja Rzeczypospolitej 2a, 02-972 Warszawa':
            print_error(f"Wrong address: {address}")
            return False
        print_success(f"✓ v2: contact.address = '{address}'")
        
        if phone != '+48 787 147 007':
            print_error(f"Wrong phone: {phone}")
            return False
        print_success(f"✓ v2: contact.phone = '{phone}'")
        
        # Verify v3 migration: about.image
        print_info("Verifying v3 migration (about.image)...")
        about_image = data.get('about', {}).get('image', '')
        if about_image != '/about.jpg':
            print_error(f"Wrong about.image: {about_image}")
            return False
        print_success(f"✓ v3: about.image = '{about_image}'")
        
        # Verify v4 migration: gallery has exactly 5 items g1-g5 with orders 0-4
        print_info("Verifying v4 migration (5 gallery photos)...")
        response = requests.get(f"{API_URL}/gallery", timeout=10)
        gallery = response.json()
        
        if len(gallery) != 5:
            print_error(f"Gallery should have exactly 5 items, got {len(gallery)}")
            return False
        print_success(f"✓ v4: Gallery has exactly 5 items")
        
        expected_urls = ['/gallery/g1.jpg', '/gallery/g2.jpg', '/gallery/g3.jpg', '/gallery/g4.jpg', '/gallery/g5.jpg']
        actual_urls = [item.get('url') for item in gallery]
        if actual_urls != expected_urls:
            print_error(f"Gallery URLs wrong. Expected: {expected_urls}, Got: {actual_urls}")
            return False
        print_success(f"✓ v4: Gallery URLs are g1.jpg through g5.jpg")
        
        expected_orders = [0, 1, 2, 3, 4]
        actual_orders = [item.get('order') for item in gallery]
        if actual_orders != expected_orders:
            print_error(f"Gallery orders wrong. Expected: {expected_orders}, Got: {actual_orders}")
            return False
        print_success(f"✓ v4: Gallery orders are 0-4 ascending")
        
        # Verify menu is EMPTY (v2 cleared it)
        print_info("Verifying menu is empty (v2 cleared demo data)...")
        response = requests.get(f"{API_URL}/menu", timeout=10)
        menu = response.json()
        if len(menu) != 0:
            print_error(f"Menu should be empty, got {len(menu)} items")
            return False
        print_success(f"✓ v2: Menu is empty (demo data cleared)")
        
        # Verify reviews are seeded (3 items)
        print_info("Verifying reviews are seeded...")
        response = requests.get(f"{API_URL}/reviews", timeout=10)
        reviews = response.json()
        if len(reviews) != 3:
            print_error(f"Reviews should have 3 items, got {len(reviews)}")
            return False
        print_success(f"✓ Reviews: 3 items seeded")
        
        # Check meta.version = 4
        if not check_meta_version(4):
            print_error("meta.version is not 4")
            return False
        print_success(f"✓ meta.version = 4")
        
        print_success("Test 3 PASSED: Fresh DB migration chain v2->v3->v4 works correctly")
        return True
        
    except Exception as e:
        print_error(f"Test 3 FAILED: {str(e)}")
        return False

def test_gallery_crud():
    """Test 4: Gallery CRUD - POST new item gets order 5, persists, then DELETE"""
    print_test("Test 4: Gallery CRUD (POST/DELETE)")
    
    try:
        headers = {'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json'}
        
        # Verify current gallery has 5 items
        print_info("Checking current gallery state...")
        response = requests.get(f"{API_URL}/gallery", timeout=10)
        gallery = response.json()
        if len(gallery) != 5:
            print_error(f"Gallery should have 5 items before POST, got {len(gallery)}")
            return False
        print_success(f"Gallery has 5 items before POST")
        
        # POST new gallery item
        print_info("POST /api/gallery with new item...")
        gallery_data = {'url': '/gallery/test.jpg'}
        response = requests.post(f"{API_URL}/gallery", json=gallery_data, headers=headers, timeout=10)
        print_info(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Failed to create gallery item: {response.status_code}")
            return False
        
        created_item = response.json()
        item_id = created_item.get('id')
        item_order = created_item.get('order')
        
        if not item_id:
            print_error("No id in created gallery item")
            return False
        
        if item_order != 5:
            print_error(f"New item should have order 5, got {item_order}")
            return False
        print_success(f"New item created with id: {item_id}, order: {item_order}")
        
        # Verify item persists across repeated GETs (migration must NOT wipe or duplicate)
        print_info("Verifying item persists across repeated GETs...")
        for i in range(3):
            response = requests.get(f"{API_URL}/gallery", timeout=10)
            gallery = response.json()
            
            if len(gallery) != 6:
                print_error(f"Gallery should have 6 items, got {len(gallery)}")
                return False
            
            # Find the new item
            new_item = next((item for item in gallery if item.get('id') == item_id), None)
            if not new_item:
                print_error(f"New item not found in gallery")
                return False
            
            if new_item.get('order') != 5:
                print_error(f"New item order should be 5, got {new_item.get('order')}")
                return False
            
            print_success(f"Attempt {i+1}: Item persists (id: {item_id}, order: 5)")
            time.sleep(0.5)
        
        # DELETE the item
        print_info(f"DELETE /api/gallery/{item_id}...")
        response = requests.delete(f"{API_URL}/gallery/{item_id}", headers=headers, timeout=10)
        if response.status_code != 200:
            print_error(f"Failed to delete gallery item: {response.status_code}")
            return False
        print_success(f"Item deleted")
        
        # Verify back to 5 items
        print_info("Verifying gallery back to 5 items...")
        response = requests.get(f"{API_URL}/gallery", timeout=10)
        gallery = response.json()
        if len(gallery) != 5:
            print_error(f"Gallery should have 5 items after delete, got {len(gallery)}")
            return False
        print_success(f"Gallery back to 5 items after delete")
        
        print_success("Test 4 PASSED: Gallery CRUD works correctly (POST order 5, persists, DELETE)")
        return True
        
    except Exception as e:
        print_error(f"Test 4 FAILED: {str(e)}")
        return False

def test_homepage():
    """Test 5: GET / returns 200"""
    print_test("Test 5: Homepage")
    
    try:
        print_info(f"GET {BASE_URL}/...")
        response = requests.get(BASE_URL, timeout=15)
        print_info(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            return False
        
        html = response.text
        if 'Pan Królik' in html or 'pankrolik' in html.lower():
            print_success("Homepage contains 'Pan Królik' text")
        else:
            print_error("Homepage doesn't contain expected text")
            return False
        
        print_success("Test 5 PASSED: Homepage returns 200")
        return True
        
    except Exception as e:
        print_error(f"Test 5 FAILED: {str(e)}")
        return False

def main():
    print("\n" + "="*80)
    print("PAN KRÓLIK - DATA MIGRATION V4 TEST SUITE")
    print("Testing 5 real gallery photos and migration chain v2->v3->v4")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"API URL: {API_URL}")
    print(f"Database: {DB_NAME}")
    print(f"Admin Token: {ADMIN_TOKEN}")
    print("="*80)
    
    results = []
    
    # Run all tests
    results.append(("Test 1: Gallery 5 Items (g1-g5, orders 0-4, no duplication)", test_gallery_5_items()))
    results.append(("Test 2: Static Files (g1-g5.jpg, about.jpg, logo.png)", test_static_files()))
    results.append(("Test 3: CRITICAL - Fresh DB Migration Chain (v2->v3->v4)", test_fresh_db_migration_chain()))
    results.append(("Test 4: Gallery CRUD (POST order 5, DELETE)", test_gallery_crud()))
    results.append(("Test 5: Homepage", test_homepage()))
    
    # Print summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    passed = 0
    failed = 0
    
    for name, result in results:
        if result:
            print(f"✅ {name}")
            passed += 1
        else:
            print(f"❌ {name}")
            failed += 1
    
    print("="*80)
    print(f"TOTAL: {passed} passed, {failed} failed out of {len(results)} tests")
    print("="*80)
    
    if failed == 0:
        print("\n🎉 ALL TESTS PASSED! Migration v4 is working correctly.")
        print("Database left seeded with 5 gallery photos (g1-g5).")
        return 0
    else:
        print(f"\n⚠️  {failed} test(s) failed. Please review the errors above.")
        return 1

if __name__ == "__main__":
    exit(main())
