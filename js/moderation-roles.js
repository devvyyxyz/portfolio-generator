/**
 * Moderation & Technical Roles Renderer
 * Dynamically renders moderation and technical role entries from moderation-roles.json
 */

async function renderModerationRoles() {
    try {
        const response = await fetch('/data/moderation-roles.json');
        if (!response.ok) throw new Error('Failed to fetch moderation roles data');
        
        const data = await response.json();
        const rolesList = document.getElementById('moderation-roles-list');
        
        if (!rolesList) {
            console.warn('moderation-roles-list container not found');
            return;
        }
        
        // Clear existing content
        rolesList.innerHTML = '';
        
        // Render each role
        data.moderation_roles.forEach(role => {
            const roleEntry = document.createElement('div');
            roleEntry.className = 'moderation-role';
            roleEntry.innerHTML = `
                <div class="role-header">
                    <h4 class="role-title">${role.title}</h4>
                    <span class="role-organization">${role.organization}</span>
                </div>
                <p class="role-responsibilities"><strong>Responsibilities:</strong> ${role.responsibilities}</p>
                <p class="role-impact"><strong>Impact:</strong> ${role.impact}</p>
                <a href="${role.url}" class="role-link">View Details &rarr;</a>
            `;
            rolesList.appendChild(roleEntry);
        });
    } catch (error) {
        console.error('Error rendering moderation roles:', error);
        const rolesList = document.getElementById('moderation-roles-list');
        if (rolesList) {
            rolesList.innerHTML = '<p class="error-message">Failed to load moderation roles data</p>';
        }
    }
}

// Render moderation roles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderModerationRoles);
} else {
    renderModerationRoles();
}
