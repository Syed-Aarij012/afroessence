# Setup Guide: Hierarchical Services

## ✅ What's Been Done

1. **Created Database Schema** - `DATABASE_SCHEMA_HIERARCHICAL_SERVICES.sql`
2. **Created Sample Data** - `SEED_SERVICES_DATA.sql`
3. **Created React Component** - `HierarchicalServiceSelector.tsx`
4. **Updated Booking Page** - Integrated the new service selector

## 🚀 Next Steps to Complete Setup

### Step 1: Run Database Migrations

Go to your Supabase project dashboard → SQL Editor and run these files in order:

1. **First, run:** `DATABASE_SCHEMA_HIERARCHICAL_SERVICES.sql`
   - This creates the 3-level service structure
   - Creates: service_categories, primary_services, sub_services tables
   - Sets up relationships and RLS policies

2. **Then, run:** `SEED_SERVICES_DATA.sql`
   - This populates sample services from your Treatwell listing
   - You can add more services following the same pattern

### Step 2: Update Admin Email (Optional)

In the SQL schema, there are admin policies that reference:
```sql
auth.jwt() ->> 'email' = 'admin@afroessence.com'
```

Update this to your actual admin email address, or remove these policies if you want to manage permissions differently.

### Step 3: Test the Booking Flow

1. Start your dev server (already running at http://localhost:3000)
2. Navigate to the Booking page
3. You should see the new hierarchical service selector
4. Test selecting:
   - A category (e.g., "Ladies - Braids, Cornrows & Twists")
   - A primary service (e.g., "Ladies - Box Braids")
   - A sub-service (e.g., "Box Braids (B) + extensions - £105, 6hrs")

### Step 4: Add All Your Services

The `SEED_SERVICES_DATA.sql` file contains examples. To add all services from your Treatwell listing, follow this pattern:

```sql
-- 1. Add Category (if not exists)
INSERT INTO service_categories (name, description, display_order) 
VALUES ('Category Name', 'Description', 1);

-- 2. Add Primary Service
INSERT INTO primary_services (category_id, name, description, display_order)
SELECT id, 'Primary Service Name', 'Description', 1
FROM service_categories WHERE name = 'Category Name';

-- 3. Add Sub-Services (the bookable items)
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Sub-Service Name', 90, 100.00, 1
FROM primary_services WHERE name = 'Primary Service Name';
```

### Step 5: Update Bookings Table (if needed)

The schema automatically adds `sub_service_id` to the bookings table. If you have existing bookings with the old `service_id`, you may need to migrate that data or keep both columns temporarily.

## 📊 Service Structure Example

```
📁 Ladies - Braids, Cornrows & Twists
  📄 Ladies - Cornrows
    ✓ 4/8 cornrows (Plain) - £35, 2hrs
    ✓ 10+ Cornrows (plain) - £50, 2hrs
    ✓ Corn Row + extension - £55, 1hr 30mins
    ✓ CornRow with Design + extensions - £80, 2hrs
  
  📄 Ladies - Box Braids
    ✓ Box Braids (B) + extensions - £105, 6hrs
    ✓ Jumbo box Braids + extensions - £105, 3hrs
    ✓ Box Braid (S/M) + extensions - £200, 10hrs
  
  📄 Ladies - Twists
    ✓ Natural hair Twist - £100, 4hrs
    ✓ Twist + extension - £145, 6hrs
    ✓ Afro/Marley Twist + extension - £155, 6hrs
    ✓ Mini twist with extension - £170, 8hrs
    ✓ Micro Twist + extension - £300, 10hrs
```

## 🎨 Features

- ✅ 3-level expandable hierarchy
- ✅ Shows service count at each level
- ✅ Displays duration and price for bookable items
- ✅ Visual selection state
- ✅ Smooth animations
- ✅ Mobile responsive
- ✅ Matches your site's design theme

## 🔧 Customization

### Change Colors
Edit `HierarchicalServiceSelector.tsx` and update the Tailwind classes:
- `text-amber-500` → your brand color
- `bg-amber-500/10` → your brand color with opacity

### Change Display Order
Update the `display_order` field in the database to reorder items.

### Hide/Show Services
Set `is_active = false` to hide services without deleting them.

## 📝 Notes

- The booking page now uses `sub_service_id` instead of `service_id`
- Duration and price are stored at the sub-service level
- All services from your Treatwell listing can be added following the pattern
- The old flat services table can be kept for backward compatibility if needed

## 🐛 Troubleshooting

**Services not showing?**
- Check that you ran both SQL files
- Verify `is_active = true` for all services
- Check browser console for errors

**Can't select services?**
- Make sure you're clicking on the sub-services (the items with prices)
- Categories and primary services are just containers

**Booking fails?**
- Verify the bookings table has `sub_service_id` column
- Check Supabase logs for errors
- Ensure RLS policies allow inserts

## 🎯 Next Features to Build

1. **Admin Interface** - Manage services through UI instead of SQL
2. **Service Images** - Add images to categories/services
3. **Service Bundles** - Allow booking multiple services together
4. **Dynamic Pricing** - Different prices for different professionals
5. **Service Availability** - Some services only available certain days

---

Need help? Check the implementation guide in `HIERARCHICAL_SERVICES_IMPLEMENTATION.md`
