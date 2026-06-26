# 📸 Testing & Screenshots Guide

**Feature:** Contraction Timer Testing  
**Version:** MamaCare v8.1  
**Purpose:** Manual testing with visual verification

---

## 🧪 How to Test Locally

### Prerequisites
- Modern browser (Chrome, Firefox, Safari, or Edge)
- Text editor or IDE
- No build tools needed (vanilla JS)

### Quick Start

1. **Open the app:**
   ```
   Right-click on index.html → Open with → Chrome (or your browser)
   ```

2. **Or use local server (optional):**
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```
   
   Then open: `http://localhost:8000`

3. **Navigate to Contraction Timer:**
   - Skip splash screen ("Get Started")
   - You'll need to sign up/login (use test email)
   - OR temporarily modify `index.html` to skip auth (see below)

### Skip Auth for Testing (Optional)

In `index.html`, find the splash screen section and add:

```javascript
// Add this to skip auth temporarily
document.getElementById('splashScreen').style.display = 'none';
document.getElementById('topBar').style.display = 'block';
document.querySelector('.page').classList.add('active');
```

---

## 📸 Screenshot Scenarios

### Scenario 1: Initial State

**Steps:**
1. Navigate to Dashboard
2. Click "Contractions" in Safety & Planning section

**What to capture:**
- Timer showing "00:00" and "Press Start"
- All UI elements visible
- Clean, empty state

**Expected:**
- Large circular timer
- "Start Contraction" button (rose gradient)
- No statistics shown
- Empty history with message

**Screenshot filename:** `01-initial-state.png`

---

### Scenario 2: Timer Running

**Steps:**
1. Click "Start Contraction"
2. Wait 10 seconds
3. Take screenshot

**What to capture:**
- Timer counting (e.g., "00:10")
- Pulsing animation visible
- "End Contraction" button
- "Reset Timer" button

**Expected:**
- Timer displays MM:SS format
- Circle has pulsing effect
- Label says "Contracting..."
- Red "End" button visible

**Screenshot filename:** `02-timer-running.png`

---

### Scenario 3: First Contraction Saved

**Steps:**
1. Start timer
2. Wait 50-60 seconds
3. Click "End Contraction"
4. Wait 2 seconds for UI update
5. Take screenshot

**What to capture:**
- Statistics appearing
- History showing 1 contraction
- Timer reset to 00:00

**Expected:**
- Stats grid visible with 4 boxes
- Last Duration shows time
- Avg Duration matches
- Frequency shows "-" or "First"
- Total Count shows "1"
- History has one entry

**Screenshot filename:** `03-first-contraction.png`

---

### Scenario 4: Multiple Contractions

**Steps:**
1. Time 5 contractions:
   - Each 50-60 seconds
   - Wait 4-5 minutes between each
2. Take screenshot after 5th

**What to capture:**
- All statistics populated
- 5 contractions in history
- Frequency calculated

**Expected:**
- Last Duration: ~55s
- Avg Duration: ~55s
- Frequency: ~5 min
- Total Count: 5
- History shows all 5 with times

**Screenshot filename:** `04-multiple-contractions.png`

---

### Scenario 5: 5-1-1 Alert Triggered

**Steps:**
1. Time 6-7 contractions:
   - Each 50-60 seconds
   - 4-6 minutes apart
2. After 6th contraction, alert should appear
3. Take screenshot

**What to capture:**
- Alert card visible
- "5-1-1 Rule Alert!" heading
- "Call Doctor" button
- Statistics showing pattern

**Expected:**
- Red-bordered alert card
- Warning icon
- Clear explanation
- Action buttons
- Stats match pattern

**Screenshot filename:** `05-511-alert.png`

---

### Scenario 6: History View

**Steps:**
1. Scroll to History section
2. Show multiple dates if possible
3. Take screenshot

**What to capture:**
- Date grouping
- Individual contraction cards
- Time, duration, frequency display
- Delete buttons

**Expected:**
- Clean card layout
- Hover effects (if hovering)
- Icons visible
- Readable text

**Screenshot filename:** `06-history-view.png`

---

### Scenario 7: Export Functionality

**Steps:**
1. Click "Export" button
2. CSV file should download
3. Open CSV in Excel/Sheets
4. Take screenshot of CSV

