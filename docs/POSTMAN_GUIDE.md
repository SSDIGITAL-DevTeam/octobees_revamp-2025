# Octobees API - Complete Postman Collection Guide

## 📥 Import ke Postman

1. Buka Postman
2. Klik **Import** di pojok kiri atas
3. Pilih file `Octobees-API-Complete.postman_collection.json`
4. Collection akan muncul di sidebar dengan 100+ endpoints

## 📚 Collection Structure

Collection ini berisi **SEMUA** endpoint yang ada di api-backend:

### 🔐 Authentication (6 endpoints)
- Login (Back Office) - Auto-save JWT token
- Affiliate Login - Auto-save affiliate token
- Logout
- Refresh Token
- Forgot Password
- Reset Password
> Semua endpoint POST sudah dilengkapi contoh body di koleksi (lihat tab Body).

### 📝 Blog (6 endpoints)
- Get All Blogs
- Get Blog by ID
- Create Blog (with image upload)
- Update Blog (PUT & PATCH)
- Delete Blog

### 📁 Blog Category (5 endpoints)
- CRUD operations for blog categories

### 💼 Career (5 endpoints)
- Job application management
- Submit, view, update, delete applications

### 📌 Position (5 endpoints)
- Job position management

### 📧 Subscription (3 endpoints)
- Newsletter subscription management

### 🛍️ Service Category (5 endpoints)
- Service category CRUD operations

### 📦 Service Plan (5 endpoints)
- Service plan management with pricing

### 🛒 Order (3 endpoints)
- Order management
- Create and view orders

### 👥 User (6 endpoints)
- User management
- CRUD operations with PUT & PATCH

### 📄 Page (5 endpoints)
- CMS page management

### 🏷️ Meta Tags (5 endpoints)
- SEO meta tag management

### 🤝 Affiliate (8 endpoints)
**Auth:**
- Login
- Change Password
- Forgot Password

**Dashboard:**
- Get Profile
- Get Stats
- Get Transactions
- Get Referrals

**Applications:**
- Submit Application
 - Resend Approval Email (BO)
 - Review/Update/Delete Application (BO)

### 🎯 Partner Portal (13 endpoints)
**Dashboard:**
- Get Stats
- Get Services
- Get Commissions (paginated)
- Get Recent Leads

**Leads:**
- Get All Leads (paginated)
- Get Lead by ID
- Create Lead
- Update Lead
- Delete Lead

**Profile:**
- Get Profile
- Update Profile
- Change Email

### 🧭 Partner Management (Back Office)
**Partner Management:**
- List partners (search, pagination)
- Get partner detail
- Update partner (PATCH)
- Delete partner

**Leads Management:** ⭐ NEW (folder terpisah di Partner BO)
- Get All Leads (with pagination)
- Get All Leads (with search)
- Get All Leads (filter by status)
- Get Lead by ID
- Update Lead
- Update Lead Status
- Delete Lead

**Commission Control (Services):** ⭐ NEW (folder terpisah di Partner BO)
- Get All Services
- Get Service by ID
- Create Service
- Update Service
- Delete Service

### 🏢 Back Office (11+ endpoints)
Admin endpoints for:
- Blog management
- User management
- Meta management
- Page management
- Career management
- Position management
- Service category management
- Service plan management
- Order management
- Affiliate application management
  - Approve/Reject applications
  - Get stats
  - Export CSV

---

## 🔧 Setup & Configuration

### Collection Variables
Collection sudah dikonfigurasi dengan variables:
- `base_url`: `http://localhost:8080/api`
- `jwt_token`: (auto-filled setelah login back office)
- `affiliate_token`: (auto-filled setelah affiliate login)

### Auto-Save Tokens
Login endpoints sudah dikonfigurasi untuk **otomatis menyimpan** JWT token ke collection variables.

---

## 🚀 Quick Start Guide

### 1. Back Office / Admin
```
1. Jalankan "Login (Back Office)"
2. Token otomatis tersimpan
3. Test endpoint lain (Blog, User, Order, dll)
```

### 2. Affiliate Portal
```
1. Jalankan "Affiliate Login"
2. Token otomatis tersimpan ke affiliate_token
3. Test Affiliate Dashboard endpoints
```

