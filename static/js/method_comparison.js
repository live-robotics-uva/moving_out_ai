// Method Comparison Videos - Separate module for better debugging
console.log('METHOD_COMPARISON.JS: Loading...');

// Video configuration - moved to global scope to avoid closure issues
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
    },
    {
        name: 'C1003',
        displayName: 'Case 1003',
        videos: {
            mlp: './static/modal_rollout_videos/1003_mlp.mp4',
            dp: './static/modal_rollout_videos/1003_dp.mp4',
            bass: './static/modal_rollout_videos/1003_bass.mp4'
        }
    },
    {
        name: 'C2001',
        displayName: 'Case 2001',
        videos: {
            mlp: './static/modal_rollout_videos/2001_mlp.mp4',
            dp: './static/modal_rollout_videos/2001_dp.mp4',
            bass: './static/modal_rollout_videos/2001_bass.mp4'
        }
    }
];

$(document).ready(function() {
    console.log('METHOD_COMPARISON.JS: Document ready');
    console.log('METHOD_COMPARISON.JS: Global videoMaps:', videoMaps);
    
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
        console.log('METHOD_COMPARISON.JS: videoMaps at binding time:', videoMaps);
        
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
            console.log('METHOD_COMPARISON.JS: Map button clicked for:', mapName);
            console.log('METHOD_COMPARISON.JS: Available maps:', videoMaps.map(m => m.name));
            
            const mapIndex = videoMaps.findIndex(map => map.name === mapName);
            console.log('METHOD_COMPARISON.JS: Found map index:', mapIndex);
            
            if (mapIndex !== -1) {
                currentMapIndex = mapIndex;
                updateMapVideos(currentMapIndex);
                setTimeout(playAllVideos, 1000);
            } else {
                console.error('METHOD_COMPARISON.JS: Map not found:', mapName);
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
    
    // ===============================================
    // Human-AI Collaboration Videos Functionality
    // ===============================================
    
    console.log('METHOD_COMPARISON.JS: Setting up Human-AI collaboration functionality');
    
    // Human-AI video maps configuration
    const humanAiVideoMaps = [
        {
            name: 'C1002',
            displayName: 'Case 1002',
            videos: {
                dp: './static/human_ai_collaboration_videos/1002_dp.mp4',
                bass: './static/human_ai_collaboration_videos/1002_bass.mp4'
            }
        },
        {
            name: 'C2000',
            displayName: 'Case 2000',
            videos: {
                dp: './static/human_ai_collaboration_videos/2000_dp.mp4',
                bass: './static/human_ai_collaboration_videos/2000_bass.mp4'
            }
        },
        {
            name: 'C2006',
            displayName: 'Case 2006',
            videos: {
                dp: './static/human_ai_collaboration_videos/2006_dp.mp4',
                bass: './static/human_ai_collaboration_videos/2006_bass.mp4'
            }
        },
        {
            name: 'C2007',
            displayName: 'Case 2007',
            videos: {
                dp: './static/human_ai_collaboration_videos/2007_dp.mp4',
                bass: './static/human_ai_collaboration_videos/2007_bass.mp4'
            }
        }
    ];
    
    let humanAiCurrentMapIndex = 0;
    
    // Wait for Human-AI elements
    function waitForHumanAiElements() {
        console.log('METHOD_COMPARISON.JS: Waiting for Human-AI elements...');
        
        const dpVideo = document.getElementById('human-ai-video-dp');
        const bassVideo = document.getElementById('human-ai-video-bass');
        const playBtn = document.getElementById('human-ai-play-all-btn');
        const pauseBtn = document.getElementById('human-ai-pause-all-btn');
        const statusElement = document.getElementById('human-ai-video-status');
        
        console.log('METHOD_COMPARISON.JS: Human-AI Element check:', {
            dpVideo: !!dpVideo,
            bassVideo: !!bassVideo,
            playBtn: !!playBtn,
            pauseBtn: !!pauseBtn,
            statusElement: !!statusElement
        });
        
        if (!dpVideo || !bassVideo || !playBtn || !pauseBtn) {
            console.log('METHOD_COMPARISON.JS: Human-AI elements not ready, retrying...');
            setTimeout(waitForHumanAiElements, 1000);
            return;
        }
        
        console.log('METHOD_COMPARISON.JS: All Human-AI elements found, initializing...');
        initializeHumanAiVideoControls(dpVideo, bassVideo, playBtn, pauseBtn, statusElement);
    }
    
    function initializeHumanAiVideoControls(dpVideo, bassVideo, playBtn, pauseBtn, statusElement) {
        console.log('METHOD_COMPARISON.JS: Initializing Human-AI controls...');
        
        const humanAiVideoElements = [dpVideo, bassVideo];
        
        // Update status function
        function updateHumanAiStatus(message) {
            if (statusElement) {
                statusElement.textContent = message;
            }
            console.log('METHOD_COMPARISON.JS: Human-AI Status:', message);
        }
        
        // Play all Human-AI videos function
        function playAllHumanAiVideos() {
            console.log('METHOD_COMPARISON.JS: Playing all Human-AI videos');
            updateHumanAiStatus('Starting videos...');
            
            humanAiVideoElements.forEach(video => {
                video.muted = true;
                video.currentTime = 0;
            });
            
            const playPromises = humanAiVideoElements.map(video => {
                return video.play().catch(e => {
                    console.error('METHOD_COMPARISON.JS: Human-AI Play failed:', e);
                    return null;
                });
            });
            
            Promise.all(playPromises).then(() => {
                console.log('METHOD_COMPARISON.JS: All Human-AI videos playing');
                updateHumanAiStatus('Human-AI collaboration videos playing...');
            }).catch(e => {
                console.error('METHOD_COMPARISON.JS: Failed to start Human-AI videos:', e);
                updateHumanAiStatus('Failed to start videos. Try clicking individual videos first.');
            });
        }
        
        // Pause all Human-AI videos function
        function pauseAllHumanAiVideos() {
            console.log('METHOD_COMPARISON.JS: Pausing all Human-AI videos');
            humanAiVideoElements.forEach(video => {
                video.pause();
            });
            updateHumanAiStatus('Human-AI videos paused');
        }
        
        // Update Human-AI videos for current map
        function updateHumanAiMapVideos(mapIndex) {
            const currentMap = humanAiVideoMaps[mapIndex];
            console.log('METHOD_COMPARISON.JS: Updating Human-AI videos to map:', currentMap.displayName);
            
            updateHumanAiStatus(`Loading ${currentMap.displayName} videos...`);
            
            dpVideo.src = currentMap.videos.dp;
            bassVideo.src = currentMap.videos.bass;
            
            humanAiVideoElements.forEach(video => {
                video.muted = true;
                video.preload = 'metadata';
                video.load();
            });
            
            // Update map selector buttons
            $('.human-ai-map-btn').removeClass('is-primary').addClass('is-light');
            $(`.human-ai-map-btn[data-map="${currentMap.name}"]`).removeClass('is-light').addClass('is-primary');
            
            // Update description
            $('#human-ai-current-map-description').text(`Currently viewing: ${currentMap.displayName}`);
            
            setTimeout(() => {
                updateHumanAiStatus(`${currentMap.displayName} videos ready`);
            }, 1000);
        }
        
        // Bind Human-AI events
        console.log('METHOD_COMPARISON.JS: Binding Human-AI events...');
        
        $(playBtn).on('click', function() {
            console.log('METHOD_COMPARISON.JS: Human-AI Play button clicked');
            playAllHumanAiVideos();
        });
        
        $(pauseBtn).on('click', function() {
            console.log('METHOD_COMPARISON.JS: Human-AI Pause button clicked');
            pauseAllHumanAiVideos();
        });
        
        $('.human-ai-map-btn').on('click', function() {
            const mapName = $(this).data('map');
            console.log('METHOD_COMPARISON.JS: Human-AI Map button clicked for:', mapName);
            
            const mapIndex = humanAiVideoMaps.findIndex(map => map.name === mapName);
            console.log('METHOD_COMPARISON.JS: Found Human-AI map index:', mapIndex);
            
            if (mapIndex !== -1) {
                humanAiCurrentMapIndex = mapIndex;
                updateHumanAiMapVideos(humanAiCurrentMapIndex);
                setTimeout(playAllHumanAiVideos, 1000);
            } else {
                console.error('METHOD_COMPARISON.JS: Human-AI Map not found:', mapName);
            }
        });
        
        // Initialize with first map
        updateHumanAiMapVideos(0);
        updateHumanAiStatus('Ready! Click "Play All" to start Human-AI collaboration comparison');
        
        console.log('METHOD_COMPARISON.JS: Human-AI initialization complete');
    }
    
    // Start Human-AI initialization
    setTimeout(waitForHumanAiElements, 1000);
}); 