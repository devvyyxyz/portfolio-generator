/**
 * Modular Y2K Preloader Handler
 * Manages the preloader display with a minimum 3-second duration
 */

const PreloaderManager = {
  startTime: Date.now(),
  minDuration: 3000, // 3 seconds
  preloaderElement: null,

  init() {
    this.preloaderElement = document.getElementById('y2kPreloader');
    
    if (!this.preloaderElement) {
      console.warn('Preloader element not found');
      return;
    }

    // Listen for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.checkHidePreloader());
    } else {
      this.checkHidePreloader();
    }

    // Also listen for full page load
    window.addEventListener('load', () => this.checkHidePreloader());
  },

  checkHidePreloader() {
    if (!this.preloaderElement) return;

    const elapsedTime = Date.now() - this.startTime;
    const remainingTime = Math.max(0, this.minDuration - elapsedTime);

    if (remainingTime > 0) {
      setTimeout(() => {
        this.hidePreloader();
      }, remainingTime);
    } else {
      this.hidePreloader();
    }
  },

  hidePreloader() {
    if (this.preloaderElement) {
      this.preloaderElement.classList.add('hidden');
    }
  }
};

// Initialize preloader when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PreloaderManager.init());
} else {
  PreloaderManager.init();
}
