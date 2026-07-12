# MamaCare Design System v2 - Implementation Guide

**Status**: ✅ CSS Tokens Added, 🚧 Components Partially Implemented  
**Date**: January 9, 2026  
**Bundle Size**: 582.8 KB minified (was 570.3 KB)

---

## What's Been Implemented

### ✅ 1. CSS Design Tokens (Complete)
**File**: `style.css`

New CSS custom properties added while maintaining backward compatibility:

```css
--mc-bg: #fbf4e9;           /* Warm ivory background */
--mc-surface: #fffcf8;      /* Card/surface color */
--mc-text: #3e2a29;         /* Deep plum-brown text */
--mc-text-soft: #6f5754;    /* Muted text */
--mc-rose: #c1707a;         /* Dusty rose primary */
--mc-rose-dark: #a85862;    /* Darker rose for hover */
--mc-rose-tint: #f3dee0;    /* Light rose background */
--mc-gold: #d99a2b;         /* Turmeric gold accent */
--mc-gold-tint: #f6e3bd;    /* Light gold background */
--mc-sage: #8b9a7a;         /* Muted sage (calm/supportive) */
--mc-sage-tint: #e6ebde;    /* Light sage background */
--mc-line: #ece0d1;         /* Subtle border color */
```

### ✅ 2. Typography (Complete)
**Files**: `index.html`, `style.css`

Added Google Fonts:
- **Fraunces** (variable) - Display font for hero numbers, titles
- **Hind** - Body/UI font with excellent Devanagari support
- **Noto Sans Devanagari** - Fallback for Hindi

Usage:
```css
.font-display { font-family: var(--font-display); }
.font-body { font-family: var(--font-body); }
```

### ✅ 3. Dashboard with Journey Thread (Implemented)
**File**: `app-dashboard-v2.js`

**Features:**
- SVG journey thread visualization (Haldi garland metaphor)
- Animated bezier curve showing T1, T2, and Due Date markers
- Current position marker with glow effect
- Baby development info by week
- Automatic calculations from due date/LMP

**How it works:**
- Hooks into existing `goTo('dashboard')` function
- Replaces content of `#dbHero` card
- Uses Bezier curve math to position beads along thread
- Fully accessible with aria labels

**Visual Elements:**
1. **Background thread** (light rose) - Full pregnancy journey
2. **Active thread** (rose) - Progress up to current week
3. **T1 Bead** (Week 13) - First trimester milestone
4. **T2 Bead** (Week 26) - Second trimester milestone  
5. **Due Bead** (Week 40) - Final destination
6. **Current Marker** (gold with glow) - "You are here"

### ✅ 4. Weight Tracker with Chart (Implemented)
**File**: `app-weight-tracker-v2.js`

**Features:**
- SVG line chart with data points
- Healthy weight band (green shaded area)
- Grid lines with axis labels
- Latest entry highlighted in gold
- Empty state with call-to-action
- Responsive to data range

**Chart Components:**
1. **Healthy band** - Approximates 10-12.5kg total gain
2. **Data line** - Connects all weight entries
3. **Data points** - Individual weigh-ins (rose circles)
4. **Current marker** - Latest entry (gold circle)
5. **Grid** - Week labels (X-axis) and weight labels (Y-axis)

### ✅ 5. Utility Classes (Complete)
**File**: `style.css`

Added 50+ utility classes:
- `.card-v2`, `.card-v2-compact` - New card styles
- `.hero-progress-card` - Journey thread container
- `.summary-grid`, `.summary-card` - Dashboard summary cards
- `.info-box` - Informational callouts
- `.badge-rose`, `.badge-gold`, `.badge-sage` - Status badges
- `.empty-state` - Empty state components
- `.no-scrollbar` - Hide scrollbars
- `.chart-*` classes - SVG chart styling

---

## How to Use

### Using New Design Tokens

**Replace old variables gradually:**
```css
/* Old */
background: var(--rose);
color: var(--text-main);

/* New */
background: var(--mc-rose);
color: var(--mc-text);
```

**Mapped aliases for compatibility:**
```css
--blush: var(--mc-rose-tint);
--warm: var(--mc-text);
--muted: var(--mc-text-soft);
--accent: var(--mc-rose);
```

### Activating the Journey Thread

The journey thread automatically renders when:
1. User has a `due_date` set in `user_profile`
2. User navigates to the dashboard
3. `#dbHero` element exists

**Manual activation:**
```javascript
// After setting due date
if (window.MC && window.MC.renderJourneyThread) {
  window.MC.renderJourneyThread();
}
```

