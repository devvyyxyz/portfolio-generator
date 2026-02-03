/**
 * Community Help & Support Renderer
 * Dynamically renders community contribution entries from community-help.json
 */

async function renderCommunityContributions() {
    try {
        const response = await fetch('/data/community-help.json');
        if (!response.ok) throw new Error('Failed to fetch community contributions data');
        
        const data = await response.json();
        const communityList = document.getElementById('community-contributions-list');
        
        if (!communityList) {
            console.warn('community-contributions-list container not found');
            return;
        }
        
        // Clear existing content
        communityList.innerHTML = '';
        
        // Render each contribution entry
        data.community_contributions.forEach(contribution => {
            const entry = document.createElement('div');
            entry.className = 'community-entry';
            entry.innerHTML = `
                <div class="community-header">
                    <h4 class="community-platform">${contribution.platform}</h4>
                    <span class="community-activity">${contribution.activity_count}</span>
                </div>
                <div class="community-focus">Focus: ${contribution.focus}</div>
                <p class="community-description">${contribution.description}</p>
                <a href="${contribution.url}" class="community-link">View Profile &rarr;</a>
            `;
            communityList.appendChild(entry);
        });
    } catch (error) {
        console.error('Error rendering community contributions:', error);
        const communityList = document.getElementById('community-contributions-list');
        if (communityList) {
            communityList.innerHTML = '<p class="error-message">Failed to load community contributions data</p>';
        }
    }
}

// Render community contributions when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCommunityContributions);
} else {
    renderCommunityContributions();
}
