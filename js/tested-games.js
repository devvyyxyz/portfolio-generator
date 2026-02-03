/**
 * Tested Games Renderer
 * Dynamically renders game/project cards from tested-games.json
 * Enables scalable management of tested games list
 */

async function renderTestedGames() {
    try {
        const response = await fetch('/data/tested-games.json');
        if (!response.ok) throw new Error('Failed to fetch tested games data');
        
        const data = await response.json();
        const gamesList = document.getElementById('tested-games-list');
        
        if (!gamesList) {
            console.warn('tested-games-list container not found');
            return;
        }
        
        // Clear existing content
        gamesList.innerHTML = '';
        
        // Render each game
        data.games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'tested-game-card';
            gameCard.innerHTML = `
                <img src="${game.image}" alt="${game.title}" class="tested-game-thumb" onerror="this.src='https://via.placeholder.com/300x170?text=${encodeURIComponent(game.title)}'">
                <div class="tested-game-title">${game.title}</div>
                <div class="tested-game-platform">${game.platform}</div>
                <div class="tested-game-desc">${game.description}</div>
                <div class="tested-game-focus">Focus: ${game.focus}</div>
                <a href="${game.url}" target="_blank" rel="noopener" class="tested-game-link">Visit Game Page &rarr;</a>
            `;
            gamesList.appendChild(gameCard);
        });
    } catch (error) {
        console.error('Error rendering tested games:', error);
        const gamesList = document.getElementById('tested-games-list');
        if (gamesList) {
            gamesList.innerHTML = '<p class="error-message">Failed to load games data</p>';
        }
    }
}

// Render games when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTestedGames);
} else {
    renderTestedGames();
}
