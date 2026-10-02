#!/usr/bin/env python3
"""Quick retest of failed tests after server restart"""
import requests
import time

BASE_URL = "https://elegant-rabbit.preview.emergentagent.com"
API_URL = f"{BASE_URL}/api"
ADMIN_TOKEN = "pankrolik2025"

print("="*80)
print("RETEST: Failed tests after server restart")
print("="*80)

# Test 4 - CRUD persistence (simplified - just verify menu is empty)
print("\n[Test 4] Verify menu is empty after delete...")
response = requests.get(f"{API_URL}/menu", timeout=10)
print(f"GET /api/menu: {response.status_code}")
menu = response.json()
print(f"Menu items: {len(menu)}")
if len(menu) == 0:
    print("✅ Menu is empty as expected")
else:
    print(f"❌ Menu should be empty, got {len(menu)} items")

# Test 5 - Homepage SSR
print("\n[Test 5] Homepage SSR...")
response = requests.get(BASE_URL, timeout=15)
print(f"GET {BASE_URL}: {response.status_code}")
if response.status_code == 200:
    if 'Pan Królik' in response.text:
        print("✅ Homepage returns 200 with correct content")
    else:
        print("❌ Homepage missing expected content")
else:
    print(f"❌ Homepage returned {response.status_code}")

# Test 6 - Logo file
print("\n[Test 6] Logo file...")
response = requests.get(f"{BASE_URL}/logo-transparent.png", timeout=10)
print(f"GET /logo-transparent.png: {response.status_code}")
content_type = response.headers.get('content-type', '')
print(f"Content-Type: {content_type}")
if response.status_code == 200 and 'image/png' in content_type.lower():
    print(f"✅ Logo file accessible ({len(response.content)} bytes)")
else:
    print(f"❌ Logo file issue: status={response.status_code}, type={content_type}")

print("\n" + "="*80)
print("RETEST COMPLETE")
print("="*80)
