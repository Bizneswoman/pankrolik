#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: "Elegancka, premium strona restauracji Pan Kr\u00f3lik (butelkowa ziele\u0144 + z\u0142oto) z CMS-em opartym o MongoDB. Publiczna strona (hero, o nas, menu 30 poz., galeria, opinie, lokalizacja, kontakt) + panel administratora do edycji tre\u015bci/menu/galerii/opinii."

backend:
  - task: "Seed + GET /api/content, /api/menu, /api/gallery, /api/reviews"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Auto-seed on first request (30 menu items, 20 gallery, 3 reviews, 1 content doc id='site'). GET endpoints return data without _id. Fixed a MongoDB connection race condition with a shared clientPromise."
        -working: true
        -agent: "testing"
        -comment: "✅ All GET endpoints tested successfully. GET /api/content returns correct structure with hero, about, contact, social, footer, id='site', no _id. GET /api/menu returns 30 items with UUIDs. GET /api/gallery returns 20 items with UUIDs. GET /api/reviews returns 3 items with UUIDs. All responses properly exclude _id field and use UUID ids."
  - task: "Admin login POST /api/admin/login"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "Password check against ADMIN_PASSWORD (default 'pankrolik2025'). Returns {success, token}. Wrong password returns 401."
        -working: true
        -agent: "testing"
        -comment: "✅ Admin login tested successfully. Correct password ('pankrolik2025') returns 200 with {success:true, token:'pankrolik2025'}. Wrong password returns 401 with {success:false}. Authentication working as expected."
  - task: "Protected CRUD (content PUT, menu POST/PUT/DELETE, gallery POST/DELETE, reviews POST/PUT/DELETE) with x-admin-token"
    implemented: true
    working: true
    file: "app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "All mutations require header x-admin-token == ADMIN_PASSWORD, else 401. UUID ids used (no ObjectID). Verify create/update/delete flows and auth rejection."
        -working: true
        -agent: "testing"
        -comment: "✅ All protected CRUD operations tested successfully. Auth rejection verified: POST /api/menu and PUT /api/content without token return 401. Menu CRUD: Created item with UUID, updated successfully, deleted successfully. Gallery CRUD: Created item with UUID, deleted successfully. Reviews CRUD: Created item with UUID, updated successfully, deleted successfully. Content PUT: Updated successfully with token. All operations use UUIDs and require x-admin-token header."

frontend:
  - task: "Public site (SSR) + Admin panel"
    implemented: true
    working: "NA"
    file: "app/site-client.js, app/page.js, app/admin/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
        -working: "NA"
        -agent: "main"
        -comment: "SSR renders full content. Not yet tested by automation (awaiting user permission)."

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 0
  run_ui: false

test_plan:
  current_focus:
    - "Seed + GET /api/content, /api/menu, /api/gallery, /api/reviews"
    - "Admin login POST /api/admin/login"
    - "Protected CRUD (content PUT, menu POST/PUT/DELETE, gallery POST/DELETE, reviews POST/PUT/DELETE) with x-admin-token"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
    -agent: "main"
    -message: "Please test all backend API endpoints. Base URL is the public origin + /api. Admin password is 'pankrolik2025' (sent via header x-admin-token for mutations, and in body {password} for /api/admin/login). Verify: (1) GET endpoints return seeded data, (2) login success/failure, (3) mutations succeed WITH token and are rejected 401 WITHOUT token, (4) create then delete a menu item / gallery / review round trip. Do NOT worry about UI."
    -agent: "testing"
    -message: "✅ Backend testing complete - ALL TESTS PASSED (10/10). All GET endpoints return correct data with UUIDs and no _id leaks. Admin login works correctly with success/failure cases. All mutations properly require authentication (401 without token). All CRUD operations (menu, gallery, reviews, content) work correctly with token. No critical issues found. Backend API is fully functional and ready for production."

