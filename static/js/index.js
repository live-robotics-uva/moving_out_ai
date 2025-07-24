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

})
