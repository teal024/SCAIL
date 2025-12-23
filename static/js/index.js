window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    bulmaSlider.attach();

    // Function to align video labels with video width
    function alignVideoLabels() {
        const video = document.getElementById('teaser1');
        const labels = document.querySelector('.video-labels');
        
        if (video && labels) {
            function updateAlignment() {
                // Get the actual rendered size of the video
                const videoWidth = video.offsetWidth;
                
                // Set the labels container to match video width
                labels.style.width = videoWidth + 'px';
                
                console.log('Video width:', videoWidth, 'Labels width set to:', labels.style.width);
            }
            
            // Multiple event listeners to catch all scenarios
            video.addEventListener('loadedmetadata', updateAlignment);
            video.addEventListener('loadeddata', updateAlignment);
            video.addEventListener('canplay', updateAlignment);
            window.addEventListener('resize', updateAlignment);
            window.addEventListener('load', updateAlignment);
            
            // Also try immediately and with delays
            updateAlignment();
            setTimeout(updateAlignment, 100);
            setTimeout(updateAlignment, 500);
            setTimeout(updateAlignment, 1000);
        }
    }
    
    // Call the alignment function
    alignVideoLabels();

    // Video Lazy Loading with Intersection Observer
    function lazyLoadVideos() {
        // Select all videos with preload="none"
        const lazyVideos = document.querySelectorAll('video[preload="none"]');
        
        if ('IntersectionObserver' in window) {
            const videoObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const video = entry.target;
                        
                        // Load the video when it enters the viewport
                        if (video.readyState === 0) {
                            video.load();
                            console.log('Lazy loading video:', video.id);
                        }
                        
                        // Stop observing this video
                        observer.unobserve(video);
                    }
                });
            }, {
                // Start loading when video is 200px away from viewport
                rootMargin: '200px 0px',
                threshold: 0.01
            });
            
            // Observe all lazy videos
            lazyVideos.forEach(video => {
                videoObserver.observe(video);
            });
            
            console.log(`Lazy loading enabled for ${lazyVideos.length} videos`);
        } else {
            // Fallback for browsers that don't support IntersectionObserver
            lazyVideos.forEach(video => {
                video.load();
            });
            console.log('IntersectionObserver not supported, loading all videos');
        }
    }
    
    // Initialize lazy loading
    lazyLoadVideos();

    // Initialize anime video slider
    initAnimeVideoSlider();

})

// Anime video slider functionality
let currentAnimeVideoIndex = 1; // Default to "Anime Characters' Interactions"

function initAnimeVideoSlider() {
    const prevBtn = document.getElementById('anime-slider-prev');
    const nextBtn = document.getElementById('anime-slider-next');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!prevBtn || !nextBtn) {
        console.log('Anime slider buttons not found');
        return;
    }
    
    // Bind click events to navigation buttons
    prevBtn.addEventListener('click', function() {
        changeAnimeVideo(-1);
    });
    
    nextBtn.addEventListener('click', function() {
        changeAnimeVideo(1);
    });
    
    // Bind click events to indicator dots
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            setAnimeVideo(index);
        });
    });
    
    console.log('Anime video slider initialized');
}

function changeAnimeVideo(direction) {
    const items = document.querySelectorAll('.anime-video-item');
    const dots = document.querySelectorAll('.slider-dot');
    const totalItems = items.length;
    
    if (totalItems === 0) return;
    
    // Pause current video
    const currentVideo = items[currentAnimeVideoIndex].querySelector('video');
    if (currentVideo) {
        currentVideo.pause();
    }
    
    // Update index
    currentAnimeVideoIndex = (currentAnimeVideoIndex + direction + totalItems) % totalItems;
    
    // Update active states
    items.forEach((item, index) => {
        item.classList.toggle('active', index === currentAnimeVideoIndex);
    });
    
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentAnimeVideoIndex);
    });
}

function setAnimeVideo(index) {
    const items = document.querySelectorAll('.anime-video-item');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (items.length === 0) return;
    
    // Pause current video
    const currentVideo = items[currentAnimeVideoIndex].querySelector('video');
    if (currentVideo) {
        currentVideo.pause();
    }
    
    currentAnimeVideoIndex = index;
    
    // Update active states
    items.forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}