### Activating the Weight Chart

The weight chart automatically renders when:
1. User navigates to the weight page
2. Weight data exists in `weight_logs` table

**Manual activation:**
```javascript
// After logging weight
if (window.MC && window.MC.enhanceWeightPage) {
  window.MC.enhanceWeightPage();
}
```

---

## What Still Needs to be Done

### 🚧 1. Full Dashboard Redesign
**Current**: Only hero card replaced, rest is legacy design  
**Needed**:
- Replace existing feature grid with new summary cards
- Add hydration tracker card (water glasses with progress bar)
- Add daily affirmation card (rose background, heart icon)
- Add upcoming appointment card (gold accent)
- Add milestone card (rose border, chevron link)

**Files to modify**: `index.html` (dashboard HTML), `app.js` (dashboard render functions)

### 🚧 2. Bottom Navigation Redesign
**Current**: Tab-based navigation with icons  
**Needed**:
- Rounded bottom nav with active state background
- Home/Trackers/Journal/More structure
- Rose tint background for active tab
- Improved touch targets (44x44px minimum)

**Files to modify**: `index.html` (nav HTML), `style.css` (nav styles)

### 🚧 3. Global Background Update
**Current**: Cream background with rose/peach orbs  
**Needed**:
- Switch to `--mc-bg` (#fbf4e9) warm ivory
- Update orb colors to match new palette
- Subtler animations

**Files to modify**: `style.css` (`.bg-ambient`, `.orb` styles)

### 🚧 4. Typography Migration
**Current**: Cormorant Garamond + DM Sans  
**Needed**:
- Apply Fraunces to all hero numbers (week count, days left)
- Apply Hind to all body text
- Maintain Devanagari support for Hindi

**Files to modify**: `style.css` (global font-family rules)

### 🚧 5. Card Style Migration
**Current**: Mix of old `.card` styles  
**Needed**:
- Migrate to `.card-v2` with new border/shadow
- Update border-radius to 20-24px
- Apply new `--mc-line` borders

**Files to modify**: `style.css` (`.card` styles globally)

### 🚧 6. Button Style Updates
**Current**: Rose/green buttons with old shadows  
**Needed**:
- Primary buttons: `--mc-rose` background
- Secondary buttons: `--mc-surface` with `--mc-line` border
- Gold accent buttons for special actions
- Consistent 12-16px border-radius

**Files to modify**: `style.css` (button styles)

### 🚧 7. Empty States
**Current**: Simple text messages  
**Needed**:
- Use `.empty-state` class with icon
- Consistent messaging across all features
- Call-to-action buttons

**Files to modify**: Multiple `app-*.js` files

---

## Testing Checklist

Before deploying, verify:

### Design Tokens
- [ ] New CSS variables load without breaking existing styles
- [ ] Fonts (Fraunces, Hind) load from Google Fonts
- [ ] Old color variables still work (backward compatibility)

### Journey Thread
- [ ] Thread renders when due date is set
- [ ] Current position marker shows correct week
- [ ] T1/T2 beads highlight when reached
- [ ] Baby info updates based on current week
- [ ] Empty state shows when no due date
- [ ] "Set Your Due Date" button works
- [ ] Thread animates smoothly (no jank)

### Weight Chart
- [ ] Chart renders with weight data
- [ ] Healthy band shows correct range
- [ ] Data points connect with line
- [ ] Latest entry highlighted in gold
- [ ] Axis labels show correct weeks/weights
- [ ] Empty state shows when no data
- [ ] Chart scales dynamically with data range

### Accessibility
- [ ] All interactive elements have focus styles
- [ ] SVG elements have `aria-hidden="true"`
- [ ] Reduced motion respected (`prefers-reduced-motion`)
- [ ] Keyboard navigation works
- [ ] Screen reader announces key information

### Performance
- [ ] Bundle size acceptable (currently 582.8 KB minified)
- [ ] No layout shifts when chart/thread renders
- [ ] Smooth 60fps animations
- [ ] No console errors

---

## Migration Strategy

### Phase 1: Foundation (Current)
✅ CSS tokens added  
✅ Fonts loaded  
✅ Utility classes added  
✅ Journey thread implemented  
✅ Weight chart implemented  

### Phase 2: Core Components (Next Sprint)
- Redesign dashboard summary cards
- Update bottom navigation
- Migrate button styles globally
- Update card styles globally

### Phase 3: Polish (Future)
- Typography migration (Fraunces/Hind everywhere)
- Background gradient update
- Empty states for all features
- Smooth transitions between old/new styles

### Phase 4: Complete Migration (Future)
- Remove old CSS variables
- Remove backward compatibility aliases
- Optimize bundle size
- Full design audit

---

## Code Examples

### Using the Journey Thread

```javascript
// In your due date setter function
async function setDueDate(date) {
  await window.supa.from('user_profile')
    .update({ due_date: date })
    .eq('id', window.user.id);
  
  // Trigger journey thread render
  if (window.MC && window.MC.renderJourneyThread) {
    window.MC.renderJourneyThread();
  }
}
```

### Using the Weight Chart

```javascript
// After logging weight
async function logWeight(weight, week) {
  await window.supa.from('weight_logs')
    .insert({
      user_id: window.user.id,
      weight_kg: weight,
      week: week,
      logged_at: new Date().toISOString()
    });
  
  // Trigger chart update
  if (window.MC && window.MC.enhanceWeightPage) {
    await window.MC.enhanceWeightPage();
  }
}
```

### Creating Summary Cards (Manual)

```html
<div class="summary-grid">
  <div class="summary-card" onclick="handleHydrationClick()">
    <div class="summary-card-bg-icon">
      <i data-lucide="droplets" style="width:90px;height:90px"></i>
    </div>
    <div class="summary-card-icon" style="background:var(--mc-sage-tint);color:var(--mc-sage)">
      <i data-lucide="droplets" style="width:18px;height:18px"></i>
    </div>
    <h3 class="summary-card-title">Hydration</h3>
    <p class="summary-card-subtitle">3 of 8 glasses</p>
    <div class="summary-progress">
      <div class="summary-progress-bar filled"></div>
      <div class="summary-progress-bar filled"></div>
      <div class="summary-progress-bar filled"></div>
      <div class="summary-progress-bar"></div>
      <div class="summary-progress-bar"></div>
      <div class="summary-progress-bar"></div>
      <div class="summary-progress-bar"></div>
      <div class="summary-progress-bar"></div>
    </div>
  </div>
</div>
```

---

## Troubleshooting

### Journey Thread Not Showing
1. Check if `due_date` is set: `userData?.due_date`
2. Verify `#dbHero` element exists
3. Check console for JavaScript errors
4. Ensure bundle.js loaded successfully

### Weight Chart Not Rendering
1. Check if weight data exists in database
2. Verify `#weightChartContainer` element created
3. Check if `window.lucide` is loaded for icons
4. Inspect SVG for NaN values (bad data)

### Fonts Not Loading
1. Check Google Fonts link in `<head>`
2. Verify network request succeeded (DevTools Network tab)
3. Check for CSP violations (console errors)
4. Fallback to DM Sans if Fraunces/Hind fail

### Colors Look Wrong
1. Check if old CSS variables override new ones
2. Verify `:root` in style.css loaded
3. Use browser DevTools to inspect computed values
4. Check for `!important` declarations overriding

---

## Performance Notes

### Bundle Size Impact
- **Before v2**: 570.3 KB minified
- **After v2**: 582.8 KB minified
- **Increase**: +12.5 KB (2.2%)

### What Added Size
- `app-dashboard-v2.js`: 10.6 KB
- `app-weight-tracker-v2.js`: 9.6 KB
- CSS utilities: ~2 KB

### Optimization Opportunities
1. Lazy load v2 components (only when dashboard/weight visited)
2. Use CSS `contain` for chart/thread rendering
3. Debounce chart re-renders on window resize
4. Use `will-change` sparingly for animations

---

## Browser Support

### Minimum Requirements
- **Chrome/Edge**: 90+ (Supports CSS custom properties, SVG 2)
- **Safari**: 14+ (iOS 14+)
- **Firefox**: 88+

### Degradation Strategy
- Journey thread: Falls back to text-only progress if SVG fails
- Weight chart: Shows table if SVG not supported
- Fonts: Falls back to DM Sans, then system fonts
- Colors: Old variables work if new ones fail

---

## Next Steps

1. **Test Thoroughly**: Clear cache, test journey thread and weight chart
2. **Gather Feedback**: Show to users, collect reactions
3. **Plan Phase 2**: Dashboard summary cards, bottom nav redesign
4. **Document Learnings**: What worked, what needs improvement

---

**Questions or Issues?** Check browser console for error messages. All v2 components log initialization messages.

**Want to Contribute?** See migration strategy above for next components to update.