**What to capture:**
- CSV file contents
- Proper formatting
- All data columns

**Expected:**
- Header row: Date, Time, Duration, Frequency
- Data rows with all contractions
- Valid CSV format

**Screenshot filename:** `07-csv-export.png`

---

### Scenario 8: Labor Stages Guide

**Steps:**
1. Scroll to Labor Stages Guide section
2. Take screenshot

**What to capture:**
- All 3 stages visible
- Numbered badges
- Information clear

**Expected:**
- Stage 1: Early Labor
- Stage 2: Active Labor
- Stage 3: Transition
- Clear descriptions

**Screenshot filename:** `08-labor-stages.png`

---

### Scenario 9: Mobile View

**Steps:**
1. Open DevTools (F12)
2. Click device toolbar (Ctrl+Shift+M)
3. Select iPhone or Android device
4. Navigate through app
5. Take screenshots

**What to capture:**
- Timer on mobile
- Statistics in 2x2 grid
- History cards
- Touch-friendly buttons

**Expected:**
- Responsive layout
- No horizontal scroll
- Readable text
- Large touch targets

**Screenshot filenames:** 
- `09-mobile-timer.png`
- `10-mobile-stats.png`
- `11-mobile-history.png`

---

### Scenario 10: Share Feature (NEW)

**Steps:**
1. Time several contractions
2. Click "Share" button
3. Take screenshot of share dialog (browser dependent)

**What to capture:**
- Share dialog or clipboard confirmation
- Summary text

**Expected:**
- Web Share API dialog (mobile)
- Or "Copied to clipboard" message
- Summary includes all key metrics

**Screenshot filename:** `12-share-feature.png`

---

## 🎨 Screenshot Best Practices

### Before Taking Screenshots

1. **Clean browser:**
   - Close unnecessary tabs
   - Hide bookmarks bar
   - Use incognito/private mode (no extensions)

2. **Prepare data:**
   - Have contractions already timed
   - Clear any test data if needed
   - Ensure realistic test data

3. **Zoom level:**
   - Keep at 100% zoom
   - Or note zoom level in filename

### Taking Screenshots

**Windows:**
- Full screen: `Win + PrintScreen`
- Snipping Tool: `Win + Shift + S`
- Game Bar: `Win + G`

**Mac:**
- Full screen: `Cmd + Shift + 3`
- Selection: `Cmd + Shift + 4`
- Window: `Cmd + Shift + 4`, then `Space`

**Browser DevTools:**
- Chrome: DevTools → ... → Capture screenshot
- Firefox: `Shift + F2`, type "screenshot"

### After Taking Screenshots

1. **Organize:**
   ```
   screenshots/
   ├── desktop/
   │   ├── 01-initial-state.png
   │   ├── 02-timer-running.png
   │   └── ...
   ├── mobile/
   │   ├── 09-mobile-timer.png
   │   └── ...
   └── exports/
       └── 07-csv-export.png
   ```

2. **Annotate (optional):**
   - Use annotation tool to highlight features
   - Add arrows or callouts
   - Label important elements

3. **Optimize:**
   - Compress images (TinyPNG, ImageOptim)
   - Target < 500KB per screenshot
   - Use PNG for UI, JPG for photos

---

## ✅ Verification Checklist

Use this while taking screenshots:

### Visual Design
- [ ] Colors match design (rose, blush, warm)
- [ ] Fonts render correctly (DM Sans, Cormorant)
- [ ] Icons display (Lucide icons)
- [ ] Spacing looks balanced
- [ ] No layout breaks

### Functionality
- [ ] Timer counts accurately
- [ ] Buttons respond to clicks
- [ ] Animations are smooth
- [ ] Data persists on refresh
- [ ] Export generates file

### Responsive
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] No horizontal scroll
- [ ] Touch targets adequate

### Content
- [ ] No placeholder text
- [ ] No "Lorem ipsum"
- [ ] Realistic test data
- [ ] No debug/console output
- [ ] Professional appearance

---

## 🐛 Common Issues While Testing

### Timer doesn't start
- **Check:** JavaScript console for errors
- **Fix:** Verify `app-contractions.js` is loaded
- **Screenshot:** Error console if present

