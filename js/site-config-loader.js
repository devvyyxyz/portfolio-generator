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
            
            if (window.Logger) window.Logger.group('Site Config', true);
            if (window.Logger) window.Logger.info('Fetching site-config', { path: configPath });
            const response = await fetch(configPath + cacheBuster);
            if (!response.ok) {
                throw new Error(`Failed to load config: ${response.status}`);
            }
            const json = await response.json();
            if (window.Logger) window.Logger.success('Site-config loaded');
            if (window.Logger) window.Logger.groupEnd();
            return json;
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
    }

    /**
     * Generate footer links from config
     * @private
     */
    _applyFooterLinks() {
        const footerConfig = this.config.footer;
        if (!footerConfig || !footerConfig.sections) {
            return;
        }

        const footerColumnsContainer = document.querySelector('.footer-columns');
        if (!footerColumnsContainer) {
            return;
        }

        // Clear existing footer columns
        const existingColumns = footerColumnsContainer.querySelectorAll('.footer-column');
        existingColumns.forEach(col => col.remove());

        // Create columns from config
        Object.entries(footerConfig.sections).forEach(([key, section]) => {
            const column = document.createElement('div');
            column.className = 'footer-column';

            const header = document.createElement('h4');
            header.className = 'footer-header';
            header.textContent = section.title;
            column.appendChild(header);

            const ul = document.createElement('ul');
            ul.className = 'footer-links';

            section.links.forEach(link => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                
                // Add icon if specified
                if (link.icon) {
                    const img = document.createElement('img');
                    img.setAttribute('data-icon-category', link.icon.category);
                    img.setAttribute('data-icon-key', link.icon.key);
                    img.alt = link.icon.alt || link.label;
                    img.className = 'icon-img footer-link-icon';
                    img.style.width = '16px';
                    img.style.height = '16px';
                    img.style.marginRight = '6px';
                    img.style.verticalAlign = 'middle';
                    a.appendChild(img);
                }
                
                const textNode = document.createTextNode(link.label);
                a.appendChild(textNode);

                // Check if href is a config path (contains '.')
                if (link.href.includes('.')) {
                    a.href = this.get(link.href) || '#';
                    a.target = '_blank';
                } else {
                    a.href = link.href;
                }

                li.appendChild(a);
                ul.appendChild(li);
            });

            column.appendChild(ul);
            footerColumnsContainer.appendChild(column);
        });

        // Trigger icon loading for newly created footer icons
        if (window.loadPageIcons) {
            window.loadPageIcons();
        }

        // Update footer bottom links
        const footerBottomCenter = document.querySelector('.footer-bottom-center');
        if (footerBottomCenter && footerConfig.bottomLinks) {
            footerBottomCenter.innerHTML = '';

            footerConfig.bottomLinks.forEach((link, index) => {
                const a = document.createElement('a');
                a.href = link.href;
                a.textContent = link.label;
                footerBottomCenter.appendChild(a);

                // Add separator between links
                if (index < footerConfig.bottomLinks.length - 1) {
                    const span = document.createElement('span');
                    span.className = 'separator';
                    span.textContent = '|';
                    footerBottomCenter.appendChild(span);
                }
            });
        }
    }

    /**
     * Apply footer links after components are loaded
     * Public method to call after footer component is inserted
     */
    applyFooterLinks() {
        if (!this.config) {
            console.warn('Config not loaded. Waiting...');
            return this.load().then(() => this._applyFooterLinks());
        }
        this._applyFooterLinks();
    }
}

// Create global instance
window.siteConfig = new SiteConfigLoader();

// Auto-load and apply config when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await window.siteConfig.load();
        window.siteConfig.applyToDOM();
        if (window.Logger) window.Logger.event('siteConfigReady');
        
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
        window.siteConfig.applyFooterLinks();
        if (window.Logger) window.Logger.info('Config reapplied after components loaded');
    }
});
