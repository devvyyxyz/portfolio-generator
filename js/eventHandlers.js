/**
 * Event Handlers Module
 * Handles user interactions and events
 */

class EventHandlers {
    constructor() {
        this.visibilityHidden = this.getHiddenProperty();
        this.visibilityChange = this.getVisibilityChangeEvent();
        this.titleOnBlur = CONFIG.titleOnBlur;
        this.titleOnActive = CONFIG.titleOnActive;
    }

    /**
     * Get the visibility property name
     * @returns {string}
     */
    getHiddenProperty() {
        if (typeof document.hidden !== 'undefined') return 'hidden';
        if (typeof document.msHidden !== 'undefined') return 'msHidden';
        if (typeof document.webkitHidden !== 'undefined') return 'webkitHidden';
        return null;
    }

    /**
     * Get the visibility change event name
     * @returns {string}
     */
    getVisibilityChangeEvent() {
        if (typeof document.hidden !== 'undefined') return 'visibilitychange';
        if (typeof document.msHidden !== 'undefined') return 'msvisibilitychange';
        if (typeof document.webkitHidden !== 'undefined') return 'webkitvisibilitychange';
        return null;
    }

    /**
     * Initialize all event handlers
     */
    init() {
        this.setupVisibilityHandlers();
        this.setupProjectHandlers();
        this.setupCollapseHandlers();
        this.setupCarousel();
        debug('Event handlers initialized');
    }

    /**
     * Setup visibility change handlers (tab focus)
     */
    setupVisibilityHandlers() {
        if (this.visibilityChange && this.visibilityHidden) {
            document.addEventListener(this.visibilityChange, () => this.handleVisibilityChange());
        } else {
            // Fallback for older browsers
            window.addEventListener('blur', () => this.handleBlur());
            window.addEventListener('focus', () => this.handleFocus());
        }
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document[this.visibilityHidden]) {
            document.title = this.titleOnBlur;
        } else {
            document.title = this.titleOnActive;
        }
    }

    /**
     * Handle window blur
     */
    handleBlur() {
        document.title = this.titleOnBlur;
    }

    /**
     * Handle window focus
     */
    handleFocus() {
        document.title = this.titleOnActive;
    }

    /**
     * Setup project image and modal handlers
     */
    setupProjectHandlers() {
        // Gallery thumbnails
        queryAll('.gallery-thumbnail-image').forEach(img => {
            img.addEventListener('click', (e) => this.handleGalleryClick(e));
        });

        // Modal thumbnails
        queryAll('.modal-thumbnail-image').forEach(img => {
            img.addEventListener('click', (e) => this.handleModalClick(e));
        });
    }

    /**
     * Handle gallery thumbnail click
     * @param {Event} event - Click event
     */
    handleGalleryClick(event) {
        const target = event.target;
        const projectId = target.id;
        const projectTitle = target.getAttribute('project-title');
        const projectDesc = target.getAttribute('project-desc');

        const carouselInner = query('.carousel-inner');
        const titleElement = byId('gallery-title');
        const descElement = byId('modal-project-desc');

        if (carouselInner) {
            carouselInner.innerHTML = '';
        }
        if (titleElement) {
            titleElement.innerHTML = '';
        }

        // Find and clone images from repo
        const images = queryAll(`#image-repo .item#${projectId}`);
        if (images.length > 0) {
            const firstImage = images[0].cloneNode(true);
            if (images[0].parentNode.children.length > 0) {
                firstImage.classList.add('active');
            }
            
            if (carouselInner) {
                carouselInner.appendChild(firstImage);
            }

            // Clone remaining images
            for (let i = 1; i < images.length; i++) {
                const clone = images[i].cloneNode(true);
                if (carouselInner) {
                    carouselInner.appendChild(clone);
                }
            }
        }

        if (titleElement) {
            titleElement.textContent = projectTitle;
        }
        if (descElement) {
            descElement.innerHTML = projectDesc;
        }

        // Show modal using jQuery or vanilla JS
        if (typeof $ !== 'undefined') {
            $('#modal-gallery').modal('show');
        } else {
            const modal = byId('modal-gallery');
            if (modal) {
                modal.style.display = 'block';
            }
        }
    }

    /**
     * Handle modal thumbnail click
     * @param {Event} event - Click event
     */
    handleModalClick(event) {
        const target = event.target;
        const projectTitle = target.getAttribute('project-title');
        const projectDesc = target.getAttribute('project-desc');

        const titleElement = byId('modal-title');
        const descElement = byId('modal-desc-body');

        if (titleElement) {
            titleElement.textContent = projectTitle;
        }
        if (descElement) {
            descElement.innerHTML = projectDesc;
        }

        // Show modal using jQuery or vanilla JS
        if (typeof $ !== 'undefined') {
            $('#modal-desc').modal('show');
        } else {
            const modal = byId('modal-desc');
            if (modal) {
                modal.style.display = 'block';
            }
        }
    }

    /**
     * Setup collapse/expand handlers
     */
    setupCollapseHandlers() {
        if (typeof $ === 'undefined') return; // jQuery required for collapse

        $('.collapse').on('shown.bs.collapse', function () {
            const icon = $(this).parent().find('.glyphicon');
            icon.removeClass('glyphicon-triangle-right').addClass('glyphicon-triangle-bottom');
        });

        $('.collapse').on('hidden.bs.collapse', function () {
            const icon = $(this).parent().find('.glyphicon');
            icon.removeClass('glyphicon-triangle-bottom').addClass('glyphicon-triangle-right');
        });
    }

    /**
     * Setup carousel
     */
    setupCarousel() {
        if (typeof $ === 'undefined') return; // jQuery required for carousel

        $('#modal-carousel').carousel({
            interval: CONFIG.carouselInterval
        });
    }

    /**
     * Add custom event handler for project sections
     * @param {Function} callback - Callback function
     */
    onProjectsLoaded(callback) {
        if (typeof callback === 'function') {
            document.addEventListener('projectsLoaded', callback);
        }
    }

    /**
     * Dispatch custom event
     * @param {string} eventName - Event name
     * @param {any} detail - Event detail
     */
    dispatchEvent(eventName, detail = null) {
        const event = new CustomEvent(eventName, { detail });
        document.dispatchEvent(event);
    }
}

// Create global event handler instance
const eventHandlers = new EventHandlers();
