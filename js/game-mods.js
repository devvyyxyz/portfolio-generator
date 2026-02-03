/**
 * Game Mods & Contributions Renderer
 * Dynamically renders mod/contribution entries from game-mods.json
 */

async function renderGameMods() {
    try {
        const response = await fetch('/data/game-mods.json');
        if (!response.ok) throw new Error('Failed to fetch game mods data');
        
        const data = await response.json();
        const modsList = document.getElementById('game-mods-list');
        
        if (!modsList) {
            console.warn('game-mods-list container not found');
            return;
        }
        
        // Clear existing content
        modsList.innerHTML = '';
        
        // Render each mod/contribution
        data.game_mods.forEach(mod => {
            const modEntry = document.createElement('div');
            modEntry.className = 'game-mod-entry';
            modEntry.innerHTML = `
                <div class="mod-header">
                    <h4 class="mod-game-name">${mod.game_name}</h4>
                    <span class="mod-type">${mod.contribution_type}</span>
                </div>
                <p class="mod-description">${mod.description}</p>
                <p class="mod-outcome"><strong>Outcome:</strong> ${mod.outcome}</p>
            `;
            modsList.appendChild(modEntry);
        });
    } catch (error) {
        console.error('Error rendering game mods:', error);
        const modsList = document.getElementById('game-mods-list');
        if (modsList) {
            modsList.innerHTML = '<p class="error-message">Failed to load game mods data</p>';
        }
    }
}

// Render game mods when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGameMods);
} else {
    renderGameMods();
}