### 3. Partner Portal
```
1. Login menggunakan "Affiliate Login" (partner = approved affiliate)
2. Test Partner Portal endpoints (Dashboard, Leads, Profile)
```

### 4. Public Endpoints
Beberapa endpoint tidak memerlukan authentication:
- Get All Blogs
- Get Blog by ID
- Get All Positions
- Get Service Categories
- Get Service Plans
- Submit Order
- Submit Career Application
- Subscribe to Newsletter

---

## 📋 Endpoint Categories

### End User Endpoints (`/v1/*`)
Endpoint untuk public/frontend:
- Blog, Career, Position
- Service Category, Service Plan
- Order, Subscription
- Page, Meta Tags

### Affiliate Endpoints (`/v1/affiliate/*`)
Endpoint untuk affiliate users:
- Authentication
- Dashboard (stats, transactions, referrals)
- Application submission

### Partner Endpoints (`/v1/partner/*`)
Endpoint untuk partner portal:
- Dashboard (stats, services, commissions)
- Leads management (CRUD)
- Profile management

### Back Office Endpoints (`/v1/back-office/*`)
Endpoint untuk admin:
- Semua resource management
- Affiliate application approval
- Advanced operations

---

## 💡 Tips Penggunaan

1. **Login Terlebih Dahulu**
   - Back Office: Gunakan "Login (Back Office)"
   - Affiliate/Partner: Gunakan "Affiliate Login"

2. **Token Expires**
   - JWT token expires dalam beberapa jam
   - Login ulang jika mendapat 401 Unauthorized

3. **File Upload**
   - Endpoint Blog menggunakan `multipart/form-data`
   - Upload image via form-data field

4. **Pagination**
   - Partner endpoints support pagination
   - Gunakan query params `page` dan `limit`

5. **Path Variables**
   - Ganti `:id` dengan ID yang valid
   - Contoh: `/v1/blog/blog-123`

6. **Testing Flow**
   ```
   Login → Get Resources → Create → Update → Delete
   ```

---

## 🎯 Common Use Cases

### Create Blog Post
```
1. Login (Back Office)
2. Create Blog
   - Upload image
   - Set title, content, slug
   - Set category
3. Verify: Get All Blogs
```

### Manage Partner Leads
```
1. Affiliate Login
2. Get Dashboard Stats
3. Get Available Services
4. Create Lead
5. Update Lead Status
6. Get Commission History
```

### Approve Affiliate Application
```
1. Login (Back Office)
2. Get All Applications (Back Office)
3. Get Application by ID
4. Approve Application
5. Verify: Get Stats
```

### Manage Leads (Back Office) ⭐ NEW
```
1. Login (Back Office)
2. Get All Leads
   - Use pagination: ?page=1&limit=10
   - Search: ?search=john
   - Filter by status: ?status=Lead Created
3. Get Lead by ID (view details)
4. Update Lead Status
   - Change status to "Follow-up", "Proposal Sent", etc.
   - Add remark/notes
5. Update Lead Information
   - Update contact details
   - Update project value
6. Delete Lead (if needed)
```

---

## 📊 Total Endpoints

| Category | Count |
|----------|-------|
| Authentication | 6 |
| Blog | 6 |
| Blog Category | 5 |
| Career | 5 |
| Position | 5 |
| Subscription | 3 |
| Service Category | 5 |
| Service Plan | 5 |
| Order | 3 |
| User | 6 |
| Page | 5 |
| Meta Tags | 5 |
| Affiliate | 8 |
| Partner Portal | 13 |
| Back Office - Partner Mgmt | 4 |
| Back Office - Leads Mgmt ⭐ | 7 |
| Back Office - Services Mgmt ⭐ | 5 |
| Back Office - Other | 11+ |
| **TOTAL** | **102+** |

---

## ✅ Ready to Use!

Collection lengkap dengan **102+ endpoints** sudah siap digunakan untuk:
- Development & Testing
- API Documentation
- Integration Testing
- QA Testing
- Demo & Presentation

**Happy Testing! 🚀**
