/**
 * DOM Renderer Module
 * Handles rendering portfolio data to the DOM
 */

class DOMRenderer {
    constructor(data) {
        this.data = data;
        this.main = document.getElementById('main');
    }

    /**
     * Render all portfolio content
     */
    render() {
        try {
            this.renderNavigation();
            this.renderHero();
            this.renderSections();
            this.initializeNavigation();
            debug('Portfolio rendered successfully');
        } catch (error) {
            logError('Failed to render portfolio', error);
        }
    }

    /**
     * Render navigation menu
     */
    renderNavigation() {
        const navMenu = document.getElementById('navMenu');
        const nameEl = document.getElementById('name');
        const titleEl = document.getElementById('title');

        // Set header info
        if (nameEl) nameEl.textContent = this.data.personal.name || '';
        if (titleEl) titleEl.textContent = this.data.personal.title || '';

        if (!navMenu) return;

        // Build navigation items
        const navHTML = this.data.navigation.order
            .filter(sectionKey => {
                const section = this.data.sections[sectionKey];
                return section && section.enabled !== false;
            })
            .map(sectionKey => {
                const section = this.data.sections[sectionKey];
                return this.fillTemplate(TEMPLATES.navItem, {
                    sectionId: sectionKey,
                    icon: section.icon || '📄',
                    title: section.title
                });
            })
            .join('');

        navMenu.innerHTML = navHTML;
    }

    /**
     * Render hero section
     */
    renderHero() {
        const p = this.data.personal;
        const emailHTML = p.email ? `<span>✉️ <a href="mailto:${p.email}">${p.email}</a></span>` : '';
        
        const heroHTML = this.fillTemplate(TEMPLATES.hero, {
            name: p.name || '',
            title: p.title || '',
            bio: p.bio || '',
            location: p.location || '',
            email: emailHTML
        });

        this.main.innerHTML = heroHTML;
    }

    /**
     * Render all sections
     */
    renderSections() {
        this.data.navigation.order.forEach(sectionKey => {
            const section = this.data.sections[sectionKey];
            
            if (!section || section.enabled === false) return;

            // Special handling for social section
            if (sectionKey === 'social') {
                this.renderSocialSection(section);
                return;
            }

            // Special handling for skills section
            if (sectionKey === 'skills') {
                this.renderSkillsSection(section);
                return;
            }

            // Special handling for testimonials section
            if (sectionKey === 'testimonials') {
                this.renderTestimonialsSection(section);
                return;
            }

            // Standard section rendering
            this.renderSection(sectionKey, section);
        });
    }

    /**
     * Render a standard section
     */
    renderSection(sectionKey, section) {
        const sectionHTML = this.fillTemplate(TEMPLATES.section, {
            sectionId: sectionKey,
            icon: section.icon || '📄',
            title: section.title
        });

        this.main.insertAdjacentHTML('beforeend', sectionHTML);

        const grid = document.getElementById(`${sectionKey}-grid`);
        if (!grid || !section.items) return;

        // Render items based on section type
        section.items.forEach(item => {
            const itemHTML = this.renderItem(sectionKey, item);
            grid.insertAdjacentHTML('beforeend', itemHTML);
        });
    }

    /**
     * Render an individual item
     */
    renderItem(sectionKey, item) {
        switch(sectionKey) {
            case 'gamesTested':
                return this.renderGameTested(item);
            case 'gamesMade':
                return this.renderGameMade(item);
            case 'art':
                return this.renderArtItem(item);
            case 'codingProjects':
                return this.renderCodingProject(item);
            case 'workExperience':
                return this.renderWorkItem(item);
            case 'clients':
                return this.renderClientItem(item);
            case 'projects':
                return this.renderProjectItem(item);
            case 'education':
                return this.renderEducationItem(item);
            case 'awards':
                return this.renderAwardItem(item);
            case 'certifications':
                return this.renderCertificationItem(item);
            case 'blog':
                return this.renderBlogItem(item);
            case 'openSource':
                return this.renderOpenSourceItem(item);
            case 'speaking':
                return this.renderSpeakingItem(item);
            case 'testimonials':
                return this.renderTestimonialItem(item);
            default:
                return this.renderGenericItem(item);
        }
    }

