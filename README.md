# Prostore - Modern E-commerce Store

A modern e-commerce store built with Next.js 15, TypeScript, Prisma, NextAuth.js, and Tailwind CSS.

## 🚀 Features

- **Authentication**: Sign in/Sign up with NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Shadcn UI components
- **Styling**: Tailwind CSS
- **Type Safety**: Full TypeScript support
- **User Management**: Role-based authentication (Admin/User)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd first-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:6543/prostore"

# NextAuth
NEXTAUTH_SECRET=xmVpackzg9sdkEBzJsGse3rosvkUY+4ni2quxvoK6Go=
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_URL_INTERNAL=http://localhost:3000

# App
NEXT_PUBLIC_APP_NAME=Prostore
NEXT_PUBLIC_APP_DESCRIPTION=A modern store built with Next.js
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
LATEST_PRODUCTS_LIMIT=4
```

### 4. Start the database

Start PostgreSQL using Docker Compose:

```bash
docker-compose up -d
```

This will start a PostgreSQL database on port `6543`.

### 5. Set up the database

Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma db push
```

### 6. Seed the database with sample data

Run the seed script to populate the database with sample users and products:

```bash
npx tsx db/seed.ts
```

This will create:
- **2 sample users**:
  - Admin user: `admin@example.com` / `123456` (Role: ADMIN)
  - Regular user: `jane@example.com` / `123456` (Role: USER)
- **Sample products** for testing

### 7. Start the development server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 🧪 Testing Authentication

### Test Users

After seeding the database, you can test authentication with these accounts:

#### Admin Account
- **Email**: `admin@example.com`
- **Password**: `123456`
- **Role**: ADMIN

#### Regular User Account
- **Email**: `jane@example.com`
- **Password**: `123456`
- **Role**: USER

### Authentication Flow

1. **Sign Up**: Create a new account at `/sign-up`
2. **Sign In**: Login with existing account at `/sign-in`
3. **User Profile**: Click on your avatar to see dropdown menu
4. **Sign Out**: Click "Log out" in the dropdown menu

## 📁 Project Structure

```
first-project/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   │   ├── sign-in/       # Sign in page
│   │   └── sign-up/       # Sign up page
│   ├── api/               # API routes
│   │   └── auth/          # NextAuth.js API routes
│   └── (root)/            # Main application pages
├── components/            # React components
│   ├── shared/            # Shared components
│   │   ├── header/        # Header components
│   │   └── user-profile.tsx
│   └── ui/                # Shadcn UI components
├── db/                    # Database related files
│   ├── prisma.ts          # Prisma client
│   ├── sample-data.ts     # Sample data
│   └── seed.ts            # Database seeding script
├── lib/                   # Utility libraries
│   ├── actions/           # Server actions
│   ├── constants/          # App constants
│   └── utils.ts           # Utility functions
├── prisma/                # Prisma schema and migrations
└── public/                # Static assets
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx tsx db/seed.ts` - Seed database with sample data

## 🗄️ Database Management

### Prisma Studio

To view and manage your database data visually:

```bash
npx prisma studio
```

This will open Prisma Studio at [http://localhost:5555](http://localhost:5555).

### Database Schema

The main models in the database:

- **User**: User accounts with authentication
- **Product**: Product catalog
- **Account**: NextAuth.js account linking
- **Session**: NextAuth.js user sessions
- **VerificationToken**: NextAuth.js verification tokens

### Resetting the Database

To reset the database and reseed:

```bash
# Stop the database
docker-compose down

# Remove the database volume (optional - this will delete all data)
docker volume rm first-project_postgres_data

# Start the database again
docker-compose up -d

# Push schema and seed
npx prisma db push
npx tsx db/seed.ts
```

## 🚀 Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_SECRET="your-production-secret-key"
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_APP_NAME="Prostore"
NEXT_PUBLIC_SERVER_URL="https://your-domain.com"
```

### Build for Production

```bash
npm run build
npm run start
```

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure Docker is running
   - Check if PostgreSQL container is healthy: `docker-compose ps`
   - Verify DATABASE_URL in `.env.local`

2. **NextAuth Secret Error**
   - Make sure `NEXTAUTH_SECRET` is set in `.env.local`
   - Generate a new secret: `openssl rand -base64 32`

3. **Prisma Client Error**
   - Run `npx prisma generate` after schema changes
   - Restart the development server

4. **Port Already in Use**
   - Change the port in `package.json` or kill existing processes
   - For port 3000: `taskkill /f /im node.exe` (Windows)

### Getting Help

If you encounter any issues:

1. Check the terminal output for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check if the database is running and accessible

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Happy coding! 🎉**