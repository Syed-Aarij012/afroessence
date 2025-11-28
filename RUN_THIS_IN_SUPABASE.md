# 🚀 Quick Setup Instructions

## ⚠️ If You See Duplicates

If you already ran the setup and see duplicates:

1. Go to Supabase Dashboard → SQL Editor
2. Open `CLEANUP_DUPLICATES.sql`
3. Copy and paste it into SQL Editor
4. Click **Run** - This will delete all services
5. Then follow the steps below

## Run This ONE File in Supabase

1. Go to your Supabase Dashboard
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open the file: `COMPLETE_SERVICES_SETUP.sql`
5. Copy ALL the content
6. Paste it into the Supabase SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. **IMPORTANT: Only run this ONCE!**

That's it! This will:
- ✅ Create all 3 tables (service_categories, primary_services, sub_services)
- ✅ Set up relationships and security policies
- ✅ Add ALL 10 categories
- ✅ Add ALL primary services
- ✅ Add ALL sub-services with prices and durations
- ✅ Update your bookings table to work with the new structure

## After Running

1. Refresh your booking page at http://localhost:3000/booking
2. You should see all services organized in the hierarchical structure
3. Click on categories to expand them
4. Click on primary services to see the bookable items
5. Select a service to see the price and duration

## Structure You'll See

```
📁 Ladies - Hair Treatments (2)
  📄 Ladies - Afro Relaxer
    ✓ Afro Retouch (Relaxer inclusive) - £100, 1hr 30mins
    ✓ Afro retouch, treat and trim - £135, 2hrs 30mins
    ✓ Afro Retouch and set - £150, 3hrs
  📄 Ladies - Hair Conditioning & Scalp Treatment
    ✓ Hair Conditioning & Scalp Treatment - £67.50, 2hrs

📁 Ladies - Braids, Cornrows & Twists (5)
  📄 Ladies - Cornrows
    ✓ 4/8 cornrows (Plain) - £35, 2hrs
    ✓ 10+ Cornrows (plain) - £50, 2hrs
    ... and more

... and 8 more categories with all your services!
```

## Total Services Added
- 10 Categories
- 31 Primary Services  
- 100+ Sub-Services (bookable items)

All matching your Treatwell listing! 🎉
