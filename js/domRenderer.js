/**
 * DOM Renderer Module
 * Handles rendering portfolio content to the DOM
 */

class PortfolioRenderer {
    constructor(mainElement = '#main', templates = TEMPLATES) {
        this.mainElement = typeof mainElement === 'string' ? byId(mainElement) : mainElement;
        this.templates = templates;
        this.data = null;
    }

    /**
     * Render entire portfolio
     * @param {object} data - Portfolio data
     */
    render(data) {
        this.data = data;
        
        // Set page title
        this.setPageTitle(data.personal);

        // Set header
        this.renderHeader(data.personal);

        // Render contacts
        this.renderContacts(data.personal);

        // Render sections in order
        const order = data.displayOrder || CONFIG.defaultOrder;
        for (const section of order) {
            const method = this[`render${this.capitalize(section)}`];
            if (method && typeof method === 'function') {
                method.call(this, data);
            }
        }

        // Setup tooltips if enabled
        if (CONFIG.enableTooltips) {
            this.setupTooltips();
        }
    }

    /**
     * Set page title
     * @param {object} personal - Personal data
     */
    setPageTitle(personal) {
        const title = `${personal.name}, ${personal.title}`;
        document.title = title;
    }

    /**
     * Render header information
     * @param {object} personal - Personal data
     */
    renderHeader(personal) {
        setText(byId('name'), personal.name || 'Portfolio');
        setText(byId('title'), personal.title || '');
    }

    /**
     * Render contact information
     * @param {object} personal - Personal data
     */
    renderContacts(personal) {
        const contactsElement = byId('contacts');
        if (!contactsElement) return;

        contactsElement.innerHTML = '';

        if (hasValue(personal.email)) {
            appendHTML(contactsElement, this.templates.email.replace('%data%', personal.email));
        }
        if (hasValue(personal.phone)) {
            appendHTML(contactsElement, this.templates.phone.replace('%data%', personal.phone));
        }
        if (hasValue(personal.location)) {
            appendHTML(contactsElement, this.templates.location.replace('%data%', personal.location));
        }
        if (hasValue(personal.website)) {
            appendHTML(contactsElement, this.templates.website.replace('%data%', personal.website));
        }
    }

    /**
     * Render short bio section
     * @param {object} data - Portfolio data
     */
    renderShortBio(data) {
        const personal = data.personal;
        if (hasValue(personal.shortBio)) {
            appendHTML(this.mainElement, this.templates.shortBio.replace('%data%', personal.shortBio));
        }
    }

    /**
     * Render project sections
     * @param {object} data - Portfolio data
     */
    renderProjects(data) {
        if (!hasValue(data.projectSections, 'array')) return;

        for (let i = 0; i < data.projectSections.length; i++) {
            const section = data.projectSections[i];
            const html = this.templates.projectsStart
                .replace('%sectionTitle%', section.title)
                .replace('%id%', i);
            
            appendHTML(this.mainElement, html);
            const sectionElement = byId(`projects${i}`);
            this.renderProjectList(section.projects, sectionElement);
        }
    }

    /**
     * Render list of projects
     * @param {array} projects - Projects array
     * @param {HTMLElement} container - Container element
     */
    renderProjectList(projects, container) {
        if (!projects || !container) return;

        let projectRow = null;
        let projectCount = 0;

        for (let i = 0; i < projects.length; i++) {
            projectCount++;

            if (projectCount === 1) {
                appendHTML(container, this.templates.projectRow);
                projectRow = byClass('project-row')[byClass('project-row').length - 1];
            }

            const project = projects[i];
            const projectId = generateId('project');

            // Add images to repository if gallery exists
            if (hasValue(project.gallery, 'array')) {
                this.addProjectImagesToRepo(project.gallery, projectId);
                var projectHtml = this.templates.projectWithGallery;
            } else if (hasValue(project.description)) {
                var projectHtml = this.templates.projectWithModal;
            } else {
                var projectHtml = this.templates.projectSimple;
            }

            projectHtml = projectHtml
                .replace('%image%', project.thumbnail || '')
                .replace(/%title%/g, project.title || '')
                .replace('%id%', projectId);

            if (hasValue(project.link)) {
                projectHtml += this.templates.projectLink.replace('%link%', project.link);
            }

            if (hasValue(project.description)) {
                if (Array.isArray(project.description)) {
                    projectHtml = this.addProjectBulletDescription(projectHtml, project.description);
                } else {
                    projectHtml = projectHtml.replace('%projectDesc%', project.description);
                }
            }

            appendHTML(projectRow, projectHtml);

            if (projectCount >= CONFIG.projectsPerRow) {
                projectCount = 0;
            }
        }
    }

