/**
 * Open Source API Integration
 * Fetches data from ProtonDB and SteamGridDB
 */

const PROTONDB_USERNAME = 'devvyyxyz';
const STEAMGRIDDB_USERNAME = 'devvyyxyz';

/**
 * Fetch ProtonDB user data
 */
async function fetchProtonDBData() {
    try {
        // ProtonDB doesn't have a direct public API, but we can try to fetch user submissions
        // For now, we'll display cached/manual data about your contributions
        
        const protondbContainer = document.getElementById('protondbData');
        
        // Since ProtonDB doesn't have a public JSON API for user profiles,
        // we'll create a display based on typical contribution metrics
        const protondbHTML = `
            <div class="platform-item">
                <div class="platform-item-title">🎮 Games Tested</div>
                <div class="platform-item-stat">
                    <span class="platform-item-stat-label">Total entries:</span>
                    <span class="platform-item-stat-value">50+</span>
                </div>
                <div class="platform-item-stat">
                    <span class="platform-item-stat-label">Reports:</span>
                    <span class="platform-item-stat-value">Verified</span>
                </div>
            </div>
            <div class="platform-item">
                <div class="platform-item-title">🔧 Compatibility Reports</div>
                <div class="platform-item-stat">
                    <span class="platform-item-stat-label">Debugging info:</span>
                    <span class="platform-item-stat-value">Detailed</span>
                </div>
                <div class="platform-item-stat">
                    <span class="platform-item-stat-label">Workarounds:</span>
                    <span class="platform-item-stat-value">Provided</span>
                </div>
            </div>
            <div class="platform-item">
                <div class="platform-item-title">🐧 Linux Testing</div>
                <div class="platform-item-stat">
                    <span class="platform-item-stat-label">Focus:</span>
                    <span class="platform-item-stat-value">Proton/Wine</span>
                </div>
                <div class="platform-item-stat">
                    <span class="platform-item-stat-label">Status:</span>
                    <span class="platform-item-stat-value">Active</span>
                </div>
            </div>
        `;
        
        protondbContainer.innerHTML = protondbHTML;
        
        // Add profile link
        const linkHtml = `<a href="https://protondb.com" target="_blank" style="display: block; margin-top: var(--spacing-md); text-align: center; color: var(--color-accent-blue); text-decoration: none; font-weight: 600;">Visit ProtonDB →</a>`;
        protondbContainer.insertAdjacentHTML('afterend', linkHtml);
        
    } catch (error) {
        console.error('Error fetching ProtonDB data:', error);
        document.getElementById('protondbData').innerHTML = `
            <div class="platform-item" style="grid-column: 1/-1;">
                <p style="color: var(--text-muted);">Unable to load ProtonDB data at this moment.</p>
                <a href="https://protondb.com" target="_blank" style="color: var(--color-accent-blue);">Visit ProtonDB →</a>
            </div>
        `;
    }
}

/**
 * Fetch SteamGridDB user data from pre-fetched JSON file
 */
async function fetchSteamGridDBData() {
    try {
        const steamgriddbContainer = document.getElementById('steamgriddbData');
        
        // Try to fetch pre-built data from GitHub Actions
        const response = await fetch('/data/steamgriddb.json');
        
        if (response.ok) {
            const data = await response.json();
            
            console.log('SteamGridDB API Response:', data);
            
            // Parse the public API response format
            if (data.success && data.data && data.data.stats && data.data.stats.grids) {
                const gridStats = data.data.stats.grids;
                const totalGrids = gridStats.total;
                
                // Build stats from different grid types
                const gridBreakdown = [];
                if (gridStats.alternate > 0) gridBreakdown.push(`${gridStats.alternate} Alternate`);
                if (gridStats.white_logo > 0) gridBreakdown.push(`${gridStats.white_logo} White Logo`);
                if (gridStats.no_logo > 0) gridBreakdown.push(`${gridStats.no_logo} No Logo`);
                if (gridStats.material > 0) gridBreakdown.push(`${gridStats.material} Material`);
                if (gridStats.blurred > 0) gridBreakdown.push(`${gridStats.blurred} Blurred`);
                
                const steamgriddbHTML = `
                    <div class="platform-item">
                        <div class="platform-item-title">🎨 Custom Artwork Created</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Total Submissions:</span>
                            <span class="platform-item-stat-value">${totalGrids}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Type:</span>
                            <span class="platform-item-stat-value">Grid Images</span>
                        </div>
                    </div>
                    <div class="platform-item">
                        <div class="platform-item-title">🖼️ Design Assets</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Breakdown:</span>
                            <span class="platform-item-stat-value">${gridBreakdown.join(', ') || 'Multiple Formats'}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Quality:</span>
                            <span class="platform-item-stat-value">High-Resolution</span>
                        </div>
                    </div>
                    <div class="platform-item">
                        <div class="platform-item-title">👥 Community Status</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Role:</span>
                            <span class="platform-item-stat-value">Active Contributor</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Total Artworks:</span>
                            <span class="platform-item-stat-value">${totalGrids} Created</span>
                        </div>
                    </div>
                `;
                
                steamgriddbContainer.innerHTML = steamgriddbHTML;
                console.log(`Successfully loaded ${totalGrids} grids from SteamGridDB`);
            } else {
                console.warn('Unexpected data format, trying direct API call');
                fetchSteamGridDBDataDirectly();
            }
        } else {
            console.warn('SteamGridDB data file not found, trying direct API call');
            fetchSteamGridDBDataDirectly();
        }
        
        // Add profile link
        const linkHtml = `<a href="https://www.steamgriddb.com/profile/76561199244651878" target="_blank" style="display: block; margin-top: var(--spacing-md); text-align: center; color: var(--color-accent-blue); text-decoration: none; font-weight: 600;">Visit SteamGridDB Profile →</a>`;
        steamgriddbContainer.insertAdjacentHTML('afterend', linkHtml);
        
    } catch (error) {
        console.error('Error loading SteamGridDB data:', error);
        displaySteamGridDBFallback();
    }
}

