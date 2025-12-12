-- SET CORRECT FINAL PRICES (Original + £25)
-- Run this AFTER running the reset script

-- Image 1: Cornrows and Box Braids (Original + £25)
UPDATE sub_services SET price = 80.00 WHERE name = 'Corn Row + extension';
UPDATE sub_services SET price = 105.00 WHERE name = 'CornRow with Design + extensions';
UPDATE sub_services SET price = 130.00 WHERE name = 'Box Braids (B) + extensions';
UPDATE sub_services SET price = 130.00 WHERE name = 'Jumbo box Braids + extensions';
UPDATE sub_services SET price = 225.00 WHERE name = 'Box Braid (S/M) + extensions';

-- Image 2: Twists (Original + £25)
UPDATE sub_services SET price = 170.00 WHERE name = 'Twist + extension';
UPDATE sub_services SET price = 180.00 WHERE name = 'Afro/Marley Twist + extension';
UPDATE sub_services SET price = 195.00 WHERE name = 'Mini twist with extension';
UPDATE sub_services SET price = 325.00 WHERE name = 'Micro Twist + extension';

-- Image 3: Afro Braids Part 1 (Original + £25)
UPDATE sub_services SET price = 110.00 WHERE name = 'Ghana weave Allback (B)';
UPDATE sub_services SET price = 110.00 WHERE name = 'Ghana weave Shuku (B)';
UPDATE sub_services SET price = 125.00 WHERE name = 'Crochet Braids';
UPDATE sub_services SET price = 125.00 WHERE name = 'Single plait';
UPDATE sub_services SET price = 155.00 WHERE name = 'Half cornrow/Braids + extension';
UPDATE sub_services SET price = 165.00 WHERE name = 'Ghana weave Allback (S/M) + extension';
UPDATE sub_services SET price = 165.00 WHERE name = 'Ghana weave shuku (S/M) + extension';
UPDATE sub_services SET price = 165.00 WHERE name = 'Knotless Braids (B) + extension';
UPDATE sub_services SET price = 165.00 WHERE name = 'Styled Cornrow/Braids + extension';
UPDATE sub_services SET price = 215.00 WHERE name = 'Knotless with curls + extensions';

-- Image 4: Afro Braids Part 2 (Original + £25)
UPDATE sub_services SET price = 225.00 WHERE name = 'French curls + extensions';
UPDATE sub_services SET price = 225.00 WHERE name = 'Knotless Braids (S/M) + extensions';
UPDATE sub_services SET price = 245.00 WHERE name = 'Loose Box/knotless braids (B)';
UPDATE sub_services SET price = 257.00 WHERE name = 'Goddess/Boho Braids (B) + extension/human hair bulk';
UPDATE sub_services SET price = 260.00 WHERE name = 'Loose Box/knotless braids';
UPDATE sub_services SET price = 281.00 WHERE name = 'French curl Boho + bone straight braiding extensions';
UPDATE sub_services SET price = 325.00 WHERE name = 'Goddess/Boho Braids (S/M) + extensions/human hair bulk';
UPDATE sub_services SET price = 410.00 WHERE name = 'Bora Bora + extensions/human hair bulk';

-- Image 5: Children Services (Original + £25)
UPDATE sub_services SET price = 100.00 WHERE name = 'Single/braids (no extensions)';
UPDATE sub_services SET price = 110.00 WHERE name = 'Single/braids (extensions)';
UPDATE sub_services SET price = 95.00 WHERE name = 'Twist (no extensions)';
UPDATE sub_services SET price = 115.00 WHERE name = 'Twist (extension)';

-- Verify the final correct prices
SELECT name, price FROM sub_services 
WHERE name IN (
    'Corn Row + extension',
    'CornRow with Design + extensions',
    'Box Braids (B) + extensions',
    'Jumbo box Braids + extensions',
    'Box Braid (S/M) + extensions',
    'Twist + extension',
    'Afro/Marley Twist + extension',
    'Mini twist with extension',
    'Micro Twist + extension',
    'Ghana weave Allback (B)',
    'Ghana weave Shuku (B)',
    'Crochet Braids',
    'Single plait',
    'Half cornrow/Braids + extension',
    'Ghana weave Allback (S/M) + extension',
    'Ghana weave shuku (S/M) + extension',
    'Knotless Braids (B) + extension',
    'Styled Cornrow/Braids + extension',
    'Knotless with curls + extensions',
    'French curls + extensions',
    'Knotless Braids (S/M) + extensions',
    'Loose Box/knotless braids (B)',
    'Goddess/Boho Braids (B) + extension/human hair bulk',
    'Loose Box/knotless braids',
    'French curl Boho + bone straight braiding extensions',
    'Goddess/Boho Braids (S/M) + extensions/human hair bulk',
    'Bora Bora + extensions/human hair bulk',
    'Single/braids (no extensions)',
    'Single/braids (extensions)',
    'Twist (no extensions)',
    'Twist (extension)'
)
ORDER BY name;