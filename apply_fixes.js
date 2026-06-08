// Apply critical fixes to app.js
const fs = require('fs');

let content = fs.readFileSync('app.js', 'utf8');

// Fix 1: Add setupOTPPaste function after otpInput
const otpInputPattern = /function otpInput\(el, idx\) \{[^}]+\}/;
const otpInputMatch = content.match(otpInputPattern);

if (otpInputMatch && !content.includes('function setupOTPPaste')) {
  const setupOTPPasteFunc = `

// Handle OTP paste — fills all 6 boxes from a pasted 6-digit code
function setupOTPPaste() {
  for(let i=0;i<6;i++){
    const inp=$('otp'+i);
    if(!inp) continue;
    inp.addEventListener('paste', e=>{
      e.preventDefault();
      const text=(e.clipboardData||window.clipboardData).getData('text').replace(/\\D/g,'').slice(0,6);
      if(!text) return;
      for(let j=0;j<6;j++){
        const box=$('otp'+j);
        if(box) box.value=text[j]||'';
      }
      $('otp'+(Math.min(text.length,5)))?.focus();
      if(text.length===6) verifyOTP();
    });
    // Also handle backspace to go back
    inp.addEventListener('keydown', e=>{
      if(e.key==='Backspace'&&!inp.value&&i>0) $('otp'+(i-1))?.focus();
    });
  }
}`;
  
  content = content.replace(otpInputMatch[0], otpInputMatch[0] + setupOTPPasteFunc);
  console.log('✓ Added setupOTPPaste function');
}

// Fix 2: Add medicine scheduling to loadMedicines
if (content.includes('async function loadMedicines()') && !content.includes('medsForSchedule')) {
  content = content.replace(
    /renderMedicines\(\);(\s*)\}/,
    `renderMedicines();$1  // Re-schedule reminders for all active medicines$1  if(window.scheduleMedicineReminders && medicines.length){$1    const medsForSchedule=medicines.map(m=>({...m,reminder_time:m.time_of_day}));$1    window.scheduleMedicineReminders(medsForSchedule);$1  }$1}`
  );
  console.log('✓ Added medicine scheduling to loadMedicines');
}

// Fix 3: Add medicine scheduling to addMedicine
if (content.includes('async function addMedicine()') && !content.match(/addMedicine[\s\S]{0,500}scheduleMedicineReminders/)) {
  content = content.replace(
    /(toggleAddMedForm\(\);flash\('med-save',T\.synced\);loadMedicines\(\);)/,
    `$1\n  // Schedule local reminder for this medicine\n  if(window.scheduleMedicineReminders){\n    const newMed={name,dose:$('medDose')?.value||'1 tablet',reminder_time:$('medTime')?.value||'08:00',notes:$('medNotes')?.value||''};\n    window.scheduleMedicineReminders([newMed]);\n  }`
  );
  console.log('✓ Added medicine scheduling to addMedicine');
}

// Fix 4: Add push scheduling on login
if (content.includes('window.ONBOARD.checkOnboarding') && !content.includes('scheduleDailyWaterReminders')) {
  content = content.replace(
    /(if \(window\.ONBOARD\)\s+window\.ONBOARD\.checkOnboarding\(u\);)/,
    `$1\n  // Schedule push reminders if permission already granted\n  if (Notification.permission === 'granted') {\n    if (window.scheduleDailyWaterReminders) window.scheduleDailyWaterReminders();\n    if (window.scheduleWeeklyUpdate) window.scheduleWeeklyUpdate();\n  }`
  );
  console.log('✓ Added push scheduling on login');
}

fs.writeFileSync('app.js', content, 'utf8');
console.log('\n✅ All fixes applied to app.js');
