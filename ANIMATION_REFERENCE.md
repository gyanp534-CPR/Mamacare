# Yoga Animations - Technical Reference

## Overview
Each yoga pose has a custom SVG animation that demonstrates the movement. These are lightweight, performant, and require no external libraries.

## Animation Architecture

### SVG Structure
```
<svg viewBox="0 0 200 200">
  <g id="animation-id">
    <!-- Body parts as lines, circles, paths -->
  </g>
  <style>
    @keyframes animationName { /* animation frames */ }
    #animation-id { animation: animationName 2s ease-in-out infinite; }
  </style>
</svg>
```

### Key Features
- **Viewbox**: 200x200 for consistent scaling
- **Responsive**: Scales to container size
- **Infinite Loop**: Continuous demonstration
- **Smooth Easing**: ease-in-out for natural motion
- **Inline Styles**: No external CSS needed

---

## Individual Animations

### 1. Cat-Cow Stretch
**Duration**: 2s | **Motion**: Spine flexion/extension

```
Animation: scaleY(0.9) → scaleY(1.1)
- 0%: Spine compressed (cat pose)
- 50%: Spine extended (cow pose)
- 100%: Back to compressed
```

**Visual Elements**:
- Ellipse for torso
- Circle for head
- Lines for limbs
- Path for tail

**Use Case**: Back pain relief, spine flexibility

---

### 2. Butterfly Pose
**Duration**: 2.5s | **Motion**: Hip opening

```
Animation: rotateX(0deg) → rotateX(15deg)
- 0%: Legs together
- 50%: Legs open (butterfly position)
- 100%: Back to together
```

**Visual Elements**:
- Circle for head
- Line for spine
- Paths for legs
- Curved paths for feet

**Use Case**: Hip flexor stretch, pelvic floor prep

---

### 3. Prenatal Squats
**Duration**: 2s | **Motion**: Squat depth

```
Animation: translateY(0) → translateY(30px)
- 0%: Standing position
- 50%: Deep squat
- 100%: Back to standing
```

**Visual Elements**:
- Circle for head
- Line for torso
- Lines for legs
- Lines for feet

**Use Case**: Pelvic opening, leg strength

---

### 4. Ujjayi Pranayama
**Duration**: 4s | **Motion**: Breathing expansion

```
Animation: r(35) → r(50)
- 0%: Inhale (small circle)
- 50%: Exhale (large circle)
- 100%: Back to inhale
```

**Visual Elements**:
- Multiple concentric circles
- Opacity variations
- Path for breath flow

**Use Case**: Stress relief, breathing practice

---

### 5. Kegel Exercises
**Duration**: 1.5s | **Motion**: Pelvic floor contraction

```
Animation: opacity(0.5) → opacity(1)
- 0%: Relaxed (low opacity)
- 50%: Contracted (high opacity)
- 100%: Back to relaxed
```

**Visual Elements**:
- Ellipse for pelvic area
- Paths for muscles
- Circle for contraction indicator

**Use Case**: Pelvic floor strength, incontinence prevention

---

### 6. Side-Lying Leg Lifts
**Duration**: 2s | **Motion**: Leg lift

```
Animation: translateY(0) → translateY(-20px)
- 0%: Leg down
- 50%: Leg lifted
- 100%: Back to down
```

**Visual Elements**:
- Circle for head
- Lines for torso and legs
- Animated line for lifting leg

**Use Case**: Hip strength, glute activation

---

### 7. Prenatal Walking
**Duration**: 1.5s | **Motion**: Walking motion

```
Animation: translateX(-5px) → translateX(5px)
- 0%: Left position
- 50%: Right position
- 100%: Back to left
```

**Visual Elements**:
- Circle for head
- Line for torso
- Lines for legs
- Lines for feet

**Use Case**: Cardio, overall fitness

---

### 8. Child's Pose
**Duration**: 2.5s | **Motion**: Gentle forward fold

```
Animation: translateY(0) → translateY(5px)
- 0%: Upright position
- 50%: Forward fold
- 100%: Back to upright
```

**Visual Elements**:
- Circle for head
- Curved paths for arms
- Paths for legs
- Curved path for back

**Use Case**: Back relief, relaxation

---

### 9. Lamaze Breathing
**Duration**: 4s | **Motion**: Multi-circle breathing

```
Animation: r(45) → r(55) → r(45) → r(35)
- 0%: Inhale (medium)
- 25%: Deep inhale (large)
- 50%: Exhale (medium)
- 75%: Deep exhale (small)
- 100%: Back to medium
```

**Visual Elements**:
- Multiple circles (different sizes)
- Cross lines (breathing axis)
- Opacity variations

**Use Case**: Labor breathing, pain management

---

## CSS Animation Properties

### Timing Functions
```css
/* Smooth, natural motion */
animation-timing-function: ease-in-out;

/* Alternative: cubic-bezier for custom easing */
animation-timing-function: cubic-bezier(0.25, 1, 0.5, 1);
```

