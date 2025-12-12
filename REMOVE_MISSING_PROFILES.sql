-- Remove the auto-generated profiles that start with "Customer "

DELETE FROM profiles 
WHERE full_name LIKE 'Customer %' 
AND LENGTH(full_name) = 17; -- "Customer " + 8 characters

-- Check what profiles remain
SELECT id, full_name, email FROM profiles;