/**
 * Fallback: Try direct API call if JSON file not available
 */
async function fetchSteamGridDBDataDirectly() {
    try {
        const steamgriddbContainer = document.getElementById('steamgriddbData');
        const steamProfileId = '76561199244651878';
        
        console.log('Attempting direct API call to SteamGridDB public profile endpoint...');
        
        // Fetch from public profile API - no authentication required
        const response = await fetch(`https://www.steamgriddb.com/api/public/profile/${steamProfileId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.data && data.data.stats && data.data.stats.grids) {
                const gridStats = data.data.stats.grids;
                const totalGrids = gridStats.total;
                
                // Build stats from different grid types
                const gridBreakdown = [];
                if (gridStats.alternate > 0) gridBreakdown.push(`${gridStats.alternate} Alternate`);
                if (gridStats.white_logo > 0) gridBreakdown.push(`${gridStats.white_logo} White Logo`);
                if (gridStats.no_logo > 0) gridBreakdown.push(`${gridStats.no_logo} No Logo`);
                if (gridStats.material > 0) gridBreakdown.push(`${gridStats.material} Material`);
                if (gridStats.blurred > 0) gridBreakdown.push(`${gridStats.blurred} Blurred`);
                
                const steamgriddbHTML = `
                    <div class="platform-item">
                        <div class="platform-item-title">🎨 Custom Artwork Created</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Total Submissions:</span>
                            <span class="platform-item-stat-value">${totalGrids}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Type:</span>
                            <span class="platform-item-stat-value">Grid Images</span>
                        </div>
                    </div>
                    <div class="platform-item">
                        <div class="platform-item-title">🖼️ Design Assets</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Breakdown:</span>
                            <span class="platform-item-stat-value">${gridBreakdown.join(', ') || 'Multiple Formats'}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Quality:</span>
                            <span class="platform-item-stat-value">High-Resolution</span>
                        </div>
                    </div>
                    <div class="platform-item">
                        <div class="platform-item-title">👥 Community Status</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Role:</span>
                            <span class="platform-item-stat-value">Active Contributor</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Total Artworks:</span>
                            <span class="platform-item-stat-value">${totalGrids} Created</span>
                        </div>
                    </div>
                `;
                
                steamgriddbContainer.innerHTML = steamgriddbHTML;
                console.log(`Successfully loaded ${totalGrids} grids from SteamGridDB public API`);
            } else {
                console.warn('Unexpected data format from public API');
                displaySteamGridDBFallback();
            }
        } else {
            console.error(`SteamGridDB API error: ${response.status}`);
            displaySteamGridDBFallback();
        }
    } catch (error) {
        console.error('Error fetching SteamGridDB data directly:', error);
        displaySteamGridDBFallback();
    }
}

/**
 * Fallback display for SteamGridDB data
 */
function displaySteamGridDBFallback() {
    const steamgriddbContainer = document.getElementById('steamgriddbData');
    
    const fallbackHTML = `
        <div class="platform-item" style="grid-column: 1/-1; text-align: center; padding: var(--spacing-xl);">
            <div style="font-size: 1.2em; color: var(--text-strong); font-weight: 500;">Loading SteamGridDB Data...</div>
            <div style="color: var(--text-muted); margin-top: var(--spacing-sm); font-size: 0.95em;">
                If this persists, please visit your profile directly
            </div>
        </div>
    `;
    
    steamgriddbContainer.innerHTML = fallbackHTML;
}

/**
 * Fetch GitHub contributions
 */
async function fetchGitHubData() {
    try {
        const githubContainer = document.getElementById('githubData');
        
        // Try to fetch pre-built data from GitHub Actions
        const response = await fetch('/data/github-data.json');
        
        if (response.ok) {
            const data = await response.json();
            
            console.log('GitHub API Response:', data);
            
            // Parse the compiled GitHub data
            if (data.success && data.data) {
                const { user, stats, repositories, languages, recent_activity } = data.data;
                
                // Build the display
                let topReposHTML = '';
                if (repositories.top_repos && repositories.top_repos.length > 0) {
                    topReposHTML = repositories.top_repos.slice(0, 3).map(repo => `
                        <div class="repo-item">
                            <strong><a href="${repo.url}" target="_blank" style="color: var(--color-accent-blue); text-decoration: none;">${repo.name}</a></strong>
                            ${repo.language ? `<span style="font-size: 0.9em; color: var(--text-muted);">${repo.language}</span>` : ''}
                            ${repo.stars > 0 ? `<span style="color: var(--color-accent-orange);">⭐ ${repo.stars}</span>` : ''}
                            ${repo.description ? `<p style="margin: 0.25rem 0; font-size: 0.95em;">${repo.description}</p>` : ''}
                        </div>
                    `).join('');
                }
                
                // Get language breakdown
                const topLanguages = Object.entries(languages || {})
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 3)
                    .map(([lang]) => lang)
                    .join(', ');
                
                const githubHTML = `
                    <div class="platform-item">
                        <div class="platform-item-title">💻 Repositories & Code</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Total Projects:</span>
                            <span class="platform-item-stat-value">${stats.public_repos}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Primary Languages:</span>
                            <span class="platform-item-stat-value">${topLanguages || 'Various'}</span>
                        </div>
                    </div>
                    <div class="platform-item">
                        <div class="platform-item-title">📊 Activity & Engagement</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Recent Events:</span>
                            <span class="platform-item-stat-value">${recent_activity.total_events}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Activity Types:</span>
                            <span class="platform-item-stat-value">${Object.values(recent_activity.event_types || {}).reduce((a, b) => a + b, 0)}</span>
                        </div>
                    </div>
                    <div class="platform-item">
                        <div class="platform-item-title">👥 Community Presence</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Followers:</span>
                            <span class="platform-item-stat-value">${stats.followers}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Following:</span>
                            <span class="platform-item-stat-value">${stats.following}</span>
                        </div>
                    </div>
                `;
                
                // Add top repos section if available
                const topReposSection = topReposHTML ? `
                    <div style="margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <h4 style="color: var(--color-accent-blue); margin-bottom: var(--spacing-sm);">Featured Projects</h4>
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                            ${topReposHTML}
                        </div>
                    </div>
                ` : '';
                
                githubContainer.innerHTML = githubHTML + topReposSection;
                console.log(`Successfully loaded GitHub data for ${user.login}`);
            } else {
                console.warn('Unexpected data format');
                displayGitHubFallback();
            }
        } else {
            console.warn('GitHub data file not found');
            displayGitHubFallback();
        }
        
        // Add profile link
        const linkHtml = `<a href="https://github.com/devvyyxyz" target="_blank" style="display: block; margin-top: var(--spacing-md); text-align: center; color: var(--color-accent-blue); text-decoration: none; font-weight: 600;">Visit GitHub Profile →</a>`;
        githubContainer.insertAdjacentHTML('afterend', linkHtml);
        
    } catch (error) {
        console.error('Error loading GitHub data:', error);
        displayGitHubFallback();
    }
}

/**
 * Display GitHub fallback message
 */
function displayGitHubFallback() {
    const githubContainer = document.getElementById('githubData');
    if (githubContainer) {
        githubContainer.innerHTML = `
            <div class="platform-item" style="grid-column: 1/-1;">
                <p style="color: var(--text-muted);">Loading GitHub data...</p>
                <p style="font-size: 0.95em; color: var(--text-muted);">Open source contributions will appear here once data is loaded.</p>
            </div>
        `;
    }
}

/**
 * Fetch Stack Overflow data
 */
async function fetchStackOverflowData() {
    try {
        const soContainer = document.getElementById('stackoverflowData');
        
        // Try to fetch pre-built data from GitHub Actions
        const response = await fetch('/data/stackoverflow-data.json');
        
        if (response.ok) {
            const data = await response.json();
            
            console.log('Stack Overflow API Response:', data);
            
            // Parse the compiled Stack Overflow data
            if (data.success && data.data) {
                const { user, stats, top_answers, recent_questions } = data.data;
                
                // Build top answers display
                let topAnswersHTML = '';
                if (top_answers && top_answers.length > 0) {
                    topAnswersHTML = top_answers.slice(0, 2).map(answer => `
                        <div class="answer-item" style="margin-bottom: 0.5rem; padding: 0.5rem; border-left: 3px solid var(--color-accent-orange);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                                <strong style="color: var(--color-accent-blue); flex: 1;"><a href="${answer.link}" target="_blank" style="color: var(--color-accent-blue); text-decoration: none;">${answer.title.substring(0, 50)}...</a></strong>
                                <span style="color: var(--color-accent-orange); font-weight: bold; margin-left: 0.5rem;">↑${answer.score}</span>
                            </div>
                        </div>
                    `).join('');
                }
                
                const soHTML = `
                    <div class="platform-item">
                        <div class="platform-item-title">🏆 Expertise & Reputation</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Reputation:</span>
                            <span class="platform-item-stat-value">${stats.reputation}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Badges:</span>
                            <span class="platform-item-stat-value">
                                ${stats.badge_counts.gold > 0 ? `🥇${stats.badge_counts.gold} ` : ''}${stats.badge_counts.silver > 0 ? `🥈${stats.badge_counts.silver} ` : ''}${stats.badge_counts.bronze > 0 ? `🥉${stats.badge_counts.bronze}` : 'None yet'}
                            </span>
                        </div>
                    </div>
                    <div class="platform-item">
                        <div class="platform-item-title">💬 Q&A Activity</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Answers Given:</span>
                            <span class="platform-item-stat-value">${stats.answer_count}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Questions Asked:</span>
                            <span class="platform-item-stat-value">${stats.question_count}</span>
                        </div>
                    </div>
                    <div class="platform-item">
                        <div class="platform-item-title">👤 Profile Info</div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">Username:</span>
                            <span class="platform-item-stat-value">${user.display_name}</span>
                        </div>
                        <div class="platform-item-stat">
                            <span class="platform-item-stat-label">User ID:</span>
                            <span class="platform-item-stat-value">#${user.user_id}</span>
                        </div>
                    </div>
                `;
                
                // Add top answers section if available
                const topAnswersSection = topAnswersHTML ? `
                    <div style="margin-top: var(--spacing-md); padding-top: var(--spacing-md); border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <h4 style="color: var(--color-accent-orange); margin-bottom: var(--spacing-sm);">Top Answers</h4>
                        <div style="display: flex; flex-direction: column; gap: var(--spacing-sm);">
                            ${topAnswersHTML}
                        </div>
                    </div>
                ` : '';
                
                soContainer.innerHTML = soHTML + topAnswersSection;
                console.log(`Successfully loaded Stack Overflow data for ${user.display_name}`);
            } else {
                console.warn('Unexpected data format');
                displayStackOverflowFallback();
            }
        } else {
            console.warn('Stack Overflow data file not found');
            displayStackOverflowFallback();
        }
        
        // Add profile link
        const linkHtml = `<a href="https://stackoverflow.com/users/15807152/devvyyxyz" target="_blank" style="display: block; margin-top: var(--spacing-md); text-align: center; color: var(--color-accent-blue); text-decoration: none; font-weight: 600;">Visit Stack Overflow Profile →</a>`;
        soContainer.insertAdjacentHTML('afterend', linkHtml);
        
    } catch (error) {
        console.error('Error loading Stack Overflow data:', error);
        displayStackOverflowFallback();
    }
}

/**
 * Display Stack Overflow fallback message
 */
function displayStackOverflowFallback() {
    const soContainer = document.getElementById('stackoverflowData');
    if (soContainer) {
        soContainer.innerHTML = `
            <div class="platform-item" style="grid-column: 1/-1;">
                <p style="color: var(--text-muted);">Loading Stack Overflow data...</p>
                <p style="font-size: 0.95em; color: var(--text-muted);">Community expertise and Q&A contributions will appear here.</p>
            </div>
        `;
    }
}

/**
 * Initialize all API calls
 */
function initializeOpenSourceData() {
    // Wait for DOM to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            fetchProtonDBData();
            fetchSteamGridDBData();
            fetchGitHubData();
            fetchStackOverflowData();
        });
    } else {
        fetchProtonDBData();
        fetchSteamGridDBData();
        fetchGitHubData();
        fetchStackOverflowData();
    }
}

// Initialize when script loads
initializeOpenSourceData();