    renderGameTested(item) {
        const platforms = item.platforms ? 
            item.platforms.map(p => this.fillTemplate(TEMPLATES.itemTag, { tag: p })).join('') : '';
        
        return this.fillTemplate(TEMPLATES.gameTested, {
            image: item.image ? this.fillTemplate(TEMPLATES.itemImage, { src: item.image, alt: item.title }) : '',
            title: item.title || '',
            phase: item.phase || 'Testing',
            role: item.role || '',
            company: item.company || '',
            period: item.period || '',
            description: item.description || '',
            platforms: platforms
        });
    }

    renderGameMade(item) {
        const technologies = item.technologies ? 
            item.technologies.map(t => this.fillTemplate(TEMPLATES.itemTag, { tag: t })).join('') : '';
        
        const footer = item.link || item.repository ? 
            this.fillTemplate(TEMPLATES.itemFooter, {
                content: (item.link ? this.fillTemplate(TEMPLATES.itemLink, { url: item.link, icon: '🎮', text: 'Play Game' }) : '') +
                         (item.repository ? this.fillTemplate(TEMPLATES.itemLink, { url: item.repository, icon: '💻', text: 'View Code' }) : '')
            }) : '';

        return this.fillTemplate(TEMPLATES.gameMade, {
            image: item.image ? this.fillTemplate(TEMPLATES.itemImage, { src: item.image, alt: item.title }) : '',
            title: item.title || '',
            role: item.role || 'Developer',
            period: item.period || '',
            description: item.description || '',
            technologies: technologies,
            footer: footer
        });
    }

    renderArtItem(item) {
        const software = item.software ? 
            item.software.map(s => this.fillTemplate(TEMPLATES.itemTag, { tag: s })).join('') : '';

        return this.fillTemplate(TEMPLATES.artItem, {
            image: item.image ? this.fillTemplate(TEMPLATES.itemImage, { src: item.image, alt: item.title }) : '',
            title: item.title || '',
            type: item.type || 'Art',
            date: item.date || '',
            description: item.description || '',
            software: software
        });
    }

    renderCodingProject(item) {
        const technologies = item.technologies ? 
            item.technologies.map(t => this.fillTemplate(TEMPLATES.itemTag, { tag: t })).join('') : '';
        
        const features = item.features && item.features.length ? 
            this.fillTemplate(TEMPLATES.listUL, {
                items: item.features.map(f => this.fillTemplate(TEMPLATES.listItem, { item: f })).join('')
            }) : '';
        
        const footer = item.link || item.repository ? 
            this.fillTemplate(TEMPLATES.itemFooter, {
                content: (item.link ? this.fillTemplate(TEMPLATES.itemLink, { url: item.link, icon: '🔗', text: 'View Project' }) : '') +
                         (item.repository ? this.fillTemplate(TEMPLATES.itemLink, { url: item.repository, icon: '💻', text: 'View Code' }) : '')
            }) : '';

        return this.fillTemplate(TEMPLATES.codingProject, {
            image: item.image ? this.fillTemplate(TEMPLATES.itemImage, { src: item.image, alt: item.title }) : '',
            title: item.title || '',
            description: item.description || '',
            features: features,
            technologies: technologies,
            footer: footer
        });
    }

