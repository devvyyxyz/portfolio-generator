/**
 * Utility Functions
 * Helper functions for common operations
 */

/**
 * Replace all occurrences of a string
 * @param {string} str - Original string
 * @param {string} find - String to find
 * @param {string} replace - Replacement string
 * @returns {string} Modified string
 */
function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
}

/**
 * Replace template variables in HTML templates
 * @param {string} template - Template string
 * @param {object} data - Object with key-value pairs to replace
 * @returns {string} Processed HTML
 */
function processTemplate(template, data) {
    let result = template;
    for (const [key, value] of Object.entries(data)) {
        const placeholder = `%${key}%`;
        result = replaceAll(result, placeholder, value || '');
    }
    return result;
}

/**
 * Safe check for undefined/null/empty values
 * @param {any} value - Value to check
 * @param {string} type - Type of check ('any', 'empty', 'falsy')
 * @returns {boolean}
 */
function hasValue(value, type = 'any') {
    switch (type) {
        case 'empty':
            return value !== undefined && value !== null && value !== '';
        case 'falsy':
            return !!value;
        case 'array':
            return Array.isArray(value) && value.length > 0;
        default:
            return value !== undefined && value !== null;
    }
}

/**
 * Generate unique ID
 * @param {string} prefix - ID prefix
 * @returns {string} Unique ID
 */
function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Append HTML to element
 * @param {HTMLElement} element - Target element
 * @param {string} html - HTML to append
 */
function appendHTML(element, html) {
    if (element) {
        element.innerHTML += html;
    }
}

/**
 * Set element text content
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text content
 */
function setText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

/**
 * Set element HTML content
 * @param {HTMLElement} element - Target element
 * @param {string} html - HTML content
 */
function setHTML(element, html) {
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * Get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
function byId(id) {
    return document.getElementById(id);
}

/**
 * Get elements by class name
 * @param {string} className - Class name
 * @returns {HTMLCollection}
 */
function byClass(className) {
    return document.getElementsByClassName(className);
}

/**
 * Query selector
 * @param {string} selector - CSS selector
 * @returns {HTMLElement|null}
 */
function query(selector) {
    return document.querySelector(selector);
}

/**
 * Query selector all
 * @param {string} selector - CSS selector
 * @returns {NodeList}
 */
function queryAll(selector) {
    return document.querySelectorAll(selector);
}

/**
 * Add event listener
 * @param {HTMLElement} element - Target element
 * @param {string} event - Event name
 * @param {function} handler - Event handler
 */
function addEventListener(element, event, handler) {
    if (element) {
        element.addEventListener(event, handler);
    }
}

/**
 * Add class to element
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name
 */
function addClass(element, className) {
    if (element) {
        element.classList.add(className);
    }
}

/**
 * Remove class from element
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name
 */
function removeClass(element, className) {
    if (element) {
        element.classList.remove(className);
    }
}

/**
 * Toggle class on element
 * @param {HTMLElement} element - Target element
 * @param {string} className - Class name
 */
function toggleClass(element, className) {
    if (element) {
        element.classList.toggle(className);
    }
}

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function}
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {function}
 */
function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

/**
 * Log debug message
 * @param {string} message - Debug message
 * @param {any} data - Optional data
 */
function debug(message, data = null) {
    if (window.DEBUG || localStorage.getItem('DEBUG')) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
}

/**
 * Log error message
 * @param {string} message - Error message
 * @param {any} error - Optional error object
 */
function logError(message, error = null) {
    console.error(`[ERROR] ${message}`, error || '');
}

/**
 * Initialize 3D Tilt Effect
 * Applies interactive perspective transform to elements on mouse movement
 * Resets on mouse leave using CSS class
 * 
 * @param {string} selector - CSS selector for elements to apply effect
 * @param {object} options - Configuration object
 * @param {number} options.intensity - Tilt intensity (default: 10, lower = stronger)
 * @param {number} options.scale - Hover scale value (default: 1.05)
 * 
 * @example
 * // Apply to gallery items
 * initializePerspective3D('.gallery-item', { intensity: 10, scale: 1.05 });
 * 
 * // Apply to card items with custom intensity
 * initializePerspective3D('.card-item', { intensity: 15, scale: 1.03 });
 */
function initializePerspective3D(selector, options = {}) {
    const defaults = {
        intensity: 10,
        scale: 1.05
    };
    const config = { ...defaults, ...options };
    
    document.querySelectorAll(selector).forEach(item => {
        // Add base classes
        item.classList.add('perspective-3d', 'reset');
        
        // Mouse move - apply tilt
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / config.intensity;
            const rotateY = (centerX - x) / config.intensity;
            
            // Remove reset class to allow custom transform
            item.classList.remove('reset');
            
            // Apply 3D perspective transform
            item.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${config.scale}, ${config.scale}, 1)`;
        });
        
        // Mouse leave - reset to default state
        item.addEventListener('mouseleave', () => {
            item.classList.add('reset');
        });
    });
}
