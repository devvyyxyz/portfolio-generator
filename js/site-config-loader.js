/**
 * Site Config Loader
 * Simple utility to load and cache site configuration
 */

class SiteConfigLoader {
    constructor() {
        this.config = null;
        this.loading = false;
        this.loadPromise = null;
    }

    /**
     * Load site configuration
     * @returns {Promise<object>} Site config object
     */
    async load() {
        // Return cached config if available
        if (this.config) {
            return this.config;
        }

        // Return existing promise if already loading
        if (this.loading) {
            return this.loadPromise;
        }

        this.loading = true;
        this.loadPromise = this._fetchConfig();

        try {
            this.config = await this.loadPromise;
            return this.config;
        } finally {
            this.loading = false;
        }
    }

    /**
     * Fetch config from JSON file
     * @private
     */
    async _fetchConfig() {
        try {
            // Determine the correct path based on current location
            const isInSubdirectory = window.location.pathname.includes('/pages/');
            const configPath = isInSubdirectory ? '../site-config.json' : 'site-config.json';
            
            // Add cache busting parameter to ensure fresh data
            const cacheBuster = `?v=${Date.now()}`;
            
            const response = await fetch(configPath + cacheBuster);
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading site config:', error);
            // Return minimal fallback config
            return {
                personal: {
                    name: "Portfolio",
                    title: "Developer",
                    email: "contact@example.com",
                    location: "UK"
                },
                bio: {},
                social: {},
                theme: { default: "aero", available: ["aero"] }
            };
        }
    }

    /**
     * Get specific config value by path (e.g., 'personal.name')
     * @param {string} path - Dot-notation path to value
     * @returns {any} Config value or undefined
     */
    get(path) {
        if (!this.config) {
            console.warn('Config not loaded yet. Call load() first.');
            return undefined;
        }

        const parts = path.split('.');
        let value = this.config;

        for (const part of parts) {
            if (value && typeof value === 'object' && part in value) {
                value = value[part];
            } else {
                return undefined;
            }
        }

        return value;
    }

    /**
     * Get all config
     * @returns {object|null} Full config object
     */
    getAll() {
        return this.config;
    }

    /**
     * Apply config to DOM elements with data-config attributes
     */
    applyToDOM() {
        if (!this.config) {
            console.warn('Config not loaded yet. Call load() first.');
            return;
        }

        // Handle data-config (text content)
        document.querySelectorAll('[data-config]').forEach(element => {
            const path = element.getAttribute('data-config');
            const value = this.get(path);
            if (value !== undefined) {
                element.textContent = value;
            }
        });

        // Handle data-config-href (link URLs)
        document.querySelectorAll('[data-config-href]').forEach(element => {
            const path = element.getAttribute('data-config-href');
            const value = this.get(path);
            if (value !== undefined) {
                element.href = value;
            }
        });

        // Handle data-config-mailto (email links)
        document.querySelectorAll('[data-config-mailto]').forEach(element => {
            const path = element.getAttribute('data-config-mailto');
            const value = this.get(path);
            if (value !== undefined) {
                element.href = `mailto:${value}`;
            }
        });

        // Handle data-config-alt (alt text)
        document.querySelectorAll('[data-config-alt]').forEach(element => {
            const path = element.getAttribute('data-config-alt');
            const value = this.get(path);
            if (value !== undefined) {
                element.alt = `${value} Profile Picture`;
            }
        });

        // Handle meta tags with data-config
        document.querySelectorAll('meta[data-config]').forEach(element => {
            const path = element.getAttribute('data-config');
            const value = this.get(path);
            if (value !== undefined) {
                element.setAttribute('content', value);
            }
        });

        // Handle OG/Twitter meta tags with custom attributes
        document.querySelectorAll('meta[data-config-og-site]').forEach(element => {
            const path = element.getAttribute('data-config-og-site');
            const value = this.get(path);
            if (value !== undefined) {
                element.setAttribute('content', `${value} - Full Stack Developer`);
            }
        });

        document.querySelectorAll('meta[data-config-og-title]').forEach(element => {
            const path = element.getAttribute('data-config-og-title');
            const value = this.get(path);
            if (value !== undefined) {
                const title = this.get('personal.title');
                element.setAttribute('content', `${value} - ${title || 'Full Stack Developer & Software Engineer'}`);
            }
        });

        document.querySelectorAll('meta[data-config-twitter-title]').forEach(element => {
            const path = element.getAttribute('data-config-twitter-title');
            const value = this.get(path);
            if (value !== undefined) {
                element.setAttribute('content', `${value} - Full Stack Developer`);
            }
        });
    }
}

// Create global instance
window.siteConfig = new SiteConfigLoader();

// Auto-load and apply config when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await window.siteConfig.load();
        window.siteConfig.applyToDOM();
        
        // Dispatch event to notify other scripts that config is ready
        window.dispatchEvent(new CustomEvent('siteConfigReady', { detail: window.siteConfig.getAll() }));
    });
} else {
    // DOM already loaded
    window.siteConfig.load().then(() => {
        window.siteConfig.applyToDOM();
        window.dispatchEvent(new CustomEvent('siteConfigReady', { detail: window.siteConfig.getAll() }));
    });
}

// Reapply config after components are loaded (footer, navbar, etc.)
document.addEventListener('componentsLoaded', () => {
    if (window.siteConfig && window.siteConfig.config) {
        window.siteConfig.applyToDOM();
        console.log('Config reapplied after components loaded');
    }
});
