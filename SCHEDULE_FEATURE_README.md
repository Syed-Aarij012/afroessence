# Weekly Schedule Management Feature

## Overview
Admin can now manage weekly schedules including opening hours, closing times, and time slot intervals for each day of the week.

## Setup Instructions

### 1. Run Database Migration
Go to your Supabase SQL Editor and run the script in `ADD_SCHEDULE_TABLE.sql`

This will:
- Create the `weekly_schedule` table
- Set up default schedule (Mon-Sat: 09:00-21:00, Sun: 14:00-20:00)
- Configure permissions (anyone can view, only admins can edit)

### 2. Access Schedule Manager
1. Log in as admin
2. Go to Admin Panel
3. Click on the **"Schedule"** tab
4. You'll see all 7 days of the week

### 3. Configure Each Day
For each day you can set:
- **Open/Closed**: Toggle to mark the day as open or closed
- **Opening Time**: When the salon opens (e.g., 09:00)
- **Closing Time**: When the salon closes (e.g., 21:00)
- **Time Slot Duration**: How long each booking slot is (15, 30, 45, or 60 minutes)

### 4. Save Changes
Click the **"Save Schedule"** button to apply changes

## How It Works

### For Admins:
- Set custom hours for each day
- Close specific days
- Change time slot intervals (15min, 30min, 45min, 60min)
- Changes apply immediately after saving

### For Users:
- Booking page automatically shows only available time slots based on admin schedule
- Closed days show no available slots
- Time slots are generated based on the admin-set interval
- Past time slots are automatically hidden

## Features
✅ Weekly schedule management
✅ Individual day configuration
✅ Custom opening/closing hours
✅ Flexible time slot durations
✅ Real-time updates for users
✅ Closed day handling
✅ Past time filtering

## Example Schedules

**Default Schedule:**
- Monday-Saturday: 09:00 - 21:00 (15min slots)
- Sunday: 14:00 - 20:00 (15min slots)

**Custom Example:**
- Monday: Closed
- Tuesday-Friday: 10:00 - 20:00 (30min slots)
- Saturday: 09:00 - 18:00 (15min slots)
- Sunday: 12:00 - 17:00 (60min slots)

## Technical Details
- **Database Table**: `weekly_schedule`
- **Admin Component**: `ScheduleManager.tsx`
- **Hook**: `useWeeklySchedule.tsx`
- **Integration**: Booking page uses schedule dynamically

## Notes
- Schedule changes are immediate
- Users see updated slots without page refresh
- Closed days automatically hide all time slots
- Admin can revert to default schedule anytime
