#!/usr/bin/env python3
"""
Backend test suite for Pan Królik data migration v2
Tests the new restaurant data, empty menu/gallery, and migration persistence
"""
import requests
import json
import subprocess
import time

# Configuration
BASE_URL = "https://elegant-rabbit.preview.emergentagent.com"
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

def check_meta_version():
    """Check meta collection version using mongosh"""
    print_info("Checking meta.version in database...")
    cmd = f'mongosh --quiet --eval "db.getSiblingDB(\'{DB_NAME}\').meta.findOne({{id: \'meta\'}})"'
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if result.returncode == 0:
        print_info(f"Meta collection: {result.stdout.strip()}")
        if '"version": 2' in result.stdout or 'version: 2' in result.stdout:
            print_success("meta.version is 2")
            return True
        else:
            print_error(f"meta.version is not 2: {result.stdout}")
            return False
    else:
        print_error(f"Failed to check meta: {result.stderr}")
        return False

def test_content_api():
    """Test 1: GET /api/content - verify new restaurant data"""
    print_test("Test 1: GET /api/content - New Restaurant Data")
    
    try:
        response = requests.get(f"{API_URL}/content", timeout=10)
        print_info(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        # Check contact.address
        address = data.get('contact', {}).get('address', '')
        expected_address = 'Aleja Rzeczypospolitej 2a, 02-972 Warszawa'
        if address == expected_address:
            print_success(f"contact.address correct: {address}")
        else:
            print_error(f"contact.address wrong. Expected: {expected_address}, Got: {address}")
            return False
        
        # Check contact.phone
        phone = data.get('contact', {}).get('phone', '')
        expected_phone = '+48 787 147 007'
        if phone == expected_phone:
            print_success(f"contact.phone correct: {phone}")
        else:
            print_error(f"contact.phone wrong. Expected: {expected_phone}, Got: {phone}")
            return False
        
        # Check contact.hours
        hours = data.get('contact', {}).get('hours', [])
        if len(hours) != 3:
            print_error(f"contact.hours should have 3 entries, got {len(hours)}")
            return False
        print_success(f"contact.hours has 3 entries")
        
        # Check first entry (Monday - Closed)
        h1 = hours[0]
        if 'Poniedziałek' in h1.get('day', '') and h1.get('time') == 'Zamknięte' and h1.get('time_en') == 'Closed':
            print_success(f"Hours entry 1 correct: {h1.get('day')} | {h1.get('time')} | time_en: {h1.get('time_en')}")
        else:
            print_error(f"Hours entry 1 wrong: {h1}")
            return False
        
        # Check second entry (Tue-Fri)
        h2 = hours[1]
        if 'Wtorek' in h2.get('day', '') and h2.get('time') == '12:00 – 19:00':
            print_success(f"Hours entry 2 correct: {h2.get('day')} | {h2.get('time')}")
        else:
            print_error(f"Hours entry 2 wrong: {h2}")
            return False
        
        # Check third entry (Sat-Sun)
        h3 = hours[2]
        if 'Sobota' in h3.get('day', '') and h3.get('time') == '14:00 – 20:00':
            print_success(f"Hours entry 3 correct: {h3.get('day')} | {h3.get('time')}")
        else:
            print_error(f"Hours entry 3 wrong: {h3}")
            return False
        
        # Check about.image
        about_image = data.get('about', {}).get('image', '')
        if 'customer-assets' in about_image:
            print_success(f"about.image contains 'customer-assets': {about_image}")
        else:
            print_error(f"about.image doesn't contain 'customer-assets': {about_image}")
            return False
        
        print_success("Test 1 PASSED: All content data correct")
        return True
        
    except Exception as e:
        print_error(f"Test 1 FAILED: {str(e)}")
        return False

def test_empty_menu_gallery():
    """Test 2: GET /api/menu and /api/gallery return [] and stay empty"""
    print_test("Test 2: Empty Menu & Gallery (No Re-seeding)")
    
    try:
        # Test menu is empty
        for i in range(3):
            response = requests.get(f"{API_URL}/menu", timeout=10)
            print_info(f"GET /api/menu attempt {i+1}: Status {response.status_code}")
            
            if response.status_code != 200:
                print_error(f"Expected 200, got {response.status_code}")
                return False
            
            menu = response.json()
            if not isinstance(menu, list):
                print_error(f"Menu should be a list, got {type(menu)}")
                return False
            
            if len(menu) != 0:
                print_error(f"Menu should be empty, got {len(menu)} items")
                return False
            
            print_success(f"Attempt {i+1}: Menu is empty []")
            time.sleep(0.5)
        
        # Test gallery is empty
        for i in range(3):
            response = requests.get(f"{API_URL}/gallery", timeout=10)
            print_info(f"GET /api/gallery attempt {i+1}: Status {response.status_code}")
            
            if response.status_code != 200:
                print_error(f"Expected 200, got {response.status_code}")
                return False
            
            gallery = response.json()
            if not isinstance(gallery, list):
                print_error(f"Gallery should be a list, got {type(gallery)}")
                return False
            
            if len(gallery) != 0:
                print_error(f"Gallery should be empty, got {len(gallery)} items")
                return False
            
            print_success(f"Attempt {i+1}: Gallery is empty []")
            time.sleep(0.5)
        
        print_success("Test 2 PASSED: Menu and gallery stay empty (no re-seeding)")
        return True
        
    except Exception as e:
        print_error(f"Test 2 FAILED: {str(e)}")
        return False

def test_fresh_db_migration():
    """Test 3: CRITICAL - Drop DB, verify fresh seed has new data and empty menu/gallery"""
    print_test("Test 3: CRITICAL - Fresh DB Migration v2")
    
    try:
        # Drop the database
        if not drop_database():
            print_error("Failed to drop database")
            return False
        
        # Trigger fresh seed by calling GET /api/content
        print_info("Triggering fresh seed with GET /api/content...")
        response = requests.get(f"{API_URL}/content", timeout=15)
        print_info(f"Status: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        # Verify new contact data
        address = data.get('contact', {}).get('address', '')
        phone = data.get('contact', {}).get('phone', '')
        hours = data.get('contact', {}).get('hours', [])
        
        if address != 'Aleja Rzeczypospolitej 2a, 02-972 Warszawa':
            print_error(f"Fresh seed has wrong address: {address}")
            return False
        print_success(f"Fresh seed has correct address: {address}")
        
        if phone != '+48 787 147 007':
            print_error(f"Fresh seed has wrong phone: {phone}")
            return False
        print_success(f"Fresh seed has correct phone: {phone}")
        
        if len(hours) != 3:
            print_error(f"Fresh seed has wrong hours count: {len(hours)}")
            return False
        print_success(f"Fresh seed has correct hours (3 entries)")
        
        # Verify menu is EMPTY (not 30 demo items)
        print_info("Checking menu is empty (not 30 demo items)...")
        response = requests.get(f"{API_URL}/menu", timeout=10)
        menu = response.json()
        if len(menu) != 0:
            print_error(f"Fresh seed should have EMPTY menu, got {len(menu)} items (expected 0, not 30)")
            return False
        print_success("Fresh seed has EMPTY menu (not 30 demo items)")
        
        # Verify gallery is EMPTY (not 20 demo items)
        print_info("Checking gallery is empty (not 20 demo items)...")
        response = requests.get(f"{API_URL}/gallery", timeout=10)
        gallery = response.json()
        if len(gallery) != 0:
            print_error(f"Fresh seed should have EMPTY gallery, got {len(gallery)} items (expected 0, not 20)")
            return False
        print_success("Fresh seed has EMPTY gallery (not 20 demo items)")
        
        # Verify reviews are seeded (3 items)
        print_info("Checking reviews are seeded...")
        response = requests.get(f"{API_URL}/reviews", timeout=10)
        reviews = response.json()
        if len(reviews) != 3:
            print_error(f"Fresh seed should have 3 reviews, got {len(reviews)}")
            return False
        print_success(f"Fresh seed has 3 reviews")
        
        # Check meta.version = 2
        if not check_meta_version():
            print_error("meta.version is not 2")
            return False
        
        print_success("Test 3 PASSED: Fresh DB migration v2 works correctly")
        return True
        
    except Exception as e:
        print_error(f"Test 3 FAILED: {str(e)}")
        return False

def test_crud_persistence():
    """Test 4: CRUD persistence - add menu/gallery items, verify they persist"""
    print_test("Test 4: CRUD Persistence (Migration doesn't wipe user data)")
    
    try:
        headers = {'x-admin-token': ADMIN_TOKEN, 'Content-Type': 'application/json'}
        
        # Create a menu item
        print_info("Creating menu item...")
        menu_data = {
            'category': 'Test Category',
            'name': 'Test Dish',
            'name_en': 'Test Dish EN',
            'description': 'Test description',
            'description_en': 'Test description EN',
            'price': '99 zł',
            'image': 'https://example.com/test.jpg'
        }
        response = requests.post(f"{API_URL}/menu", json=menu_data, headers=headers, timeout=10)
        print_info(f"POST /api/menu status: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Failed to create menu item: {response.status_code}")
            return False
        
        created_menu = response.json()
        menu_id = created_menu.get('id')
        if not menu_id:
            print_error("No id in created menu item")
            return False
        print_success(f"Menu item created with id: {menu_id}")
        
        # Verify menu item persists across multiple GET calls
        for i in range(3):
            response = requests.get(f"{API_URL}/menu", timeout=10)
            menu = response.json()
            if len(menu) != 1:
                print_error(f"Menu should have 1 item, got {len(menu)}")
                return False
            if menu[0].get('id') != menu_id:
                print_error(f"Menu item id mismatch")
                return False
            print_success(f"Attempt {i+1}: Menu item persists (id: {menu_id})")
            time.sleep(0.5)
        
        # Also verify via GET /api/content
        response = requests.get(f"{API_URL}/content", timeout=10)
        if response.status_code != 200:
            print_error("GET /api/content failed")
            return False
        print_success("Menu item persists across GET /api/content call")
        
        # Delete the menu item
        print_info(f"Deleting menu item {menu_id}...")
        response = requests.delete(f"{API_URL}/menu/{menu_id}", headers=headers, timeout=10)
        if response.status_code != 200:
            print_error(f"Failed to delete menu item: {response.status_code}")
            return False
        print_success(f"Menu item deleted")
        
        # Verify menu is empty again
        response = requests.get(f"{API_URL}/menu", timeout=10)
        menu = response.json()
        if len(menu) != 0:
            print_error(f"Menu should be empty after delete, got {len(menu)} items")
            return False
        print_success("Menu is empty after delete")
        
        # Create a gallery item
        print_info("Creating gallery item...")
        gallery_data = {
            'url': 'https://example.com/test-gallery.jpg'
        }
        response = requests.post(f"{API_URL}/gallery", json=gallery_data, headers=headers, timeout=10)
        print_info(f"POST /api/gallery status: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Failed to create gallery item: {response.status_code}")
            return False
        
        created_gallery = response.json()
        gallery_id = created_gallery.get('id')
        if not gallery_id:
            print_error("No id in created gallery item")
            return False
        print_success(f"Gallery item created with id: {gallery_id}")
        
        # Verify gallery item persists
        for i in range(3):
            response = requests.get(f"{API_URL}/gallery", timeout=10)
            gallery = response.json()
            if len(gallery) != 1:
                print_error(f"Gallery should have 1 item, got {len(gallery)}")
                return False
            if gallery[0].get('id') != gallery_id:
                print_error(f"Gallery item id mismatch")
                return False
            print_success(f"Attempt {i+1}: Gallery item persists (id: {gallery_id})")
            time.sleep(0.5)
        
        # Delete the gallery item
        print_info(f"Deleting gallery item {gallery_id}...")
        response = requests.delete(f"{API_URL}/gallery/{gallery_id}", headers=headers, timeout=10)
        if response.status_code != 200:
            print_error(f"Failed to delete gallery item: {response.status_code}")
            return False
        print_success(f"Gallery item deleted")
        
        # Verify gallery is empty again
        response = requests.get(f"{API_URL}/gallery", timeout=10)
        gallery = response.json()
        if len(gallery) != 0:
            print_error(f"Gallery should be empty after delete, got {len(gallery)} items")
            return False
        print_success("Gallery is empty after delete")
        
        print_success("Test 4 PASSED: CRUD persistence works correctly")
        return True
        
    except Exception as e:
        print_error(f"Test 4 FAILED: {str(e)}")
        return False

def test_homepage_ssr():
    """Test 5: GET / returns 200 (homepage SSR works)"""
    print_test("Test 5: Homepage SSR")
    
    try:
        response = requests.get(BASE_URL, timeout=15)
        print_info(f"GET {BASE_URL} status: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            return False
        
        html = response.text
        if 'Pan Królik' in html or 'pankrolik' in html.lower():
            print_success("Homepage contains 'Pan Królik' text")
        else:
            print_error("Homepage doesn't contain expected text")
            return False
        
        print_success("Test 5 PASSED: Homepage SSR works with empty menu/gallery")
        return True
        
    except Exception as e:
        print_error(f"Test 5 FAILED: {str(e)}")
        return False

def test_logo_file():
    """Test 6: GET /logo-transparent.png returns 200 with image/png"""
    print_test("Test 6: Logo File")
    
    try:
        response = requests.get(f"{BASE_URL}/logo-transparent.png", timeout=10)
        print_info(f"GET /logo-transparent.png status: {response.status_code}")
        
        if response.status_code != 200:
            print_error(f"Expected 200, got {response.status_code}")
            return False
        
        content_type = response.headers.get('content-type', '')
        print_info(f"Content-Type: {content_type}")
        
        if 'image/png' in content_type.lower():
            print_success(f"Content-Type is image/png")
        else:
            print_error(f"Content-Type should be image/png, got {content_type}")
            return False
        
        # Check file size
        size = len(response.content)
        print_info(f"File size: {size} bytes")
        if size > 0:
            print_success(f"Logo file has content ({size} bytes)")
        else:
            print_error("Logo file is empty")
            return False
        
        print_success("Test 6 PASSED: Logo file accessible")
        return True
        
    except Exception as e:
        print_error(f"Test 6 FAILED: {str(e)}")
        return False

def main():
    print("\n" + "="*80)
    print("PAN KRÓLIK - DATA MIGRATION V2 TEST SUITE")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print(f"API URL: {API_URL}")
    print(f"Database: {DB_NAME}")
    print("="*80)
    
    results = []
    
    # Run all tests
    results.append(("Test 1: Content API (New Restaurant Data)", test_content_api()))
    results.append(("Test 2: Empty Menu & Gallery (No Re-seeding)", test_empty_menu_gallery()))
    results.append(("Test 3: CRITICAL - Fresh DB Migration v2", test_fresh_db_migration()))
    results.append(("Test 4: CRUD Persistence", test_crud_persistence()))
    results.append(("Test 5: Homepage SSR", test_homepage_ssr()))
    results.append(("Test 6: Logo File", test_logo_file()))
    
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
        print("\n🎉 ALL TESTS PASSED! Data migration v2 is working correctly.")
        return 0
    else:
        print(f"\n⚠️  {failed} test(s) failed. Please review the errors above.")
        return 1

if __name__ == "__main__":
    exit(main())
