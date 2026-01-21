// FrutigerAero Portfolio Builder

// Initialize after components are loaded
function initializeApp() {
    console.log('Initializing app...');
    initThemeSwitcher();
    injectAmbientLayers();
    const particleContainer = document.querySelector('.ui-particles');
    let particlesOn = localStorage.getItem('portfolioParticlesEnabled') !== 'false';

    function applyParticleState(enabled) {
        particlesOn = enabled;
        if (particleContainer) {
            particleContainer.classList.toggle('is-hidden', !enabled);
            particleContainer.innerHTML = '';
        }
        if (enabled) {
            initParticles(18);
        }
        localStorage.setItem('portfolioParticlesEnabled', particlesOn);

        const particleButtons = document.querySelectorAll('.particle-btn');
        particleButtons.forEach(btn => {
            const shouldBeActive = btn.dataset.particles === (enabled ? 'on' : 'off');
            btn.classList.toggle('active', shouldBeActive);
        });
    }

    applyParticleState(particlesOn);
    initToasts();
    initDevOverlay();
    
    // Content now loaded from HTML components via component-loader.js
    // No JSON data loading needed

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
        const updateScrollTopVisibility = () => {
            const threshold = window.innerHeight * 0.25; // show after ~25% viewport scroll
            scrollTop.classList.toggle('show', window.scrollY > threshold);
        };

        window.addEventListener('scroll', updateScrollTopVisibility);
        // Run once on load in case page starts scrolled
        updateScrollTopVisibility();

        scrollTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Sound System
    const soundEnabled = localStorage.getItem('portfolioSoundsEnabled') !== 'false'; // default true
    let soundsOn = soundEnabled;
    
    const sounds = {
        click: new Audio('Assets/sounds/links.ogg'),
        hover: new Audio('Assets/sounds/tokoni_hover.ogg'),
        leave: new Audio('Assets/sounds/tokoni_leave.ogg'),
        enable: new Audio('Assets/sounds/sounds_enable.mp3'),
        disable: new Audio('Assets/sounds/sounds_disable.mp3')
    };
    
    // Preload all sounds
    Object.values(sounds).forEach(sound => {
        sound.preload = 'auto';
        sound.volume = 0.3;
    });
    
    function playSound(soundName) {
        if (soundsOn && sounds[soundName]) {
            sounds[soundName].currentTime = 0;
            sounds[soundName].play().catch(e => console.log('Sound play failed:', e));
        }
    }
    
    // Music Player System
    const musicEnabled = localStorage.getItem('portfolioMusicEnabled') !== 'false'; // default true
    let musicOn = musicEnabled;
    
    const musicPlaylist = [
        'Assets/music/home.mp3',
        'Assets/music/about.mp3',
        'Assets/music/blog.mp3',
        'Assets/music/community.mp3',
        'Assets/music/resources.mp3',
        'Assets/music/chatroom.mp3',
        'Assets/music/art_gallery.mp3',
        'Assets/music/all_links.mp3',
        'Assets/music/creator_spotlights.mp3',
        'Assets/music/news.mp3',
        'Assets/music/blog/website_launched.mp3',
        'Assets/music/blog/10k_100k_milestone_event.mp3',
        'Assets/music/creator_spotlights/january.mp3',
        'Assets/music/creator_spotlights/february.mp3',
        'Assets/music/creator_spotlights/march.mp3',
        'Assets/music/creator_spotlights/april.mp3',
        'Assets/music/creator_spotlights/may.mp3',
        'Assets/music/creator_spotlights/june.mp3',
        'Assets/music/creator_spotlights/july.mp3',
        'Assets/music/creator_spotlights/august.mp3',
        'Assets/music/creator_spotlights/september.mp3',
        'Assets/music/creator_spotlights/october.mp3',
        'Assets/music/creator_spotlights/november.mp3',
        'Assets/music/creator_spotlights/december.mp3'
    ];
    
    let currentTrackIndex = 0;
    const musicPlayer = new Audio(musicPlaylist[currentTrackIndex]);
    musicPlayer.volume = 0.2;
    musicPlayer.loop = false;
    
    // Auto-play next song when current one ends
    musicPlayer.addEventListener('ended', function() {
        if (musicOn) {
            skipToNextTrack();
        }
    });
    
    function skipToNextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % musicPlaylist.length;
        musicPlayer.src = musicPlaylist[currentTrackIndex];
        if (musicOn) {
            musicPlayer.play().catch(e => console.log('Music play failed:', e));
        }
    }
    
    function toggleMusic(shouldPlay) {
        musicOn = shouldPlay;
        if (musicOn) {
            musicPlayer.play().catch(e => {
                console.log('Music autoplay blocked. User interaction required.');
                // Will play on next user interaction
            });
        } else {
            musicPlayer.pause();
        }
        localStorage.setItem('portfolioMusicEnabled', musicOn);
    }
    
    // Music Toggle Controls
    const musicButtons = document.querySelectorAll('.music-btn');
    
    // Set initial state
    musicButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.music === 'on' && musicOn) {
            btn.classList.add('active');
        } else if (btn.dataset.music === 'off' && !musicOn) {
            btn.classList.add('active');
        }
    });
    
    // Add click handlers to music buttons
    musicButtons.forEach(button => {
        button.addEventListener('click', function() {
            const setting = this.dataset.music;
            const shouldPlay = setting === 'on';
            
            toggleMusic(shouldPlay);
            
            // Update active button state
            musicButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Skip button functionality
    const skipButton = document.querySelector('.skip-btn');
    if (skipButton) {
        skipButton.addEventListener('click', function() {
            skipToNextTrack();
            playSound('click');
        });
    }
    
    // Attempt to start music if enabled (may be blocked by browser)
    if (musicOn) {
        setTimeout(() => {
            musicPlayer.play().catch(e => {
                console.log('Music autoplay blocked. Click anywhere to start.');
            });
        }, 1000);
    }

    initSystemStatus();
    initLogoEasterEgg();

    // Particle toggle controls
    function bindParticleButtons() {
        const particleButtons = document.querySelectorAll('.particle-btn');
        particleButtons.forEach(button => {
            if (button.dataset.particlesBound === 'true') return;
            button.dataset.particlesBound = 'true';
            button.addEventListener('click', function() {
                const setting = this.dataset.particles === 'on';
                applyParticleState(setting);
            });
        });
        applyParticleState(particlesOn);
    }

    bindParticleButtons();
    document.addEventListener('componentsLoaded', bindParticleButtons);
    
    // Sound Toggle Controls
    const soundButtons = document.querySelectorAll('.sound-btn');
    
    // Set initial state
    soundButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.sound === 'on' && soundsOn) {
            btn.classList.add('active');
        } else if (btn.dataset.sound === 'off' && !soundsOn) {
            btn.classList.add('active');
        }
    });
    
    // Add click handlers to sound buttons
    soundButtons.forEach(button => {
        button.addEventListener('click', function() {
            const setting = this.dataset.sound;
            soundsOn = setting === 'on';
            
            // Play enable/disable sound
            if (soundsOn) {
                sounds.enable.currentTime = 0;
                sounds.enable.play().catch(e => console.log('Sound play failed:', e));
            } else {
                sounds.disable.currentTime = 0;
                sounds.disable.play().catch(e => console.log('Sound play failed:', e));
            }
            
            // Update active button state
            soundButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Save preference to localStorage
            localStorage.setItem('portfolioSoundsEnabled', soundsOn);
        });
    });
    
    // Add sound effects to all interactive elements
    function addSoundEffects() {
        // Add click sound to all buttons
        const buttons = document.querySelectorAll('button, .btn, .size-btn, .sound-btn');
        buttons.forEach(btn => {
            if (!btn.dataset.soundsAdded) {
                btn.addEventListener('click', () => playSound('click'));
                btn.dataset.soundsAdded = 'true';
            }
        });
        
        // Add hover sounds to all links and cards
        const interactiveElements = document.querySelectorAll('a, .project-card, .timeline-item, .award-card, .volunteer-item, .social-link');
        interactiveElements.forEach(el => {
            if (!el.dataset.soundsAdded) {
                el.addEventListener('mouseenter', () => playSound('hover'));
                el.addEventListener('mouseleave', () => playSound('leave'));
                el.dataset.soundsAdded = 'true';
            }
        });
    }
    
    // Expose functions globally for dynamic content
    window.playSound = playSound;
    window.addSoundEffects = addSoundEffects;
    
    // Apply sound effects after a short delay to ensure DOM is ready
    setTimeout(addSoundEffects, 500);

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

    // Parallax effect with scroll throttling
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        let ticking = false;
        let scrolled = 0;
        
        window.addEventListener('scroll', () => {
            scrolled = window.scrollY;
            if (!ticking) {
                requestAnimationFrame(() => {
                    heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu) {
            navMenu.classList.remove('active');
        }
    });
}

// Theme Switcher
const THEME_MAP = {
    aero: { className: 'theme-aero', label: 'Frutiger Aero', meta: '#3fa9f5' },
    eco: { className: 'theme-eco', label: 'Eco', meta: '#52b788' },
    metro: { className: 'theme-metro', label: 'Metro', meta: '#ff1843' },
    red: { className: 'theme-red', label: 'Metro Red', meta: '#e53946' }
};

function initThemeSwitcher() {
    const savedTheme = localStorage.getItem('portfolioTheme') || 'red';
    applyTheme(savedTheme, false);

    if (window.__themeSwitcherInitialized) return;
    window.__themeSwitcherInitialized = true;

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.theme;
            applyTheme(key);
        });
    });
}

