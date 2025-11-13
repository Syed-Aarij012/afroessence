# Supabase Setup Instructions

## The Issue
Your Supabase backend is not connecting because either:
1. The Supabase project doesn't exist
2. The credentials are incorrect
3. The project URL is wrong

## How to Fix

### Option 1: Create a New Supabase Project
1. Go to https://supabase.com
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: "Salon Booking System"
   - Database Password: (create a strong password)
   - Region: Choose closest to you
6. Wait for project to be created (2-3 minutes)

### Option 2: Get Credentials from Existing Project
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy the following:
   - Project URL
   - Project API Key (anon/public)

## Update .env File
Replace the values in `.env` with your actual Supabase credentials:

```
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key-here"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

## Database Setup
After getting valid credentials, you'll need to run the SQL scripts in your project to set up the database tables:

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL files in this order:
   - `create-sample-data.sql`
   - `setup-admin.sql`
   - Any other SQL files as needed

## Test Connection
After updating credentials, restart the development server:
```bash
npm run dev
```

The authentication should then work properly!