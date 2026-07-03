// Configuration
const totalFrames = 59;
const images = [];
const canvas = document.getElementById('animation-canvas');
const context = canvas.getContext('2d');
const scrollSection = document.getElementById('interactive-scroll');

let currentFrameIndex = 0;

// Start by preloading the first frame
function startLoading() {
  const firstImg = new Image();
  const frameNum = "001";
  firstImg.src = `frames/ezgif-frame-${frameNum}.jpg`;
  firstImg.onload = () => {
    images[0] = firstImg;
    initScrollAnimation();
    preloadRemainingImages();
  };
  firstImg.onerror = () => {
    console.error("Failed to load first frame");
    initScrollAnimation();
    preloadRemainingImages();
  };
  images.push(firstImg);
}

// Preload the remaining frames in the background silently
function preloadRemainingImages() {
  for (let i = 2; i <= totalFrames; i++) {
    const img = new Image();
    const frameNum = String(i).padStart(3, '0');
    img.src = `frames/ezgif-frame-${frameNum}.jpg`;
    img.onload = () => {
      images[i - 1] = img;
      // Redraw if this is the current frame index
      if (currentFrameIndex === i - 1) {
        drawFrame(currentFrameIndex);
      }
    };
    img.onerror = () => {
      console.error(`Failed to load frame: frames/ezgif-frame-${frameNum}.jpg`);
    };
    images.push(img);
  }
}

// 2. Scroll Animation Setup
function initScrollAnimation() {
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas(); // Initial call
  
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Check scroll position immediately
}

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  context.scale(dpr, dpr);
  
  drawFrame(currentFrameIndex);
}

function drawFrame(index) {
  const img = images[index];
  if (!img) return; // Silent return if frame hasn't loaded yet
  
  const dpr = window.devicePixelRatio || 1;
  const canvasWidth = canvas.width / dpr;
  const canvasHeight = canvas.height / dpr;
  
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  
  const imgWidth = img.naturalWidth || 1920;
  const imgHeight = img.naturalHeight || 1080;
  
  const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight) * 1.4;
  const x = (canvasWidth - imgWidth * scale) / 2;
  const y = (canvasHeight - imgHeight * scale) / 2;
  
  context.drawImage(img, x, y, imgWidth * scale, imgHeight * scale);
}

let ticking = false;
function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateScrollAnimation();
      ticking = false;
    });
    ticking = true;
  }
}

function updateScrollAnimation() {
  const sectionRect = scrollSection.getBoundingClientRect();
  const scrollableHeight = sectionRect.height - window.innerHeight;
  const scrolled = -sectionRect.top;
  
  const scrollPercent = Math.max(0, Math.min(1, scrolled / scrollableHeight));
  const frameIndex = Math.floor(scrollPercent * (totalFrames - 1));
  
  const heroOverlay = document.getElementById('hero-text-overlay');
  if (heroOverlay) {
    const opacity = Math.max(0, 1 - (scrollPercent / 0.3));
    heroOverlay.style.opacity = opacity;
    if (opacity <= 0) {
      heroOverlay.style.display = 'none';
    } else {
      heroOverlay.style.display = 'flex';
    }
  }
  
  if (frameIndex !== currentFrameIndex) {
    currentFrameIndex = frameIndex;
    drawFrame(currentFrameIndex);
  }
}

// Start loading
startLoading();
