// 1. Set the default language (en-GB for English, ms-MY for Malay)
let currentLang = 'en-GB'; 

// 2. DICTIONARY
const translations = {
    en: {
        trending: "Trending songs",
        artist: "Popular artist",
        best25: "Best of 2025",
        album: "Popular album",
        radio: "Radio",
        about: "About us",
        contact: "Contact us",
        langText: "Language",
        enjoy: "Enjoy your music!",
        signup: "Sign Up",
        login: "Login",
        shortmv:"Short MV",
    },
    ms: {
        trending: "Lagu Popular",
        artist: "Artis Popular",
        best25: "Terbaik 2025",
        album: "Album Popular",
        radio: "Radio",
        about: "Tentang kami",
        contact: "Hubungi kami",
        langText: "Bahasa",
        enjoy: "Nikmati muzik anda!",
        signup: "Daftar",
        login: "Log Masuk",
        shortmv:"MV Pendek",
    }
};

// 3. The Clock Function (Handles Date & Time Automatically)
function updateClock() {
    const clockElement = document.getElementById('header-clock');
    if (!clockElement) return;

    const now = new Date();

    // This "Intl" tool automatically translates days and months based on currentLang
    const dateOptions = { 
        weekday: 'long', 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    };
    const dateStr = now.toLocaleDateString(currentLang, dateOptions);
    
    // Time formatting
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    };
    const timeStr = now.toLocaleTimeString(currentLang, timeOptions);

    clockElement.innerHTML = `${dateStr}<br>${timeStr}`;
}

// 4. The Change Language Function
function changeLanguage(lang) {
    //Simpan bahasa dalam browser
    localStorage.setItem('siteLang', lang);

    // Update the language setting for the clock
    currentLang = (lang === 'en') ? 'en-GB' : 'ms-MY';

    // Update all text with data-key
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[lang][key]) {
            el.innerText = translations[lang][key];
        }
    });

    // Update the Search bar placeholder
    const searchInput = document.querySelector('.search-container input');
    if (searchInput) {
        searchInput.placeholder = (lang === 'ms') ? "Apa yang anda mahu cari?..." : "What do you want to search?...";
    }

    // Refresh the clock immediately so it changes language without waiting
    updateClock();

    // Close the dropdown
    document.getElementById('langDropdown').classList.remove('show');
}

const dropdown = document.getElementById('langDropdown');
    if (dropdown) dropdown.classList.remove('show');

// 5. Setup Events & Timers
const langBtn = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');

if (langBtn && langDropdown) {
    langBtn.addEventListener('click', () => {
        langDropdown.classList.toggle('show');
    });
}

// Run clock immediately and then every second
updateClock();
setInterval(updateClock, 1000);


//6. TRENDING//
// Logic untuk Slider (Pergi ke Page 2)
let currentPage = 0;
const musicSlider = document.getElementById('musicSlider');

document.getElementById('nextBtn').onclick = () => {
    currentPage = 1;
    musicSlider.style.transform = `translateX(-100%)`;
};

document.getElementById('prevBtn').onclick = () => {
    currentPage = 0;
    musicSlider.style.transform = `translateX(0%)`;
};


// Kemas kini bar mengikut masa lagu
mainAudio.addEventListener('timeupdate', () => {
    if (mainAudio.duration) {
        const progress = (mainAudio.currentTime / mainAudio.duration) * 100;
        progressBar.value = progress;
        
        // Kemas kini teks masa (optional)
        updateTimer();
    }
});

// Bila user drag bar, tukar masa lagu
progressBar.addEventListener('input', () => {
    const seekTime = (progressBar.value / 100) * mainAudio.duration;
    mainAudio.currentTime = seekTime;
});

function updateTimer() {
    let curMins = Math.floor(mainAudio.currentTime / 60);
    let curSecs = Math.floor(mainAudio.currentTime % 60);
    if (curSecs < 10) curSecs = "0" + curSecs;
    document.getElementById('currentTime').innerText = curMins + ":" + curSecs;
    
    if(!isNaN(mainAudio.duration)) {
        let durMins = Math.floor(mainAudio.duration / 60);
        let durSecs = Math.floor(mainAudio.duration % 60);
        if (durSecs < 10) durSecs = "0" + durSecs;
        document.getElementById('durationTime').innerText = durMins + ":" + durSecs;
    }
}

// LOGIK BARU MUSIC PLAYER (FORWARD, BACKWARD, VOLUME)

// 7. SETUP SENARAI LAGU SECARA AUTOMATIK
// Kod ni akan amik semua lagu yang ada dalam grid "Trending"
const songElements = document.querySelectorAll('.clickable-song');
const songs = Array.from(songElements).map(card => ({
    src: card.getAttribute('data-src'),
    img: card.getAttribute('data-img'),
    title: card.getAttribute('data-title'),
    artist: card.getAttribute('data-artist')
}));

