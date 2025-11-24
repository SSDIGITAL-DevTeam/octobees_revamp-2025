# 🧪 Octobees API End-to-End Testing Flow

This guide outlines the complete testing flow from a new Affiliate application to fully utilizing the Partner Portal, using the provided Postman collection.

## 📋 Prerequisites

1.  **Import Postman Collection:** Ensure `Octobees-API-Complete.postman_collection.json` is imported into Postman.
2.  **Environment:** Ensure your API is running (`npm run dev`).
3.  **Base URL:** The collection uses `{{base_url}}` variable, defaulting to `http://localhost:8080/api`.

---

## 🔄 Flow 1: The Full Cycle (New Partner)

This flow simulates a real-world scenario where a user applies, gets approved, and then accesses the portal.

### 1. Affiliate Registration (Public)
*   **Folder:** `🤝 Affiliate > Applications`
*   **Request:** `Submit Application`
*   **Action:** Send the request.
*   **Body:**
    ```json
    {
      "fullName": "New Partner",
      "email": "newpartner@example.com",
      "phone": "+62812345678",
      "country": "Indonesia",
      "strategy": "SEO Expert",
      "motivation": "Join the best"
    }
    ```
*   **Result:** You get a `201 Created` response. The application is now **Pending**.

### 2. Back Office Approval (Admin)
*   **Folder:** `🔐 Authentication`
    *   **Request:** `Login (Back Office)`
    *   **Action:** Send request with `admin@octobees.com` / `password123`.
    *   **Note:** This automatically saves the `jwt_token` for subsequent Back Office requests.

*   **Folder:** `🏢 Back Office > Affiliate (BO)`
    *   **Request:** `Get All Applications`
    *   **Action:** Send request. Find the `id` of the application you just created (look for `newpartner@example.com`).
    *   **Request:** `Approve Application`
    *   **Action:** Replace `:id` in the URL with the application ID. Send request.
    *   **Result:** Application status becomes **Approved**. An Affiliate User is created.
    *   **Important:** In a real scenario, the user receives an email with a temp password. For testing, the system might log it or you can use the "Forgot Password" flow, OR simply use the seeded test user for the next steps.

### 3. Affiliate/Partner Login
*   **Folder:** `🤝 Affiliate > Auth`
*   **Request:** `Login`
*   **Action:** Send request.
    *   **Credentials:** If you used the flow above, you'd need the temp password.
    *   **EASIER WAY:** Use the **Seeded Test User**:
        *   Email: `testpartner@example.com`
        *   Password: `password123`
*   **Result:** You get a `200 OK` response with a token.
*   **Note:** This automatically saves the `affiliate_token` for all Partner Portal requests.

### 4. Partner Portal Usage
Now that you are logged in as a Partner (Affiliate), you can access the portal features.

*   **Folder:** `🎯 Partner Portal > Dashboard`
    *   **Requests:** `Get Stats`, `Get Services`, `Get Commissions`, `Get Recent Leads`.
    *   **Action:** Send these to see the dashboard data.

*   **Folder:** `🎯 Partner Portal > Leads`
    *   **Request:** `Create Lead`
    *   **Body:**
        ```json
        {
          "name": "Potential Client",
          "email": "client@company.com",
          "phone": "+62899999",
          "serviceId": "SERVICE_ID_FROM_DASHBOARD",
          "projectValue": 10000000
        }
        ```
    *   **Request:** `Get All Leads` to see your list.

*   **Folder:** `🎯 Partner Portal > Profile`
    *   **Request:** `Get Profile` to see your details.
    *   **Request:** `Update Profile` to change your info.

---

## 🚀 Flow 2: Quick Test (Existing Partner)

If you just want to test the Partner Portal endpoints without creating a new user every time:

1.  **Login:**
    *   Go to `🤝 Affiliate > Auth > Login`.
    *   Use `testpartner@example.com` / `password123`.
    *   Send Request.
2.  **Test:**
    *   Go directly to `🎯 Partner Portal` folder and run any request. The token is already set!
