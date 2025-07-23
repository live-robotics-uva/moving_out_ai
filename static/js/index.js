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
  if (!image) {
    console.log('Interpolation image not found at index:', i);
    return;
  }
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
    // preloadInterpolationImages();

    // Check if interpolation elements exist before setting up
    if ($('#interpolation-slider').length > 0 && $('#interpolation-image-wrapper').length > 0) {
        preloadInterpolationImages();
        $('#interpolation-slider').on('input', function(event) {
          setInterpolationImage(this.value);
        });
        setInterpolationImage(0);
        $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);
    } else {
        console.log('Interpolation elements not found, skipping interpolation setup');
    }

    bulmaSlider.attach();
    
    // Test if JavaScript is working
    console.log('JavaScript is running!');
    
    // Test if jQuery is working
    if (typeof $ !== 'undefined') {
        console.log('jQuery is loaded');
    } else {
        console.log('jQuery is NOT loaded');
    }

    // Dataset visualization video selection - moved inside document ready
    window.updateDatasetVideo = function() {
        console.log('updateDatasetVideo called'); // Debug log
        const task = $('#task-select').val();
        const map = $('#map-select').val();
        const episode = $('#episode-select').val();
        
        console.log(`Selected: ${task}, ${map}, ${episode}`); // Debug log
        
        const videoPath = `./static/videos/by_map_h264/movingout_${task}_${map}_${episode}.mp4`;
        console.log(`Video path: ${videoPath}`); // Debug log
        
        const video = $('#dataset-video');
        const videoSource = video.find('source');
        
        // Update video source
        videoSource.attr('src', videoPath);
        video[0].load(); // Reload the video with new source
        
        // Wait for video to load before playing
        video[0].addEventListener('loadeddata', function() {
            video[0].play();
        });
        
        // Update description
        const taskName = task === 'task1' ? 'Task 1' : 'Task 2';
        const mapName = map.replace(/([A-Z])/g, ' $1').trim(); // Add spaces before capital letters
        $('#video-description').text(`Currently viewing: ${taskName} - ${mapName} - Episode ${episode}`);
    };
    
    window.updateDescription = function() {
        console.log('updateDescription called'); // Debug log
        const task = $('#task-select').val();
        const map = $('#map-select').val();
        const episode = $('#episode-select').val();
        
        const taskName = task === 'task1' ? 'Task 1' : 'Task 2';
        const mapName = map.replace(/([A-Z])/g, ' $1').trim();
        $('#video-description').text(`Selected: ${taskName} - ${mapName} - Episode ${episode}`);
    };
    
    // Add event listeners for dataset visualization
    console.log('Setting up dataset visualization event listeners'); // Debug log
    console.log('Checking if elements exist:');
    console.log('Task select:', $('#task-select').length);
    console.log('Map select:', $('#map-select').length);
    console.log('Episode select:', $('#episode-select').length);
    console.log('Play button:', $('#play-video-btn').length);
    
    // Use setTimeout to ensure DOM is fully loaded
    setTimeout(function() {
        console.log('Setting up event listeners after timeout');
        $('#task-select, #map-select, #episode-select').on('change', function() {
            console.log('Dropdown changed!');
            window.updateDescription();
        });
        $('#play-video-btn').on('click', function() {
            console.log('Play button clicked'); // Debug log
            window.updateDatasetVideo();
        });
        
        // Initial description update
        window.updateDescription();
    }, 500);

    // ===============================================
    // Method Comparison Videos Functionality
    // ===============================================
    
    // Video map configuration - easy to extend with new videos
    const videoMaps = [
        {
            name: 'HandOff',
            displayName: 'Hand Off',
            videos: {
                mlp: './static/modal_rollout_videos/HandOff_mlp.mp4',
                dp: './static/modal_rollout_videos/HandOff_dp.mp4',
                bass: './static/modal_rollout_videos/HandOff_bass.mp4'
            }
        },
        {
            name: 'SequentialRotation',
            displayName: 'Sequential Rotation',
            videos: {
                mlp: './static/modal_rollout_videos/SequentialRotation_mlp.mp4',
                dp: './static/modal_rollout_videos/SequentialRotation_dp.mp4',
                bass: './static/modal_rollout_videos/SequentialRotation_bass.mp4'
            }
        }
        // Add more video maps here as needed
    ];
    
    let currentMapIndex = 0;
    let autoCycleEnabled = true; // Start with auto-cycle enabled
    let autoCycleTimer = null;
    let videoSyncTimer = null;
    
    // Get video elements
    const videoElements = {
        mlp: document.getElementById('video-mlp'),
        dp: document.getElementById('video-dp'),
        bass: document.getElementById('video-bass')
    };
    
    // Function to update videos for current map
    function updateMapVideos(mapIndex) {
        console.log('Updating videos for map:', videoMaps[mapIndex].displayName);
        const currentMap = videoMaps[mapIndex];
        
        // Update video sources
        Object.keys(videoElements).forEach(method => {
            const video = videoElements[method];
            const source = video.querySelector('source');
            source.src = currentMap.videos[method];
            video.load();
        });
        
        // Update UI
        $('#current-map-description').text(`Currently viewing: ${currentMap.displayName}`);
        
        // Update button states
        $('.map-btn').removeClass('is-primary').addClass('is-light');
        $(`.map-btn[data-map="${currentMap.name}"]`).removeClass('is-light').addClass('is-primary');
    }
    
    // Function to play all videos synchronously
    function playAllVideos() {
        console.log('Playing all videos synchronously');
        
        // Reset all videos to start
        Object.values(videoElements).forEach(video => {
            video.currentTime = 0;
        });
        
        // Play all videos
        const playPromises = Object.values(videoElements).map(video => {
            return video.play().catch(e => console.log('Play failed:', e));
        });
        
        // Wait for all to start playing
        Promise.all(playPromises).then(() => {
            console.log('All videos started playing');
            
            // Monitor for longest video completion
            if (autoCycleEnabled) {
                monitorVideoCompletion();
            }
        });
    }
    
    // Function to pause all videos
    function pauseAllVideos() {
        console.log('Pausing all videos');
        Object.values(videoElements).forEach(video => {
            video.pause();
        });
        clearTimeout(videoSyncTimer);
    }
    
    // Function to monitor video completion and auto-cycle
    function monitorVideoCompletion() {
        if (!autoCycleEnabled) return;
        
        const checkCompletion = () => {
            // Find the longest video duration
            let maxDuration = 0;
            let allReady = true;
            
            Object.values(videoElements).forEach(video => {
                if (!isNaN(video.duration)) {
                    maxDuration = Math.max(maxDuration, video.duration);
                } else {
                    allReady = false;
                }
            });
            
            if (!allReady) {
                // Wait for all videos to load their metadata
                videoSyncTimer = setTimeout(checkCompletion, 100);
                return;
            }
            
            // Calculate time until longest video completes
            let maxCurrentTime = 0;
            Object.values(videoElements).forEach(video => {
                maxCurrentTime = Math.max(maxCurrentTime, video.currentTime);
            });
            
            const remainingTime = (maxDuration - maxCurrentTime) * 1000; // Convert to milliseconds
            
            if (remainingTime <= 100) { // Almost finished
                // Auto cycle to next map
                autoCycleTimer = setTimeout(() => {
                    currentMapIndex = (currentMapIndex + 1) % videoMaps.length;
                    updateMapVideos(currentMapIndex);
                    setTimeout(playAllVideos, 500); // Small delay to let videos load
                }, 1000);
            } else {
                // Check again in a bit
                videoSyncTimer = setTimeout(checkCompletion, 1000);
            }
        };
        
        checkCompletion();
    }
    
    // Event listeners for comparison videos
    setTimeout(function() {
        console.log('Setting up method comparison video controls');
        
        // Map selector buttons
        $('.map-btn').on('click', function() {
            const mapName = $(this).data('map');
            const mapIndex = videoMaps.findIndex(map => map.name === mapName);
            if (mapIndex !== -1) {
                // Clear any existing timers
                clearTimeout(autoCycleTimer);
                clearTimeout(videoSyncTimer);
                
                currentMapIndex = mapIndex;
                updateMapVideos(currentMapIndex);
                
                // Always play when manually selecting (whether auto-cycle is on or off)
                setTimeout(playAllVideos, 500);
            }
        });
        
        // Control buttons
        $('#play-all-btn').on('click', playAllVideos);
        $('#pause-all-btn').on('click', pauseAllVideos);
        
        $('#auto-cycle-btn').on('click', function() {
            autoCycleEnabled = !autoCycleEnabled;
            
            if (autoCycleEnabled) {
                $(this).removeClass('is-info').addClass('is-success');
                $(this).find('span:last-child').text('Auto Cycle ON');
                playAllVideos();
            } else {
                $(this).removeClass('is-success').addClass('is-info');
                $(this).find('span:last-child').text('Auto Cycle');
                clearTimeout(autoCycleTimer);
                clearTimeout(videoSyncTimer);
            }
        });
        
        // Initialize with first map and auto-cycle state
        updateMapVideos(0);
        
        // Set initial auto-cycle button state
        $('#auto-cycle-btn').removeClass('is-info').addClass('is-success');
        $('#auto-cycle-btn').find('span:last-child').text('Auto Cycle ON');
        
        // Auto-start playing after a short delay to ensure videos are loaded
        setTimeout(() => {
            playAllVideos();
        }, 1500);
        
    }, 1000);

})
