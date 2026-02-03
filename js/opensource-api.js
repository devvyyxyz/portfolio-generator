/**
 * Open Source API Integration (Refactored)
 * Orchestrates API calls and rendering for multiple platforms
 * Uses APIService for fetch logic and PlatformRenderers for HTML generation
 */

const PROTONDB_USERNAME = 'devvyyxyz';
const STEAMGRIDDB_USERNAME = 'devvyyxyz';

/**
 * Fetch and render ProtonDB data
 */
async function fetchProtonDBData() {
    const data = await APIService.fetch({
        name: 'ProtonDB',
        dataFile: null,
        fallback: () => ({}) // ProtonDB has no public API
    });
    
    APIService.render('protondbData', data, (d) => PlatformRenderers.protonDB(d));
    
    APIService.addLinkAfter('protondbData', 'https://protondb.com', 'Visit ProtonDB →');
}

/**
 * Fetch and render SteamGridDB data
 */
async function fetchSteamGridDBData() {
    const data = await APIService.fetch({
        name: 'SteamGridDB',
        dataFile: '/data/steamgriddb.json',
        apiUrl: 'https://www.steamgriddb.com/api/public/profile/76561199244651878',
        apiOptions: {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        },
        transform: (response) => {
            // Handle both direct API response and cached JSON format
            if (response.success && response.data) {
                return { stats: response.data.stats };
            }
            return response;
        }
    });
    
    APIService.render('steamgriddbData', data, (d) => PlatformRenderers.steamGridDB(d));
    
    APIService.addLinkAfter('steamgriddbData', 'https://www.steamgriddb.com/profile/76561199244651878', 'Visit SteamGridDB Profile →');
}

/**
 * Fetch and render GitHub data
 */
async function fetchGitHubData() {
    const data = await APIService.fetch({
        name: 'GitHub',
        dataFile: '/data/github-data.json',
        apiUrl: 'https://api.github.com/users/devvyyxyz',
        apiOptions: {
            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'Portfolio-Generator'
            }
        },
        transform: (response) => {
            if (response.stats) return response;
            return {
                stats: {
                    public_repos: response.public_repos,
                    followers: response.followers,
                    pull_requests: response.public_repos,
                    issues_created: 0,
                    most_starred_repo: 'Various'
                }
            };
        }
    });
    
    APIService.render('githubData', data, (d) => PlatformRenderers.gitHub(d));
    
    APIService.addLinkAfter('githubData', 'https://github.com/devvyyxyz', 'Visit GitHub Profile →');
}

/**
 * Fetch and render Stack Overflow data
 */
async function fetchStackOverflowData() {
    const data = await APIService.fetch({
        name: 'Stack Overflow',
        dataFile: '/data/stackoverflow-data.json',
        apiUrl: 'https://api.stackexchange.com/2.3/users/13554313?site=stackoverflow&order=desc&sort=reputation',
        apiOptions: {
            headers: { 'Accept': 'application/json' }
        },
        transform: (response) => {
            if (response.stats) return response;
            const user = response.items?.[0] || {};
            return {
                stats: {
                    answer_count: user.answer_count || 0,
                    accepted_answer_count: 0,
                    reputation: user.reputation || 0,
                    badge_count: (user.badge_counts?.gold || 0) + (user.badge_counts?.silver || 0) + (user.badge_counts?.bronze || 0),
                    question_count: user.question_count || 0
                }
            };
        }
    });
    
    APIService.render('stackoverflowData', data, (d) => PlatformRenderers.stackOverflow(d));
    
    APIService.addLinkAfter('stackoverflowData', 'https://stackoverflow.com/users/13554313', 'Visit Stack Overflow Profile →');
}

/**
 * Fetch and render CodePen data
 */
async function fetchCodePenData() {
    const data = await APIService.fetch({
        name: 'CodePen',
        dataFile: '/data/codepen-data.json',
        apiUrl: null,
        fallback: () => ({ stats: { public_pens: 25, followers: 50, likes: 300, comments: 45 } })
    });
    
    APIService.render('codepenData', data, (d) => PlatformRenderers.codepen(d));
    
    APIService.addLinkAfter('codepenData', 'https://codepen.io/devvyyxyz', 'Visit CodePen Profile →');
}

/**
 * Fetch and render YouTube data
 */
async function fetchYouTubeData() {
    const data = await APIService.fetch({
        name: 'YouTube',
        dataFile: '/data/youtube-data.json',
        apiUrl: null,
        fallback: () => ({ stats: { subscriber_count: 150, video_count: 35, view_count: 5000 } })
    });
    
    APIService.render('youtubeData', data, (d) => PlatformRenderers.youtube(d));
    
    APIService.addLinkAfter('youtubeData', 'https://youtube.com/@devvyyxyz', 'Visit YouTube Channel →');
}

/**
 * Fetch and render LinkedIn data
 */
async function fetchLinkedInData() {
    const data = await APIService.fetch({
        name: 'LinkedIn',
        dataFile: '/data/linkedin-data.json',
        apiUrl: null,
        fallback: () => ({ stats: { connections: 500, endorsements: 120, posts: 25 } })
    });
    
    APIService.render('linkedinData', data, (d) => PlatformRenderers.linkedin(d));
    
    APIService.addLinkAfter('linkedinData', 'https://linkedin.com/in/devvyyxyz', 'Visit LinkedIn Profile →');
}

/**
 * Initialize all platform data fetching
 */
async function initializePlatformData() {
    try {
        console.log('Initializing platform data fetches...');
        await Promise.all([
            fetchProtonDBData(),
            fetchSteamGridDBData(),
            fetchGitHubData(),
            fetchStackOverflowData(),
            fetchCodePenData(),
            fetchYouTubeData(),
            fetchLinkedInData()
        ]);
        console.log('✓ All platform data loaded');
    } catch (error) {
        console.error('Error initializing platform data:', error);
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePlatformData);
} else {
    initializePlatformData();
}
