/**
 * Tools & Utilities Renderer
 * Dynamically renders tool/utility entries from tools-utilities.json
 */

async function renderTools() {
    try {
        const response = await fetch('/data/tools-utilities.json');
        if (!response.ok) throw new Error('Failed to fetch tools data');
        
        const data = await response.json();
        const toolsList = document.getElementById('tools-utilities-list');
        
        if (!toolsList) {
            console.warn('tools-utilities-list container not found');
            return;
        }
        
        // Clear existing content
        toolsList.innerHTML = '';
        
        // Render each tool
        data.tools.forEach(tool => {
            const toolItem = document.createElement('div');
            toolItem.className = 'tools-utility-item';
            toolItem.innerHTML = `
                <h4 class="tool-title">${tool.title}</h4>
                <p class="tool-problem"><strong>Problem Solved:</strong> ${tool.problem}</p>
                <p class="tool-technologies"><strong>Tech Stack:</strong> ${tool.technologies}</p>
                <a href="${tool.url}" class="tool-link">View Repository &rarr;</a>
            `;
            toolsList.appendChild(toolItem);
        });
    } catch (error) {
        console.error('Error rendering tools:', error);
        const toolsList = document.getElementById('tools-utilities-list');
        if (toolsList) {
            toolsList.innerHTML = '<p class="error-message">Failed to load tools data</p>';
        }
    }
}

// Render tools when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTools);
} else {
    renderTools();
}
