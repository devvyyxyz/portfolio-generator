/**
 * Platform-Specific Renderers
 * Consolidates HTML generation logic for each platform
 * Eliminates template duplication across platform fetch functions
 */

const PlatformRenderers = {
    /**
     * Create platform stat items (reusable template)
     * @param {string} title - Section title
     * @param {string} icon - Emoji or icon character
     * @param {Array} stats - Array of { label, value } objects
     * @returns {string} HTML
     */
    createPlatformItem(title, icon, stats = []) {
        const statsHtml = stats
            .map(stat => `
                <div class="contribution-item-stat">
                    <span class="contribution-item-stat-label">${stat.label}:</span>
                    <span class="contribution-item-stat-value">${stat.value}</span>
                </div>
            `)
            .join('');
        
        return `
            <div class="contribution-item solid">
                <div class="contribution-item-title">${icon} ${title}</div>
                ${statsHtml}
            </div>
        `;
    },
    
    /**
     * ProtonDB Renderer
     */
    protonDB(data) {
        // ProtonDB uses static/manual data (no API available)
        return `
            ${this.createPlatformItem('🎮 Games Tested', '', [
                { label: 'Total entries', value: '50+' },
                { label: 'Reports', value: 'Verified' }
            ])}
            ${this.createPlatformItem('🔧 Compatibility Reports', '', [
                { label: 'Debugging info', value: 'Detailed' },
                { label: 'Workarounds', value: 'Provided' }
            ])}
            ${this.createPlatformItem('🐧 Linux Testing', '', [
                { label: 'Focus', value: 'Proton/Wine' },
                { label: 'Status', value: 'Active' }
            ])}
        `;
    },
    
    /**
     * SteamGridDB Renderer
     */
    steamGridDB(data) {
        if (!data?.stats?.grids) {
            throw new Error('Invalid SteamGridDB data format');
        }
        
        const gridStats = data.stats.grids;
        const totalGrids = gridStats.total;
        
        // Build breakdown of grid types
        const gridBreakdown = [];
        if (gridStats.alternate > 0) gridBreakdown.push(`${gridStats.alternate} Alternate`);
        if (gridStats.white_logo > 0) gridBreakdown.push(`${gridStats.white_logo} White Logo`);
        if (gridStats.no_logo > 0) gridBreakdown.push(`${gridStats.no_logo} No Logo`);
        if (gridStats.material > 0) gridBreakdown.push(`${gridStats.material} Material`);
        if (gridStats.blurred > 0) gridBreakdown.push(`${gridStats.blurred} Blurred`);
        
        return `
            ${this.createPlatformItem('🎨 Custom Artwork Created', '', [
                { label: 'Total Submissions', value: totalGrids },
                { label: 'Type', value: 'Grid Images' }
            ])}
            ${this.createPlatformItem('🖼️ Design Assets', '', [
                { label: 'Breakdown', value: gridBreakdown.join(', ') || 'Multiple Formats' },
                { label: 'Quality', value: 'High-Resolution' }
            ])}
            ${this.createPlatformItem('👥 Community Status', '', [
                { label: 'Role', value: 'Active Contributor' },
                { label: 'Total Artworks', value: `${totalGrids} Created` }
            ])}
        `;
    },
    
    /**
     * GitHub Renderer
     */
    gitHub(data) {
        if (!data?.stats) {
            throw new Error('Invalid GitHub data format');
        }
        
        const stats = data.stats;
        
        return `
            ${this.createPlatformItem('📊 Repository Statistics', '', [
                { label: 'Public Repos', value: stats.public_repos || '0' },
                { label: 'Followers', value: stats.followers || '0' }
            ])}
            ${this.createPlatformItem('🔗 Contributions', '', [
                { label: 'Pull Requests', value: stats.pull_requests || '0' },
                { label: 'Issues Created', value: stats.issues_created || '0' }
            ])}
            ${this.createPlatformItem('⭐ Recognition', '', [
                { label: 'Most Starred', value: stats.most_starred_repo || 'Various' },
                { label: 'Status', value: 'Active Contributor' }
            ])}
        `;
    },
    
    /**
     * Stack Overflow Renderer
     */
    stackOverflow(data) {
        if (!data?.stats) {
            throw new Error('Invalid Stack Overflow data format');
        }
        
        const stats = data.stats;
        
        return `
            ${this.createPlatformItem('❓ Answer Statistics', '', [
                { label: 'Total Answers', value: stats.answer_count || '0' },
                { label: 'Accepted', value: stats.accepted_answer_count || '0' }
            ])}
            ${this.createPlatformItem('📈 Community Impact', '', [
                { label: 'Score', value: stats.reputation || '0' },
                { label: 'Badges', value: stats.badge_count || '0' }
            ])}
            ${this.createPlatformItem('🏆 Expertise', '', [
                { label: 'Questions', value: stats.question_count || '0' },
                { label: 'Tags', value: 'Multiple Tech Stacks' }
            ])}
        `;
    },
    
    /**
     * CodePen Renderer
     */
    codepen(data) {
        if (!data?.stats) {
            throw new Error('Invalid CodePen data format');
        }
        
        const stats = data.stats;
        
        return `
            ${this.createPlatformItem('🎨 Pen Statistics', '', [
                { label: 'Total Pens', value: stats.public_pens || '0' },
                { label: 'Followers', value: stats.followers || '0' }
            ])}
            ${this.createPlatformItem('👍 Recognition', '', [
                { label: 'Likes', value: stats.likes || '0' },
                { label: 'Comments', value: stats.comments || '0' }
            ])}
        `;
    },
    
    /**
     * YouTube Renderer
     */
    youtube(data) {
        if (!data?.stats) {
            throw new Error('Invalid YouTube data format');
        }
        
        const stats = data.stats;
        
        return `
            ${this.createPlatformItem('📺 Channel Statistics', '', [
                { label: 'Subscribers', value: stats.subscriber_count || 'N/A' },
                { label: 'Video Count', value: stats.video_count || '0' }
            ])}
            ${this.createPlatformItem('📊 Engagement', '', [
                { label: 'Total Views', value: stats.view_count || '0' },
                { label: 'Status', value: 'Content Creator' }
            ])}
        `;
    },
    
    /**
     * LinkedIn Renderer
     */
    linkedin(data) {
        if (!data?.stats) {
            throw new Error('Invalid LinkedIn data format');
        }
        
        const stats = data.stats;
        
        return `
            ${this.createPlatformItem('💼 Professional Profile', '', [
                { label: 'Connections', value: stats.connections || '0' },
                { label: 'Endorsements', value: stats.endorsements || '0' }
            ])}
            ${this.createPlatformItem('📝 Content', '', [
                { label: 'Posts', value: stats.posts || '0' },
                { label: 'Engagement', value: 'Active' }
            ])}
        `;
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PlatformRenderers;
}
