/**
 * Secrets System
 * Hidden easter eggs and developer features
 * Easy to extend with new secrets
 */

class SecretsManager {
    constructor() {
        this.secrets = {};
        this.registerSecret('devOverlay', this.createDevOverlay);
        // Add more secrets here as you create them
    }

    registerSecret(name, initFunction) {
        this.secrets[name] = initFunction.bind(this);
        if (window.Logger) window.Logger.info(`Secret registered: ${name}`);
    }

    initializeAll() {
        if (window.Logger) window.Logger.group('Secrets');
        Object.entries(this.secrets).forEach(([name, init]) => {
            try {
                init();
            } catch (err) {
                if (window.Logger) window.Logger.error(`Secret init failed: ${name}`, err);
            }
        });
        if (window.Logger) window.Logger.groupEnd();
    }

    // ========== DEV OVERLAY SECRET ==========
    createDevOverlay() {
        if (window.__devOverlayInitialized) return;
        window.__devOverlayInitialized = true;
        
        let overlay = document.getElementById('devOverlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'devOverlay';
            overlay.className = 'dev-overlay';
            overlay.innerHTML = `
                <h4>Developer Mode</h4>
                <div class="dev-row"><span>Status</span><span id="dev-status">Idle</span></div>
                <div class="dev-row"><span>Theme</span><span id="dev-theme">Aero</span></div>
                <div class="dev-row"><span>Build</span><span>Aero v2.3.1</span></div>
                <div class="dev-row"><span>Page</span><span id="dev-page">Home</span></div>
                <div class="dev-row"><span>Browser</span><span id="dev-browser">Chrome</span></div>
                <div class="dev-row"><span>Memory</span><span id="dev-memory">--</span></div>
                <div class="dev-row"><span>Latency</span><span id="dev-latency">--</span></div>
                <div class="dev-row"><span>Music</span><span id="dev-music">--</span></div>
                <div class="dev-row"><span>FPS</span><span id="dev-fps">60</span></div>
            `;
            document.body.appendChild(overlay);
        }

        // Get page name
        const pageName = this.getPageName();
        const pageEl = document.getElementById('dev-page');
        if (pageEl) pageEl.textContent = pageName;

        // Get browser
        const browserEl = document.getElementById('dev-browser');
        if (browserEl) browserEl.textContent = this.detectBrowser();

        // Track FPS
        let fpsLast = performance.now();
        let frameCount = 0;
        let fpsValue = 60;

        function trackFPS(now) {
            frameCount++;
            if (now - fpsLast >= 1000) {
                fpsValue = frameCount;
                frameCount = 0;
                fpsLast = now;
                const fpsEl = document.getElementById('dev-fps');
                if (fpsEl) fpsEl.textContent = fpsValue;
            }
            requestAnimationFrame(trackFPS);
        }
        requestAnimationFrame(trackFPS);

        // Update memory and latency periodically
        setInterval(() => {
            const memEl = document.getElementById('dev-memory');
            if (memEl) memEl.textContent = `${(2 + Math.random() * 6).toFixed(1)} MB`;
            
            const latEl = document.getElementById('dev-latency');
            if (latEl) latEl.textContent = `${Math.floor(15 + Math.random() * 30)} ms`;

            const musicEl = document.getElementById('dev-music');
            if (musicEl) {
                const musicOn = localStorage.getItem('portfolioMusicEnabled') !== 'false';
                musicEl.textContent = musicOn ? 'Playing' : 'Off';
                musicEl.style.color = musicOn ? '#2ecc71' : 'inherit';
            }
        }, 1000);

        // Toggle on Ctrl+Shift+F
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                overlay.classList.toggle('active');
                const status = overlay.classList.contains('active') ? 'Online' : 'Idle';
                const statusEl = document.getElementById('dev-status');
                if (statusEl) statusEl.textContent = status;
                
                if (window.Logger) {
                    const isActive = overlay.classList.contains('active');
                    window.Logger.event('devOverlay', { status: isActive ? 'opened' : 'closed' });
                }
            }
        });

        if (window.Logger) window.Logger.success('Dev Overlay secret activated');
    }

    // Helper: Get current page name
    getPageName() {
        const path = window.location.pathname;
        if (path.includes('/pages/about')) return 'About';
        if (path.includes('/pages/work')) return 'Work';
        if (path.includes('/pages/blog')) return 'Blog';
        if (path.includes('/pages/connect')) return 'Connect';
        if (path.includes('/pages/contact')) return 'Contact';
        if (path.includes('/pages/gallery')) return 'Gallery';
        if (path.includes('/pages/sitemap')) return 'Sitemap';
        if (path.includes('/pages/privacy')) return 'Privacy';
        if (path.includes('/pages/terms')) return 'Terms';
        if (path.includes('index') || path === '/') return 'Home';
        return 'Unknown';
    }

    // Helper: Detect browser
    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    // ========== LOGO EASTER EGG (already exists in frutiger-main) ==========
    // Can be extended with new secrets following this pattern

}

// Initialize on DOM ready
let secretsManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        secretsManager = new SecretsManager();
    });
} else {
    secretsManager = new SecretsManager();
}

// Initialize secrets after components load and theme is set
document.addEventListener('componentsLoaded', () => {
    if (secretsManager) {
        secretsManager.initializeAll();
    }
});

// Expose for manual triggering if needed
window.SecretsManager = SecretsManager;
