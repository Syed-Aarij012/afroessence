# Remove FloatingElement Dancing Animations

To remove all dancing animations (FloatingElement wrappers) while keeping other visual effects:

## Manual Steps:
1. Remove all `<FloatingElement delay={...}>` opening tags
2. Remove all corresponding `</FloatingElement>` closing tags
3. Keep all other components like ParticleBackground, GradientOrb, AnimatedBackground, Card3D, etc.

## Files to update:
- src/pages/Booking.tsx
- src/pages/Admin.tsx  
- src/pages/MyBookings.tsx
- src/pages/About.tsx
- src/pages/Contact.tsx
- src/pages/Gallery.tsx
- src/pages/Home.tsx
- src/pages/Auth.tsx

## What to keep:
- AnimatedBackground
- ParticleBackground  
- GradientOrb
- Card3D, InteractiveCard
- All gradients and visual effects
- All hover animations and transitions

## What to remove:
- Only FloatingElement wrapper components that cause dancing/floating animations