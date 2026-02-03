/**
 * Guides & Tutorials Renderer
 * Dynamically renders guide entries from guides.json
 */

async function renderGuides() {
    try {
        const response = await fetch('/data/guides.json');
        if (!response.ok) throw new Error('Failed to fetch guides data');
        
        const data = await response.json();
        const guidesList = document.getElementById('guides-list');
        
        if (!guidesList) {
            console.warn('guides-list container not found');
            return;
        }
        
        // Clear existing content
        guidesList.innerHTML = '';
        
        // Render each guide
        data.guides.forEach(guide => {
            const guideItem = document.createElement('div');
            guideItem.className = 'guide-item';
            guideItem.innerHTML = `
                <div class="guide-header">
                    <h4 class="guide-title">${guide.title}</h4>
                    <span class="guide-platform">${guide.platform}</span>
                </div>
                <p class="guide-description">${guide.description}</p>
                <a href="${guide.url}" class="guide-link">Read Guide &rarr;</a>
            `;
            guidesList.appendChild(guideItem);
        });
    } catch (error) {
        console.error('Error rendering guides:', error);
        const guidesList = document.getElementById('guides-list');
        if (guidesList) {
            guidesList.innerHTML = '<p class="error-message">Failed to load guides data</p>';
        }
    }
}

// Render guides when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGuides);
} else {
    renderGuides();
}
