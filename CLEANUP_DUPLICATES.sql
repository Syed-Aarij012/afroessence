-- CLEANUP SCRIPT - Run this first to remove all data and start fresh

-- Delete all sub-services
DELETE FROM sub_services;

-- Delete all primary services
DELETE FROM primary_services;

-- Delete all service categories
DELETE FROM service_categories;

-- Now you can run COMPLETE_SERVICES_SETUP.sql again
