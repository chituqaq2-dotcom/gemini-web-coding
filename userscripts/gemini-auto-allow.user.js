// ==UserScript==
// @name         Gemini auto-allow (runabout only)
// @namespace    gemini-web-coding
// @version      1.1.0
// @description  Auto-click "Always allow" on Gemini's tool-permission card, only for the runabout app. Works with the tab in the background.
// @match        https://gemini.google.com/*
// @run-at       document-idle
// @grant        none
// @updateURL    https://raw.githubusercontent.com/chituqaq2-dotcom/gemini-web-coding/main/userscripts/gemini-auto-allow.user.js
// @downloadURL  https://raw.githubusercontent.com/chituqaq2-dotcom/gemini-web-coding/main/userscripts/gemini-auto-allow.user.js
// ==/UserScript==

// 1.1.0: 1.0.0 never clicked on the live page. Now: searches shadow DOM too,
// matches role=button and custom elements, normalizes text/aria-label,
// identifies the card by its "Let Gemini use" / "允许 Gemini" wording plus the
// app name (walking up to 20 levels), and fires a full pointer/mouse click.
// Logs every decision to the console with the [auto-allow] prefix.

(function () {
  'use strict';

  const APP_NAME = 'runabout';
  const CARD_HINTS = ['Let Gemini use', 'Choose to let Gemini', '允许 Gemini', '让 Gemini'];
  const LABELS = ['always allow', '始终允许', '一律允许', '总是允许'];
  const NEVER = ["don't allow", 'dont allow', '不允许', 'allow once', '允许一次'];

  const done = new WeakSet();
  const warned = new WeakSet();
  let count = 0;
  const log = (...a) => console.log('[auto-allow]', ...a);

  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

  function labelOf(el) {
    return norm(el.innerText || el.textContent) || norm(el.getAttribute('aria-label'));
  }

  // Collect clickable candidates, descending into open shadow roots.
  function candidates(root, out) {
    const els = root.querySelectorAll('*');
    for (const el of els) {
      const tag = el.tagName;
      if (tag === 'BUTTON' || el.getAttribute('role') === 'button' || tag.includes('-BUTTON')) {
        out.push(el);
      }
      if (el.shadowRoot) candidates(el.shadowRoot, out);
    }
    return out;
  }

  function textUp(el) {
    // innerText of the node, crossing shadow boundaries via host.
    return el.innerText || el.textContent || '';
  }

  function cardOf(btn) {
    let el = btn;
    for (let i = 0; el && i < 20; i++) {
      el = el.parentElement || (el.getRootNode && el.getRootNode().host) || null;
      if (!el) break;
      const t = textUp(el);
      if (t.length > 3000) return null; // walked past the card
      if (t.includes(APP_NAME) && CARD_HINTS.some((h) => t.includes(h))) return el;
    }
    return null;
  }

  function realClick(el) {
    const r = el.getBoundingClientRect();
    const opts = { bubbles: true, cancelable: true, composed: true, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2, button: 0 };
    for (const type of ['pointerdown', 'mousedown', 'pointerup', 'mouseup']) {
      const E = type.startsWith('pointer') && window.PointerEvent ? PointerEvent : MouseEvent;
      el.dispatchEvent(new E(type, opts));
    }
    el.click();
  }

  function scan() {
    const list = candidates(document, []);
    for (const btn of list) {
      if (done.has(btn) || btn.disabled || btn.getAttribute('aria-disabled') === 'true') continue;
      const text = labelOf(btn);
      if (!text || NEVER.some((n) => text === n)) continue;
      if (!LABELS.some((l) => text === l || text.endsWith(l))) continue;
      const card = cardOf(btn);
      if (!card) {
        if (!warned.has(btn)) { warned.add(btn); log('found', JSON.stringify(text), 'but no runabout card around it; skipped'); }
        continue;
      }
      done.add(btn);
      count++;
      log(`#${count} clicking`, JSON.stringify(text));
      realClick(btn);
      return;
    }
  }

  log('loaded v1.1.0');
  // Throttle: Gemini streams text, which fires many mutations.
  let pending = false;
  new MutationObserver(() => {
    if (pending) return;
    pending = true;
    setTimeout(() => { pending = false; scan(); }, 300);
  }).observe(document.documentElement, { childList: true, subtree: true });
  setInterval(scan, 2000);
  scan();
})();
