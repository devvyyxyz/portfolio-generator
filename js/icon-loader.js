/**
 * Generic Icon Loader
 * Loads icons from config for any element with data-icon-category and data-icon-key attributes
 */

window.loadPageIcons = async function() {
    // Wait for icon config to be ready
    if (!window.iconConfig) {
        console.log('Icon config not ready, retrying...');
        setTimeout(window.loadPageIcons, 100);
        return;
    }

    try {
        // Wait for config to load
        await window.iconConfig.load();
        
        // Find all elements with icon data attributes
        const iconElements = document.querySelectorAll('[data-icon-category][data-icon-key]');
        
        if (iconElements.length === 0) {
            console.log('No icon elements found on this page');
            return;
        }

        console.log(`Found ${iconElements.length} icon elements to load`);

        // Determine base path
        const isInSubdirectory = window.location.pathname.includes('/pages/');
        const basePath = isInSubdirectory ? '../' : '';

        // Load each icon
        for (const element of iconElements) {
            const category = element.getAttribute('data-icon-category');
            const key = element.getAttribute('data-icon-key');

            if (!category || !key) {
                console.warn('Icon element missing category or key:', element);
                continue;
            }

            try {
                const iconData = await window.iconConfig.getIcon(category, key);
                
                if (iconData && iconData.icon) {
                    const encodedPath = encodeURI(basePath + iconData.icon);
                    element.src = encodedPath;
                    element.style.display = 'inline-block';
                } else if (iconData && iconData.files) {
                    // Handle multi-style icons
                    const style = window.iconConfig.getStyle();
                    const iconPath = iconData.files[style];
                    if (iconPath) {
                        const encodedPath = encodeURI(basePath + iconPath);
                        element.src = encodedPath;
                        element.style.display = 'inline-block';
                    }
                } else {
                    console.warn(`No icon data found for ${category}/${key}`);
                }
            } catch (err) {
                console.error(`Error loading icon ${category}/${key}:`, err);
            }
        }

        console.log('Icon loading complete');
    } catch (err) {
        console.error('Error in loadPageIcons:', err);
    }
};

// Auto-load when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.loadPageIcons);
} else {
    window.loadPageIcons();
}

// Also listen for icon config ready event
window.addEventListener('iconConfigReady', window.loadPageIcons);
