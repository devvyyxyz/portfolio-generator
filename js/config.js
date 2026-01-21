/**
 * Configuration Settings
 * Centralized configuration for the portfolio generator
 */

const CONFIG = {
    // Data Source - set to 'local' or 'remote'
    dataSource: 'local',
    
    // Local data file path - updated to use new structured format
    localDataPath: './portfolio-data.json',
    
    // Fallback to old format if new one doesn't exist
    fallbackDataPath: './navdeep.json',
    
    // Remote GitHub data
    remoteDataPath: 'https://raw.githubusercontent.com/GITHUB_USERNAME/portfolio-generator/master/portfolio-data.json',
    
    // Page title settings
    titleOnBlur: 'Miss You :(',
    titleOnActive: 'Portfolio',
    
    // Animation settings
    animationDuration: 300,
    
    // UI settings
    projectsPerRow: 3,
    itemsPerPage: 6,
    enableTooltips: true,
    enableAnimations: true,
    enableSearch: true,
    showNavigation: true,
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