    renderWorkItem(item) {
        const currentBadge = item.current ? TEMPLATES.currentBadge : '';
        
        const responsibilities = item.responsibilities && item.responsibilities.length ?
            this.fillTemplate(TEMPLATES.listUL, {
                items: item.responsibilities.map(r => this.fillTemplate(TEMPLATES.listItem, { item: r })).join('')
            }) : '';
        
        const achievements = item.achievements && item.achievements.length ?
            this.fillTemplate(TEMPLATES.listUL, {
                items: item.achievements.map(a => this.fillTemplate(TEMPLATES.listItem, { item: a })).join('')
            }) : '';
        
        const link = item.website ? 
            this.fillTemplate(TEMPLATES.itemLink, { url: item.website, icon: '🔗', text: 'Visit Website' }) : '';

        return this.fillTemplate(TEMPLATES.workItem, {
            position: item.position || '',
            currentBadge: currentBadge,
            company: item.company || '',
            location: item.location || '',
            period: item.period || '',
            responsibilities: responsibilities,
            achievements: achievements,
            link: link
        });
    }

    renderClientItem(item) {
        const technologies = item.technologies ? 
            item.technologies.map(t => this.fillTemplate(TEMPLATES.itemTag, { tag: t })).join('') : '';
        
        const testimonial = item.testimonial ? 
            `<blockquote class="testimonial">"${item.testimonial}"</blockquote>` : '';

        return this.fillTemplate(TEMPLATES.clientItem, {
            name: item.name || '',
            role: item.role || '',
            period: item.period || '',
            project: item.project || '',
            technologies: technologies,
            testimonial: testimonial
        });
    }

    renderProjectItem(item) {
        const technologies = item.technologies ? 
            item.technologies.map(t => this.fillTemplate(TEMPLATES.itemTag, { tag: t })).join('') : '';
        
        const highlights = item.highlights && item.highlights.length ?
            this.fillTemplate(TEMPLATES.listUL, {
                items: item.highlights.map(h => this.fillTemplate(TEMPLATES.listItem, { item: h })).join('')
            }) : '';
        
        const footer = item.link || item.repository ? 
            this.fillTemplate(TEMPLATES.itemFooter, {
                content: (item.link ? this.fillTemplate(TEMPLATES.itemLink, { url: item.link, icon: '🔗', text: 'View Project' }) : '') +
                         (item.repository ? this.fillTemplate(TEMPLATES.itemLink, { url: item.repository, icon: '💻', text: 'View Code' }) : '')
            }) : '';

        return this.fillTemplate(TEMPLATES.portfolioItem, {
            image: item.image ? this.fillTemplate(TEMPLATES.itemImage, { src: item.image, alt: item.title }) : '',
            title: item.title || '',
            meta: this.fillTemplate(TEMPLATES.itemMeta, {
                content: `<span>${item.role || ''}</span><span>${item.period || ''}</span><span class="item-badge">${item.category || ''}</span>`
            }),
            description: item.description || '',
            tags: this.fillTemplate(TEMPLATES.itemTags, { tags: technologies }),
            footer: footer
        });
    }

    renderEducationItem(item) {
        const grade = item.grade ? 
            `<div class="item-meta"><strong>Grade:</strong> ${item.grade}</div>` : '';
        
        const achievements = item.achievements && item.achievements.length ?
            this.fillTemplate(TEMPLATES.listUL, {
                items: item.achievements.map(a => this.fillTemplate(TEMPLATES.listItem, { item: a })).join('')
            }) : '';

        return this.fillTemplate(TEMPLATES.educationItem, {
            institution: item.institution || '',
            degree: item.degree || '',
            field: item.field || '',
            location: item.location || '',
            graduationDate: item.graduationDate || '',
            grade: grade,
            achievements: achievements
        });
    }

    renderAwardItem(item) {
        return this.fillTemplate(TEMPLATES.awardItem, {
            title: item.title || '',
            category: item.category || 'Award',
            issuer: item.issuer || '',
            date: item.date || '',
            description: item.description || ''
        });
    }

    renderCertificationItem(item) {
        const link = item.link ? 
            this.fillTemplate(TEMPLATES.itemFooter, {
                content: this.fillTemplate(TEMPLATES.itemLink, { url: item.link, icon: '🔗', text: 'View Certificate' })
            }) : '';

        return this.fillTemplate(TEMPLATES.certificationItem, {
            title: item.title || '',
            issuer: item.issuer || '',
            date: item.date || '',
            link: link
        });
    }

