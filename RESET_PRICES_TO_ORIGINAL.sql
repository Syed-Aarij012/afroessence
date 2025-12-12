-- RESET PRICES TO ORIGINAL VALUES
-- Run this first to fix the multiple price increases

-- Image 1: Cornrows and Box Braids (Reset to original prices)
UPDATE sub_services SET price = 55.00 WHERE name = 'Corn Row + extension';
UPDATE sub_services SET price = 80.00 WHERE name = 'CornRow with Design + extensions';
UPDATE sub_services SET price = 105.00 WHERE name = 'Box Braids (B) + extensions';
UPDATE sub_services SET price = 105.00 WHERE name = 'Jumbo box Braids + extensions';
UPDATE sub_services SET price = 200.00 WHERE name = 'Box Braid (S/M) + extensions';

-- Image 2: Twists (Reset to original prices)
UPDATE sub_services SET price = 145.00 WHERE name = 'Twist + extension';
UPDATE sub_services SET price = 155.00 WHERE name = 'Afro/Marley Twist + extension';
UPDATE sub_services SET price = 170.00 WHERE name = 'Mini twist with extension';
UPDATE sub_services SET price = 300.00 WHERE name = 'Micro Twist + extension';

-- Image 3: Afro Braids Part 1 (Reset to original prices)
UPDATE sub_services SET price = 85.00 WHERE name = 'Ghana weave Allback (B)';
UPDATE sub_services SET price = 85.00 WHERE name = 'Ghana weave Shuku (B)';
UPDATE sub_services SET price = 100.00 WHERE name = 'Crochet Braids';
UPDATE sub_services SET price = 100.00 WHERE name = 'Single plait';
UPDATE sub_services SET price = 130.00 WHERE name = 'Half cornrow/Braids + extension';
UPDATE sub_services SET price = 140.00 WHERE name = 'Ghana weave Allback (S/M) + extension';
UPDATE sub_services SET price = 140.00 WHERE name = 'Ghana weave shuku (S/M) + extension';
UPDATE sub_services SET price = 140.00 WHERE name = 'Knotless Braids (B) + extension';
UPDATE sub_services SET price = 140.00 WHERE name = 'Styled Cornrow/Braids + extension';
UPDATE sub_services SET price = 190.00 WHERE name = 'Knotless with curls + extensions';

-- Image 4: Afro Braids Part 2 (Reset to original prices)
UPDATE sub_services SET price = 200.00 WHERE name = 'French curls + extensions';
UPDATE sub_services SET price = 200.00 WHERE name = 'Knotless Braids (S/M) + extensions';
UPDATE sub_services SET price = 220.00 WHERE name = 'Loose Box/knotless braids (B)';
UPDATE sub_services SET price = 232.00 WHERE name = 'Goddess/Boho Braids (B) + extension/human hair bulk';
UPDATE sub_services SET price = 235.00 WHERE name = 'Loose Box/knotless braids';
UPDATE sub_services SET price = 256.00 WHERE name = 'French curl Boho + bone straight braiding extensions';
UPDATE sub_services SET price = 300.00 WHERE name = 'Goddess/Boho Braids (S/M) + extensions/human hair bulk';
UPDATE sub_services SET price = 385.00 WHERE name = 'Bora Bora + extensions/human hair bulk';

-- Image 5: Children Services (Reset to original prices)
UPDATE sub_services SET price = 75.00 WHERE name = 'Single/braids (no extensions)';
UPDATE sub_services SET price = 85.00 WHERE name = 'Single/braids (extensions)';
UPDATE sub_services SET price = 70.00 WHERE name = 'Twist (no extensions)';
UPDATE sub_services SET price = 90.00 WHERE name = 'Twist (extension)';

-- Verify the reset
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