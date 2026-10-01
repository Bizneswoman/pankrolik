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
