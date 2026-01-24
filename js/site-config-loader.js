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
            const response = await fetch('site-config.json');
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
}

// Create global instance
window.siteConfig = new SiteConfigLoader();