    /**
     * Add project images to repository
     * @param {array} images - Image URLs
     * @param {string} projectId - Project ID
     */
    addProjectImagesToRepo(images, projectId) {
        const repo = byId('image-repo');
        if (!repo) return;

        for (const image of images) {
            const html = this.templates.projectGalleryItem
                .replace('%src%', image)
                .replace('%id%', projectId);
            appendHTML(repo, html);
        }
    }

    /**
     * Add bullet description to project
     * @param {string} projectHtml - Project HTML template
     * @param {array} descriptions - Description array
     * @returns {string}
     */
    addProjectBulletDescription(projectHtml, descriptions) {
        let html = this.templates.projectBulletStart;
        for (const desc of descriptions) {
            html += this.templates.projectBulletItem.replace('%data%', desc);
        }
        html += this.templates.projectBulletEnd;
        return projectHtml.replace('%projectDesc%', html);
    }

    /**
     * Render work experience section
     * @param {object} data - Portfolio data
     */
    renderWork(data) {
        if (!hasValue(data.work, 'array')) return;

        appendHTML(this.mainElement, this.templates.workStart);
        const workElement = byId('work');

        for (const work of data.work) {
            let employerHtml = '';
            if (hasValue(work.website)) {
                employerHtml = this.templates.employer
                    .replace('%employer%', work.employer || '')
                    .replace('%url%', work.website);
            } else {
                employerHtml = this.templates.employerWithoutUrl.replace('%employer%', work.employer || '');
            }

            appendHTML(workElement, employerHtml);

            const titleHtml = this.templates.jobTitle.replace('%data%', work.title || '');
            appendHTML(workElement, titleHtml);

            const metaHtml = this.templates.employmentDateAndLocation
                .replace('%location%', work.location || '')
                .replace('%date%', work.dates || '');
            appendHTML(workElement, metaHtml);

            if (hasValue(work.highlights, 'array')) {
                this.renderHighlights(workElement, work.highlights, `work-${generateId()}`);
            }
        }
    }

    /**
     * Render education section
     * @param {object} data - Portfolio data
     */
    renderEducation(data) {
        if (!hasValue(data.education, 'array')) return;

        appendHTML(this.mainElement, this.templates.educationStart);
        const eduElement = byId('education');

        for (const edu of data.education) {
            const institutionHtml = this.templates.institutionName.replace('%data%', edu.institution || '');
            appendHTML(eduElement, institutionHtml);

            const degreeString = `${edu.degree || ''}, ${edu.major || ''}`;
            const metaHtml = this.templates.employmentDateAndLocation
                .replace('%location%', degreeString)
                .replace('%date%', edu.graduationDate || '');
            appendHTML(eduElement, metaHtml);

            if (hasValue(edu.gpa)) {
                const gpaHtml = this.templates.gpa.replace('%data%', edu.gpa);
                appendHTML(eduElement, gpaHtml);
            }
        }
    }

