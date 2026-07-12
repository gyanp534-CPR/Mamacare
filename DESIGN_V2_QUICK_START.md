# Design System v2 - Quick Start

## ✅ What's Live Now

### 1. **Journey Thread Visualization** 🎯
Beautiful SVG garland showing pregnancy progress with T1/T2/Due markers.

**See it**: Navigate to Dashboard after setting your due date  
**Location**: `#dbHero` card replaces old progress display  
**File**: `app-dashboard-v2.js`

**What it shows:**
- Current week (large number with "wks")
- Days remaining (top right, rose color)
- Animated thread with your position
- Baby development info

### 2. **Weight Chart with Healthy Band** 📊
SVG line chart with green healthy weight range visualization.

**See it**: Navigate to Weight Tracker page  
**Location**: Replaces canvas chart  
**File**: `app-weight-tracker-v2.js`

**What it shows:**
- Your weight progression line (rose)
- Healthy weight band (green shaded)
- Latest entry highlighted (gold)
- Week/weight grid labels

### 3. **New Color Palette** 🎨
Warm, calming design tokens throughout the app.

**Colors:**
- **Background**: Warm ivory (#fbf4e9)
- **Primary**: Dusty rose (#c1707a)
- **Accent**: Turmeric gold (#d99a2b)
- **Calm**: Muted sage (#8b9a7a)
- **Text**: Deep plum-brown (#3e2a29)

### 4. **New Typography** ✍️
Display font (Fraunces) for hero numbers, body font (Hind) with Devanagari support.

**Fonts:**
- **Fraunces**: Week numbers, large titles
- **Hind**: All body text, UI elements
- **Noto Sans Devanagari**: Hindi fallback

---

## 🧪 Test It Now

### Test Journey Thread
1. Open app → Navigate to Dashboard
2. If you see "Set Your Due Date" → Click it
3. Enter your LMP or due date
4. Go back to Dashboard → See the beautiful thread!
5. Check that:
   - Current week shows correctly
   - Days remaining updates
   - Thread animates smoothly
   - Baby info changes by week

### Test Weight Chart
1. Navigate to Weight Tracker
2. If no data: Add a few weight entries (different weeks)
3. Chart should appear with:
   - Green healthy band
   - Rose line connecting points
   - Latest entry in gold
   - Grid with labels
4. Add another entry → Chart updates automatically

### Test New Design Tokens
1. Inspect any element with DevTools
2. Look for CSS variables like `var(--mc-rose)`
3. Try changing values in DevTools → See instant effect
4. Old variables like `var(--rose)` still work!

---

## 🔧 Using in Your Code

### Apply New Card Style
```html
<div class="card-v2">
  <h2 class="font-display" style="font-size:24px">Title</h2>
  <p>Content with new design tokens</p>
</div>
```

### Use New Colors
```javascript
element.style.background = 'var(--mc-rose-tint)';
element.style.color = 'var(--mc-text)';
element.style.borderColor = 'var(--mc-line)';
```

### Manually Trigger Journey Thread
```javascript
// After updating due date
if (window.MC && window.MC.renderJourneyThread) {
  window.MC.renderJourneyThread();
}
```

### Manually Update Weight Chart
```javascript
// After logging weight
if (window.MC && window.MC.enhanceWeightPage) {
  window.MC.enhanceWeightPage();
}
```

---

## 📱 What Users Will See

### Before (Old Design)
- Plain progress bar
- Text-only week count
- Canvas weight chart (no healthy band)
- Pink/cream color scheme

### After (New Design v2)
- Beautiful journey thread garland
- Large display numbers (Fraunces font)
- SVG weight chart with healthy range
- Warm ivory + dusty rose + turmeric gold
- Calming sage accents
- Better Devanagari support

---

## 🐛 Known Issues

### Journey Thread
- ⚠️ Only shows on dashboard (not other pages yet)
- ⚠️ Empty state could be prettier
- ⚠️ Baby info is static (could pull from database)

### Weight Chart
- ⚠️ Healthy band is rough approximation (not personalized)
- ⚠️ Chart doesn't resize on window change (refresh needed)
- ⚠️ Empty state shows but could be more engaging

### Global
- ⚠️ Old and new styles coexist (gradual migration)
- ⚠️ Some cards still use old `.card` style
- ⚠️ Bottom nav not redesigned yet
- ⚠️ Summary cards (hydration, affirmation) not built yet

---

## 📋 What's NOT Changed Yet

The following still use the old design:
- ✖️ Bottom navigation (still old tabs)
- ✖️ All tracker pages except Weight
- ✖️ Medicine cards
- ✖️ Journal entries
- ✖️ Hospital bag checklist
- ✖️ Baby name list
- ✖️ Appointment cards
- ✖️ Most buttons

These will be migrated in future phases.

---

## 🚀 Next Steps (Phase 2)

1. **Dashboard Summary Cards**
   - Hydration tracker card (water glasses)
   - Daily affirmation card (rose background)
   - Upcoming appointment card (gold accent)

2. **Bottom Navigation Redesign**
   - Rounded nav with active state
   - Home/Trackers/Journal/More structure

3. **Global Card Migration**
   - Replace all `.card` with `.card-v2`
   - Update border-radius to 20-24px

4. **Button Styles**
   - Primary: `--mc-rose` background
   - Secondary: `--mc-surface` with border
   - Gold accent for special actions

---

## 💡 Tips

- **Backward Compatible**: Old CSS variables still work
- **Progressive Enhancement**: New features add on top of old
- **Graceful Degradation**: Falls back to text if SVG fails
- **Accessibility**: All interactive elements have focus styles
- **Performance**: Bundle only increased 2.2% (+12.5 KB)

---

## 📞 Need Help?

- **Implementation Guide**: See `DESIGN_SYSTEM_V2_GUIDE.md` for full details
- **Console Logs**: Check for "✨ Dashboard v2" and "📊 Weight Tracker v2" messages
- **Browser DevTools**: Inspect elements to see computed styles
- **Git History**: Compare with commit `2aaf29f` to see changes

---

**Status**: ✅ Phase 1 Complete - CSS Foundation + 2 Major Components  
**Bundle**: 582.8 KB minified (25.9% smaller than source)  
**Deployed**: Commit `2aaf29f` pushed to GitHub

Enjoy the new design! 🌸