backend:
  - task: "Empty-DB self-heal: auto-seed on SSR (lib/data.js + shared lib/seed.js)"
    implemented: true
    working: true
    file: "/app/lib/data.js, /app/lib/seed.js, /app/app/api/[[...path]]/route.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "User reported client-side exception on deployed site because new Atlas DB was empty. Root cause: lib/data.js (SSR) fetched from DB without seeding, returning content:null which crashed site-client. Fix: extracted seed data (DEFAULT_CONTENT, mkMenu, mkGallery, mkReviews, ensureSeed) from route.js into shared /app/lib/seed.js; route.js now imports ensureSeed from there (no behavior change intended); lib/data.js now calls ensureSeed(db) before fetching AND falls back to in-memory defaults if DB is unreachable/empty. Manually verified: dropped local DB, homepage returned 200 and DB re-seeded (content:1, menu:30, gallery:20, reviews:3). Also created standalone /app/scripts/seed-atlas.mjs (Atlas seeding blocked by Atlas IP allowlist - user action needed, not testable here)."
      - working: true
        agent: "testing"
        comment: "✅ ALL TESTS PASSED (12/12). REGRESSION TESTS (10/10): All API endpoints work correctly after refactor - GET /api/content returns correct structure with id='site' and no _id; GET /api/menu returns 30 items with UUIDs; GET /api/gallery returns 20 items with UUIDs; GET /api/reviews returns 3 items with UUIDs; Admin login works with correct/wrong password; Auth required on mutations (401 without token); All CRUD operations (menu, gallery, reviews, content) work with token. CRITICAL EMPTY-DB SELF-HEAL TESTS (2/2): Empty-DB Homepage Recovery - dropped DB, GET / returned 200 with real content ('Pan Królik' text present, no error page), collections auto re-seeded (content:1, menu:30, gallery:20, reviews:3); Empty-DB API Recovery - dropped DB, GET /api/menu returned 30 items, collections auto re-seeded. The bug fix is working perfectly - both SSR (lib/data.js) and API routes (route.js) correctly call ensureSeed() from shared /app/lib/seed.js, preventing empty-DB crashes."

