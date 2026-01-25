/**
 * Icon Config Loader
 * Loads and manages icons from icons-config.json
 * Supports multiple icon styles (style-classic, style-glossy-blue, style-ios6)
 */

class IconConfigLoader {
    constructor() {
        this.config = null;
        this.loading = false;
        this.loadPromise = null;
        this.currentStyle = null;
    }

    /**
     * Load icon configuration
     * @returns {Promise<object>} Icon config object
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
            this.currentStyle = this.config.iconStyle || 'style-ios6';
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
            const configPath = isInSubdirectory ? '../js/icons-config.json' : 'js/icons-config.json';
            
            // Add cache busting parameter
            const cacheBuster = `?v=${Date.now()}`;
            
            const response = await fetch(configPath + cacheBuster);
            if (!response.ok) {
                throw new Error(`Failed to load icons config: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error loading icons config:', error);
            return null;
        }
    }

    /**
     * Set the current icon style
     * @param {string} style - One of: style-classic, style-glossy-blue, style-ios6
     */
    setStyle(style) {
        this.currentStyle = style;
        window.dispatchEvent(new Event('iconStyleChanged'));
    }

    /**
     * Get the current icon style
     * @returns {string}
     */
    getStyle() {
        return this.currentStyle || 'style-ios6';
    }

    /**
     * Get icon by category and key
     * @param {string} category - Icon category (e.g., 'social', 'ui', 'page-sections')
     * @param {string} key - Icon key (e.g., 'github', 'close')
     * @returns {object} Icon object with properties
     */
    async getIcon(category, key) {
        const config = await this.load();
        if (!config || !config[category] || !config[category][key]) {
            return null;
        }
        return config[category][key];
    }

    /**
     * Get icon HTML (image tag or emoji)
     * @param {string} category
     * @param {string} key
     * @param {number} size - Image width/height in pixels (default: 48)
     * @returns {Promise<string>} HTML string for the icon
     */
    async getIconHTML(category, key, size = 48) {
        const icon = await this.getIcon(category, key);
        if (!icon) {
            return null;
        }

        const isInSubdirectory = window.location.pathname.includes('/pages/');
        const basePath = isInSubdirectory ? '../' : '';
        const style = this.getStyle();

        // Handle image-based icons
        if (icon.type === 'image' && icon.files && icon.files[style]) {
            const imagePath = basePath + icon.files[style];
            return '<img src="' + imagePath + '" alt="' + icon.alt + '" width="' + size + '" height="' + size + '" class="icon-image" loading="lazy">';
        }

        // Fallback to emoji
        if (icon.emoji) {
            return '<span class="icon-emoji">' + icon.emoji + '</span>';
        }

        return null;
    }

    /**
     * Get image path for an icon
     * Useful for CSS backgrounds or direct image sources
     * @param {string} category
     * @param {string} key
     * @param {string} style - Optional style override
     * @returns {Promise<string>} Full image path
     */
    async getIconPath(category, key, style = null) {
        const icon = await this.getIcon(category, key);
        if (!icon || icon.type !== 'image' || !icon.files) {
            return null;
        }

        const useStyle = style || this.getStyle();
        const imagePath = icon.files[useStyle];
        
        if (!imagePath) {
            return null;
        }

        const isInSubdirectory = window.location.pathname.includes('/pages/');
        const basePath = isInSubdirectory ? '../' : '';
        return basePath + imagePath;
    }

    /**
     * Get all available icon styles
     * @returns {array} List of available styles
     */
    getAvailableStyles() {
        return ['style-classic', 'style-glossy-blue', 'style-ios6'];
    }

    /**
     * Get all icons in a category
     * @param {string} category
     * @returns {Promise<object>}
     */
    async getCategory(category) {
        const config = await this.load();
        if (!config || !config[category]) {
            return null;
        }
        return config[category];
    }

    /**
     * Get the entire configuration
     * @returns {Promise<object>}
     */
    async getAll() {
        return this.load();
    }
}

// Create global instance
window.iconConfig = new IconConfigLoader();

// Auto-load config when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', async () => {
        await window.iconConfig.load();
        window.dispatchEvent(new CustomEvent('iconConfigReady', { detail: window.iconConfig.getAll() }));
    });
} else {
    // DOM already loaded
    window.iconConfig.load().then(() => {
        window.dispatchEvent(new CustomEvent('iconConfigReady', { detail: window.iconConfig.getAll() }));
    });
}

