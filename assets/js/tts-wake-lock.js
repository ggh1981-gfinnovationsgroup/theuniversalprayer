/**
 * tts-wake-lock.js — Wake Lock + Speech Synthesis keep-alive for The Universal Prayer
 *
 * Prevents the device from going to standby/sleep while TTS is playing.
 * Uses the Screen Wake Lock API (supported on Chrome Android, Safari 16.4+).
 * Falls back gracefully on unsupported browsers.
 *
 * Usage:
 *   tupTTS.acquire()   — call when TTS starts
 *   tupTTS.release()   — call when TTS stops/finishes
 */
(function () {
  'use strict';

  var _lock = null;
  var _active = false;

  async function acquire() {
    _active = true;
    if (!('wakeLock' in navigator)) return;
    try {
      _lock = await navigator.wakeLock.request('screen');
    } catch (e) {
      // Not supported or permission denied — silently continue
    }
  }

  function release() {
    _active = false;
    if (_lock) {
      _lock.release().catch(function () {});
      _lock = null;
    }
  }

  // When the tab becomes visible again (user returns from another app or
  // unlocks the screen), re-acquire the lock and resume speech if paused.
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState !== 'visible') return;
    if (_active) {
      acquire();
      // Some browsers pause speechSynthesis on visibility loss; resume it.
      if (window.speechSynthesis && window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    }
  });

  window.tupTTS = { acquire: acquire, release: release };
})();
