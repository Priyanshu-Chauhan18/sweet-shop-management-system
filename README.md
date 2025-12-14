# Sweet Luxe - Premium Confectionery Platform

A modern, premium e-commerce platform for luxury sweets and chocolates. Built with Next.js 15, Supabase, and Tailwind CSS.

**Created by Priyanshu Chauhan**

🔗 **GitHub Repository**: [https://github.com/Priyanshu-Chauhan18/Sweet-Luxe](https://github.com/Priyanshu-Chauhan18/Sweet-Luxe)

---

## Overview

Sweet Luxe is a full-stack e-commerce application featuring:
- Beautiful dark theme with neon purple accents
- User authentication (Email/Password + Google OAuth)
- Product catalog with categories (Sweets & Chocolates)
- Admin dashboard for product management
- Secure checkout and purchase flow
- Responsive design for all devices

---

## Screenshots

### Home Page
![Home Page](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-14-at-21.34.41-1765728570981.png?width=8000&height=8000&resize=contain)
*Landing page featuring premium sweets and chocolates collection*

### Login Page
![Login Page](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-14-at-21.36.43-1765728585336.png?width=8000&height=8000&resize=contain)
*Secure authentication with email/password and Google OAuth*

### Register Page
![Register Page](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-14-at-21.36.36-1765728574623.png?width=8000&height=8000&resize=contain)
*User registration form with elegant dark theme*

### Dashboard
![Dashboard](https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Screenshot-2025-12-14-at-21.37.49-1765728575487.png?width=8000&height=8000&resize=contain)
*Browse and purchase products with real-time inventory*

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first styling |
| **Supabase** | Backend (Auth, Database, Storage) |
| **Shadcn/UI** | UI component library |
| **Lucide React** | Icon library |

---

## Test Report

### Running Tests

```bash
npm run test
# or
npm run test:watch
```

### Test Coverage

The application includes tests for:
- **API Routes**: All `/api/sweets`, `/api/auth`, and `/api/admin` endpoints
- **Authentication Flow**: Login, register, logout, password reset
- **Product Management**: CRUD operations for sweets/chocolates
- **Purchase Flow**: Stock management and transaction handling
- **Admin Features**: Product creation, updates, and deletion

Test results are generated in `./test-results/` directory.

---

## My AI Usage

### AI Tools Used

During the development of Sweet Luxe, I utilized **Orchids AI** as my primary development assistant:

#### How AI Helped:
1. **Code Refactoring**: Transformed the entire codebase from a basic template to a production-ready platform
2. **UI/UX Design**: Generated the premium dark theme with purple accents, animations, and glassmorphic effects
3. **Component Architecture**: Helped structure React components following Next.js 15 best practices
4. **API Development**: Assisted in creating RESTful API routes with proper error handling
5. **Authentication**: Guided implementation of Supabase Auth with email and OAuth providers
6. **Database Schema**: Designed and optimized database tables and relationships
7. **Security Practices**: Ensured proper environment variable usage and secret management
8. **Documentation**: Generated comprehensive README with setup instructions

#### AI Limitations & Human Contributions:
- **Business Logic**: All product categorization and pricing strategies were human-decided
- **Design Decisions**: Color schemes and branding were manually refined after AI suggestions
- **Testing**: Manual testing and edge case identification were human-driven
- **Environment Configuration**: Supabase project setup and credential management done manually
- **Deployment**: Production deployment decisions and optimizations were human-executed

#### Responsible AI Usage:
- AI was used as a **productivity tool**, not a replacement for understanding
- All AI-generated code was **reviewed, tested, and validated** before integration
- Security-sensitive code (authentication, payment handling) was **manually audited**
- AI suggestions were **critically evaluated** rather than blindly accepted

---

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm, yarn, pnpm, or bun
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd sweet-luxe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Configure environment variables**
   
   Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   
   # Optional: Google OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000)

---

## Database Setup (Supabase)

### Required Tables

**profiles** - User profiles
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**sweets** - Product catalog
```sql
CREATE TABLE sweets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

Create a public bucket named `product-images` for storing product images.

---

## Authentication Flow

1. **Registration**: Users register with email/password or Google OAuth
2. **Email Verification**: Confirmation email sent for email/password signups
3. **Login**: Users authenticate via email/password or Google
4. **Session**: JWT-based sessions managed by Supabase
5. **Protected Routes**: Dashboard and admin pages require authentication

---

## Admin Access

### Creating an Admin Account

1. Navigate to `/admin/setup`
2. Fill in your admin credentials
3. Click "Create Admin Account"
4. You'll be redirected to the admin dashboard

### Admin Features

- View all products
- Add new products with image upload
- Edit product details (name, price, stock, category)
- Delete products
- Real-time inventory management

### Manual Admin Setup (Database)

To manually set a user as admin:
1. Open Supabase Dashboard > Table Editor > `profiles`
2. Find the user by email
3. Set `role` to `admin`

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Auth callback
│   ├── dashboard/         # User dashboard
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── forgot-password/   # Password reset request
│   ├── reset-password/    # Password reset form
│   └── verify-email/      # Email verification
├── components/            # React components
│   └── ui/               # Shadcn/UI components
├── lib/                   # Utilities and helpers
│   ├── actions/          # Server actions
│   └── supabase/         # Supabase clients
└── hooks/                 # Custom React hooks
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key |
| `GOOGLE_CLIENT_ID` | No | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | No | Google OAuth client secret |
| `NEXT_PUBLIC_SITE_URL` | Yes | Your app's URL |

---

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with `npm run build && npm start`

---

## Security Notes

- All secrets stored in environment variables
- `.env.local` is gitignored
- Supabase RLS policies recommended for production
- Service role key only used server-side

---

## License

This project is proprietary software created by Priyanshu Chauhan.

---

## Contact

**Priyanshu Chauhan** - Project Owner & Developer

For questions or support, please open an issue on the repository.