test_plan:
  current_focus:
    - "Empty-DB self-heal: auto-seed on SSR (lib/data.js + shared lib/seed.js)"
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Refactored seed logic into /app/lib/seed.js shared by API route and SSR data layer. Please test: (1) all API endpoints still work (GET/PUT /api/content, CRUD /api/menu, /api/gallery, /api/reviews, POST /api/admin/login with password pankrolik2025), (2) empty-DB recovery: drop the local DB (mongosh: db.getSiblingDB(process DB_NAME from /app/.env = your_database_name).dropDatabase()), then GET homepage (http://localhost:3000/) must return 200 with full content (not an error page) and collections must be re-seeded automatically, (3) same empty-DB recovery via API: drop DB then GET /api/menu must return 30 items. Do NOT test the Atlas script (external network blocked)."
  - agent: "testing"
    message: "✅ Backend testing complete - ALL TESTS PASSED (12/12). REGRESSION: All 10 API endpoints work correctly after refactor (GET endpoints, admin login, auth protection, all CRUD operations). CRITICAL BUG FIX VERIFIED: Empty-DB self-heal works perfectly via both SSR homepage and API routes. Dropped DB twice and verified: (1) Homepage returns 200 with real content (no crash/error page), (2) API endpoints return correct data (30 menu, 20 gallery, 3 reviews), (3) Collections auto re-seed correctly. The refactor to shared /app/lib/seed.js is successful - both route.js and lib/data.js correctly call ensureSeed(). No critical issues found. Backend is fully functional and the reported bug is fixed."

frontend:
  - task: "Admin panel: fix broken Polish characters (raw \\uXXXX escapes in JSX) + verify full panel functionality"
    implemented: true
    working: true
    file: "/app/app/admin/page.js, /app/app/site-client.js, /app/lib/seed.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "User reported 'panel admina nie działa'. Found: JSX text nodes and attributes contained literal \\uXXXX escape sequences (e.g. 'Has\\u0142o' instead of 'Hasło') which render verbatim in JSX. Decoded all 314 escapes to real UTF-8 chars across admin/page.js (55), site-client.js (41), lib/seed.js (218). Login API verified working via curl (POST /api/admin/login with pankrolik2025 returns success). Needs UI verification: login flow, all 4 tabs render with correct Polish text, CRUD operations work."
      - working: true
        agent: "testing"
        comment: "✅ ALL TESTS PASSED - Unicode escape bug completely fixed. Comprehensive testing completed: (1) Login page displays correct Polish text ('Panel administratora', 'Zaloguj się, aby zarządzać treścią') with NO literal \\uXXXX sequences anywhere. (2) Wrong password shows error 'Nieprawidłowe hasło'. (3) Correct password 'pankrolik2025' logs in successfully. (4) Dashboard shows all 4 tabs with correct Polish text: 'Treść strony', 'Menu', 'Galeria', 'Opinie' - verified NO unicode escapes in any tab. (5) CRUD operations verified: Content edit saves with success toast 'Zapisano treść strony', Menu add/delete works (tested add→delete cycle), Reviews add/delete works (tested add→delete cycle). (6) Logout returns to login screen. (7) Public homepage displays correct Polish text with no unicode escapes, PL/EN language toggle works correctly ('Strona główna' switches to 'Home'). All 314 unicode escapes successfully decoded to proper UTF-8 Polish characters (ł, ą, ę, ć, ń, ó, ś, ź, ż). Admin panel is fully functional."

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Fixed mojibake (raw unicode escapes) in admin panel UI. Please run frontend UI test on http://localhost:3000/admin: (1) login page shows proper Polish ('Hasło', 'Zaloguj się'), (2) login with password pankrolik2025 succeeds and dashboard appears, (3) all 4 tabs (Treść strony, Menu, Galeria, Opinie) open and show correct Polish diacritics (no literal \\u sequences anywhere), (4) basic CRUD smoke: edit a content field and save (toast appears), add+delete a menu item, add+delete a review. (5) Also verify homepage http://localhost:3000/ still renders correctly (PL and EN toggle). Credentials in /app/memory/test_credentials.md."
  - agent: "testing"
    message: "✅ UNICODE BUG FIX VERIFIED - ALL TESTS PASSED. Tested admin panel at http://localhost:3000/admin with comprehensive test suite covering all requested scenarios. CRITICAL FIX CONFIRMED: Zero literal \\uXXXX unicode escape sequences found anywhere in the UI (tested login page, all 4 dashboard tabs, and public homepage). All Polish diacritics render correctly (ł, ą, ę, ć, ń, ó, ś, ź, ż). FUNCTIONALITY VERIFIED: Login/logout works, wrong password shows error, all 4 tabs render correctly, content edit saves with toast, menu add/delete works, review add/delete works, homepage PL/EN toggle works. The fix successfully decoded all 314 unicode escapes to proper UTF-8 characters. Admin panel is fully functional and ready for production. No critical issues found."

backend:
  - task: "Login resilient to DB outage: /api/admin/login handled before DB connect + better error messages in admin UI"
    implemented: true
    working: true
    file: "/app/app/api/[[...path]]/route.js, /app/app/admin/page.js"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "User reported 'wyskakuje błędne hasło' on production login. Local login verified fine, so root cause hypothesis: in production the DB is unreachable -> route handler ran connectToMongo+ensureSeed BEFORE login -> login returned 500 -> admin UI displayed generic 'Nieprawidłowe hasło'. Fix 1: moved /admin/login handling BEFORE DB connect in route.js (login now DB-independent). Fix 2: admin login UI now distinguishes 401 (wrong password) vs server/network errors with clear Polish messages. Manually verified: with mongodb stopped, POST /api/admin/login returns 200 success; wrong password returns 401; after mongo restart, /api/menu returns 200. Deployer debug of production env is running in parallel."
      - working: true
        agent: "testing"
        comment: "✅ ALL TESTS PASSED (3/3 test groups). CRITICAL BUG FIX VERIFIED: Login is now completely DB-independent and works perfectly during MongoDB outage. Test 1 - Normal Login (DB Running): Correct password returns 200 {success:true, token:'pankrolik2025'}, wrong password returns 401 {success:false, error}. Test 2 - CRITICAL DB Outage Resilience: Stopped MongoDB service, then verified login with correct password returns 200 {success:true, token} (CORE FIX WORKING!), wrong password returns 401, GET /api/menu times out during outage (expected behavior). Test 3 - Post-Outage Regression: Started MongoDB service, verified all endpoints work correctly - GET /api/menu returns 30 items, GET /api/content returns site content with id='site', GET /api/gallery returns 20 items, GET /api/reviews returns 3 items, menu CRUD with x-admin-token works (create/update/delete), protected routes without token return 401, homepage GET / returns 200 with real content ('Pan Królik' present). The refactor successfully moved /admin/login handling to lines 50-57 BEFORE connectToMongo() call (line 59), making login completely resilient to DB outages. This fixes the production issue where DB unreachability caused login to fail. MongoDB service confirmed running after tests."

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: "Please retest backend after login refactor: (1) POST /api/admin/login with pankrolik2025 -> 200 {success:true,token}; wrong password -> 401 {success:false}. (2) CRITICAL: stop mongodb (sudo supervisorctl stop mongodb), then POST /api/admin/login with correct password MUST still return 200 success; also GET /api/menu during outage should return 500 (expected). Then START mongodb back (sudo supervisorctl start mongodb) and verify GET /api/menu returns 30 items and full CRUD still works (menu add/update/delete with x-admin-token: pankrolik2025). (3) Regression: GET /api/content, /api/gallery, /api/reviews OK; homepage GET / returns 200. IMPORTANT: always restart mongodb at the end."
  - agent: "testing"
    message: "✅ DB OUTAGE RESILIENCE BUG FIX VERIFIED - ALL TESTS PASSED (3/3). The CRITICAL fix is working perfectly: admin login is now completely DB-independent and works even when MongoDB is down. Comprehensive testing completed: (1) Normal login works with correct/wrong password, (2) CRITICAL: During MongoDB outage, login with correct password returns 200 {success:true, token} and wrong password returns 401 - this proves the fix works!, (3) Post-outage regression: all endpoints (menu, content, gallery, reviews) return correct data, menu CRUD works with token, protected routes require auth, homepage returns 200 with real content. The refactor successfully moved /admin/login handling BEFORE DB connection in route.js (lines 50-57 before connectToMongo on line 59). This solves the production issue where DB unreachability caused login to show 'wrong password' errors. MongoDB service confirmed running after tests. No critical issues found."
