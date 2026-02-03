/**
 * Generic API Service
 * Handles common patterns: fetch from file → API → fallback
 * Eliminates code duplication across multiple platform integrations
 */

class APIService {
    /**
     * Fetch data with automatic fallback strategy
     * @param {Object} config - Configuration object
     * @param {string} config.name - Platform name (for logging)
     * @param {string} config.dataFile - Path to JSON data file (primary source)
     * @param {string|Function} config.apiUrl - API endpoint or function that returns URL
     * @param {Object} config.apiOptions - Fetch options for API call (headers, etc.)
     * @param {Function} config.transform - Transform function to normalize data
     * @param {Function} config.fallback - Fallback function if all attempts fail
     * @returns {Promise<Object>} - Resolved data or null
     */
    static async fetch(config) {
        const { name, dataFile, apiUrl, apiOptions = {}, transform, fallback } = config;
        
        // Strategy 1: Try local JSON file first (fastest, reliable)
        try {
            if (dataFile) {
                console.log(`[${name}] Attempting to fetch from local data file: ${dataFile}`);
                const response = await fetch(dataFile);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`[${name}] ✓ Loaded from local file`);
                    return transform ? transform(data) : data;
                }
            }
        } catch (error) {
            console.warn(`[${name}] Local file fetch failed:`, error.message);
        }
        
        // Strategy 2: Try API endpoint (if configured)
        try {
            if (apiUrl) {
                const url = typeof apiUrl === 'function' ? apiUrl() : apiUrl;
                console.log(`[${name}] Attempting to fetch from API: ${url}`);
                
                const response = await fetch(url, apiOptions);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`[${name}] ✓ Loaded from API`);
                    return transform ? transform(data) : data;
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            }
        } catch (error) {
            console.warn(`[${name}] API fetch failed:`, error.message);
        }
        
        // Strategy 3: Use fallback if provided
        if (fallback) {
            console.log(`[${name}] Using fallback data`);
            return typeof fallback === 'function' ? fallback() : fallback;
        }
        
        console.error(`[${name}] All fetch strategies failed`);
        return null;
    }
    
    /**
     * Render fetched data to DOM container
     * @param {string} containerId - Element ID to render into
     * @param {Object} data - Data to render
     * @param {Function} renderFn - Function that returns HTML string
     * @param {string} errorMessage - Custom error message
     */
    static render(containerId, data, renderFn, errorMessage = 'Failed to load data') {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container not found: ${containerId}`);
            return;
        }
        
        try {
            if (!data) {
                throw new Error('No data to render');
            }
            
            const html = renderFn(data);
            container.innerHTML = html;
            console.log(`✓ Rendered to ${containerId}`);
        } catch (error) {
            console.error(`Error rendering ${containerId}:`, error);
            this.displayError(container, errorMessage);
        }
    }
    
    /**
     * Display unified error message in container
     * @param {HTMLElement} container - Container element
     * @param {string} title - Error title (short message)
     * @param {string} hint - Hint text (optional, shows below title)
     */
    static displayError(container, title = 'Failed to load data', hint = 'Try refreshing the page or check back later.') {
        container.innerHTML = `
            <div class="error-message-container">
                <div class="error-message-icon">⚠️</div>
                <div class="error-message-title">${title}</div>
                <div class="error-message-hint">${hint}</div>
            </div>
        `;
    }
    
    /**
     * Helper: Add a link element after a container
     * @param {string} containerId - Container to add link after
     * @param {string} href - Link URL
     * @param {string} text - Link text
     * @param {Object} styles - Inline style object
     */
    static addLinkAfter(containerId, href, text, styles = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const styleStr = Object.entries(styles)
            .map(([key, value]) => `${key}: ${value}`)
            .join('; ');
        
        const linkHtml = `<a href="${href}" target="_blank" style="${styleStr}">${text}</a>`;
        container.insertAdjacentHTML('afterend', linkHtml);
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIService;
}
