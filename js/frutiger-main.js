// FrutigerAero Portfolio Builder

document.addEventListener('DOMContentLoaded', function() {
    // Hide preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 2000);
    }

    // Load resume data
    fetch('resume.json')
        .then(response => response.json())
        .then(data => populatePortfolio(data))
        .catch(error => console.error('Error loading resume:', error));

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Scroll to top button
    const scrollTop = document.getElementById('scrollTop');
    if (scrollTop) {
        window.addEventListener('scroll', () => {
            scrollTop.classList.toggle('show', window.scrollY > 300);
        });

        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Text Size Controls
    const sizeButtons = document.querySelectorAll('.size-btn');
    const siteContainer = document.getElementById('siteContainer');
    
    // Restore saved text size preference from localStorage
    const savedTextSize = localStorage.getItem('portfolioTextSize') || 'medium';
    if (siteContainer) {
        siteContainer.classList.add(`text-${savedTextSize}`);
        sizeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.size === savedTextSize) {
                btn.classList.add('active');
            }
        });
    }
    
    // Add click handlers to size buttons
    sizeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const size = this.dataset.size;
            
            // Remove all text size classes
            siteContainer.classList.remove('text-small', 'text-medium', 'text-large');
            
            // Add the new size class
            siteContainer.classList.add(`text-${size}`);
            
            // Update active button state
            sizeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Save preference to localStorage
            localStorage.setItem('portfolioTextSize', size);
        });
    });

    // Scroll reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Parallax effect
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu) {
            navMenu.classList.remove('active');
        }
    });
});

function populatePortfolio(data) {
    const { personal, displayOrder } = data;

    // Hero Section
    document.getElementById('heroName').textContent = personal.name;
    document.getElementById('heroTitle').textContent = personal.title;
    document.getElementById('shortBio').textContent = personal.shortBio || '';

    // Build sections based on display order
    if (displayOrder && displayOrder.length > 0) {
        displayOrder.forEach(sectionType => {
            switch(sectionType) {
                case 'projects':
                    buildProjects(data.projectSections);
                    break;
                case 'work':
                    buildWork(data.work);
                    break;
                case 'education':
                    buildEducation(data.education);
                    break;
                case 'awards':
                    buildAwards(data.awards);
                    break;
                case 'volunteer':
                    buildVolunteer(data.volunteer);
                    break;
                case 'social':
                    buildSocial(personal.profiles);
                    break;
            }
        });
    }

    // Observe all cards for scroll animations
    setTimeout(() => {
        const cards = document.querySelectorAll('.project-card, .timeline-item, .award-card, .volunteer-item, .social-link');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('scroll-reveal');
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => observer.observe(card));
    }, 100);
}

function buildProjects(projectSections) {
    const container = document.getElementById('projects-container');
    if (!projectSections || !container) return;

    projectSections.forEach(section => {
        const html = `
            <div class="project-card scroll-reveal">
                <h3>${section.title}</h3>
                <p>${section.description || ''}</p>
                ${section.projects && section.projects.length > 0 ? `
                    <ul class="project-highlights">
                        ${section.projects.map(p => `<li>${p.title || p}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function buildWork(work) {
    const container = document.getElementById('work-container');
    if (!work || !container) return;

    work.forEach(job => {
        const html = `
            <div class="timeline-item scroll-reveal">
                <h3>${job.title || 'Position'}</h3>
                <div class="subtitle">${job.employer || ''}</div>
                ${job.location ? `<div class="subtitle">${job.location}</div>` : ''}
                <div class="dates">${job.dates || ''}</div>
                ${job.highlights && job.highlights.length > 0 ? `
                    <ul>
                        ${job.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function buildEducation(education) {
    const container = document.getElementById('education-container');
    if (!education || !container) return;

    education.forEach(edu => {
        const html = `
            <div class="timeline-item scroll-reveal">
                <h3>${edu.studyType || 'Degree'} in ${edu.area || ''}</h3>
                <div class="subtitle">${edu.institution || ''}</div>
                ${edu.location ? `<div class="subtitle">${edu.location}</div>` : ''}
                <div class="dates">${edu.startDate || ''} - ${edu.endDate || ''}</div>
                ${edu.score ? `<p><strong>GPA:</strong> ${edu.score}</p>` : ''}
                ${edu.courses && edu.courses.length > 0 ? `
                    <p><strong>Relevant Courses:</strong></p>
                    <ul>
                        ${edu.courses.map(c => `<li>${c}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function buildAwards(awards) {
    const container = document.getElementById('awards-container');
    if (!awards || !container) return;

    awards.forEach((award, index) => {
        const icons = ['🏆', '🥇', '⭐', '🎖️', '👑', '💎'];
        const icon = icons[index % icons.length];
        
        const html = `
            <div class="award-card scroll-reveal">
                <div class="award-icon">${icon}</div>
                <h3>${award.title || 'Award'}</h3>
                ${award.issuer ? `<p><strong>${award.issuer}</strong></p>` : ''}
                ${award.date ? `<p>${award.date}</p>` : ''}
                ${award.summary ? `<p>${award.summary}</p>` : ''}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function buildVolunteer(volunteer) {
    const container = document.getElementById('volunteer-container');
    if (!volunteer || !container) return;

    volunteer.forEach(vol => {
        const html = `
            <div class="volunteer-item scroll-reveal">
                <h3>${vol.position || 'Volunteer Position'}</h3>
                <div class="organization">${vol.organization || ''}</div>
                ${vol.location ? `<p><strong>Location:</strong> ${vol.location}</p>` : ''}
                <div class="dates">${vol.startDate || ''} - ${vol.endDate || ''}</div>
                ${vol.summary ? `<p>${vol.summary}</p>` : ''}
                ${vol.highlights && vol.highlights.length > 0 ? `
                    <ul>
                        ${vol.highlights.map(h => `<li>${h}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

function buildSocial(profiles) {
    const container = document.getElementById('social-container');
    if (!profiles || !container) return;

    const socialIcons = {
        'twitter': 'twitter',
        'github': 'messages',
        'linkedin': 'linkedin',
        'facebook': 'facebook',
        'instagram': 'instagram',
        'website': 'safari',
        'email': 'mail',
        'youtube': 'youtube',
        'pinterest': 'pinterest',
        'reddit': 'reddit'
    };

    profiles.forEach(profile => {
        const network = profile.network.toLowerCase();
        const iconName = socialIcons[network] || 'messages';
        const iconPath = `Assets/Icons/style-glossy-blue/${iconName}.png`;
        
        const html = `
            <a href="${profile.url}" class="social-link scroll-reveal" target="_blank" rel="noopener noreferrer">
                <img src="${iconPath}" alt="${profile.network}" class="social-icon" title="${profile.network}" onerror="this.style.display='none'">
                <span>${profile.network}</span>
            </a>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

// Auto-hide empty sections
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const sections = ['projects', 'work', 'education', 'awards', 'volunteer', 'social'];
        
        sections.forEach(section => {
            const container = document.getElementById(`${section}-container`);
            const sectionElement = document.querySelector(`#${section}`);
            
            if (container && sectionElement && container.children.length === 0) {
                sectionElement.style.display = 'none';
            }
        });
    }, 500);
});
