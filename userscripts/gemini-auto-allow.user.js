// ==UserScript==
// @name         Gemini auto-allow (runabout only)
// @namespace    gemini-web-coding
// @version      1.0.0
// @description  Auto-click "Always allow" on Gemini's tool-permission card, only for the runabout app. Works with the tab in the background.
// @match        https://gemini.google.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Only approve cards from this app. Change if your app has another name.
  const APP_NAME = 'runabout';
  // Button labels to click, in order of preference (English and Chinese UI).
  const LABELS = ['Always allow', '始终允许', 'Allow once', '允许一次'];
  // Labels that must never be clicked.
  const NEVER = ["Don't allow", '不允许'];

  const clicked = new WeakSet();
  let count = 0;

  function cardOf(btn) {
    // Walk up to the smallest ancestor that also holds the app name.
    let el = btn.parentElement;
    for (let i = 0; el && i < 8; i++, el = el.parentElement) {
      const t = el.innerText || '';
      if (t.includes(APP_NAME) && t.length < 600) return el;
    }
    return null;
  }

  function scan() {
    const buttons = Array.from(document.querySelectorAll('button'));
    for (const label of LABELS) {
      for (const btn of buttons) {
        if (clicked.has(btn) || btn.disabled) continue;
        const text = (btn.innerText || '').trim();
        if (text !== label || NEVER.includes(text)) continue;
        const card = cardOf(btn);
        if (!card) continue; // not a runabout permission card
        clicked.add(btn);
        count++;
        console.log(`[auto-allow] #${count} clicked "${text}"`);
        btn.click();
        return; // one card per pass; the next mutation triggers the next pass
      }
    }
  }

  // DOM changes still fire in background tabs, so this does not need focus.
  new MutationObserver(() => scan()).observe(document.body, {
    childList: true,
    subtree: true,
  });
  // Fallback poll (browsers slow this to about once a minute in hidden tabs).
  setInterval(scan, 3000);
  scan();
})();