    renderBlogItem(item) {
        const tags = item.tags ? 
            item.tags.map(t => this.fillTemplate(TEMPLATES.itemTag, { tag: t })).join('') : '';
        
        const footer = item.link ? 
            this.fillTemplate(TEMPLATES.itemFooter, {
                content: this.fillTemplate(TEMPLATES.itemLink, { url: item.link, icon: '📖', text: 'Read Article' })
            }) : '';

        return this.fillTemplate(TEMPLATES.portfolioItem, {
            image: '',
            title: item.title || '',
            meta: this.fillTemplate(TEMPLATES.itemMeta, {
                content: `<span>${item.category || 'Article'}</span><span>${item.date || ''}</span>`
            }),
            description: item.excerpt || item.description || '',
            tags: this.fillTemplate(TEMPLATES.itemTags, { tags: tags }),
            footer: footer
        });
    }

    renderOpenSourceItem(item) {
        const technologies = item.technologies ? 
            item.technologies.map(t => this.fillTemplate(TEMPLATES.itemTag, { tag: t })).join('') : '';
        
        const stats = [];
        if (item.prs) stats.push(`${item.prs} PRs`);
        if (item.stars) stats.push(`⭐ ${item.stars}`);
        
        const footer = item.repository ? 
            this.fillTemplate(TEMPLATES.itemFooter, {
                content: this.fillTemplate(TEMPLATES.itemLink, { url: item.repository, icon: '💻', text: 'View on GitHub' })
            }) : '';

        return this.fillTemplate(TEMPLATES.portfolioItem, {
            image: '',
            title: item.project || '',
            meta: this.fillTemplate(TEMPLATES.itemMeta, {
                content: `<span>${item.role || 'Contributor'}</span><span>${stats.join(' • ')}</span>`
            }),
            description: item.description || '',
            tags: this.fillTemplate(TEMPLATES.itemTags, { tags: technologies }),
            footer: footer
        });
    }

    renderSpeakingItem(item) {
        const links = [];
        if (item.slides) links.push(this.fillTemplate(TEMPLATES.itemLink, { url: item.slides, icon: '📊', text: 'Slides' }));
        if (item.recording) links.push(this.fillTemplate(TEMPLATES.itemLink, { url: item.recording, icon: '▶️', text: 'Recording' }));
        
        const footer = links.length ? 
            this.fillTemplate(TEMPLATES.itemFooter, { content: links.join('') }) : '';

        return this.fillTemplate(TEMPLATES.portfolioItem, {
            image: '',
            title: item.title || '',
            meta: this.fillTemplate(TEMPLATES.itemMeta, {
                content: `<span>${item.event || ''}</span><span>${item.date || ''}</span><span class="item-badge">${item.type || 'Talk'}</span>`
            }),
            description: item.description || '',
            tags: '',
            footer: footer
        });
    }

    renderTestimonialItem(item) {
        const image = item.image ? 
            `<img src="${item.image}" alt="${item.name}" class="testimonial-image" />` : '';
        
        return `
            <div class="portfolio-item testimonial-item">
                ${image}
                <blockquote class="testimonial-quote">"${item.quote || ''}"</blockquote>
                <div class="testimonial-author">
                    <strong>${item.name || ''}</strong>
                    <span>${item.position || ''}</span>
                    ${item.company ? `<span>${item.company}</span>` : ''}
                </div>
            </div>
        `;
    }

    renderGenericItem(item) {
        return this.fillTemplate(TEMPLATES.portfolioItem, {
            image: '',
            title: item.title || item.name || '',
            meta: '',
            description: item.description || '',
            tags: '',
            footer: ''
        });
    }

