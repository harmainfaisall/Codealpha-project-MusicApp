const songs = [
    {
        title: "BAIRAN",
        artist: "Banjaare",
        src: "songs/Bairan - Bairan (320 kbps).mp3",
        cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwyKtVHK0ZmXAbf2aSZggklV6hhsR_s8y_ow&s",
        color: "#6c2b91"
    },
    {
        title: "Jo Tum Mere Ho",
        artist: "Anuv Jain",
        src: "songs/Jo Tum Mere Ho Anuv Jain 320 kbps.mp3",
        cover: "https://i.scdn.co/image/ab67616d0000b27372a77d038887cdc425f5ee55",
        color: "#374d75"
    },
    {
        title: "TUM SE HI",
        artist: "Mohit Chauhan",
        src: "songs/Tum Se Hi Jab We Met 320 kbps.mp3",
        cover: "https://images.genius.com/62667f1b93a95247fb37501a4166f39b.1000x1000x1.jpg",
        color: "#093546"
    },
    {
        title: "Tune Jo Na Kaha",
        artist: "Mohit Chauhan",
        src: "songs/Tune Jo Na Kaha (PenduJatt.Com.Se).mp3",
        cover: "https://c.saavncdn.com/978/New-York-Hindi-2009-20190329182537-500x500.jpg",
        color: "#cae630"
    }
];



// DOM Elements
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');

const progressBar = document.getElementById('progress');
const progressWrapper = document.getElementById('progress-wrapper');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');

const volumeBar = document.getElementById('volume');
const volumeWrapper = document.getElementById('volume-wrapper');
const volumeIcon = document.getElementById('volume-icon');

const playlistEl = document.getElementById('playlist');

// Now Playing large
const mainCover = document.getElementById('main-cover');
const mainTitle = document.getElementById('main-title');
const mainArtist = document.getElementById('main-artist');
const bgGradient = document.getElementById('bg-gradient');

// Now Playing small bar
const barCover = document.getElementById('bar-cover');
const barTitle = document.getElementById('bar-title');
const barArtist = document.getElementById('bar-artist');

// State
let songIndex = 1;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Initialize Player
function initPlayer() {
    renderPlaylist();
    loadSong(songs[songIndex]);
    
    // Set initial volume
    audio.volume = 0.5;
    volumeBar.style.width = '50%';

    // Start playing the current song (Sitaare)
    playSong();
}

// Load a given song details
function loadSong(song) {
    mainTitle.innerText = song.title;
    mainArtist.innerText = song.artist;
    mainCover.src = song.cover;
    
    barTitle.innerText = song.title;
    barArtist.innerText = song.artist;
    barCover.src = song.cover;
    barCover.classList.remove('hidden');
    
    audio.src = encodeURI(song.src);
    audio.load();
    bgGradient.style.background = `linear-gradient(135deg, ${song.color} 0%, #121212 100%)`;
    
    updatePlaylistHighlight();
}

// Play Song
function playSong() {
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause-circle"></i>';
    audio.play().catch(() => {
        // Playback may be blocked until user interacts with the page
    });
}

// Pause Song
function pauseSong() {
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play-circle"></i>';
    audio.pause();
}

// Previous Song
function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

// Next Song
function nextSong() {
    if (isShuffle) {
        let newIndex = songIndex;
        while (newIndex === songIndex) {
            newIndex = Math.floor(Math.random() * songs.length);
        }
        songIndex = newIndex;
    } else {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
    }
    loadSong(songs[songIndex]);
    if (isPlaying) playSong();
}

// Format Time (e.g., 2:30)
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Update Progress Bar
function updateProgress(e) {
    const target = e.target || e.srcElement;
    const { duration, currentTime } = target;
    const progressPercent = duration ? (currentTime / duration) * 100 : 0;
    progressBar.style.width = `${progressPercent}%`;
    
    currentTimeEl.innerText = formatTime(currentTime);
    if (duration) {
        totalTimeEl.innerText = formatTime(duration);
    }
}

// Set Progress on click
function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    audio.currentTime = (clickX / width) * duration;
}

// Set Volume
function setVolume(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    let volumePercent = clickX / width;
    
    if (volumePercent < 0) volumePercent = 0;
    if (volumePercent > 1) volumePercent = 1;
    
    audio.volume = volumePercent;
    volumeBar.style.width = `${volumePercent * 100}%`;
    
    updateVolumeIcon();
}

function updateVolumeIcon() {
    if (audio.volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (audio.volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Toggle Mute
function toggleMute() {
    if (audio.volume > 0) {
        audio.dataset.savedVolume = audio.volume;
        audio.volume = 0;
        volumeBar.style.width = '0%';
    } else {
        audio.volume = audio.dataset.savedVolume || 0.5;
        volumeBar.style.width = `${audio.volume * 100}%`;
    }
    updateVolumeIcon();
}

// Render Playlist
function renderPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, index) => {
        const li = document.createElement('li');
        li.classList.add('playlist-item');
        if (index === songIndex) li.classList.add('active');
        
        li.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="playlist-thumb">
            <div class="playlist-info">
                <span class="title">${song.title}</span>
                <span class="artist">${song.artist}</span>
            </div>
        `;
        
        li.addEventListener('click', () => {
            songIndex = index;
            loadSong(songs[songIndex]);
            playSong();
        });
        
        playlistEl.appendChild(li);
    });
}

// Update Highlight in Playlist
function updatePlaylistHighlight() {
    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, index) => {
        if (index === songIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Event Listeners
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('loadedmetadata', updateProgress);
progressWrapper.addEventListener('click', setProgress);

volumeWrapper.addEventListener('click', setVolume);
volumeIcon.addEventListener('click', toggleMute);

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
});

// Autoplay next song when ended
audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

// Initialize
initPlayer();
