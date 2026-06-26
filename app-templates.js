/**
 * MamaCare — Template Helper System
 * Replaces massive HTML string literals with maintainable functions
 * 
 * Benefits:
 * - Cleaner code (no inline styles in JS strings)
 * - Easier to modify (designers can work with HTML/CSS)
 * - Reusable components
 * - Better syntax highlighting
 */

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

const html = {
  /**
   * Escape HTML to prevent XSS (backup to DOMPurify)
   */
  escape: (str) => {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Sanitize and set HTML (uses DOMPurify if available)
   */
  safe: (htmlString) => {
    return window.DOMPurify ? DOMPurify.sanitize(htmlString) : htmlString;
  }
};

// ═══════════════════════════════════════════════════════════
// COMPONENT TEMPLATES
// ═══════════════════════════════════════════════════════════

const Templates = {
  
  /**
   * Card Component
   */
  card: ({ title, label, content, className = '' }) => `
    <div class="card ${className}">
      ${label ? `<div class="sec-label">${html.escape(label)}</div>` : ''}
      ${title ? `<div class="sec-title">${html.escape(title)}</div>` : ''}
      ${content}
    </div>
  `,

  /**
   * Stat Card (3-column grid)
   */
  statCard: ({ icon, label, value, color = 'var(--accent)' }) => `
    <div style="text-align:center;padding:12px;background:rgba(232,160,168,0.06);border-radius:12px;border:1px solid var(--blush)">
      <i data-lucide="${icon}" style="width:20px;height:20px;color:${color};margin-bottom:6px"></i>
      <div style="font-size:22px;font-weight:700;color:${color};margin-bottom:2px">${html.escape(value)}</div>
      <div style="font-size:11.5px;color:var(--muted);font-weight:500">${html.escape(label)}</div>
    </div>
  `,

  /**
   * Empty State
   */
  emptyState: ({ icon = 'flower-2', message, actionText, actionClick }) => `
    <div style="text-align:center;padding:32px 20px;color:var(--muted)">
      <i data-lucide="${icon}" style="width:48px;height:48px;margin-bottom:12px;opacity:0.3"></i>
      <p style="font-size:13px;margin-bottom:16px">${html.escape(message)}</p>
      ${actionText ? `<button class="btn btn-g btn-sm" onclick="${actionClick}">${html.escape(actionText)}</button>` : ''}
    </div>
  `,

  /**
   * List Item (generic)
   */
  listItem: ({ icon, title, subtitle, meta, actions, className = '' }) => `
    <div class="${className}" style="background:white;border-radius:14px;padding:14px;margin-bottom:9px;border:1.5px solid rgba(232,160,168,.15)">
      <div style="display:flex;justify-content:space-between;align-items:flex-start">
        <div style="flex:1">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
            ${icon ? `<i data-lucide="${icon}" style="width:18px;height:18px;color:var(--accent)"></i>` : ''}
            <span style="font-size:14px;font-weight:600;color:var(--warm)">${title}</span>
          </div>
          ${subtitle ? `<p style="font-size:13px;line-height:1.6;color:var(--muted);margin:4px 0">${subtitle}</p>` : ''}
          ${meta ? `<div style="font-size:12px;color:var(--muted);margin-top:6px">${meta}</div>` : ''}
        </div>
        ${actions ? `<div style="display:flex;gap:8px;align-items:center">${actions}</div>` : ''}
      </div>
    </div>
  `,

  /**
   * Feature Grid Item (dashboard)
   */
  featureItem: ({ icon, label, page, color, bgColor }) => `
    <div class="feature-item" data-page="${page}" ${bgColor ? `style="background:${bgColor};border-color:${color}"` : ''}>
      <div class="mi-icon">
        <i data-lucide="${icon}" ${color ? `style="color:${color}"` : ''}></i>
      </div>
      <div class="mi-label" ${color ? `style="color:${color}"` : ''}>${html.escape(label)}</div>
    </div>
  `,

  /**
   * Timeline Progress Bar
   */
  progressBar: ({ percent, color = 'var(--accent)' }) => `
    <div class="timeline-bar">
      <div class="timeline-fill" style="width:${percent}%;background:${color}"></div>
    </div>
    <div style="text-align:right;font-size:12.5px;font-weight:700;color:${color};margin-top:4px">
      ${Math.round(percent)}%
    </div>
  `,

  /**
   * Tab Button
   */
  tabButton: ({ label, active = false, onClick, icon }) => `
    <button class="tab-btn ${active ? 'active' : ''}" onclick="${onClick}">
      ${icon ? `<i data-lucide="${icon}" class="app-icon-inline"></i>` : ''}
      ${html.escape(label)}
    </button>
  `,

  /**
   * Badge/Pill
   */
  badge: ({ text, color = 'var(--accent)', bg = 'var(--blush)' }) => `
    <span style="font-size:11px;background:${bg};color:${color};padding:2px 9px;border-radius:50px;font-weight:500">
      ${html.escape(text)}
    </span>
  `,

  /**
   * Icon Button
   */
  iconButton: ({ icon, onClick, title = '', color = 'var(--muted)' }) => `
    <button onclick="${onClick}" title="${html.escape(title)}" 
            style="background:none;border:none;color:${color};cursor:pointer;padding:4px">
      <i data-lucide="${icon}" class="app-icon-inline"></i>
    </button>
  `,

  /**
   * Hero Section (with gradient)
   */
  hero: ({ emoji, title, subtitle, action }) => `
    <div style="text-align:center;padding:28px 20px;background:linear-gradient(135deg,rgba(232,160,168,.12),rgba(247,196,168,.1));border-radius:20px;margin-bottom:20px">
      ${emoji ? `<div style="font-size:48px;margin-bottom:12px">${emoji}</div>` : ''}
      <h2 style="font-family:'Cormorant Garamond',serif;font-size:clamp(1.7rem,4.5vw,2.2rem);font-weight:400;color:var(--warm);margin-bottom:8px">
        ${title}
      </h2>
      ${subtitle ? `<p style="font-size:14px;color:var(--muted);line-height:1.6">${subtitle}</p>` : ''}
      ${action ? action : ''}
    </div>
  `,

  /**
   * Input Group
   */
  inputGroup: ({ label, id, type = 'text', placeholder = '', value = '', required = false }) => `
    <div>
      ${label ? `<label for="${id}">${html.escape(label)}${required ? ' <span style="color:var(--danger)">*</span>' : ''}</label>` : ''}
      <input type="${type}" id="${id}" placeholder="${html.escape(placeholder)}" ${value ? `value="${html.escape(value)}"` : ''} ${required ? 'required' : ''}>
    </div>
  `,

  /**
   * Select Group
   */
  selectGroup: ({ label, id, options, selected = '' }) => `
    <div>
      ${label ? `<label for="${id}">${html.escape(label)}</label>` : ''}
      <select id="${id}">
        ${options.map(opt => `
          <option value="${html.escape(opt.value)}" ${opt.value === selected ? 'selected' : ''}>
            ${html.escape(opt.label)}
          </option>
        `).join('')}
      </select>
    </div>
  `,

  /**
   * Chart Container
   */
  chartContainer: ({ id, height = 180 }) => `
    <div style="position:relative;height:${height}px;margin:16px 0">
      <canvas id="${id}" height="${height}"></canvas>
    </div>
  `,

  /**
   * Alert/Flash Message
   */
  alert: ({ type = 'info', message, icon }) => {
    const colors = {
      success: { bg: '#e8f5e9', color: '#2e7d32', icon: 'check-circle' },
      error: { bg: '#ffebee', color: '#c62828', icon: 'alert-circle' },
      warning: { bg: '#fff3e0', color: '#e65100', icon: 'alert-triangle' },
      info: { bg: '#e3f2fd', color: '#1565c0', icon: 'info' }
    };
    const theme = colors[type] || colors.info;
    return `
      <div style="background:${theme.bg};color:${theme.color};padding:12px 16px;border-radius:12px;display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <i data-lucide="${icon || theme.icon}" style="width:20px;height:20px;flex-shrink:0"></i>
        <div style="flex:1;font-size:13px;line-height:1.5">${message}</div>
      </div>
    `;
  },

  /**
   * Modal/Dialog Structure
   */
  modal: ({ title, content, actions, closeButton = true }) => `
    <div class="modal-overlay" onclick="this.remove()">
      <div class="modal-content" onclick="event.stopPropagation()" style="background:white;border-radius:20px;padding:24px;max-width:500px;width:90%;max-height:80vh;overflow-y:auto">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
          <h3 style="font-size:1.3rem;color:var(--warm);margin:0">${html.escape(title)}</h3>
          ${closeButton ? `<button onclick="this.closest('.modal-overlay').remove()" style="background:none;border:none;cursor:pointer;color:var(--muted)"><i data-lucide="x" style="width:24px;height:24px"></i></button>` : ''}
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${actions ? `<div class="modal-actions" style="display:flex;gap:10px;justify-content:flex-end;margin-top:20px">${actions}</div>` : ''}
      </div>
    </div>
  `
};

// ═══════════════════════════════════════════════════════════
// LAYOUT HELPERS
// ═══════════════════════════════════════════════════════════

const Layout = {
  /**
   * 2-column grid
   */
  grid2: (items) => `
    <div class="g2">
      ${items.join('')}
    </div>
  `,

  /**
   * 3-column grid
   */
  grid3: (items) => `
    <div class="g3">
      ${items.join('')}
    </div>
  `,

  /**
   * Feature grid (4 columns)
   */
  featureGrid: (items) => `
    <div class="feature-grid db-grid-4">
      ${items.join('')}
    </div>
  `,

  /**
   * Tab row
   */
  tabRow: (tabs) => `
    <div class="tab-row">
      ${tabs.join('')}
    </div>
  `,

  /**
   * Section with header
   */
  section: ({ label, title, content, className = '' }) => `
    <div class="dashboard-section ${className}">
      ${label || title ? `
        <div class="section-header">
          ${label ? `<div class="sec-label">${html.escape(label)}</div>` : ''}
          ${title ? `<div class="sec-title">${html.escape(title)}</div>` : ''}
        </div>
      ` : ''}
      ${content}
    </div>
  `
};

// ═══════════════════════════════════════════════════════════
// EXPORT (Make available globally)
// ═══════════════════════════════════════════════════════════

window.Templates = Templates;
window.Layout = Layout;
window.html = html;

console.log('📦 Template System loaded');
console.log('  Components:', Object.keys(Templates).length);
console.log('  Layouts:', Object.keys(Layout).length);
