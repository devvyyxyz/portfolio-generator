/**
 * Modular Y2K Preloader Handler
 * Manages the preloader display - only disappears after components are loaded
 */

const PreloaderManager = {
  preloaderElement: null,

  init() {
    this.preloaderElement = document.getElementById('y2kPreloader');
    
    if (!this.preloaderElement) {
      console.warn('Preloader element not found');
      return;
    }

    // Listen for component load completion
    document.addEventListener('componentsLoaded', () => this.hidePreloader());
    
    // Fallback: Hide after 10 seconds max if components don't finish loading
    setTimeout(() => {
      this.hidePreloader();
    }, 10000);
  },

  hidePreloader() {
    if (this.preloaderElement && !this.preloaderElement.classList.contains('hidden')) {
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