let currentSongIndex = 0;

// 8. FUNGSI UNTUK TUKAR LAGU (LOAD SONG)
function loadSong(index) {
    const song = songs[index];
    const playerFooter = document.getElementById('music-player-footer');
    
    // Kemas kini info pada footer
    document.getElementById('player-img').src = song.img;
    document.getElementById('player-title').innerText = song.title;
    document.getElementById('player-artist').innerText = song.artist;

    // Masukkan sumber lagu dan mainkan
    mainAudio.src = song.src;
    mainAudio.play();
    
    // Munculkan Footer dan tukar icon kepada Pause
    playerFooter.classList.add('active');
    document.getElementById('masterPlay').innerHTML = '<i class="fa fa-pause-circle"></i>';
}

// 9. LOGIK KLIK PADA KAD LAGU (MANUAL CLICK)
document.querySelectorAll('.clickable-song').forEach((card, index) => {
    card.onclick = function() {
        currentSongIndex = index; // Set index lagu yang diklik
        loadSong(currentSongIndex);
    };
});

// 10. BUTANG NEXT (FORWARD)
document.getElementById('nextSong').onclick = () => {
    currentSongIndex = (currentSongIndex + 1) % songs.length; // Pergi lagu depan, kalau habis patah balik ke lagu 1
    loadSong(currentSongIndex);
};

// 11. BUTANG PREVIOUS (BACKWARD)
document.getElementById('prevSong').onclick = () => {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length; // Patah balik lagu belakang
    loadSong(currentSongIndex);
};

// 12. MASTER PLAY / PAUSE
document.getElementById('masterPlay').onclick = () => {
    if (mainAudio.paused) {
        mainAudio.play();
        document.getElementById('masterPlay').innerHTML = '<i class="fa fa-pause-circle"></i>';
    } else {
        mainAudio.pause();
        document.getElementById('masterPlay').innerHTML = '<i class="fa fa-play-circle"></i>';
    }
};

// 17. KAWALAN VOLUME (REAL VOLUME CONTROL)
const volumeBar = document.getElementById('volumeBar');
// Set volume asal ikut slider (contoh 80%)
mainAudio.volume = volumeBar.value / 100;

volumeBar.addEventListener('input', () => {
    mainAudio.volume = volumeBar.value / 100;
});

// 18. AUTO-PLAY LAGU SETERUSNYA
// Apabila lagu habis, dia akan automatik main lagu seterusnya
mainAudio.addEventListener('ended', () => {
    document.getElementById('nextSong').click();
});


// Fungsi Copy to Clipboard
        function copyToClipboard(text, label) {
            navigator.clipboard.writeText(text).then(() => {
                const toast = document.getElementById('copy-toast');
                toast.innerText = label + " copied!";
                toast.classList.add('show');
                
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }

// ==========================================
// 19. FUNGSI COPY TO CLIPBOARD (Untuk Contact Page)
// ==========================================
function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('copy-toast');
        if (toast) {
            toast.innerText = label + " copied!";
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    }).catch(err => console.error('Failed to copy: ', err));
}

document.addEventListener('DOMContentLoaded', () => {
    // Baca bahasa yang disimpan
    const savedLang = localStorage.getItem('siteLang') || 'en';
    
    // Tukar bahasa ikut savedLang
    changeLanguage(savedLang);
});



// 20. FUNGSI CARIAN (SEARCH)
const searchInput = document.querySelector('.search-container input');

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase();
        
        // Ambil semua jenis kad (Lagu Trending, Best of 25, dan MV)
        const allCards = document.querySelectorAll('.song-card, .song-card-v, .mv-card');
        
        allCards.forEach(card => {
            // Ambil tajuk dan artis dari data-attribute atau teks dalam elemen
            const title = card.getAttribute('data-title') || card.querySelector('.s-title')?.innerText || "";
            const artist = card.getAttribute('data-artist') || card.querySelector('.s-artist')?.innerText || "";
            
            const combinedText = (title + " " + artist).toLowerCase();

            // Jika carian sepadan, tunjukkan kad. Jika tidak, sembunyikan.
            if (combinedText.includes(searchTerm)) {
                card.style.display = "block"; // atau "flex" mengikut CSS anda
                card.style.opacity = "1";
            } else {
                card.style.display = "none";
            }
        });

        // (Optional) Sembunyikan tajuk section (H3) jika tiada lagu yang muncul dalam section tersebut
        const sections = document.querySelectorAll('.trending-box');
        sections.forEach(section => {
            const visibleCards = section.querySelectorAll('.song-card[style*="display: block"], .song-card-v[style*="display: block"], .mv-card[style*="display: block"]');
            if (visibleCards.length === 0 && searchTerm !== "") {
                section.style.display = "none";
            } else {
                section.style.display = "block";
            }
        });
    });
}

searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const firstVisibleCard = document.querySelector('.song-card[style*="display: block"], .song-card-v[style*="display: block"]');
        if (firstVisibleCard) {
            firstVisibleCard.click(); // Automatik klik (mainkan) lagu pertama yang muncul
        }
    }
});

//POPULAR ALBUM//
const countryData = {
    'malaysia': [
        { title: 'Rahsia tuhan', artist: 'Noh Salleh', img: 'rahsia.jpeg', src: 'rahsia.mp3' },
        { title: 'Ingat', artist: 'ALYPH', img: 'ingat.jpeg', src: 'ingat.mp3' },
        { title: 'Sentiasa', artist: 'Firdaus Rahmat', img: 'sentiasa.jpg', src: 'sentiasa.mp3' }
    ],
    'indonesia': [
        { title: 'Kota ini tak sama tanpamu', artist: 'Nadhif Basalamah', img: 'nadhif.jpeg', src: 'nadhif.mp3' },
        { title: 'Alamak', artist: 'Rizky Febian & Adrian Khalif', img: 'alamak.jpg', src: 'jiwa.mp3' },
        { title: 'Mangu', artist: 'Fourtwnty', img: 'mangu.jpeg', src: 'mangu.mp3' }
    ],
    'western': [
        { title: 'Lush life', artist: 'Zara Larsson', img: 'lush.jpeg', src: 'lush.mp3' },
        { title: 'Chanel', artist: 'Tyla', img: 'chanel.jpg', src: 'chanel.mp3' },
        { title: 'I thought i saw your face today', artist: 'She & Him', img: 'she.jpeg', src: 'she.mp3' }
    ]
};
// Fungsi utama untuk mainkan muzik
function playMusic(src, title, artist, img) {
    const playerFooter = document.getElementById('music-player-footer');
    const mainAudio = document.getElementById('mainAudio');
    
    // Kemas kini UI Footer
    document.getElementById('player-img').src = img;
    document.getElementById('player-title').innerText = title;
    document.getElementById('player-artist').innerText = artist;

    // Mainkan audio
    mainAudio.src = src;
    mainAudio.play();
    
    // Paparkan footer dan tukar icon
    playerFooter.classList.add('active');
    document.getElementById('masterPlay').innerHTML = '<i class="fa fa-pause-circle"></i>';
}

// Fungsi untuk aktifkan klik pada lagu yang baru muncul (Dynamic)
function initPlayButtons() {
    const songCards = document.querySelectorAll('.clickable-song');
    songCards.forEach(card => {
        card.onclick = function() {
            const src = this.getAttribute('data-src');
            const title = this.getAttribute('data-title');
            const artist = this.getAttribute('data-artist');
            const img = this.getAttribute('data-img');
            
            playMusic(src, title, artist, img);
        };
    });
}
function showCountrySongs(country) {
    const container = document.getElementById('country-songs-container');
    const grid = document.getElementById('songs-grid');
    const countryName = document.getElementById('selected-country-name');
    
    countryName.innerText = "Top 3 Songs - " + country.toUpperCase();
    grid.innerHTML = '';
    
    countryData[country].forEach(song => {
        // Pastikan semua data-src, data-title, data-artist, dan data-img ada di sini
        const songHTML = `
            <div class="song-card-v clickable-song" 
                 data-src="${song.src}" 
                 data-title="${song.title}" 
                 data-artist="${song.artist}" 
                 data-img="${song.img}">
                <img src="${song.img}" alt="cover" onerror="this.src='logo.png'">
                <div class="song-info-v">
                    <p class="s-title">${song.title}</p>
                    <p class="s-artist">${song.artist}</p>
                </div>
            </div>
        `;
        grid.innerHTML += songHTML;
    });

    container.style.display = 'block';
    
    // SANGAT PENTING: Panggil semula fungsi klik selepas HTML baru dijana
    initPlayButtons(); 
}

//POPULAR ARTIST//
let currentIdx = 0;
const cards = document.querySelectorAll('.artist-card-3d');

function updateCarousel() {
    cards.forEach((card, i) => {
        card.classList.remove('active', 'prev', 'next');
        
        if (i === currentIdx) {
            card.classList.add('active');
        } else if (i === (currentIdx - 1 + cards.length) % cards.length) {
            card.classList.add('prev');
        } else if (i === (currentIdx + 1) % cards.length) {
            card.classList.add('next');
        }
    });
}

document.getElementById('nextArtist').onclick = () => {
    currentIdx = (currentIdx + 1) % cards.length;
    updateCarousel();
};

document.getElementById('prevArtist').onclick = () => {
    currentIdx = (currentIdx - 1 + cards.length) % cards.length;
    updateCarousel();
};

// Jalankan fungsi pertama kali
updateCarousel();