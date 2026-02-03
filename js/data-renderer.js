/**
 * Universal Data Renderer
 * Consolidates rendering logic for all dynamic content sections
 * Configuration-driven approach for scalability and maintainability
 */

const DATA_RENDERERS = {
    testedGames: {
        dataFile: '/data/tested-games.json',
        containerId: 'tested-games-list',
        dataKey: 'games',
        renderItem: (item) => `
            <img src="${item.image}" alt="${item.title}" class="tested-game-thumb" onerror="this.src='https://via.placeholder.com/300x170?text=${encodeURIComponent(item.title)}'">
            <div class="tested-game-title">${item.title}</div>
            <div class="tested-game-platform">${item.platform}</div>
            <div class="tested-game-desc">${item.description}</div>
            <div class="tested-game-focus">Focus: ${item.focus}</div>
            <a href="${item.url}" target="_blank" rel="noopener" class="tested-game-link">Visit Game Page &rarr;</a>
        `,
        itemClass: 'tested-game-card'
    },
    guides: {
        dataFile: '/data/guides.json',
        containerId: 'guides-list',
        dataKey: 'guides',
        renderItem: (item) => `
            <div class="guide-header">
                <h4 class="guide-title">${item.title}</h4>
                <span class="guide-platform">${item.platform}</span>
            </div>
            <p class="guide-description">${item.description}</p>
            <a href="${item.url}" class="guide-link">Read Guide &rarr;</a>
        `,
        itemClass: 'guide-item'
    },
    communityHelp: {
        dataFile: '/data/community-help.json',
        containerId: 'community-contributions-list',
        dataKey: 'community_contributions',
        renderItem: (item) => `
            <div class="community-header">
                <h4 class="community-platform">${item.platform}</h4>
                <span class="community-activity">${item.activity_count}</span>
            </div>
            <div class="community-focus">Focus: ${item.focus}</div>
            <p class="community-description">${item.description}</p>
            <a href="${item.url}" class="community-link">View Profile &rarr;</a>
        `,
        itemClass: 'community-entry'
    },
    tools: {
        dataFile: '/data/tools-utilities.json',
        containerId: 'tools-utilities-list',
        dataKey: 'tools',
        renderItem: (item) => `
            <h4 class="tool-title">${item.title}</h4>
            <p class="tool-problem"><strong>Problem Solved:</strong> ${item.problem}</p>
            <p class="tool-technologies"><strong>Tech Stack:</strong> ${item.technologies}</p>
            <a href="${item.url}" class="tool-link">View Repository &rarr;</a>
        `,
        itemClass: 'tools-utility-item'
    },
    moderationRoles: {
        dataFile: '/data/moderation-roles.json',
        containerId: 'moderation-roles-list',
        dataKey: 'moderation_roles',
        renderItem: (item) => `
            <div class="role-header">
                <h4 class="role-title">${item.title}</h4>
                <span class="role-organization">${item.organization}</span>
            </div>
            <p class="role-responsibilities"><strong>Responsibilities:</strong> ${item.responsibilities}</p>
            <p class="role-impact"><strong>Impact:</strong> ${item.impact}</p>
            <a href="${item.url}" class="role-link">View Details &rarr;</a>
        `,
        itemClass: 'moderation-role'
    },
    gameMods: {
        dataFile: '/data/game-mods.json',
        containerId: 'game-mods-list',
        dataKey: 'game_mods',
        renderItem: (item) => `
            <div class="mod-header">
                <h4 class="mod-game-name">${item.game_name}</h4>
                <span class="mod-type">${item.contribution_type}</span>
            </div>
            <p class="mod-description">${item.description}</p>
            <p class="mod-outcome"><strong>Outcome:</strong> ${item.outcome}</p>
        `,
        itemClass: 'game-mod-entry'
    }
};

/**
 * Render a data section based on configuration
 * @param {string} configKey - Key of the renderer config in DATA_RENDERERS
 */
async function renderDataSection(configKey) {
    const config = DATA_RENDERERS[configKey];
    
    if (!config) {
        console.warn(`No renderer configuration found for: ${configKey}`);
        return;
    }
    
    try {
        const response = await fetch(config.dataFile);
        if (!response.ok) throw new Error(`Failed to fetch ${config.dataFile}`);
        
        const data = await response.json();
        const container = document.getElementById(config.containerId);
        
        if (!container) {
            console.warn(`Container not found: ${config.containerId}`);
            return;
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Get array of items from data
        const items = data[config.dataKey] || [];
        
        // Render each item
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = config.itemClass;
            itemElement.innerHTML = config.renderItem(item);
            container.appendChild(itemElement);
        });
    } catch (error) {
        console.error(`Error rendering ${configKey}:`, error);
        const container = document.getElementById(config.containerId);
        if (container) {
            container.innerHTML = '<p class="error-message">Failed to load data</p>';
        }
    }
}

/**
 * Initialize all data renderers when DOM is ready
 */
function initializeDataRenderers() {
    // Render all configured sections
    Object.keys(DATA_RENDERERS).forEach(configKey => {
        renderDataSection(configKey);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDataRenderers);
} else {
    initializeDataRenderers();
}
