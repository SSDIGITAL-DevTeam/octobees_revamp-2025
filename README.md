# Octobees Revamp 2025

> Modern, scalable web platform for Octobees - Complete rebuild with Partner Portal, Affiliate System, and Content Management.

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue.svg)](https://www.mysql.com/)

## 📋 Overview

Octobees Revamp 2025 is a complete platform consisting of:

- **🌐 Main Website**: Corporate website with blog, career portal, and service catalog
- **🎯 Partner Portal**: Dashboard for partners to manage leads and track commissions
- **🤝 Affiliate System**: Referral system with commission tracking
- **🏢 Back Office**: Admin panel to manage all resources
- **📱 API Backend**: RESTful API with 90+ endpoints

## 🏗️ Project Structure

```
octobees_revamp-2025/
├── api-backend/              # Backend API (Express.js + MySQL)
│   ├── src/
│   │   ├── affiliate/       # Affiliate system
│   │   ├── partner/         # Partner portal API
│   │   ├── blog/            # Blog management
│   │   ├── career/          # Career applications
│   │   ├── order/           # Order processing
│   │   └── ...              # Other modules
│   ├── drizzle/             # Database schema & migrations
│   ├── README.md            # Backend documentation
│   └── package.json
│
├── partner/                  # Partner Portal Frontend (React + TypeScript)
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom hooks
│   │   ├── pages/           # Page components
│   │   └── lib/             # Utilities
│   ├── README.md            # Frontend documentation
│   └── package.json
│
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **MySQL** 8.x
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SSDIGITAL-DevTeam/octobees_revamp-2025.git
   cd octobees_revamp-2025
   ```

2. **Setup Backend**
   ```bash
   cd api-backend
   npm install
   cp .env.example .env
   # Edit .env with your configuration
   npm run push          # Run database migrations
   npm run dev           # Start backend server
   ```

3. **Setup Partner Portal**
   ```bash
   cd partner
   npm install
   cp .env.example .env
   # Edit .env with API URL
   npm run dev           # Start frontend dev server
   ```

### Access Points

- **API Backend**: http://localhost:8080/api
- **Partner Portal**: http://localhost:5173
- **API Health Check**: http://localhost:8080/api/health

## 📚 Documentation

### Backend API
Comprehensive API documentation available in [`api-backend/README.md`](./api-backend/README.md)

**Key Features:**
- 90+ RESTful endpoints
- JWT authentication
- Role-based access control
- File upload support
- Rate limiting & security
- Comprehensive Postman collections

**Quick Links:**
- [API Documentation](./api-backend/README.md)
- [Database Schema](./api-backend/README.md#database-schema)
- [Postman Collections](./api-backend/POSTMAN_GUIDE.md)

### Partner Portal
Frontend documentation available in [`partner/README.md`](./partner/README.md)

**Key Features:**
- Modern React + TypeScript
- Tailwind CSS styling
- Responsive design
- Real-time dashboard
- Lead management system
- Commission tracking

## 🎯 Key Features

### 🤝 Partner Portal
- **Dashboard Analytics**: Real-time stats, pending commissions, conversion rates
- **Lead Management**: Full CRUD operations with status tracking
- **Service Catalog**: Browse available services with commission rates
- **Commission Tracking**: Detailed history with pagination
- **Profile Management**: Update profile and change email

### 🎁 Affiliate System
- **Application Management**: Submit and track affiliate applications
- **Referral Tracking**: Monitor clicks, signups, and conversions
- **Commission Calculation**: Automated commission processing
- **Dashboard**: View stats, transactions, and referrals

### 📝 Content Management
- **Blog System**: Full blog management with categories
- **Career Portal**: Job postings and applications
- **Service Catalog**: Service categories and pricing plans
- **SEO Management**: Meta tags and page optimization

### 🏢 Back Office
- **Resource Management**: Admin CRUD for all resources
- **User Management**: Manage admin users and permissions
- **Affiliate Approval**: Approve/reject affiliate applications
- **Analytics**: Statistics and CSV exports

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20.x
- **Framework**: Express.js 4.x
- **Database**: MySQL 8.x
- **ORM**: Drizzle ORM
- **Authentication**: JWT
- **File Storage**: Google Cloud Storage
- **Email**: Nodemailer

### Frontend (Partner Portal)
- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Icons**: Lucide React

### DevOps & Tools
- **Version Control**: Git
- **API Testing**: Postman
- **Database Migrations**: Drizzle Kit
- **Process Manager**: PM2 / Nodemon
- **Logging**: Pino

## 📊 Database Schema

### Core Tables
- **Users & Auth**: `user`, `affiliate_user`, `affiliate_application`
- **Affiliate**: `affiliate_referral`, `affiliate_transaction`
- **Partner**: `partner_service`, `partner_lead`, `partner_commission`
- **Content**: `blog`, `blog_category`, `page`, `metas`
- **Business**: `order`, `career`, `position`, `subscription`

See [Database Documentation](./api-backend/README.md#database-schema) for detailed schema.

## 🧪 Testing

### Backend Testing
```bash
cd api-backend
npm test                              # Run all tests
node src/seeder/create-test-data.js   # Create test data
```

### Test Credentials
**Partner/Affiliate:**
- Email: `testpartner@example.com`
- Password: `password123`

**Back Office:**
- Email: `admin@octobees.com`
- Password: `password123`

### API Testing
Import Postman collections from `api-backend/`:
- `Octobees-API-Complete.postman_collection.json` - All 90+ endpoints
- `Partner-Portal-API.postman_collection.json` - Partner-specific endpoints

## 🚀 Deployment

### Backend Deployment

**Using PM2:**
```bash
cd api-backend
npm ci --production
npm run push              # Run migrations
pm2 start src/index.js --name octobees-api
pm2 save
```

**Using Docker:**
```bash
# Coming soon
```

### Frontend Deployment

**Build for Production:**
```bash
cd partner
npm run build
# Deploy dist/ folder to hosting
```

**Environment Variables:**
```env
VITE_API_URL=https://api.octobees.com/api
```

## 📝 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `fitry` - Development branch
- `feature/*` - Feature branches

### Commit Convention
```
feat: Add new feature
fix: Bug fix
docs: Documentation
style: Code style
refactor: Code refactoring
test: Testing
chore: Maintenance
```

### Pull Request Process
1. Create feature branch from `main`
2. Make changes and commit
3. Push to GitHub
4. Create Pull Request to `main`
5. Wait for review and approval
6. Merge to `main`

## 🔒 Security

- **Authentication**: JWT with secure token storage
- **Password**: bcrypt hashing with salt
- **API**: Rate limiting (100 req/15min)
- **Headers**: Helmet security headers
- **CORS**: Configured allowed origins
- **Validation**: Input validation with Zod
- **SQL**: Protected by ORM (no raw queries)

## 📦 Available Scripts

### Backend (`api-backend/`)
```bash
npm run dev              # Start development server
npm run generate         # Generate database migration
npm run push            # Apply migrations to database
npm run studio          # Open Drizzle Studio
npm test                # Run tests
npm start               # Start production server
```

### Frontend (`partner/`)
```bash
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

See [Contributing Guidelines](./CONTRIBUTING.md) for more details.

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/SSDIGITAL-DevTeam/octobees_revamp-2025/issues)
- **Email**: dev@octobees.com
- **Documentation**: See README in each module

## 📄 License

Copyright © 2025 Octobees. All rights reserved.

## 🎉 Acknowledgments

Built with ❤️ by the **Octobees Development Team**

### Team
- **Backend**: API development, database design, authentication
- **Frontend**: Partner portal, UI/UX design
- **DevOps**: Deployment, CI/CD, monitoring

### Technologies
Special thanks to the amazing open-source projects:
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)

---

**Version**: 1.0.0  
**Last Updated**: November 2025  
**Status**: ✅ Production Ready

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Backend API with 90+ endpoints
- [x] Partner Portal frontend
- [x] Affiliate system
- [x] Database schema & migrations
- [x] Authentication & authorization
- [x] Postman collections
- [x] Documentation

### 🚧 In Progress
- [ ] Main website frontend
- [ ] Email notifications
- [ ] Advanced analytics

### 📅 Planned
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced reporting
- [ ] Multi-language support
- [ ] Docker deployment
- [ ] CI/CD pipeline

---

For detailed documentation, please refer to:
- [Backend Documentation](./api-backend/README.md)
- [Partner Portal Documentation](./partner/README.md)
