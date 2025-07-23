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
    
    console.log('=== INITIALIZING METHOD COMPARISON VIDEOS ===');
    
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
    console.log('Getting video elements...');
    const videoElements = {
        mlp: document.getElementById('video-mlp'),
        dp: document.getElementById('video-dp'),
        bass: document.getElementById('video-bass')
    };
    
    console.log('Video elements found:', {
        mlp: !!videoElements.mlp,
        dp: !!videoElements.dp,
        bass: !!videoElements.bass
    });
    
    // Function to update videos for current map
    function updateMapVideos(mapIndex) {
        console.log('Updating videos for map:', videoMaps[mapIndex].displayName);
        const currentMap = videoMaps[mapIndex];
        
        // Update status
        $('#video-status').text(`Loading ${currentMap.displayName} videos...`);
        
        // Update video sources
        Object.keys(videoElements).forEach(method => {
            const video = videoElements[method];
            const source = video.querySelector('source');
            source.src = currentMap.videos[method];
            
            // Ensure proper attributes for GitHub Pages
            video.muted = true;
            video.preload = 'metadata';
            video.playsInline = true;
            
            video.load();
        });
        
        // Update button states
        $('.map-btn').removeClass('is-primary').addClass('is-light');
        $(`.map-btn[data-map="${currentMap.name}"]`).removeClass('is-light').addClass('is-primary');
        
        // Update status when videos are ready
        setTimeout(() => {
            $('#video-status').text(`${currentMap.displayName} videos ready - Click "Play All" to start`);
        }, 1000);
    }
    
    // Function to play all videos synchronously
    function playAllVideos() {
        console.log('Playing all videos synchronously');
        $('#video-status').text('Starting videos...');
        
        // Reset all videos to start
        Object.values(videoElements).forEach(video => {
            video.currentTime = 0;
            // Ensure videos are muted for autoplay
            video.muted = true;
        });
        
        // Play all videos with better error handling
        const playPromises = Object.values(videoElements).map(video => {
            return video.play().catch(e => {
                console.error('Play failed for video:', video.id, e);
                $('#video-status').text('Some videos failed to play. Try clicking play on individual videos first.');
                return null;
            });
        });
        
        // Wait for all to start playing
        Promise.all(playPromises).then(() => {
            console.log('All videos started playing');
            const currentMap = videoMaps[currentMapIndex];
            $('#video-status').text(`Playing ${currentMap.displayName} comparison...`);
            
            // Monitor for longest video completion
            if (autoCycleEnabled) {
                monitorVideoCompletion();
            }
        }).catch(e => {
            console.error('Failed to start some videos:', e);
            $('#video-status').text('Failed to start videos. Please try again or disable auto-cycle.');
        });
    }
    
    // Function to pause all videos
    function pauseAllVideos() {
        console.log('Pausing all videos');
        $('#video-status').text('Videos paused');
        Object.values(videoElements).forEach(video => {
            video.pause();
        });
        clearTimeout(videoSyncTimer);
        clearTimeout(autoCycleTimer);
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
                $('#video-status').text('Switching to next scenario...');
                autoCycleTimer = setTimeout(() => {
                    currentMapIndex = (currentMapIndex + 1) % videoMaps.length;
                    updateMapVideos(currentMapIndex);
                    setTimeout(playAllVideos, 1000); // Small delay to let videos load
                }, 1000);
            } else {
                // Check again in a bit
                videoSyncTimer = setTimeout(checkCompletion, 1000);
            }
        };
        
        checkCompletion();
    }
    
    // Function to wait for elements and initialize
    function initializeMethodComparisonVideos() {
        console.log('=== ATTEMPTING TO INITIALIZE METHOD COMPARISON ===');
        
        // Check if all required elements exist
        const mlpVideo = document.getElementById('video-mlp');
        const dpVideo = document.getElementById('video-dp');
        const bassVideo = document.getElementById('video-bass');
        const playBtn = document.getElementById('play-all-btn');
        const pauseBtn = document.getElementById('pause-all-btn');
        
        console.log('Element check:', {
            mlp: !!mlpVideo,
            dp: !!dpVideo,
            bass: !!bassVideo,
            playBtn: !!playBtn,
            pauseBtn: !!pauseBtn
        });
        
        if (!mlpVideo || !dpVideo || !bassVideo || !playBtn || !pauseBtn) {
            console.log('Some elements missing, retrying in 1 second...');
            setTimeout(initializeMethodComparisonVideos, 1000);
            return;
        }
        
        console.log('=== ALL ELEMENTS FOUND, SETTING UP CONTROLS ===');
        
        // Update video elements object with actual elements
        videoElements.mlp = mlpVideo;
        videoElements.dp = dpVideo;
        videoElements.bass = bassVideo;
        
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
        $('#play-all-btn').on('click', function() {
            console.log('=== PLAY ALL BUTTON CLICKED ===');
            playAllVideos();
        });
        $('#pause-all-btn').on('click', function() {
            console.log('=== PAUSE ALL BUTTON CLICKED ===');
            pauseAllVideos();
        });
        
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
        
        // Set initial auto-cycle button state (but don't auto-start)
        $('#auto-cycle-btn').removeClass('is-info').addClass('is-success');
        $('#auto-cycle-btn').find('span:last-child').text('Auto Cycle ON');
        
        // Add a notice for users to click play
        console.log('Videos loaded. Click "Play All" to start.');
        
        // Optional: Auto-start only if user has interacted with the page
        let userHasInteracted = false;
        $(document).one('click touchstart keydown', function() {
            userHasInteracted = true;
            console.log('User interaction detected, enabling auto-play');
        });
        
        // Check for user interaction and auto-start after delay
        setTimeout(() => {
            if (userHasInteracted) {
                console.log('Auto-starting videos after user interaction');
                $('#video-status').text('Auto-starting videos...');
                setTimeout(playAllVideos, 500);
            } else {
                console.log('No user interaction detected, waiting for manual play');
                $('#video-status').text('Ready! Click "Play All" to start the video comparison');
            }
        }, 2000);
    }
    
    // Start trying to initialize method comparison videos
    setTimeout(initializeMethodComparisonVideos, 1000);

})