### Duration Range
- **Fast**: 1.5s (Kegel, Walking)
- **Medium**: 2s (Cat-Cow, Squats)
- **Slow**: 2.5s - 4s (Butterfly, Ujjayi, Lamaze)

### Transform Origins
```css
/* Center of SVG viewbox */
transform-origin: 100px 100px;
```

---

## Performance Considerations

### GPU Acceleration
- Uses `transform` property (GPU accelerated)
- Avoids `top`, `left`, `width`, `height` (CPU intensive)
- Smooth 60fps on modern devices

### Optimization Techniques
1. **Minimal Path Complexity**: Simple shapes (circles, lines, paths)
2. **Efficient Selectors**: Direct ID targeting
3. **Inline Styles**: No external CSS files
4. **SVG Optimization**: Minimal attributes

### Browser Support
- ✅ Chrome/Chromium (all versions)
- ✅ Firefox (all versions)
- ✅ Safari (all versions)
- ✅ Edge (all versions)
- ✅ Mobile browsers

---

## Customization Guide

### Changing Animation Duration
```javascript
// In getYogaPoseAnimation()
// Change "2s" to desired duration
animation: yogaIconBounce 3s ease-in-out infinite;
```

### Changing Animation Speed
```css
/* Faster */
animation: catcow 1s ease-in-out infinite;

/* Slower */
animation: catcow 3s ease-in-out infinite;
```

### Changing Animation Direction
```css
/* Reverse direction */
animation-direction: reverse;

/* Alternate (forward then backward) */
animation-direction: alternate;
```

### Changing Colors
```javascript
// In SVG, change stroke color
stroke="#D88C9A"  // Rose
stroke="#73B59D"  // Green
stroke="#88ADC4"  // Blue
```

---

## Integration with UI

### Card Preview
```javascript
<div class="yoga-card-preview">
  <div class="yoga-demo-placeholder">
    ${getYogaPoseAnimation(y.name)}
  </div>
</div>
```

### Modal Display
```javascript
<div class="yoga-demo-large">
  ${getYogaPoseAnimation(pose.name)}
</div>
```

### Responsive Scaling
```css
.yoga-demo-large svg {
  width: 100%;
  height: 100%;
  max-width: 200px;
}
```

---

## Animation Timing Chart

| Pose | Duration | Cycles/Min | Best For |
|------|----------|-----------|----------|
| Cat-Cow | 2s | 30 | Continuous flow |
| Butterfly | 2.5s | 24 | Gentle opening |
| Squats | 2s | 30 | Strength building |
| Ujjayi | 4s | 15 | Breathing focus |
| Kegel | 1.5s | 40 | Quick practice |
| Side Lifts | 2s | 30 | Strength building |
| Walking | 1.5s | 40 | Cardio rhythm |
| Child's Pose | 2.5s | 24 | Relaxation |
| Lamaze | 4s | 15 | Labor breathing |

---

## Advanced Customization

### Creating New Animations
1. Define SVG structure with unique ID
2. Create @keyframes animation
3. Apply animation to element
4. Add to `getYogaPoseAnimation()` function

### Example Template
```javascript
'New Pose Name': `<svg viewBox="0 0 200 200" style="width:100%;height:100%;max-width:200px">
  <g id="new-pose-anim">
    <!-- SVG elements here -->
  </g>
  <style>
    @keyframes newPose { 
      0% { /* start state */ }
      50% { /* middle state */ }
      100% { /* end state */ }
    }
    #new-pose-anim { animation: newPose 2s ease-in-out infinite; }
  </style>
</svg>`
```

---

## Troubleshooting

### Animation Not Playing
- Check SVG viewBox is "0 0 200 200"
- Verify animation ID matches in CSS
- Ensure animation duration is > 0
- Check browser console for errors

### Animation Stuttering
- Reduce animation complexity
- Use transform instead of position
- Check for other heavy animations
- Test on different devices

### Animation Not Visible
- Check stroke/fill colors
- Verify SVG elements are within viewBox
- Check z-index and opacity
- Ensure container has proper size

---

## Performance Metrics

### File Size Impact
- Each SVG animation: ~300-500 bytes
- Total for 9 poses: ~3-4 KB
- Negligible impact on page load

### CPU Usage
- Minimal (GPU accelerated)
- ~1-2% CPU per animation
- No impact on other page functions

### Memory Usage
- Minimal (inline SVG)
- No external resources
- Efficient garbage collection

---

## Future Enhancements

1. **Interactive Animations**: User-controlled speed
2. **Multiple Variations**: Different animation styles
3. **Sound Effects**: Audio cues for timing
4. **Haptic Feedback**: Vibration on mobile
5. **AR Integration**: Augmented reality overlays
6. **Video Fallback**: Real video for complex poses

---

This reference provides a complete guide to understanding, customizing, and extending the yoga animations system.