function applyTheme(themeKey, persist = true) {
    const theme = THEME_MAP[themeKey] || THEME_MAP.red;
    const body = document.body;

    Object.values(THEME_MAP).forEach(entry => body.classList.remove(entry.className));
    body.classList.add(theme.className);
    body.dataset.theme = themeKey;

    if (persist) {
        localStorage.setItem('portfolioTheme', themeKey);
    }

    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === themeKey);
    });

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
        metaTheme.setAttribute('content', theme.meta);
    }

    const devTheme = document.getElementById('dev-theme');
    if (devTheme) {
        devTheme.textContent = theme.label;
    }

    window.currentTheme = themeKey;
}

// Ambient gradient overlay + particles shell
function injectAmbientLayers() {
    if (!document.querySelector('.ambient-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'ambient-overlay';
        document.body.appendChild(overlay);
    }
    if (!document.querySelector('.ui-particles')) {
        const particles = document.createElement('div');
        particles.className = 'ui-particles';
        document.body.appendChild(particles);
    }
}

// Floating particles
function initParticles(count = 12) {
    const container = document.querySelector('.ui-particles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        const size = Math.random() * 6 + 4;
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.animationDuration = `${12 + Math.random() * 10}s`;
        p.style.animationDelay = `${Math.random() * 8}s`;
        container.appendChild(p);
    }
}

const TOAST_MESSAGES = [
    '💾 Skills cache refreshed',
    '🌐 Network stable',
    '🧠 Learning module loaded',
    '🎛️ UI services restarted',
    '🔔 Notifications routed'
];

// Toast notifications
function initToasts() {
    if (document.querySelector('.toast-container')) return;
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    const msg = TOAST_MESSAGES[Math.floor(Math.random() * TOAST_MESSAGES.length)];
    showToast(msg, 3200);
}

function showToast(message, timeout = 3000) {
    const container = document.querySelector('.toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    container.appendChild(el);
    setTimeout(() => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        setTimeout(() => el.remove(), 400);
    }, timeout);
}

// Dev overlay (Ctrl+Shift+F)
function initDevOverlay() {
    if (window.__devOverlayInitialized) return;
    window.__devOverlayInitialized = true;
    let overlay = document.getElementById('devOverlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'devOverlay';
        overlay.className = 'dev-overlay';
        overlay.innerHTML = `
            <h4>Developer Mode</h4>
            <div class="dev-row"><span>Status</span><span id="dev-status">Idle</span></div>
            <div class="dev-row"><span>Theme</span><span id="dev-theme">Metro Red</span></div>
            <div class="dev-row"><span>Build</span><span>Aero v2.3.1</span></div>
            <div class="dev-row"><span>RAM</span><span id="dev-ram">2.4 GB</span></div>
            <div class="dev-row"><span>FPS</span><span id="dev-fps">60</span></div>
        `;
        document.body.appendChild(overlay);
    }

    // Sync dev overlay with current theme selection
    const activeTheme = document.body.dataset.theme || localStorage.getItem('portfolioTheme') || 'red';
    applyTheme(activeTheme, false);

    let fpsLast = performance.now();
    let frameCount = 0;
    let fpsValue = 60;

    function trackFPS(now) {
        frameCount++;
        if (now - fpsLast >= 1000) {
            fpsValue = frameCount;
            frameCount = 0;
            fpsLast = now;
            const fpsEl = document.getElementById('dev-fps');
            if (fpsEl) fpsEl.textContent = fpsValue;
        }
        requestAnimationFrame(trackFPS);
    }
    requestAnimationFrame(trackFPS);

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
            overlay.classList.toggle('active');
            const status = overlay.classList.contains('active') ? 'Online' : 'Hidden';
            const statusEl = document.getElementById('dev-status');
            if (statusEl) statusEl.textContent = status;
            const ramEl = document.getElementById('dev-ram');
            if (ramEl) ramEl.textContent = `${(2 + Math.random() * 6).toFixed(1)} GB`;
        }
    });
}