    /**
     * Render awards section
     * @param {object} data - Portfolio data
     */
    renderAwards(data) {
        if (!hasValue(data.awards, 'array')) return;

        appendHTML(this.mainElement, this.templates.awardsStart);
        const awardsElement = byId('awards');

        for (let i = 0; i < data.awards.length; i++) {
            const award = data.awards[i];
            const titleHtml = this.templates.awardTitle.replace('%data%', award.title || '');
            appendHTML(awardsElement, titleHtml);

            const metaHtml = this.templates.awarderAndDate
                .replace('%awarder%', award.awarder || '')
                .replace('%date%', award.date || '');
            appendHTML(awardsElement, metaHtml);

            if (hasValue(award.description)) {
                const detailId = generateId('award-detail');
                const divId = `${detailId}-div`;
                
                const titleHtml = this.templates.awardDetailsTitle
                    .replace('%id%', detailId)
                    .replace('%targetId%', divId);
                appendHTML(awardsElement, titleHtml);

                const detailsHtml = this.templates.awardDetails
                    .replace('%id%', divId)
                    .replace('%data%', award.description);
                appendHTML(awardsElement, detailsHtml);
            }
        }
    }

    /**
     * Render volunteer section
     * @param {object} data - Portfolio data
     */
    renderVolunteer(data) {
        if (!hasValue(data.volunteer, 'array')) return;

        appendHTML(this.mainElement, this.templates.volunteerStart);
        const volElement = byId('volunteer');

        for (const vol of data.volunteer) {
            let orgHtml = '';
            if (hasValue(vol.website)) {
                orgHtml = this.templates.employer
                    .replace('%employer%', vol.organization || '')
                    .replace('%url%', vol.website);
            } else {
                orgHtml = this.templates.employerWithoutUrl.replace('%employer%', vol.organization || '');
            }

            appendHTML(volElement, orgHtml);

            const titleHtml = this.templates.jobTitle.replace('%data%', vol.title || '');
            appendHTML(volElement, titleHtml);

            const metaHtml = this.templates.employmentDateAndLocation
                .replace('%location%', vol.location || '')
                .replace('%date%', vol.dates || '');
            appendHTML(volElement, metaHtml);

            if (hasValue(vol.highlights, 'array')) {
                this.renderHighlights(volElement, vol.highlights, `volunteer-${generateId()}`);
            }
        }
    }

    /**
     * Render social links section
     * @param {object} data - Portfolio data
     */
    renderSocial(data) {
        if (!hasValue(data.personal.profiles, 'array')) return;

        appendHTML(this.mainElement, this.templates.socialStart);
        const socialElement = byId('social');

        for (const profile of data.personal.profiles) {
            const html = this.templates.socialItem
                .replace('%network%', profile.network.toLowerCase())
                .replace('%link%', profile.url);
            appendHTML(socialElement, html);
        }
    }

    /**
     * Render highlights/details section
     * @param {HTMLElement} container - Container element
     * @param {array} highlights - Highlights array
     * @param {string} baseId - Base ID for elements
     */
    renderHighlights(container, highlights, baseId) {
        const titleHtml = this.templates.workHighlightsTitle
            .replace('%id%', baseId)
            .replace('%targetId%', `${baseId}-list`);
        appendHTML(container, titleHtml);

        const listHtml = this.templates.workHighlightsList.replace('%data%', `${baseId}-list`);
        appendHTML(container, listHtml);

        const listElement = byId(`${baseId}-list`);
        for (const highlight of highlights) {
            const itemHtml = this.templates.workHighlightsItem.replace('%data%', highlight);
            appendHTML(listElement, itemHtml);
        }
    }

    /**
     * Setup tooltips
     */
    setupTooltips() {
        if (typeof $ !== 'undefined' && $.fn.tooltip) {
            $('.tooltip-image').tooltip();
            const first = query('.tooltip-image');
            if (first) {
                $(first).tooltip('show');
            }
        }
    }

    /**
     * Capitalize first letter
     * @param {string} str - String to capitalize
     * @returns {string}
     */
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Create global renderer instance
const renderer = new PortfolioRenderer('main', TEMPLATES);
