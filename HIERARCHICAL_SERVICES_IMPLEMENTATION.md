# Hierarchical Services Implementation Guide

## Overview
This implements a 3-level service hierarchy similar to Treatwell:
1. **Service Categories** (e.g., "Ladies - Hair Treatments")
2. **Primary Services** (e.g., "Ladies - Afro Relaxer")
3. **Sub-Services** (e.g., "Afro Retouch (Relaxer inclusive)" - £100, 90 mins)

## Database Setup

### Step 1: Run the Schema
Execute `DATABASE_SCHEMA_HIERARCHICAL_SERVICES.sql` in your Supabase SQL editor to create:
- `service_categories` table
- `primary_services` table
- `sub_services` table
- Proper relationships and indexes
- RLS policies

### Step 2: Seed Sample Data
Execute `SEED_SERVICES_DATA.sql` to populate with sample services from your Treatwell listing.

### Step 3: Update Bookings Table
The schema automatically updates the bookings table to reference `sub_services` instead of the old flat `services` table.

## Component Usage

### Basic Implementation
```tsx
import HierarchicalServiceSelector from "@/components/HierarchicalServiceSelector";

function BookingPage() {
  const [selectedService, setSelectedService] = useState(null);

  const handleServiceSelect = (subService, primaryService, category) => {
    console.log('Selected:', {
      category: category.name,
      primary: primaryService.name,
      service: subService.name,
      price: subService.price,
      duration: subService.duration_minutes
    });
    setSelectedService(subService);
  };

  return (
    <HierarchicalServiceSelector
      onServiceSelect={handleServiceSelect}
      selectedServiceId={selectedService?.id}
    />
  );
}
```

## Data Structure

### Service Categories
```typescript
{
  id: string;
  name: string;              // "Ladies - Hair Treatments"
  description: string;
  display_order: number;
  is_active: boolean;
}
```

### Primary Services
```typescript
{
  id: string;
  category_id: string;       // References service_categories
  name: string;              // "Ladies - Afro Relaxer"
  description: string;
  display_order: number;
  is_active: boolean;
}
```

### Sub-Services (Bookable Items)
```typescript
{
  id: string;
  primary_service_id: string; // References primary_services
  name: string;               // "Afro Retouch (Relaxer inclusive)"
  duration_minutes: number;   // 90
  price: number;              // 100.00
  display_order: number;
  is_active: boolean;
}
```

## Adding All Your Services

To add all services from your Treatwell listing, follow this pattern in SQL:

```sql
-- 1. Add Category
INSERT INTO service_categories (name, display_order) 
VALUES ('Category Name', 1);

-- 2. Add Primary Service
INSERT INTO primary_services (category_id, name, display_order)
SELECT id, 'Primary Service Name', 1
FROM service_categories WHERE name = 'Category Name';

-- 3. Add Sub-Services
INSERT INTO sub_services (primary_service_id, name, duration_minutes, price, display_order)
SELECT id, 'Sub-Service Name', 90, 100.00, 1
FROM primary_services WHERE name = 'Primary Service Name';
```

## Admin Interface

You'll want to create an admin interface to manage these services. Key features:
- Add/Edit/Delete categories
- Add/Edit/Delete primary services
- Add/Edit/Delete sub-services
- Reorder items (using display_order)
- Toggle active/inactive status

## Integration with Booking System

Update your booking creation to use the sub_service_id:

```typescript
const { data, error } = await supabase
  .from('bookings')
  .insert({
    sub_service_id: selectedSubService.id,
    customer_name: name,
    customer_email: email,
    booking_date: date,
    booking_time: time,
    duration_minutes: selectedSubService.duration_minutes,
    total_price: selectedSubService.price,
    // ... other fields
  });
```

## Features

✅ **Expandable/Collapsible** - Categories and primary services can be expanded
✅ **Visual Hierarchy** - Clear indentation and styling
✅ **Service Count** - Shows number of items in each level
✅ **Duration & Price Display** - Shows key info for each bookable service
✅ **Selection State** - Highlights selected service
✅ **Responsive** - Works on all screen sizes
✅ **Performance** - Efficient data loading with proper indexing

## Next Steps

1. Run the SQL scripts in Supabase
2. Add the HierarchicalServiceSelector to your Booking page
3. Update booking creation logic to use sub_service_id
4. Add remaining services from your Treatwell listing
5. Create admin interface for service management
6. Test the complete booking flow

## Notes

- The `display_order` field controls the order of items in each level
- Use `is_active` to hide services without deleting them
- All prices are in GBP (£)
- Durations are in minutes
- RLS policies ensure public can only view active services
