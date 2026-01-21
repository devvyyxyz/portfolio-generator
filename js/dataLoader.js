/**
 * Data Loader Module
 * Handles loading and validating portfolio data from local or remote sources
 */

class DataLoader {
    constructor(config = CONFIG) {
        this.config = config;
        this.data = null;
        this.isLoading = false;
        this.error = null;
    }

    /**
     * Load data based on configuration
     * @returns {Promise<object>} Portfolio data
     */
    async load() {
        this.isLoading = true;
        this.error = null;

        try {
            if (this.config.dataSource === 'local') {
                this.data = await this.loadLocal();
            } else {
                this.data = await this.loadRemote();
            }

            if (!this.data) {
                throw new Error('No data loaded');
            }

            // Validate and normalize data
            this.data = this.validateData(this.data);

            debug('Data loaded successfully', this.data);
            return this.data;
        } catch (error) {
            this.error = error;
            logError('Failed to load portfolio data', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Validate and normalize portfolio data
     * @param {object} data - Raw data
     * @returns {object} Validated data
     */
    validateData(data) {
        // Ensure required fields exist
        if (!data.personal) {
            throw new Error('Missing required field: personal');
        }

        if (!data.sections) {
            throw new Error('Missing required field: sections');
        }

        // Ensure navigation order exists
        if (!data.navigation || !data.navigation.order) {
            data.navigation = {
                order: Object.keys(data.sections).filter(key => 
                    data.sections[key] && data.sections[key].enabled !== false
                )
            };
        }

        // Normalize section data
        Object.keys(data.sections).forEach(sectionKey => {
            const section = data.sections[sectionKey];
            
            // Ensure section has required properties
            if (!section.title) {
                section.title = this.titleCase(sectionKey);
            }
            
            if (section.enabled === undefined) {
                section.enabled = true;
            }
            
            // Normalize items array
            if (!section.items && !section.categories) {
                section.items = [];
            }
        });

        return data;
    }

    /**
     * Load data from local JSON file
     * @returns {Promise<object>}
     */
    async loadLocal() {
        try {
            const response = await fetch(this.config.localDataPath);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            debug('Local data loaded', data);
            return data;
        } catch (error) {
            logError(`Failed to load local data from ${this.config.localDataPath}`, error);
            throw error;
        }
    }

    /**
     * Load data from remote GitHub repository
     * @returns {Promise<object>}
     */
    async loadRemote() {
        try {
            // Replace GITHUB_USERNAME with actual username if needed
            let url = this.config.remoteDataPath;
            
            if (typeof GITHUB_USERNAME !== 'undefined') {
                url = url.replace('GITHUB_USERNAME', GITHUB_USERNAME);
            }

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            debug('Remote data loaded', data);
            return data;
        } catch (error) {
            logError(`Failed to load remote data from ${this.config.remoteDataPath}`, error);
            throw error;
        }
    }

    /**
     * Convert camelCase or snake_case to Title Case
     * @param {string} str
     * @returns {string}
     */
    titleCase(str) {
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
            .trim();
    }

    /**
     * Fallback data if no data is available
     * @returns {object}
     */
    getFallbackData() {
        return {
            personal: {
                name: 'Portfolio',
                title: 'Welcome',
                email: '',
                location: '',
                bio: 'Unable to load portfolio data. Please check your configuration.'
            },
            sections: {},
            navigation: { order: [] }
        };
    }

    /**
     * Get loaded data
     * @returns {object}
     */
    getData() {
        return this.data;
    }

    /**
     * Check if data is loaded
     * @returns {boolean}
     */
    isLoaded() {
        return this.data !== null;
    }

    /**
     * Get error message if load failed
     * @returns {string|null}
     */
    getError() {
        return this.error;
    }
}

// Create global instance
const dataLoader = new DataLoader(CONFIG);
