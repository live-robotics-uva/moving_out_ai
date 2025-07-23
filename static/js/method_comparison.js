// Method Comparison Videos - Separate module for better debugging
console.log('METHOD_COMPARISON.JS: Loading...');

$(document).ready(function() {
    console.log('METHOD_COMPARISON.JS: Document ready');
    
    // Video configuration
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
    ];
    
    let currentMapIndex = 0;
    let autoCycleEnabled = true;
    
    // Wait for elements to be available
    function waitForElements() {
        console.log('METHOD_COMPARISON.JS: Waiting for elements...');
        
        const mlpVideo = document.getElementById('video-mlp');
        const dpVideo = document.getElementById('video-dp');
        const bassVideo = document.getElementById('video-bass');
        const playBtn = document.getElementById('play-all-btn');
        const pauseBtn = document.getElementById('pause-all-btn');
        const statusElement = document.getElementById('video-status');
        
        console.log('METHOD_COMPARISON.JS: Element check:', {
            mlpVideo: !!mlpVideo,
            dpVideo: !!dpVideo,
            bassVideo: !!bassVideo,
            playBtn: !!playBtn,
            pauseBtn: !!pauseBtn,
            statusElement: !!statusElement
        });
        
        if (!mlpVideo || !dpVideo || !bassVideo || !playBtn || !pauseBtn) {
            console.log('METHOD_COMPARISON.JS: Elements not ready, retrying...');
            setTimeout(waitForElements, 1000);
            return;
        }
        
        console.log('METHOD_COMPARISON.JS: All elements found, initializing...');
        initializeVideoControls(mlpVideo, dpVideo, bassVideo, playBtn, pauseBtn, statusElement);
    }
    
    function initializeVideoControls(mlpVideo, dpVideo, bassVideo, playBtn, pauseBtn, statusElement) {
        console.log('METHOD_COMPARISON.JS: Initializing controls...');
        
        const videoElements = [mlpVideo, dpVideo, bassVideo];
        
        // Update status function
        function updateStatus(message) {
            if (statusElement) {
                statusElement.textContent = message;
            }
            console.log('METHOD_COMPARISON.JS: Status:', message);
        }
        
        // Play all videos function
        function playAllVideos() {
            console.log('METHOD_COMPARISON.JS: Playing all videos');
            updateStatus('Starting videos...');
            
            videoElements.forEach(video => {
                video.muted = true;
                video.currentTime = 0;
            });
            
            const playPromises = videoElements.map(video => {
                return video.play().catch(e => {
                    console.error('METHOD_COMPARISON.JS: Play failed:', e);
                    return null;
                });
            });
            
            Promise.all(playPromises).then(() => {
                console.log('METHOD_COMPARISON.JS: All videos playing');
                updateStatus('Videos playing...');
            }).catch(e => {
                console.error('METHOD_COMPARISON.JS: Failed to start videos:', e);
                updateStatus('Failed to start videos. Try clicking individual videos first.');
            });
        }
        
        // Pause all videos function
        function pauseAllVideos() {
            console.log('METHOD_COMPARISON.JS: Pausing all videos');
            videoElements.forEach(video => {
                video.pause();
            });
            updateStatus('Videos paused');
        }
        
        // Update videos for current map
        function updateMapVideos(mapIndex) {
            const currentMap = videoMaps[mapIndex];
            console.log('METHOD_COMPARISON.JS: Updating to map:', currentMap.displayName);
            
            updateStatus(`Loading ${currentMap.displayName} videos...`);
            
            mlpVideo.src = currentMap.videos.mlp;
            dpVideo.src = currentMap.videos.dp;
            bassVideo.src = currentMap.videos.bass;
            
            videoElements.forEach(video => {
                video.muted = true;
                video.preload = 'metadata';
                video.load();
            });
            
            // Update map selector buttons
            $('.map-btn').removeClass('is-primary').addClass('is-light');
            $(`.map-btn[data-map="${currentMap.name}"]`).removeClass('is-light').addClass('is-primary');
            
            setTimeout(() => {
                updateStatus(`${currentMap.displayName} videos ready`);
            }, 1000);
        }
        
        // Bind events
        console.log('METHOD_COMPARISON.JS: Binding events...');
        
        $(playBtn).on('click', function() {
            console.log('METHOD_COMPARISON.JS: Play button clicked');
            playAllVideos();
        });
        
        $(pauseBtn).on('click', function() {
            console.log('METHOD_COMPARISON.JS: Pause button clicked');
            pauseAllVideos();
        });
        
        $('.map-btn').on('click', function() {
            const mapName = $(this).data('map');
            const mapIndex = videoMaps.findIndex(map => map.name === mapName);
            console.log('METHOD_COMPARISON.JS: Map button clicked:', mapName, mapIndex);
            if (mapIndex !== -1) {
                currentMapIndex = mapIndex;
                updateMapVideos(currentMapIndex);
                setTimeout(playAllVideos, 1000);
            }
        });
        
        // Initialize with first map
        updateMapVideos(0);
        updateStatus('Ready! Click "Play All" to start');
        
        // Auto-start after user interaction
        let userInteracted = false;
        $(document).one('click touchstart', function() {
            userInteracted = true;
            console.log('METHOD_COMPARISON.JS: User interaction detected');
        });
        
        setTimeout(() => {
            if (userInteracted) {
                console.log('METHOD_COMPARISON.JS: Auto-starting videos');
                playAllVideos();
            }
        }, 3000);
        
        console.log('METHOD_COMPARISON.JS: Initialization complete');
    }
    
    // Start initialization
    setTimeout(waitForElements, 500);
}); 