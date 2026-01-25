// Floating Fish Animation System
class FloatingFish {
  constructor() {
    this.container = null;
    this.fishElements = [];
    this.isActive = localStorage.getItem('portfolioFishEnabled') !== 'false';
    this.maxFish = 5;
    this.basePath = this.getBasePath();
    // All fish images available in Assets/images/fishes/
    this.fishImages = [
      `${this.basePath}Assets/images/fishes/blue-multi.png`,
      `${this.basePath}Assets/images/fishes/blue.png`,
      `${this.basePath}Assets/images/fishes/butter.png`,
      `${this.basePath}Assets/images/fishes/clown.avif`,
      `${this.basePath}Assets/images/fishes/clownfish.png`,
      `${this.basePath}Assets/images/fishes/green.png`,
      `${this.basePath}Assets/images/fishes/multicoloured.png`,
      `${this.basePath}Assets/images/fishes/orange-multi.png`,
      `${this.basePath}Assets/images/fishes/organge.webp`,
      `${this.basePath}Assets/images/fishes/picmix.com_2469184.png`,
      `${this.basePath}Assets/images/fishes/red-blue.png`,
      `${this.basePath}Assets/images/fishes/yellow-multi.png`,
      `${this.basePath}Assets/images/fishes/zebra.avif`
    ];
    this.init();
  }

  getBasePath() {
    // Detect if we're in a subdirectory (like pages/)
    return window.location.pathname.includes('/pages/') ? '../' : '';
  }

  init() {
    // Create container
    this.container = document.createElement('div');
    this.container.className = 'fish-container';
    this.container.id = 'fishContainer';
    document.body.appendChild(this.container);

    // Create initial fish
    for (let i = 0; i < this.maxFish; i++) {
      this.createFish();
    }

    // Start animation if enabled
    if (this.isActive) {
      this.start();
    }
  }

  createFish() {
    const fish = document.createElement('div');
    fish.className = 'fish';
    
    // Select random fish image from available images
    const randomImage = this.fishImages[Math.floor(Math.random() * this.fishImages.length)];
    
    // Create image element
    const img = document.createElement('img');
    img.src = randomImage;
    img.alt = 'Swimming Fish';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.loading = 'lazy';
    
    fish.appendChild(img);
    this.container.appendChild(fish);
    this.fishElements.push(fish);
    
    return fish;
  }

  getColorValue(colorClass) {
    // No longer needed with images, but keeping for compatibility
    const colors = {
      orange: '#FF8C00',
      blue: '#1E90FF',
      pink: '#FFB6C1',
      yellow: '#FFD700',
      purple: '#9370DB'
    };
    return colors[colorClass] || '#FF8C00';
  }

  animateFish(fish) {
    if (!this.isActive) return;

    // Random start position at screen edge
    const startSide = Math.random() > 0.5 ? 'left' : 'right';
    const startY = Math.random() * (window.innerHeight - 100);
    
    // Random end position at opposite edge
    const endX = startSide === 'left' ? window.innerWidth + 100 : -100;
    const startX = startSide === 'left' ? -100 : window.innerWidth + 100;
    
    // Set initial position
    fish.style.left = startX + 'px';
    fish.style.top = startY + 'px';
    
    // Flip fish based on direction
    fish.style.transform = startSide === 'left' ? 'scaleX(1)' : 'scaleX(-1)';
    
    // Show fish
    fish.classList.add('active');
    
    // Animation duration (8-15 seconds)
    const duration = 8000 + Math.random() * 7000;
    
    // Animate across screen
    const startTime = Date.now();
    const animate = () => {
      if (!this.isActive) {
        fish.classList.remove('active');
        return;
      }

      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Linear movement
      const currentX = startX + (endX - startX) * progress;
      
      // Wavy vertical movement
      const waveAmplitude = 30;
      const waveFrequency = 4;
      const waveY = Math.sin(progress * Math.PI * waveFrequency) * waveAmplitude;
      
      fish.style.left = currentX + 'px';
      fish.style.top = (startY + waveY) + 'px';
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Hide fish and schedule next appearance
        fish.classList.remove('active');
        this.scheduleFish(fish);
      }
    };
    
    animate();
    