### History doesn't save
- **Check:** localStorage quota
- **Fix:** Clear browser data, try again
- **Screenshot:** DevTools → Application → Storage

### Styles look wrong
- **Check:** `style.css` loaded correctly
- **Fix:** Hard refresh (Ctrl+Shift+R)
- **Screenshot:** Broken layout for bug report

### Buttons don't click
- **Check:** Event listeners attached
- **Fix:** Check console, verify initialization
- **Screenshot:** DevTools → Elements → Event Listeners

---

## 📊 Performance Testing

### Load Time
1. Open DevTools → Network tab
2. Hard refresh (Ctrl+Shift+R)
3. Check "Finish" time
4. **Target:** < 2 seconds

**Screenshot:** Network tab with timeline

### Animation FPS
1. DevTools → Performance tab
2. Click record
3. Start timer (triggers animation)
4. Stop after 10 seconds
5. Check FPS graph
6. **Target:** Steady 60fps

**Screenshot:** Performance timeline

### Memory Usage
1. DevTools → Memory tab
2. Take heap snapshot
3. Time 10 contractions
4. Take another snapshot
5. Check memory delta
6. **Target:** < 5MB increase

**Screenshot:** Memory comparison

---

## 🧪 Browser Testing Matrix

Test on these browsers and take screenshots:

| Browser | Version | Desktop | Mobile | Notes |
|---------|---------|---------|--------|-------|
| Chrome | Latest | ✅ | ✅ | Full support |
| Firefox | Latest | ✅ | ✅ | Full support |
| Safari | Latest | ✅ | ✅ | No vibration |
| Edge | Latest | ✅ | ✅ | Full support |

### Screenshot naming:
- `desktop-chrome-initial.png`
- `mobile-safari-timer.png`
- `tablet-firefox-stats.png`

---

## 📝 Bug Report Template

When you find issues:

```markdown
## Bug Report

**Browser:** Chrome 120 (or version)
**Device:** Windows 11 / iPhone 15 Pro
**Date:** 2026-06-25

**Issue:** [Short description]

**Steps to Reproduce:**
1. Navigate to Contractions
2. Click Start
3. [etc.]

**Expected Result:**
Timer should count up

**Actual Result:**
Timer stays at 00:00

**Screenshot:**
![Bug Screenshot](screenshots/bug-timer-not-counting.png)

**Console Errors:**
```
[Error message here]
```

**Additional Notes:**
Only happens on first click, works on second try
```

---

## 🎬 Video Testing (Optional)

For complex interactions:

1. **Screen Recording:**
   - Windows: Xbox Game Bar (`Win + G`)
   - Mac: QuickTime Player
   - Browser: DevTools → Record

2. **What to Record:**
   - Full timer flow (start to 5-1-1 alert)
   - Animation smoothness
   - User interaction
   - Mobile gestures

3. **Video Format:**
   - MP4 or WebM
   - 1080p or 720p
   - 30fps minimum
   - < 5 minutes per video

---

## ✨ Screenshot Checklist Summary

Before submitting:

- [ ] All 12+ scenario screenshots taken
- [ ] Mobile screenshots included
- [ ] Screenshots organized in folders
- [ ] Files named consistently
- [ ] Images optimized (< 500KB each)
- [ ] CSV export verified
- [ ] No sensitive data visible
- [ ] Professional quality
- [ ] Annotations added (if needed)
- [ ] Browser/device noted
- [ ] Date recorded

---

## 📤 Submitting Test Results

### Package Screenshots

```
mamacare-v8.1-screenshots.zip
├── README.md (this file)
├── desktop/
│   ├── 01-initial-state.png
│   ├── 02-timer-running.png
│   └── [etc.]
├── mobile/
│   ├── 09-mobile-timer.png
│   └── [etc.]
├── exports/
│   └── sample-export.csv
└── bugs/ (if any found)
    ├── bug-001-timer-issue.png
    └── bug-report.md
```

### Submit via:
- Email with zip attachment
- GitHub issue with screenshots
- Shared drive (Google Drive, Dropbox)
- Direct message with links

---

**Happy Testing!** 🧪✨

Remember: Good screenshots help us improve the app and create better documentation for users!

---

*Last Updated: June 25, 2026*  
*MamaCare v8.1 Testing Guide*