    renderSkillsSection(section) {
        const sectionHTML = this.fillTemplate(TEMPLATES.section, {
            sectionId: 'skills',
            icon: section.icon || '⚡',
            title: section.title
        });

        this.main.insertAdjacentHTML('beforeend', sectionHTML);

        const grid = document.getElementById('skills-grid');
        if (!grid || !section.categories) return;

        section.categories.forEach(category => {
            const skillsHTML = category.skills.map(skill => 
                this.fillTemplate(TEMPLATES.skillItem, {
                    name: skill.name,
                    level: skill.level || 50
                })
            ).join('');

            const categoryHTML = this.fillTemplate(TEMPLATES.skillsCategory, {
                category: category.category,
                skills: skillsHTML
            });

            grid.insertAdjacentHTML('beforeend', categoryHTML);
        });
    }

    renderSocialSection(section) {
        if (!section.items || !section.items.length) return;

        const iconMap = {
            'linkedin': 'Assets/Icons/style-glossy-blue/linkedin.png',
            'github': 'Assets/Icons/style-glossy-blue/linkedin.png', // Using LinkedIn as placeholder
            'youtube': 'Assets/Icons/style-glossy-blue/youtube.png',
            'instagram': 'Assets/Icons/style-glossy-blue/instagram.png',
            'facebook': 'Assets/Icons/style-glossy-blue/facebook.png',
            'reddit': 'Assets/Icons/style-glossy-blue/reddit.png',
            'pinterest': 'Assets/Icons/style-glossy-blue/pinterest.png',
            'tumblr': 'Assets/Icons/style-glossy-blue/tumblr.png',
            'skype': 'Assets/Icons/style-glossy-blue/skype.png',
            'twitter': 'Assets/Icons/style-glossy-blue/reddit.png', // Using Reddit as placeholder
            'discord': 'Assets/Icons/style-glossy-blue/messages.png'
        };

        const itemsHTML = section.items.map(item => {
            const platformLower = (item.platform || '').toLowerCase();
            const iconPath = iconMap[platformLower];
            const iconHTML = iconPath 
                ? `<img src="${iconPath}" alt="${item.platform}" class="social-icon-img" width="48" height="48" loading="lazy" />`
                : `<span class="social-icon-fallback">${item.platform ? item.platform.charAt(0) : '?'}</span>`;
            
            return `
                <a href="${item.url || '#'}" target="_blank" rel="noopener noreferrer" 
                   class="social-link hover-lift" aria-label="${item.platform}">
                    <div class="social-icon">${iconHTML}</div>
                    <div class="social-info">
                        <div class="social-platform">${item.platform || ''}</div>
                        <div class="social-username">${item.username || ''}</div>
                    </div>
                </a>
            `;
        }).join('');

        const socialHTML = `
            <section id="social" class="portfolio-section reveal">
                <h2 class="section-title">
                    <span class="section-icon">${section.icon || '🔗'}</span>
                    ${section.title}
                </h2>
                <div class="social-grid">
                    ${itemsHTML}
                </div>
            </section>
        `;

        this.main.insertAdjacentHTML('beforeend', socialHTML);
    }

    renderTestimonialsSection(section) {
        const sectionHTML = this.fillTemplate(TEMPLATES.section, {
            sectionId: 'testimonials',
            icon: section.icon || '💬',
            title: section.title
        });

        this.main.insertAdjacentHTML('beforeend', sectionHTML);

        const grid = document.getElementById('testimonials-grid');
        if (!grid || !section.items) return;

        section.items.forEach(item => {
            const itemHTML = this.renderTestimonialItem(item);
            grid.insertAdjacentHTML('beforeend', itemHTML);
        });
    }

    /**
     * Initialize navigation functionality
     */
    initializeNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking a link
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }

        // Smooth scroll and active state
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    
                    // Update active state
                    document.querySelectorAll('.nav-menu a').forEach(a => a.classList.remove('active'));
                    this.classList.add('active');
                }
            });
        });
    }

    /**
     * Fill template with data
     */
    fillTemplate(template, data) {
        let result = template;
        Object.keys(data).forEach(key => {
            const regex = new RegExp(`%${key}%`, 'g');
            result = result.replace(regex, data[key] || '');
        });
        return result;
    }
}
