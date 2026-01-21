/**
 * HTML Templates
 * All HTML template strings for dynamic content generation
 */

const TEMPLATES = {
    // Navigation
    navItem: '<li><a href="#%sectionId%" data-section="%sectionId%"><span>%icon%</span> %title%</a></li>',
    
    // Hero/Header Section
    hero: `<section class="hero">
        <h1>%name%</h1>
        <p class="lead">%title%</p>
        <p>%bio%</p>
        <div class="hero-meta">
            <span>📍 %location%</span>
            %email%
        </div>
    </section>`,
    
    // Section Container
    section: `<section id="%sectionId%" class="portfolio-section">
        <div class="section-header">
            <span class="section-icon">%icon%</span>
            <h2 class="section-title">%title%</h2>
        </div>
        <div class="section-grid" id="%sectionId%-grid"></div>
    </section>`,
    
    // Portfolio Item Cards
    portfolioItem: `<div class="portfolio-item">
        %image%
        <div class="item-header">
            <h3 class="item-title">%title%</h3>
        </div>
        %meta%
        <div class="item-description">%description%</div>
        %tags%
        %footer%
    </div>`,
    
    itemImage: '<img src="%src%" alt="%alt%" class="item-image">',
    itemMeta: '<div class="item-meta">%content%</div>',
    itemBadge: '<span class="item-badge">%text%</span>',
    itemTags: '<div class="item-tags">%tags%</div>',
    itemTag: '<span class="item-tag">%tag%</span>',
    itemFooter: '<div class="item-footer">%content%</div>',
    itemLink: '<a href="%url%" class="item-link" target="_blank">%icon% %text%</a>',
    
    // Games Tested Item
    gameTested: `<div class="portfolio-item">
        %image%
        <div class="item-header">
            <h3 class="item-title">%title%</h3>
            <span class="item-badge">%phase%</span>
        </div>
        <div class="item-meta">
            <span>%role% @ %company%</span>
            <span>%period%</span>
        </div>
        <div class="item-description">%description%</div>
        <div class="item-tags">%platforms%</div>
    </div>`,
    
    // Games Made Item
    gameMade: `<div class="portfolio-item">
        %image%
        <div class="item-header">
            <h3 class="item-title">%title%</h3>
        </div>
        <div class="item-meta">
            <span>%role%</span>
            <span>%period%</span>
        </div>
        <div class="item-description">%description%</div>
        <div class="item-tags">%technologies%</div>
        %footer%
    </div>`,
    
    // Art Item
    artItem: `<div class="portfolio-item">
        %image%
        <div class="item-header">
            <h3 class="item-title">%title%</h3>
            <span class="item-badge">%type%</span>
        </div>
        <div class="item-meta">
            <span>%date%</span>
        </div>
        <div class="item-description">%description%</div>
        <div class="item-tags">%software%</div>
    </div>`,
    
    // Coding Project Item
    codingProject: `<div class="portfolio-item">
        %image%
        <div class="item-header">
            <h3 class="item-title">%title%</h3>
        </div>
        <div class="item-description">%description%</div>
        %features%
        <div class="item-tags">%technologies%</div>
        %footer%
    </div>`,
    
    // Work Experience Item
    workItem: `<div class="portfolio-item">
        <div class="item-header">
            <h3 class="item-title">%position%</h3>
            %currentBadge%
        </div>
        <div class="item-meta">
            <span><strong>%company%</strong></span>
            <span>%location%</span>
            <span>%period%</span>
        </div>
        %responsibilities%
        %achievements%
        %link%
    </div>`,
    
    // Client Item
    clientItem: `<div class="portfolio-item">
        <div class="item-header">
            <h3 class="item-title">%name%</h3>
        </div>
        <div class="item-meta">
            <span>%role%</span>
            <span>%period%</span>
        </div>
        <div class="item-description">%project%</div>
        <div class="item-tags">%technologies%</div>
        %testimonial%
    </div>`,
    
    // Education Item
    educationItem: `<div class="portfolio-item">
        <div class="item-header">
            <h3 class="item-title">%institution%</h3>
        </div>
        <div class="item-meta">
            <span>%degree% in %field%</span>
            <span>%location%</span>
            <span>%graduationDate%</span>
        </div>
        %grade%
        %achievements%
    </div>`,
    
    // Award Item
    awardItem: `<div class="portfolio-item">
        <div class="item-header">
            <h3 class="item-title">%title%</h3>
            <span class="item-badge">%category%</span>
        </div>
        <div class="item-meta">
            <span>%issuer%</span>
            <span>%date%</span>
        </div>
        <div class="item-description">%description%</div>
    </div>`,
    
    // Certification Item
    certificationItem: `<div class="portfolio-item">
        <div class="item-header">
            <h3 class="item-title">%title%</h3>
        </div>
        <div class="item-meta">
            <span>%issuer%</span>
            <span>%date%</span>
        </div>
        %link%
    </div>`,
    
    // Skills Section
    skillsCategory: `<div class="portfolio-item">
        <h3 class="item-title">%category%</h3>
        <div class="skills-list">%skills%</div>
    </div>`,
    
    skillItem: `<div class="skill-item">
        <div class="skill-name">%name%</div>
        <div class="skill-bar">
            <div class="skill-progress" style="width: %level%%"></div>
        </div>
    </div>`,
    
    // Social Links
    socialSection: `<section id="social" class="portfolio-section">
        <div class="section-header">
            <span class="section-icon">🔗</span>
            <h2 class="section-title">Social Links</h2>
        </div>
        <div class="social-grid">%items%</div>
    </section>`,
    
    socialItem: `<a href="%url%" class="social-link" target="_blank">
        <span class="social-icon">%icon%</span>
        <span class="social-platform">%platform%</span>
        <span class="social-username">@%username%</span>
    </a>`,
    
    // Helper templates
    listUL: '<ul class="item-list">%items%</ul>',
    listItem: '<li>%item%</li>',
    currentBadge: '<span class="item-badge" style="background: linear-gradient(135deg, #00CC66 0%, #00AA55 100%); color: white;">Current</span>',
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TEMPLATES;
}
