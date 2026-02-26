# B.CLEAN - Asset Placeholders

This directory contains placeholder files for the required app assets.

## Required Assets

### App Icons

- `icon.png` - 1024x1024px - Main app icon
- `adaptive-icon.png` - 1024x1024px - Android adaptive icon foreground
- `favicon.png` - 48x48px - Web favicon
- `notification-icon.png` - 96x96px - Android notification icon

### Splash Screen

- `splash.png` - 2048x2048px - Splash screen image

## Asset Guidelines

### App Icon (icon.png)

- Size: 1024x1024 pixels
- Format: PNG with transparency
- Design: Simple, recognizable, works at small sizes
- Content: Should not include text (iOS guidelines)
- Background: Consider both light and dark backgrounds

### Android Adaptive Icon (adaptive-icon.png)

- Size: 1024x1024 pixels
- Format: PNG with transparency
- Safe zone: Keep important content in center 768x768px circle
- Background: Transparent (background color set in app.json)

### Splash Screen (splash.png)

- Size: 2048x2048 pixels minimum
- Format: PNG
- Background: Solid color matching app.json backgroundColor
- Content: Centered logo or brand mark
- Design: Simple, loads quickly

### Notification Icon (notification-icon.png)

- Size: 96x96 pixels
- Format: PNG with transparency
- Style: Silhouette/flat design
- Color: White on transparent background
- Content: Simple, recognizable at small sizes

## Asset Creation Tools

Recommended tools for creating assets:

- Adobe Photoshop / Illustrator
- Figma
- Sketch
- Affinity Designer

Online generators:

- https://www.appicon.co/
- https://easyappicon.com/
- https://www.figma.com/ (App Icon templates)

## Installation

1. Create your assets according to the specifications above
2. Place them in this `/assets` directory
3. Ensure filenames match exactly:
   - `icon.png`
   - `adaptive-icon.png`
   - `splash.png`
   - `favicon.png`
   - `notification-icon.png`
4. Verify paths in `app.json` are correct

## Notes

- All assets must be original or properly licensed
- High resolution assets ensure quality across all device sizes
- Test icons on various backgrounds (light/dark mode)
- Review App Store and Play Store guidelines for icon requirements
- Consider hiring a professional designer for production assets

---

**Current Status:** Placeholder files needed  
**Required for:** App Store and Play Store submission
