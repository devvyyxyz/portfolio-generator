/**
 * Icon Style Switcher
 * Allows changing icon styles across the site
 * Usage: iconStyleSwitcher.setStyle('style-ios6')
 */

const iconStyleSwitcher = {
    /**
     * Set icon style globally
     * @param {string} style - One of: 'style-classic', 'style-glossy-blue', 'style-ios6'
     */
    setStyle: async function(style) {
        if (!window.iconConfig) {
            console.error('Icon config not loaded');
            return false;
        }

        // Validate style
        const availableStyles = window.iconConfig.getAvailableStyles();
        if (!availableStyles.includes(style)) {
            console.error('Invalid style. Available styles:', availableStyles);
            return false;
        }

        // Set the style
        window.iconConfig.setStyle(style);

        // Save to localStorage for persistence
        try {
            localStorage.setItem('preferredIconStyle', style);
        } catch (e) {
            console.warn('Could not save style to localStorage:', e);
        }

        // Reload all icons on the page
        this.refreshIcons();

        return true;
    },

    /**
     * Get current icon style
     * @returns {string}
     */
    getStyle: function() {
        return window.iconConfig ? window.iconConfig.getStyle() : 'style-ios6';
    },

    /**
     * Load saved style from localStorage
     */
    loadSavedStyle: async function() {
        try {
            const saved = localStorage.getItem('preferredIconStyle');
            if (saved && window.iconConfig) {
                const availableStyles = window.iconConfig.getAvailableStyles();
                if (availableStyles.includes(saved)) {
                    window.iconConfig.setStyle(saved);
                    return;
                }
            }
        } catch (e) {
            console.warn('Could not load saved style:', e);
        }
    },

    /**
     * Refresh all icon images on the page
     */
    refreshIcons: function() {
        // Update all icon images
        const iconImages = document.querySelectorAll('.icon-image');
        iconImages.forEach(async (img) => {
            const category = img.dataset.iconCategory;
            const key = img.dataset.iconKey;
            if (category && key) {
                const path = await window.iconConfig.getIconPath(category, key);
                if (path) {
                    img.src = path;
                }
            }
        });

        // Dispatch custom event for other components to listen to
        window.dispatchEvent(new Event('iconsRefreshed'));
    },

    /**
     * Get all available styles
     * @returns {array}
     */
    getAvailableStyles: function() {
        return window.iconConfig ? window.iconConfig.getAvailableStyles() : [];
    }
};

// Load saved style when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        iconStyleSwitcher.loadSavedStyle();
    });
} else {
    iconStyleSwitcher.loadSavedStyle();
}
