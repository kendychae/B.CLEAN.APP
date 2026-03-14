# B.CLEAN - Asset Placeholders

This directory contains placeholder files for the required app assets.

## ⚠️ CRITICAL: Assets Required Before App Store Submission

**Status:** ❌ Missing all required assets  
**Action:** Create the 5 PNG files below before building for production

---

## Required Assets

### App Icons

- `icon.png` - 1024x1024px - Main app icon ❌ **MISSING**
- `adaptive-icon.png` - 1024x1024px - Android adaptive icon foreground ❌ **MISSING**
- `favicon.png` - 48x48px - Web favicon ❌ **MISSING**
- `notification-icon.png` - 96x96px - Android notification icon ❌ **MISSING**

### Splash Screen

- `splash.png` - 1284x2778px - Splash screen image ❌ **MISSING**

---

## Quick Start: 3 Ways to Create Assets

### Option 1: Use Free Icon Generator (Fastest - 5 minutes)

1. Visit: https://icons.expo.fyi/
2. Upload your logo or choose a color
3. Download generated assets
4. Extract to this `assets/` folder
5. Done!

### Option 2: Design in Figma/Canva (30-60 minutes)

1. **Figma** (https://figma.com):
   - Create 1024x1024 artboard
   - Design icon with window/cleaning theme
   - Export as PNG @1x
2. **Canva** (https://canva.com):
   - Search "App Icon" template
   - Customize with B.CLEAN branding
   - Download as PNG

### Option 3: Hire a Designer (1-3 days, $20-100)

- **Fiverr**: Search "app icon design" - starting at $20
- **99designs**: Full app branding package - starting at $299
- **Upwork**: Custom icon design - $50-200

---

## Asset Guidelines

### App Icon (icon.png)

- Size: 1024x1024 pixels
- Format: PNG with transparency
- Design: Simple, recognizable, works at small sizes
- Content: Should not include text smaller than 6pt (iOS guidelines)
- Background: Consider both light and dark backgrounds
- **Icon Ideas for B.CLEAN:**
  - Window pane with sparkles
  - Stylized "B" with water droplet
  - Squeegee tool
  - Clean window with sun reflection

### Android Adaptive Icon (adaptive-icon.png)

- Size: 1024x1024 pixels
- Format: PNG with transparency
- Safe zone: Keep important content in center 768x768px circle (center 66%)
- Background: Transparent (background color set in app.json: white)
- Note: Android will mask/shape this automatically

### Splash Screen (splash.png)

- Size: 1284x2778 pixels (tallest iPhone resolution)
- Format: PNG
- Background: White or solid brand color
- Content: Centered logo or brand mark (B.CLEAN text/logo)
- Design: Simple, loads quickly
- Will auto-resize for different devices

### Notification Icon (notification-icon.png)

- Size: 96x96 pixels
- Format: PNG with transparency
- Style: Silhouette/flat design
- Color: White icon on transparent background
- Content: Simple shape (window icon, B letter, etc.)
- Android system will tint based on theme

### Favicon (favicon.png)

- Size: 48x48 pixels
- Format: PNG
- Design: Simplified version of main icon
- Used for: Web version and browser tabs

---

## Installation

1. Create your assets according to the specifications above
2. Place them in this `/assets` directory
3. Ensure filenames match exactly (case-sensitive):
   - `icon.png`
   - `adaptive-icon.png`
   - `splash.png`
   - `favicon.png`
   - `notification-icon.png`
4. Verify paths in `app.json` are correct (they already are)
5. Test by running: `npm start`

## Asset Creation Tools

**Free:**

- https://icons.expo.fyi/ - Auto-generate all assets
- Figma - https://www.figma.com/
- Canva - https://www.canva.com/
- GIMP - https://www.gimp.org/
- Inkscape - https://inkscape.org/

**Online Generators:**

- https://www.appicon.co/
- https://easyappicon.com/
- https://hotpot.ai/free-app-icon-generator

**Paid Professional:**

- Adobe Photoshop / Illustrator
- Sketch (Mac only)
- Affinity Designer

---

## Store Screenshots (Also Required)

In addition to icons, you'll need screenshots for store listings:

### iOS Screenshots

- **6.7" (iPhone 14 Pro Max):** 1290x2796 px - **REQUIRED**
- **6.5" (iPhone 11 Pro Max):** 1284x2778 px - **REQUIRED**
- Need: 4-5 screenshots showing key features

### Android Screenshots

- **Recommended:** 1080x1920 px (9:16 ratio)
- **Min:** 320px short side, 3840px long side
- Need: 2-8 screenshots

### Feature Graphic (Google Play Only)

- **Size:** 1024x500 px
- Marketing banner for Play Store listing

### How to Capture Screenshots:

1. Run app: `npm run ios` or `npm run android`
2. Navigate to key screens:
   - Login/Dashboard
   - Customer list
   - Job calendar
   - Territory map
   - Photo documentation
3. Screenshot:
   - iOS: Cmd+S in simulator
   - Android: Click camera icon in emulator
4. Optional: Add frames/text with Previewed.app or Figma

---

## Brand Colors (Suggested)

Use these for consistency across assets:

```
Primary: #1E88E5 (Blue)
Secondary: #43A047 (Green)
Accent: #FDD835 (Yellow)
Background: #FFFFFF (White)
Text: #212121 (Dark Gray)
```

Update with your actual brand colors if different.

---

## Validation Checklist

Before submission, verify:

- [ ] All 5 PNG files exist in `/assets` folder
- [ ] Files named exactly as required (case-sensitive)
- [ ] Icon size is 1024x1024 px
- [ ] Icon works on light AND dark backgrounds
- [ ] Splash screen centered and looks good
- [ ] Icons tested in app (`npm start`)
- [ ] Notification icon is white silhouette on transparent
- [ ] No copyrighted content in assets
- [ ] Screenshots captured (4-8 different screens)
- [ ] Feature graphic created (Google Play)

---

## Notes

- All assets must be original or properly licensed
- High resolution assets ensure quality across all device sizes
- Test icons on various backgrounds (light/dark mode)
- Review [App Store](https://developer.apple.com/design/human-interface-guidelines/app-icons) and [Play Store](https://developer.android.com/distribute/google-play/resources/icon-design-specifications) guidelines
- **Budget:** Professional designer recommended for production launch (improves conversion by 20-30%)

---

**Next Step:** Create these 5 assets, then proceed with production builds as outlined in `/STORE_SUBMISSION_GUIDE.md`
