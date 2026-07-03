const MUSIC_STORAGE_KEY = 'musicPlayerState';

function readMusicState() {
    try {
        const raw = localStorage.getItem(MUSIC_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch (e) {
        return null;
    }
}

function writeMusicState(state) {
    try {
        localStorage.setItem(MUSIC_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
        return;
    }
}

function initMusicPlayer() {
    const player = document.getElementById('music-player');
    const audio = document.getElementById('bg-audio');
    if (!player || !audio) return;

    const toggleBtn = document.getElementById('music-toggle');
    const volumeBtn = document.getElementById('volume-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const volumePercentEl = document.getElementById('volume-percent');
    const favoriteBtn = document.getElementById('favorite-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const expandBtn = document.getElementById('expand-btn');
    const optionsBtn = document.getElementById('options-btn');
    const progressBarMusic = document.getElementById('music-progress-bar');
    const progressFillMusic = document.getElementById('music-progress-fill');
    const currentTimeEl = document.getElementById('music-current-time');
    const durationEl = document.getElementById('music-duration');
    const statusTextEl = document.getElementById('music-status-text');
    const toast = document.getElementById('music-toast');

    const iconHigh = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
    const iconLow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>';
    const iconMuted = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';

    function updateVolumeIcon(value) {
        volumeBtn.innerHTML = value == 0 ? iconMuted : value < 50 ? iconLow : iconHigh;
    }

    function formatTime(seconds) {
        if (!isFinite(seconds) || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ':' + String(s).padStart(2, '0');
    }

    let lastVolume = volumeSlider.value;
    let isDraggingProgress = false;
    let isFavorite = false;
    let isRepeat = false;
    let isShuffle = false;
    let isCompact = false;
    let toastTimeout = null;

    const saved = readMusicState();
    if (saved) {
        if (typeof saved.volume === 'number') {
            volumeSlider.value = saved.volume;
            audio.volume = saved.volume / 100;
        } else {
            audio.volume = volumeSlider.value / 100;
        }
        isFavorite = !!saved.favorite;
        isRepeat = !!saved.repeat;
        isShuffle = !!saved.shuffle;
        audio.loop = isRepeat;
        favoriteBtn.classList.toggle('active', isFavorite);
        repeatBtn.classList.toggle('active', isRepeat);
        shuffleBtn.classList.toggle('active', isShuffle);

        const applyTime = () => {
            if (typeof saved.currentTime === 'number' && isFinite(saved.currentTime)) {
                audio.currentTime = saved.currentTime;
            }
            if (saved.playing) {
                audio.play().then(() => setPlayingState(true)).catch(() => setPlayingState(false));
            }
        };

        if (audio.readyState >= 1) {
            applyTime();
        } else {
            audio.addEventListener('loadedmetadata', applyTime, { once: true });
        }
    } else {
        audio.volume = volumeSlider.value / 100;
    }

    updateVolumeIcon(volumeSlider.value);
    volumePercentEl.textContent = volumeSlider.value + '%';

    function persistState(extra) {
        const state = {
            volume: Number(volumeSlider.value),
            favorite: isFavorite,
            repeat: isRepeat,
            shuffle: isShuffle,
            playing: !audio.paused,
            currentTime: audio.currentTime || 0
        };
        writeMusicState(Object.assign(state, extra || {}));
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2400);
    }

    function setPlayingState(playing) {
        player.classList.toggle('playing', playing);
        statusTextEl.textContent = playing ? 'Reproduzindo' : 'Pausado';
        toggleBtn.classList.add('bounce');
        setTimeout(() => toggleBtn.classList.remove('bounce'), 260);
        persistState({ playing });
    }

    toggleBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            setPlayingState(true);
        } else {
            audio.pause();
            setPlayingState(false);
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        if (isDraggingProgress) return;
        const percent = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        progressFillMusic.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
        progressBarMusic.setAttribute('aria-valuenow', Math.round(percent));
    });

    audio.addEventListener('ended', () => {
        if (isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else {
            setPlayingState(false);
        }
    });

    setInterval(() => {
        persistState();
    }, 2000);

    window.addEventListener('beforeunload', () => {
        persistState();
    });

    function seekFromEvent(clientX) {
        const rect = progressBarMusic.getBoundingClientRect();
        const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
        progressFillMusic.style.width = (ratio * 100) + '%';
        currentTimeEl.textContent = formatTime(ratio * (audio.duration || 0));
        return ratio;
    }

    progressBarMusic.addEventListener('pointerdown', e => {
        isDraggingProgress = true;
        progressBarMusic.classList.add('dragging');
        seekFromEvent(e.clientX);
        progressBarMusic.setPointerCapture(e.pointerId);
    });

    progressBarMusic.addEventListener('pointermove', e => {
        if (!isDraggingProgress) return;
        seekFromEvent(e.clientX);
    });

    progressBarMusic.addEventListener('pointerup', e => {
        if (!isDraggingProgress) return;
        const ratio = seekFromEvent(e.clientX);
        if (audio.duration) audio.currentTime = ratio * audio.duration;
        isDraggingProgress = false;
        progressBarMusic.classList.remove('dragging');
        persistState();
    });

    progressBarMusic.addEventListener('keydown', e => {
        if (!audio.duration) return;
        if (e.key === 'ArrowRight') audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
        if (e.key === 'ArrowLeft') audio.currentTime = Math.max(audio.currentTime - 5, 0);
        persistState();
    });

    volumeSlider.addEventListener('input', () => {
        audio.volume = volumeSlider.value / 100;
        updateVolumeIcon(volumeSlider.value);
        volumePercentEl.textContent = volumeSlider.value + '%';
        volumeBtn.classList.add('bounce');
        setTimeout(() => volumeBtn.classList.remove('bounce'), 220);
        persistState();
    });

    volumeBtn.addEventListener('click', () => {
        if (audio.volume > 0) {
            lastVolume = volumeSlider.value;
            volumeSlider.value = 0;
            audio.volume = 0;
        } else {
            volumeSlider.value = lastVolume > 0 ? lastVolume : 60;
            audio.volume = volumeSlider.value / 100;
        }
        updateVolumeIcon(volumeSlider.value);
        volumePercentEl.textContent = volumeSlider.value + '%';
        persistState();
    });

    favoriteBtn.addEventListener('click', () => {
        isFavorite = !isFavorite;
        favoriteBtn.classList.toggle('active', isFavorite);
        showToast(isFavorite ? 'Adicionada aos favoritos' : 'Removida dos favoritos');
        persistState();
    });

    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        audio.loop = isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
        showToast(isRepeat ? 'Repetir ativado' : 'Repetir desativado');
        persistState();
    });

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
        showToast(isShuffle ? 'Aleatório ativado' : 'Aleatório desativado');
        persistState();
    });

    expandBtn.addEventListener('click', () => {
        isCompact = !isCompact;
        player.classList.toggle('compact', isCompact);
    });

    optionsBtn.addEventListener('click', () => {
        showToast('Nenhuma opção disponível');
    });

    document.addEventListener('keydown', e => {
        const tag = document.activeElement ? document.activeElement.tagName : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA') return;
        if (e.code === 'Space') {
            e.preventDefault();
            toggleBtn.click();
        }
        if (e.code === 'ArrowUp') {
            e.preventDefault();
            volumeSlider.value = Math.min(Number(volumeSlider.value) + 5, 100);
            volumeSlider.dispatchEvent(new Event('input'));
        }
        if (e.code === 'ArrowDown') {
            e.preventDefault();
            volumeSlider.value = Math.max(Number(volumeSlider.value) - 5, 0);
            volumeSlider.dispatchEvent(new Event('input'));
        }
        if (e.code === 'KeyM') {
            volumeBtn.click();
        }
    });
}

document.addEventListener('DOMContentLoaded', initMusicPlayer);