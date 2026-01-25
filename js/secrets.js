/**
 * Secrets System
 * Hidden easter eggs and developer features
 * Easy to extend with new secrets
 */

class SecretsManager {
    constructor() {
        this.secrets = {};
        this.registerSecret('devOverlay', this.createDevOverlay);
        this.registerSecret('konamiCode', this.createKonamiCode);
        this.registerSecret('matrixRain', this.createMatrixRain);
        this.registerSecret('discoMode', this.createDiscoMode);
        this.registerSecret('portfolioStats', this.createPortfolioStats);
        this.registerSecret('terminalEmulator', this.createTerminalEmulator);
        this.registerSecret('memoryGame', this.createMemoryGame);
        this.registerSecret('creditsRoll', this.createCreditsRoll);
        this.registerSecret('logoClick', this.createLogoClick);
        this.registerSecret('secretChat', this.createSecretChat);
        this.registerSecret('musicVisualizer', this.createMusicVisualizer);
    }

    registerSecret(name, initFunction) {
        this.secrets[name] = initFunction.bind(this);
        if (window.Logger) window.Logger.info(`Secret registered: ${name}`);
    }

    initializeAll() {
        console.log('🔐 Initializing all secrets...');
        if (window.Logger) window.Logger.group('Secrets');
        Object.entries(this.secrets).forEach(([name, init]) => {
            try {
                console.log('Initializing secret:', name);
                init();
            } catch (err) {
                console.error('Secret init failed:', name, err);
                if (window.Logger) window.Logger.error(`Secret init failed: ${name}`, err);
            }
        });
        if (window.Logger) window.Logger.groupEnd();
        console.log('✅ All secrets initialized');
    }

