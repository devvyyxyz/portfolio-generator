/**
 * Main Portfolio Generator
 * Entry point for the application
 */

// Initialize on document ready
document.addEventListener('DOMContentLoaded', initializePortfolio);

/**
 * Initialize portfolio application
 */
async function initializePortfolio() {
    try {
        debug('Initializing portfolio generator');

        // Load data
        const data = await dataLoader.load();
        
        // Store data globally for features.js
        window.portfolioData = data;

        // Create and render with new renderer
        const renderer = new DOMRenderer(data);
        renderer.render();

        // Setup event handlers
        eventHandlers.init();

        // Dispatch loaded event
        eventHandlers.dispatchEvent('portfolioLoaded', data);

        // Update page title
        document.title = `${data.personal.name} - ${data.personal.title}`;

        // Hide preloader after portfolio is rendered
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
            document.body.classList.add('content-loaded');
        }

        debug('Portfolio initialized successfully');
    } catch (error) {
        logError('Failed to initialize portfolio', error);
        
        // Show error message to user
        const mainElement = byId('main');
        if (mainElement) {
            mainElement.innerHTML = `
                <div class="alert alert-danger" style="margin: 50px auto; max-width: 600px; text-align: center;">
                    <h3>Error Loading Portfolio</h3>
                    <p>${error.message || 'Unable to load portfolio data. Please try again later.'}</p>
                    <p style="font-size: 12px; color: #666;">
                        Check your data source configuration and ensure the file exists.
                    </p>
                </div>
            `;
        }
    }
}

/**
 * Manual reload function
 * Can be called from console: reloadPortfolio()
 */
function reloadPortfolio() {
    debug('Reloading portfolio');
    location.reload();
}

/**
 * Switch data source (useful for testing)
 * @param {string} source - 'local' or 'remote'
 */
function switchDataSource(source) {
    if (source === 'local' || source === 'remote') {
        CONFIG.dataSource = source;
        debug(`Data source switched to ${source}`);
        reloadPortfolio();
    } else {
        console.error('Invalid data source. Use "local" or "remote".');
    }
}

/**
 * Enable/disable debug mode
 * @param {boolean} enabled - Debug enabled
 */
function setDebugMode(enabled) {
    if (enabled) {
        localStorage.setItem('DEBUG', 'true');
        console.log('Debug mode enabled. Refresh to see debug logs.');
    } else {
        localStorage.removeItem('DEBUG');
        console.log('Debug mode disabled.');
    }
}

/**
 * Get portfolio data
 * @returns {object} Current portfolio data
 */
function getPortfolioData() {
    return dataLoader.getData();
}

/**
 * Update specific section
 * @param {string} section - Section name
 * @param {any} data - New data
 */
function updateSection(section, data) {
    const currentData = getPortfolioData();
    if (currentData) {
        currentData[section] = data;
        renderer.render(currentData);
        eventHandlers.init();
        debug(`Section "${section}" updated`);
    }
}

// Expose utility functions globally for console access
window.reloadPortfolio = reloadPortfolio;
window.switchDataSource = switchDataSource;
window.setDebugMode = setDebugMode;
window.getPortfolioData = getPortfolioData;
window.updateSection = updateSection;