    // Occasionally create bubbles
    if (Math.random() > 0.7) {
      this.createBubbles(fish);
    }
  }

  createBubbles(fish) {
    const bubbleCount = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < bubbleCount; i++) {
      setTimeout(() => {
        if (!this.isActive) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        const fishRect = fish.getBoundingClientRect();
        bubble.style.left = (fishRect.left + 20) + 'px';
        bubble.style.top = (fishRect.top + 20) + 'px';
        bubble.style.animationDelay = (Math.random() * 0.5) + 's';
        
        this.container.appendChild(bubble);
        
        // Remove bubble after animation
        setTimeout(() => {
          bubble.remove();
        }, 3000);
      }, i * 500);
    }
  }

  scheduleFish(fish) {
    if (!this.isActive) return;
    
    // Random delay between 3-10 seconds before next swim
    const delay = 3000 + Math.random() * 7000;
    
    setTimeout(() => {
      this.animateFish(fish);
    }, delay);
  }

  start() {
    this.isActive = true;
    localStorage.setItem('portfolioFishEnabled', 'true');
    
    // Stagger fish starts
    this.fishElements.forEach((fish, index) => {
      setTimeout(() => {
        this.animateFish(fish);
      }, index * 2000);
    });
  }

  stop() {
    this.isActive = false;
    localStorage.setItem('portfolioFishEnabled', 'false');
    
    // Hide all fish
    this.fishElements.forEach(fish => {
      fish.classList.remove('active');
    });
  }

  toggle() {
    if (this.isActive) {
      this.stop();
    } else {
      this.start();
    }
  }

  updateMaxFish(newMax) {
    const oldMax = this.maxFish;
    this.maxFish = Math.max(1, Math.min(newMax, 20)); // Clamp between 1 and 20
    
    if (this.maxFish > oldMax) {
      // Add more fish
      const difference = this.maxFish - oldMax;
      for (let i = 0; i < difference; i++) {
        const newFish = this.createFish();
        if (this.isActive) {
          setTimeout(() => {
            this.animateFish(newFish);
          }, i * 1000);
        }
      }
    } else if (this.maxFish < oldMax) {
      // Remove fish
      const toRemove = this.fishElements.slice(this.maxFish);
      toRemove.forEach(fish => {
        fish.remove();
        this.fishElements = this.fishElements.filter(f => f !== fish);
      });
    }
  }
}

// Initialize on page load
let fishSystem;

function initializeFishButtons() {
  if (!fishSystem) return;
  
  // Setup toggle buttons
  const fishButtons = document.querySelectorAll('.fish-btn');
  
  if (fishButtons.length === 0) {
    console.warn('Fish buttons not found');
    return;
  }
  
  fishButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.fish === 'on' && fishSystem.isActive) {
      btn.classList.add('active');
    } else if (btn.dataset.fish === 'off' && !fishSystem.isActive) {
      btn.classList.add('active');
    }
  });
  
  fishButtons.forEach(button => {
    button.addEventListener('click', function() {
      const setting = this.dataset.fish;
      
      if (setting === 'on') {
        fishSystem.start();
      } else {
        fishSystem.stop();
      }
      
      // Update active state
      fishButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Setup fish count slider
  const fishCountSlider = document.getElementById('fish-count-slider');
  const fishCountDisplay = document.getElementById('fish-count-display');
  
  if (fishCountSlider && fishCountDisplay) {
    // Set initial value from system
    fishCountSlider.value = fishSystem.maxFish;
    fishCountDisplay.textContent = fishSystem.maxFish;
    
    fishCountSlider.addEventListener('input', function() {
      const newCount = parseInt(this.value);
      fishCountDisplay.textContent = newCount;
      fishSystem.updateMaxFish(newCount);
    });
  }
}

// Wait for DOM and components to be loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    fishSystem = new FloatingFish();
    
    // Try to initialize buttons immediately
    setTimeout(() => {
      initializeFishButtons();
    }, 100);
  });
} else {
  // DOM already loaded
  fishSystem = new FloatingFish();
  
  // Try to initialize buttons immediately
  setTimeout(() => {
    initializeFishButtons();
  }, 100);
}

// Also listen for components loaded event
document.addEventListener('componentsLoaded', () => {
  initializeFishButtons();
});