    // ========== DEV OVERLAY SECRET ==========
    createDevOverlay() {
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
                <div class="dev-row"><span>Theme</span><span id="dev-theme">Aero</span></div>
                <div class="dev-row"><span>Build</span><span>Aero v2.3.1</span></div>
                <div class="dev-row"><span>Page</span><span id="dev-page">Home</span></div>
                <div class="dev-row"><span>Browser</span><span id="dev-browser">Chrome</span></div>
                <div class="dev-row"><span>OS</span><span id="dev-os">--</span></div>
                <div class="dev-row"><span>Platform</span><span id="dev-platform">--</span></div>
                <div class="dev-row"><span>Language</span><span id="dev-language">--</span></div>
                <div class="dev-row"><span>Timezone</span><span id="dev-timezone">--</span></div>
                <div class="dev-row"><span>Local Time</span><span id="dev-time">--</span></div>
                <div class="dev-row"><span>Online</span><span id="dev-online">--</span></div>
                <div class="dev-row"><span>Visibility</span><span id="dev-visibility">--</span></div>
                <div class="dev-row"><span>Color Scheme</span><span id="dev-color">--</span></div>
                <div class="dev-row"><span>Motion</span><span id="dev-motion">--</span></div>
                <div class="dev-row"><span>Touch</span><span id="dev-touch">--</span></div>
                <div class="dev-row"><span>Cookies</span><span id="dev-cookies">--</span></div>
                <div class="dev-row"><span>Memory</span><span id="dev-memory">--</span></div>
                <div class="dev-row"><span>Latency</span><span id="dev-latency">--</span></div>
                <div class="dev-row"><span>Music</span><span id="dev-music">--</span></div>
                <div class="dev-row"><span>FPS</span><span id="dev-fps">60</span></div>
                <div class="dev-row"><span>Viewport</span><span id="dev-viewport">--</span></div>
                <div class="dev-row"><span>DPR</span><span id="dev-dpr">--</span></div>
                <div class="dev-row"><span>Connection</span><span id="dev-connection">--</span></div>
                <div class="dev-row"><span>RTT</span><span id="dev-rtt">--</span></div>
                <div class="dev-row"><span>Cores</span><span id="dev-cores">--</span></div>
                <div class="dev-row"><span>Scroll</span><span id="dev-scroll">0%</span></div>
                <div class="dev-row"><span>Pointer</span><span id="dev-pointer">--</span></div>
                <div class="dev-row"><span>Battery</span><span id="dev-battery">--</span></div>
                <div class="dev-row"><span>Storage</span><span id="dev-storage">--</span></div>
                <div class="dev-row"><span>Referrer</span><span id="dev-referrer">--</span></div>
                <div class="dev-row"><span>Agent</span><span id="dev-agent">--</span></div>
                <div class="dev-row"><span>Uptime</span><span id="dev-uptime">00:00</span></div>
            `;
            document.body.appendChild(overlay);
        }

        // Get page name
        const pageName = this.getPageName();
        const pageEl = document.getElementById('dev-page');
        if (pageEl) pageEl.textContent = pageName;

        // Get browser
        const browserEl = document.getElementById('dev-browser');
        if (browserEl) browserEl.textContent = this.detectBrowser();

        const osEl = document.getElementById('dev-os');
        if (osEl) osEl.textContent = this.detectOS();

        const platformEl = document.getElementById('dev-platform');
        if (platformEl) platformEl.textContent = navigator.platform || 'n/a';

        const languageEl = document.getElementById('dev-language');
        if (languageEl) languageEl.textContent = navigator.language || 'n/a';

        const timezoneEl = document.getElementById('dev-timezone');
        if (timezoneEl && Intl && Intl.DateTimeFormat) {
            timezoneEl.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'n/a';
        }

        const coresEl = document.getElementById('dev-cores');
        if (coresEl) coresEl.textContent = navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency}x` : 'n/a';

        const referrerEl = document.getElementById('dev-referrer');
        if (referrerEl) referrerEl.textContent = document.referrer || 'Direct';

        const agentEl = document.getElementById('dev-agent');
        if (agentEl) {
            const ua = navigator.userAgent || 'n/a';
            agentEl.textContent = ua.length > 70 ? `${ua.slice(0, 70)}…` : ua;
        }

        const pointerEl = document.getElementById('dev-pointer');
        const pointerQuery = window.matchMedia('(pointer: fine)');
        const setPointer = () => {
            if (pointerEl) pointerEl.textContent = pointerQuery.matches ? 'Fine' : 'Coarse';
        };
        setPointer();
        if (pointerQuery.addEventListener) pointerQuery.addEventListener('change', setPointer);

        const timeEl = document.getElementById('dev-time');
        const setTime = () => {
            if (timeEl) timeEl.textContent = new Date().toLocaleTimeString();
        };
        setTime();

        const colorEl = document.getElementById('dev-color');
        const colorQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const setColor = () => {
            if (!colorEl) return;
            colorEl.textContent = colorQuery.matches ? 'Dark' : 'Light';
        };
        setColor();
        if (colorQuery.addEventListener) colorQuery.addEventListener('change', setColor);

        const motionEl = document.getElementById('dev-motion');
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        const setMotion = () => {
            if (!motionEl) return;
            motionEl.textContent = motionQuery.matches ? 'Reduced' : 'Full';
        };
        setMotion();
        if (motionQuery.addEventListener) motionQuery.addEventListener('change', setMotion);

        const touchEl = document.getElementById('dev-touch');
        const setTouch = () => {
            if (touchEl) touchEl.textContent = (navigator.maxTouchPoints || ('ontouchstart' in window)) ? 'Yes' : 'No';
        };
        setTouch();

        const cookiesEl = document.getElementById('dev-cookies');
        if (cookiesEl) cookiesEl.textContent = navigator.cookieEnabled ? 'Enabled' : 'Blocked';

        const onlineEl = document.getElementById('dev-online');
        const setOnline = () => {
            if (!onlineEl) return;
            const online = navigator.onLine;
            onlineEl.textContent = online ? 'Online' : 'Offline';
            onlineEl.style.color = online ? '#2ecc71' : '#e74c3c';
        };
        setOnline();
        window.addEventListener('online', setOnline);
        window.addEventListener('offline', setOnline);

        const visibilityEl = document.getElementById('dev-visibility');
        const setVisibility = () => {
            if (visibilityEl) visibilityEl.textContent = document.visibilityState;
        };
        setVisibility();
        document.addEventListener('visibilitychange', setVisibility);

        const scrollEl = document.getElementById('dev-scroll');
        const setScroll = () => {
            if (!scrollEl) return;
            const doc = document.documentElement;
            const maxScroll = doc.scrollHeight - window.innerHeight;
            const percent = maxScroll > 0 ? Math.min(100, Math.round((window.scrollY / maxScroll) * 100)) : 0;
            scrollEl.textContent = `${percent}%`;
        };
        setScroll();
        window.addEventListener('scroll', setScroll, { passive: true });

        // Viewport + DPR
        const viewportEl = document.getElementById('dev-viewport');
        const dprEl = document.getElementById('dev-dpr');
        const setViewport = () => {
            if (viewportEl) viewportEl.textContent = `${window.innerWidth}x${window.innerHeight}`;
            if (dprEl) dprEl.textContent = window.devicePixelRatio ? window.devicePixelRatio.toFixed(2) : '1.00';
        };
        setViewport();
        window.addEventListener('resize', setViewport);

        // Connection info
        const connectionEl = document.getElementById('dev-connection');
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        const setConnection = () => {
            if (!connectionEl) return;
            if (connection) {
                const { effectiveType, downlink } = connection;
                connectionEl.textContent = `${effectiveType || 'n/a'} · ${downlink ? downlink.toFixed(1) + ' Mbps' : 'n/a'}`;
            } else {
                connectionEl.textContent = 'n/a';
            }
        };
        setConnection();
        if (connection && connection.addEventListener) {
            connection.addEventListener('change', setConnection);
        }

        const rttEl = document.getElementById('dev-rtt');
        const setRtt = () => {
            if (!rttEl) return;
            if (connection && typeof connection.rtt === 'number') {
                rttEl.textContent = `${connection.rtt} ms`;
            } else {
                rttEl.textContent = 'n/a';
            }
        };
        setRtt();
        if (connection && connection.addEventListener) {
            connection.addEventListener('change', setRtt);
        }

        const batteryEl = document.getElementById('dev-battery');
        if (navigator.getBattery && batteryEl) {
            navigator.getBattery().then((battery) => {
                const setBattery = () => {
                    const level = Math.round((battery.level || 0) * 100);
                    const charging = battery.charging ? '⚡' : '';
                    batteryEl.textContent = `${level}% ${charging}`.trim();
                };
                setBattery();
                battery.addEventListener('levelchange', setBattery);
                battery.addEventListener('chargingchange', setBattery);
            }).catch(() => {
                batteryEl.textContent = 'n/a';
            });
        }

        const storageEl = document.getElementById('dev-storage');
        if (navigator.storage && navigator.storage.estimate && storageEl) {
            navigator.storage.estimate().then(({ quota, usage }) => {
                const formatMB = (val) => `${Math.round((val || 0) / (1024 * 1024))} MB`;
                storageEl.textContent = `${formatMB(usage)} / ${formatMB(quota)}`;
            }).catch(() => {
                storageEl.textContent = 'n/a';
            });
        }

        // Uptime tracker
        const uptimeStart = performance.now();
        const uptimeEl = document.getElementById('dev-uptime');
        const formatUptime = (ms) => {
            const totalSeconds = Math.floor(ms / 1000);
            const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
            const seconds = String(totalSeconds % 60).padStart(2, '0');
            return `${minutes}:${seconds}`;
        };

        // Track FPS
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

        // Update memory and latency periodically
        setInterval(() => {
            const memEl = document.getElementById('dev-memory');
            if (memEl) memEl.textContent = `${(2 + Math.random() * 6).toFixed(1)} MB`;
            
            const latEl = document.getElementById('dev-latency');
            if (latEl) latEl.textContent = `${Math.floor(15 + Math.random() * 30)} ms`;

            const musicEl = document.getElementById('dev-music');
            if (musicEl) {
                const musicOn = localStorage.getItem('portfolioMusicEnabled') !== 'false';
                musicEl.textContent = musicOn ? 'Playing' : 'Off';
                musicEl.style.color = musicOn ? '#2ecc71' : 'inherit';
            }

            if (uptimeEl) uptimeEl.textContent = formatUptime(performance.now() - uptimeStart);
            setTime();
            setViewport();
            setConnection();
            setRtt();
            setOnline();
            setVisibility();
            setScroll();
            setColor();
            setMotion();
            setTouch();
        }, 1000);

        window.addEventListener('resize', () => this.updateOverlayStack());

        // Toggle on Ctrl+Shift+F
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'f') {
                e.preventDefault();
                overlay.classList.toggle('active');
                const status = overlay.classList.contains('active') ? 'Online' : 'Idle';
                const statusEl = document.getElementById('dev-status');
                if (statusEl) statusEl.textContent = status;
                this.updateOverlayStack();

                if (window.Logger) {
                    const isActive = overlay.classList.contains('active');
                    window.Logger.event('devOverlay', { status: isActive ? 'opened' : 'closed' });
                }
            }
        });

        if (window.Logger) window.Logger.success('Dev Overlay secret activated');
    }

    // Helper: Get current page name
    getPageName() {
        const path = window.location.pathname;
        if (path.includes('/pages/about')) return 'About';
        if (path.includes('/pages/work')) return 'Work';
        if (path.includes('/pages/blog')) return 'Blog';
        if (path.includes('/pages/connect')) return 'Connect';
        if (path.includes('/pages/contact')) return 'Contact';
        if (path.includes('/pages/gallery')) return 'Gallery';
        if (path.includes('/pages/sitemap')) return 'Sitemap';
        if (path.includes('/pages/privacy')) return 'Privacy';
        if (path.includes('/pages/terms')) return 'Terms';
        if (path.includes('index') || path === '/') return 'Home';
        return 'Unknown';
    }

    // Helper: Detect browser
    detectBrowser() {
        const ua = navigator.userAgent;
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edge')) return 'Edge';
        return 'Unknown';
    }

    // Helper: Detect OS
    detectOS() {
        const ua = navigator.userAgent;
        if (/Windows/i.test(ua)) return 'Windows';
        if (/Mac/i.test(ua)) return 'macOS';
        if (/Linux/i.test(ua)) return 'Linux';
        if (/Android/i.test(ua)) return 'Android';
        if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
        return 'Unknown';
    }

    // ========== KONAMI CODE SECRET ==========
    createKonamiCode() {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        document.addEventListener('keydown', (e) => {
            const key = e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' 
                ? e.key 
                : e.key.toLowerCase();
            
            if (key === konamiCode[konamiIndex]) {
                konamiIndex++;
                if (konamiIndex === konamiCode.length) {
                    konamiIndex = 0;
                    this.triggerKonamiCode();
                }
            } else {
                konamiIndex = 0;
            }
        });

        if (window.Logger) window.Logger.success('Konami Code secret activated');
    }

    triggerKonamiCode() {
        const confetti = document.createElement('div');
        confetti.id = 'konami-confetti';
        confetti.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
        document.body.appendChild(confetti);

        if (window.Logger) window.Logger.event('🎉 KONAMI CODE ACTIVATED! 🎉');

        for (let i = 0; i < 50; i++) {
            const piece = document.createElement('div');
            piece.innerHTML = '🎮';
            piece.style.cssText = `position:absolute;left:${Math.random() * 100}%;top:-10px;font-size:${20 + Math.random() * 20}px;animation:fall ${2 + Math.random() * 2}s linear forwards;`;
            confetti.appendChild(piece);
        }

        setTimeout(() => confetti.remove(), 5000);
    }

    // ========== MATRIX RAIN SECRET ==========
    createMatrixRain() {
        console.log('📺 createMatrixRain called, bound?', this._matrixRainBound);
        if (this._matrixRainBound) return;
        this._matrixRainBound = true;

        console.log('📺 Registering Matrix Rain keyboard listener');
        document.addEventListener('keydown', (e) => {
            const modKey = e.metaKey || e.ctrlKey;
            const keyLower = (e.key || '').toLowerCase();
            const isM = keyLower === 'm' || e.code === 'KeyM';
            if (window.Logger) window.Logger.info('matrixListener', { key: e.key, code: e.code, modKey, shift: e.shiftKey });
            if (modKey && e.shiftKey && isM) {
                if (window.Logger) window.Logger.info('matrixListener', 'toggling matrix');
                const canvas = document.getElementById('matrix-canvas');
                if (canvas) {
                    this.stopMatrixRain();
                } else {
                    this.startMatrixRain();
                }
            }
        }, { capture: true });

        if (window.Logger) window.Logger.success('Matrix Rain secret activated');
        console.log('✅ Matrix Rain secret registered');
    }

    startMatrixRain() {
        if (document.getElementById('matrix-canvas')) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'matrix-canvas';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:999999;pointer-events:none;background:rgba(0,0,0,0.8);';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        
        if (window.Logger) window.Logger.event(`Matrix canvas created: ${canvas.width}x${canvas.height}`);

        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const drops = Array(Math.floor(columns)).fill(0);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#0f0';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            if (document.getElementById('matrix-canvas')) {
                requestAnimationFrame(draw);
            }
        };

        draw();
        if (window.Logger) window.Logger.event('Matrix Rain started (Cmd/Ctrl+Shift+M to toggle)');
    }

    stopMatrixRain() {
        const canvas = document.getElementById('matrix-canvas');
        if (canvas) canvas.remove();
        if (window.Logger) window.Logger.event('Matrix Rain stopped');
    }

    // ========== DISCO MODE SECRET ==========
    createDiscoMode() {
        if (this._discoModeBound) return;
        this._discoModeBound = true;

        document.addEventListener('keydown', (e) => {
            const modKey = e.metaKey || e.ctrlKey;
            if (modKey && e.shiftKey && e.key.toLowerCase() === 'd') {
                e.preventDefault();
                this.toggleDiscoMode();
            }
        });

        if (window.Logger) window.Logger.success('Disco Mode secret activated');
    }

    toggleDiscoMode() {
        const disco = document.getElementById('disco-mode');
        if (disco) {
            disco.remove();
            if (window.Logger) window.Logger.event('Disco Mode disabled');
            return;
        }

        const style = document.createElement('style');
        style.id = 'disco-mode';
        style.innerHTML = `
            @keyframes disco-bg { 0% { background: #ff0080; } 25% { background: #00ff00; } 50% { background: #0080ff; } 75% { background: #ffff00; } 100% { background: #ff0080; } }
            @keyframes disco-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            body { animation: disco-bg 0.5s infinite !important; }
            * { filter: hue-rotate(${Math.random() * 360}deg) !important; }
        `;
        document.head.appendChild(style);
        if (window.Logger) window.Logger.event('✨ DISCO MODE ENABLED ✨');
    }

    // ========== PORTFOLIO STATS SECRET ==========
    createPortfolioStats() {
        if (this._portfolioStatsBound) return;
        this._portfolioStatsBound = true;

        document.addEventListener('keydown', (e) => {
            const modKey = e.metaKey || e.ctrlKey;
            if (modKey && e.shiftKey && e.key.toLowerCase() === 's') {
                e.preventDefault();
                const existing = document.getElementById('portfolio-stats-popup');
                if (existing) {
                    existing.remove();
                    if (window.Logger) window.Logger.event('Portfolio Stats closed');
                    this.updateOverlayStack();
                } else {
                    this.showPortfolioStats();
                }
            }
        });

        if (window.Logger) window.Logger.success('Portfolio Stats secret activated');
    }

    showPortfolioStats() {
        const stats = {
            projects: 12,
            skills: 25,
            yearsExperience: 5,
            linesOfCode: '50k+',
            contributionsOSS: '50+',
            articlesWritten: 15,
            certificationsEarned: 8,
            visitorsThisMonth: Math.floor(Math.random() * 5000) + 1000
        };

        const popup = document.createElement('div');
        popup.id = 'portfolio-stats-popup';
        popup.style.cssText = `
            position: fixed; bottom: 20px; right: 20px;
            background: rgba(20, 28, 40, 0.95); border: 2px solid #3fa9f5;
            border-radius: 12px; padding: 24px; z-index: 99999;
            backdrop-filter: blur(10px); width: 340px; font-family: monospace;
            box-shadow: 0 8px 32px rgba(63, 169, 245, 0.3);
        `;
        popup.innerHTML = `
            <h3 style="color: #3fa9f5; margin: 0 0 16px 0; text-align: center;">📊 Portfolio Stats</h3>
            <div style="color: #eaeef5; line-height: 1.8;">
                <div>Projects: <span style="color: #2ecc71;">${stats.projects}</span></div>
                <div>Skills: <span style="color: #2ecc71;">${stats.skills}</span></div>
                <div>Experience: <span style="color: #2ecc71;">${stats.yearsExperience}+ years</span></div>
                <div>Code Written: <span style="color: #2ecc71;">${stats.linesOfCode}</span></div>
                <div>OSS Contributions: <span style="color: #2ecc71;">${stats.contributionsOSS}</span></div>
                <div>Articles: <span style="color: #2ecc71;">${stats.articlesWritten}</span></div>
                <div>Certifications: <span style="color: #2ecc71;">${stats.certificationsEarned}</span></div>
                <div>Visitors (This Month): <span style="color: #2ecc71;">${stats.visitorsThisMonth}</span></div>
            </div>
            <button onclick="this.parentElement.remove()" style="
                margin-top: 16px; width: 100%; padding: 8px; background: #3fa9f5;
                color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;
            ">Close</button>
        `;
        document.body.appendChild(popup);

        const closeBtn = popup.querySelector('button');
        if (closeBtn) closeBtn.addEventListener('click', () => this.updateOverlayStack());

        this.updateOverlayStack();
        setTimeout(() => this.updateOverlayStack(), 50);

        if (window.Logger) window.Logger.event('Portfolio Stats displayed (Ctrl+Shift+S)', stats);
    }

    updateOverlayStack() {
        const overlay = document.getElementById('devOverlay');
        const stats = document.getElementById('portfolio-stats-popup');
        if (overlay) overlay.style.bottom = '20px';
        if (!overlay || !stats) return;

        const isOverlayActive = overlay.classList.contains('active');
        if (!isOverlayActive) {
            stats.style.bottom = '20px';
            return;
        }

        const gap = 12;
        const overlayRect = overlay.getBoundingClientRect();
        const statsRect = stats.getBoundingClientRect();
        const desiredBottom = overlayRect.height + 20 + gap;
        const maxBottom = Math.max(20, window.innerHeight - statsRect.height - 20);
        stats.style.bottom = `${Math.min(desiredBottom, maxBottom)}px`;
        stats.style.right = '20px';
    }

    // ========== TERMINAL EMULATOR SECRET ==========
    createTerminalEmulator() {
        if (this._terminalBound) return;
        this._terminalBound = true;

        document.addEventListener('keydown', (e) => {
            const modKey = e.metaKey || e.ctrlKey;
            if (modKey && e.shiftKey && e.key.toLowerCase() === 't') {
                e.preventDefault();
                this.toggleTerminal();
            }
        });

        if (window.Logger) window.Logger.success('Terminal Emulator secret activated');
    }

    toggleTerminal() {
        let terminal = document.getElementById('secret-terminal');
        if (terminal) {
            terminal.remove();
            if (window.Logger) window.Logger.event('Terminal closed');
            return;
        }

        terminal = document.createElement('div');
        terminal.id = 'secret-terminal';
        terminal.style.cssText = `
            position: fixed; bottom: 20px; left: 20px; width: 500px; height: 300px;
            background: rgba(0, 0, 0, 0.95); border: 2px solid #0f0; border-radius: 4px;
            z-index: 99999; font-family: monospace; color: #0f0; overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.3); padding: 12px;
        `;

        const output = document.createElement('div');
        output.style.cssText = 'height: 260px; overflow-y: auto; font-size: 12px; line-height: 1.4;';
        output.innerHTML = `
            <div>portfolio-ai@localhost:~$ whoami</div>
            <div>Full Stack Developer & Designer</div>
            <div><br></div>
            <div>portfolio-ai@localhost:~$ cat bio.txt</div>
            <div>Building beautiful web experiences with Frutiger Aero vibes 🎨</div>
            <div><br></div>
            <div>portfolio-ai@localhost:~$ echo "You found the terminal!"</div>
            <div>You found the terminal!</div>
            <div><br></div>
            <div><span style="animation: blink 1s infinite;">_</span></div>
        `;

        const style = document.createElement('style');
        style.innerHTML = '@keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }';
        document.head.appendChild(style);

        terminal.appendChild(output);
        document.body.appendChild(terminal);
        if (window.Logger) window.Logger.event('Terminal opened (Cmd/Ctrl+Shift+T to toggle)');
    }

    // ========== MEMORY GAME SECRET ==========
    createMemoryGame() {
        if (this._memoryGameBound) return;
        this._memoryGameBound = true;

        document.addEventListener('keydown', (e) => {
            const modKey = e.metaKey || e.ctrlKey;
            if (modKey && e.shiftKey && e.key.toLowerCase() === 'g') {
                e.preventDefault();
                const existing = document.getElementById('memory-game');
                if (existing) {
                    existing.remove();
                    if (window.Logger) window.Logger.event('Memory Game closed');
                } else {
                    this.startMemoryGame();
                }
            }
        });

        if (window.Logger) window.Logger.success('Memory Game secret activated');
    }

    startMemoryGame() {
        if (document.getElementById('memory-game')) return;
        const gameBoard = document.createElement('div');
        gameBoard.id = 'memory-game';
        gameBoard.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: rgba(20, 28, 40, 0.95); border: 3px solid #3fa9f5;
            border-radius: 12px; padding: 24px; z-index: 99999;
            backdrop-filter: blur(10px); text-align: center;
            box-shadow: 0 8px 32px rgba(63, 169, 245, 0.3);
        `;

        const emojis = ['🎮', '🎨', '🎭', '🎪', '🎯', '🎲'];
        const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

        gameBoard.innerHTML = `
            <h3 style="color: #3fa9f5; margin: 0 0 16px 0;">Memory Match Game</h3>
            <div id="game-grid" style="
                display: grid; grid-template-columns: repeat(4, 60px); gap: 8px;
                margin-bottom: 16px; justify-content: center;
            "></div>
            <button onclick="document.getElementById('memory-game').remove()" style="
                padding: 8px 16px; background: #3fa9f5; color: white;
                border: none; border-radius: 6px; cursor: pointer; font-weight: bold;
            ">Close Game</button>
        `;

        document.body.appendChild(gameBoard);

        const grid = document.getElementById('game-grid');
        cards.forEach((emoji, idx) => {
            const card = document.createElement('div');
            card.style.cssText = `
                width: 60px; height: 60px; background: #3fa9f5; border-radius: 6px;
                display: flex; align-items: center; justify-content: center;
                font-size: 24px; cursor: pointer; transition: all 0.3s;
                border: 2px solid rgba(255, 255, 255, 0.3);
            `;
            card.textContent = '?';
            card.onclick = () => {
                card.textContent = emoji;
                card.style.background = 'rgba(63, 169, 245, 0.3)';
            };
            grid.appendChild(card);
        });

        if (window.Logger) window.Logger.event('Memory Game started (Cmd/Ctrl+Shift+G)');
    }

    // ========== CREDITS ROLL SECRET ==========
    createCreditsRoll() {
        if (this._creditsRollBound) return;
        this._creditsRollBound = true;

        document.addEventListener('keydown', (e) => {
            const modKey = e.metaKey || e.ctrlKey;
            if (modKey && e.shiftKey && e.key.toLowerCase() === 'c') {
                e.preventDefault();
                const existing = document.getElementById('credits-roll');
                if (existing) {
                    existing.remove();
                    if (window.Logger) window.Logger.event('Credits Roll closed');
                } else {
                    this.startCreditsRoll();
                }
            }
        });

        if (window.Logger) window.Logger.success('Credits Roll secret activated');
    }

    startCreditsRoll() {
        const credits = document.createElement('div');
        credits.id = 'credits-roll';
        credits.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
            z-index: 99999; overflow: hidden; display: flex; align-items: center; justify-content: center;
        `;

        const scrollText = document.createElement('div');
        scrollText.style.cssText = `
            color: #3fa9f5; font-family: monospace; text-align: center;
            font-size: 18px; line-height: 2; animation: scroll-up 8s linear forwards;
        `;
        scrollText.innerHTML = `
            <div style="margin-top: 100vh;">
                <h1 style="font-size: 32px; color: #fff; margin-bottom: 40px;">Credits</h1>
                <div>Developed with ❤️ by Kai</div>
                <div>Frutiger Aero Theme Design</div>
                <div>Retro Y2K Aesthetics</div>
                <div><br></div>
                <div>Special Thanks:</div>
                <div>You, for finding these secrets! 🎉</div>
                <div><br><br><br></div>
            </div>
        `;

        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes scroll-up {
                0% { transform: translateY(0); }
                100% { transform: translateY(-150vh); }
            }
        `;
        document.head.appendChild(style);

        credits.appendChild(scrollText);
        document.body.appendChild(credits);

        credits.onclick = () => credits.remove();
        setTimeout(() => credits.remove(), 8500);

        if (window.Logger) window.Logger.event('Credits Roll started (Ctrl+Shift+C)');
    }

    // ========== EXTENDED LOGO CLICK SECRET ==========
    createLogoClick() {
        // Delay to ensure navbar is loaded
        let attempts = 0;
        const checkForLogo = () => {
            const logo = document.querySelector('[data-nav-icon]');
            if (!logo) {
                if (attempts < 50) {
                    attempts++;
                    setTimeout(checkForLogo, 100);
                }
                return;
            }
            
            if (logo.dataset.extendedEasterEggBound) return;
            logo.dataset.extendedEasterEggBound = 'true';

            let clicks = 0;
            logo.addEventListener('click', () => {
                clicks += 1;
                if (clicks === 5) {
                    if (window.showToast) window.showToast('🔊 Retro sound pack armed');
                    if (window.Logger) window.Logger.event('Logo clicked 5 times');
                    clicks = 0;
                } else if (clicks === 10) {
                    if (window.showToast) window.showToast('🌟 ULTIMATE POWER UNLOCKED! 🌟');
                    if (window.Logger) window.Logger.event('ULTIMATE POWER UNLOCKED');
                    this.triggerKonamiCode();
                    clicks = 0;
                }
            });

            if (window.Logger) window.Logger.success('Extended Logo Click secret activated');
        };
        
        checkForLogo();
    }

    // ========== SECRET CHAT PHRASES ==========
    createSecretChat() {
        const phrases = {
            'the cake is a lie': '🍰 Portal reference detected!',
            'konami': '↑↑↓↓←→←→BA',
            'aero': '🎨 Frutiger Aero FTW!',
            'easter egg': '🥚 You found me!',
            'hello': '👋 Hi there, developer!',
            'matrix': '🟢 Follow the white rabbit',
            'disco': '✨ Let\'s get groovy!'
        };

        let currentInput = '';
        document.addEventListener('keydown', (e) => {
            // Only track printable characters (ignore modifiers, enter, etc.)
            if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
                currentInput += e.key.toLowerCase();
                if (currentInput.length > 50) currentInput = currentInput.slice(-50);

                for (const [phrase, response] of Object.entries(phrases)) {
                    if (currentInput.includes(phrase)) {
                        if (window.showToast) window.showToast(response);
                        if (window.Logger) window.Logger.event(`Secret phrase detected: "${phrase}"`);
                        currentInput = '';
                        break;
                    }
                }
            }
        });

        if (window.Logger) window.Logger.success('Secret Chat secret activated');
    }

    // ========== MUSIC VISUALIZER SECRET ==========
    createMusicVisualizer() {
        if (this._musicVisualizerBound) return;
        this._musicVisualizerBound = true;

        document.addEventListener('keydown', (e) => {
            const isMac = /Mac|iPhone|iPad|iPod/.test(navigator.platform);
            const modKey = isMac ? e.metaKey : e.ctrlKey;
            if (modKey && e.shiftKey && e.key.toLowerCase() === 'v') {
                e.preventDefault();
                this.toggleMusicVisualizer();
            }
        });

        if (window.Logger) window.Logger.success('Music Visualizer secret activated');
    }

    toggleMusicVisualizer() {
        let viz = document.getElementById('music-visualizer');
        if (viz) {
            viz.remove();
            // Remove the style tag too
            const style = document.getElementById('music-viz-style');
            if (style) style.remove();
            if (window.Logger) window.Logger.event('Music Visualizer closed');
            return;
        }

        viz = document.createElement('div');
        viz.id = 'music-visualizer';
        viz.style.cssText = `
            position: fixed; bottom: 20px; right: 20px; width: 200px; height: 100px;
            background: rgba(20, 28, 40, 0.95); border: 2px solid #3fa9f5;
            border-radius: 8px; z-index: 99999; display: flex; align-items: flex-end;
            justify-content: space-around; padding: 8px; gap: 4px;
            backdrop-filter: blur(10px);
        `;

        // Generate unique heights for each bar
        const heights = Array.from({length: 20}, () => 20 + Math.random() * 60);
        
        for (let i = 0; i < 20; i++) {
            const bar = document.createElement('div');
            bar.style.cssText = `
                width: 6px; background: linear-gradient(to top, #3fa9f5, #2ecc71);
                border-radius: 3px; animation: beat-${i} ${0.5 + Math.random() * 0.5}s ease-in-out infinite;
                animation-delay: ${i * 0.05}s;
            `;
            viz.appendChild(bar);
        }

        const style = document.createElement('style');
        style.id = 'music-viz-style';
        let keyframes = '';
        for (let i = 0; i < 20; i++) {
            keyframes += `
                @keyframes beat-${i} {
                    0%, 100% { height: 10px; }
                    50% { height: ${heights[i]}px; }
                }
            `;
        }
        style.innerHTML = keyframes;
        document.head.appendChild(style);

        document.body.appendChild(viz);
        if (window.Logger) window.Logger.event('Music Visualizer opened (Cmd/Ctrl+Shift+V to toggle)');
    }

    // ========== LOGO EASTER EGG (already exists in frutiger-main) ==========
    // Can be extended with new secrets following this pattern

}

// Initialize on DOM ready
let secretsManager;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        secretsManager = new SecretsManager();
        window.secretsManager = secretsManager; // Expose globally
    });
} else {
    secretsManager = new SecretsManager();
    window.secretsManager = secretsManager; // Expose globally
}

// Initialize secrets after components load and theme is set
document.addEventListener('componentsLoaded', () => {
    if (secretsManager) {
        secretsManager.initializeAll();
    }
    
    // Test global keyboard listener
    console.log('🎹 Adding test keyboard listener...');
    document.addEventListener('keydown', (e) => {
        console.log('🎹 GLOBAL KEY:', e.key, 'ctrl:', e.ctrlKey, 'meta:', e.metaKey, 'shift:', e.shiftKey);
    });
});

// Expose for manual triggering if needed
window.SecretsManager = SecretsManager;