// System Status widget
function initSystemStatus() {
    const main = document.querySelector('.main-content');
    if (!main || document.querySelector('.system-status')) return;
    const creativity = Math.floor(70 + Math.random() * 25);
    const coffee = ['Low ☕', 'Steady ☕', 'Critical ☕', 'Refill 🚨'][Math.floor(Math.random() * 4)];
    const latency = Math.floor(15 + Math.random() * 30);
    const html = `
      <section class="system-status content-section">
        <div class="status-card">
          <h3>System Status</h3>
          <div class="status-item"><span>Portfolio</span><span>Online</span></div>
          <div class="status-item"><span>Latency</span><span>${latency} ms</span></div>
          <div class="status-item"><span>Network</span><span>Stable</span></div>
        </div>
        <div class="status-card">
          <h3>Creativity Level</h3>
          <div class="status-item"><span>Meter</span><span>${creativity}%</span></div>
          <div class="status-bar"><div class="status-bar-fill" style="width:${creativity}%;"></div></div>
          <div class="status-item" style="margin-top: var(--spacing-sm);"><span>Coffee Intake</span><span>${coffee}</span></div>
        </div>
      </section>`;
    main.insertAdjacentHTML('afterbegin', html);
}

// Logo easter egg: 5 clicks -> toast
function initLogoEasterEgg() {
    const logo = document.querySelector('[data-nav-icon]');
    if (!logo || logo.dataset.easterEggBound) return;
    logo.dataset.easterEggBound = 'true';
    let clicks = 0;
    logo.addEventListener('click', () => {
        clicks += 1;
        if (clicks === 5) {
            showToast('🔊 Retro sound pack armed');
            clicks = 0;
        }
    });
}

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
        
        // Reapply sound effects to dynamically created elements
        if (window.addSoundEffects) {
            window.addSoundEffects();
        }
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

// Initialize on components loaded
document.addEventListener('componentsLoaded', function() {
    console.log('Components loaded, initializing app...');
    initializeApp();
});

// Fallback if components don't load
document.addEventListener('DOMContentLoaded', function() {
    // If components haven't loaded after 500ms, initialize anyway
    setTimeout(() => {
        const navbar = document.querySelector('#navbarPlaceholder nav');
        if (!navbar) {
            console.log('Components not loaded, initializing without components...');
            initializeApp();
        }
    }, 500);
    
    // Auto-hide empty sections
    setTimeout(() => {
        const sections = ['projects', 'work', 'education', 'awards', 'volunteer', 'social'];
        
        sections.forEach(section => {
            const container = document.getElementById(`${section}-container`);
            const sectionElement = document.querySelector(`#${section}`);
            
            if (container && sectionElement && container.children.length === 0) {
                sectionElement.style.display = 'none';
            }
        });
    }, 1000);
});
