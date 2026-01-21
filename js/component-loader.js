// Modular Component Loader for GitHub Pages
class ComponentLoader {
  constructor() {
    this.basePath = this.getBasePath();
    this.componentsPath = `${this.basePath}components/`;
  }

  // Detect if we're in a subdirectory
  getBasePath() {
    const path = window.location.pathname;
    return path.includes('/pages/') ? '../' : '';
  }

  // Load a component HTML file
  async loadComponent(componentName) {
    try {
      const response = await fetch(`${this.componentsPath}${componentName}.html`);
      if (!response.ok) throw new Error(`Failed to load ${componentName}`);
      return await response.text();
    } catch (error) {
      console.error(`Error loading component ${componentName}:`, error);
      return '';
    }
  }

  // Fix asset paths for subdirectory pages
  fixAssetPaths(html) {
    if (this.basePath) {
      // Fix image sources (both src attributes and inline styles)
      html = html.replace(/src="Assets\//g, `src="${this.basePath}Assets/`);
      html = html.replace(/url\('Assets\//g, `url('${this.basePath}Assets/`);
      html = html.replace(/url\("Assets\//g, `url("${this.basePath}Assets/`);
      // Fix links that need base path
      html = html.replace(/href="pages\//g, `href="${this.basePath}pages/`);
    }
    return html;
  }

  // Fix navigation links for subdirectory pages
  fixNavLinks(html) {
    if (this.basePath) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      
      // Fix hash links to point to index.html
      tempDiv.querySelectorAll('a[data-nav-link]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
          link.setAttribute('href', `${this.basePath}index.html${href}`);
        }
      });
      
      // Gallery link is already correct, just needs base path fix which was done above
      
      return tempDiv.innerHTML;
    }
    return html;
  }

  // Insert component into placeholder
  async insertComponent(placeholderId, componentName) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) {
      console.warn(`Placeholder ${placeholderId} not found`);
      return;
    }

    let html = await this.loadComponent(componentName);
    if (!html) return;

    // Fix paths
    html = this.fixAssetPaths(html);
    
    // Fix navigation if it's the navbar
    if (componentName === 'navbar') {
      html = this.fixNavLinks(html);
    }

    // Special handling for metadata component - insert into head
    if (componentName === 'metadata') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      // Move all child elements to head
      Array.from(tempDiv.children).forEach(child => {
        document.head.appendChild(child);
      });
      // Remove the placeholder
      placeholder.remove();
    } else {
      placeholder.innerHTML = html;
    }
  }

  // Load all components on the page
  async loadAll() {
    const placeholders = document.querySelectorAll('[data-component]');
    const promises = Array.from(placeholders).map(placeholder => {
      const componentName = placeholder.getAttribute('data-component');
      return this.insertComponent(placeholder.id, componentName);
    });

    await Promise.all(promises);
    
    // Trigger custom event when components are loaded
    document.dispatchEvent(new CustomEvent('componentsLoaded'));
  }
}

// Auto-load components when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', async () => {
    const loader = new ComponentLoader();
    await loader.loadAll();
  });
} else {
  // DOM already loaded
  (async () => {
    const loader = new ComponentLoader();
    await loader.loadAll();
  })();
}
