var MUSIC_PLAYLIST = [
  {
    nome: 'Gimme Ocean',
    titulo: 'spotify',
    arquivo: 'src/music/GimmeOcean.mp3',
    capa: 'src/music/image/GimmeOcean.jpg'
  },
  {
    nome: 'Gimme Ocean',
    titulo: 'spotify',
    arquivo: 'src/music/battlecry.mp3',
    capa: 'src/music/image/battlecry.jpg'
  },
  {
    nome: 'Gimme Ocean',
    titulo: 'spotify',
    arquivo: 'src/music/Bloom.mp3',
    capa: 'src/music/image/Bloom.jpg'
  },
  {
    nome: 'Gimme Ocean',
    titulo: 'spotify',
    arquivo: 'src/music/Sunset Lover.mp3',
    capa: 'src/music/image/SunsetLover.jpg'
  }
];

(function () {
  var STORAGE_KEY = 'codywas_music_state';
  var SAVE_INTERVAL_MS = 800;

  var SITE_ROOT_URL = (function () {
    var scripts = document.getElementsByTagName('script');
    var thisScriptUrl = '';

    for (var i = 0; i < scripts.length; i++) {
      var absUrl = scripts[i].src || '';
      if (/\/musica\.js(\?.*)?$/.test(absUrl)) {
        thisScriptUrl = absUrl;
        break;
      }
    }

    if (!thisScriptUrl) return '';
    var marker = 'src/js/musica.js';
    var markerIdx = thisScriptUrl.indexOf(marker);
    if (markerIdx !== -1) {
      return thisScriptUrl.slice(0, markerIdx);
    }
    return thisScriptUrl.slice(0, thisScriptUrl.lastIndexOf('/') + 1);
  })();

  function resolvePath(path) {
    if (!path) return path;
    if (/^([a-z]+:)?\/\//i.test(path) || path.charAt(0) === '/') {
      return path;
    }
    if (!SITE_ROOT_URL) return path;
    return SITE_ROOT_URL + path;
  }

  function readState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (err) {
      return null;
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {}
  }

  function formatTime(seconds) {
    if (!isFinite(seconds) || seconds < 0) return '0:00';
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
  }

  document.addEventListener('DOMContentLoaded', function () {
    var player = document.querySelector('.musica');
    if (!player) return;

    var audio = player.querySelector('.musica__audio');
    var toggle = player.querySelector('.musica__toggle');
    var prevBtn = player.querySelector('.musica__prev');
    var nextBtn = player.querySelector('.musica__next');
    var bookmark = player.querySelector('.musica__bookmark');
    var nameEl = player.querySelector('.musica__name');
    var titleEl = player.querySelector('.musica__title');
    var coverEl = player.querySelector('.musica__cover');
    var wave = player.querySelector('.musica__wave');
    var currentTimeEl = player.querySelector('.musica__time--current');
    var durationEl = player.querySelector('.musica__time--duration');

    if (!audio || !toggle || !wave || !MUSIC_PLAYLIST.length) return;

    if (window.lucide) {
      lucide.createIcons();
    }

    function setPlayingUI(isPlaying) {
      player.classList.toggle('is-playing', isPlaying);
      toggle.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Reproduzir');
    }

    function setBookmarkUI(isActive) {
      if (!bookmark) return;
      bookmark.classList.toggle('is-active', isActive);
      bookmark.setAttribute('aria-pressed', String(isActive));
      bookmark.setAttribute('aria-label', isActive ? 'Remover dos favoritos' : 'Favoritar');
    }
    
    var WAVE_BAR_COUNT = 40;
    var waveBars = [];

    (function buildWave() {
      var frag = document.createDocumentFragment();
      for (var i = 0; i < WAVE_BAR_COUNT; i++) {
        var bar = document.createElement('span');
        bar.className = 'musica__wave-bar';
        var seed = Math.sin(i * 12.9898) * 43758.5453;
        var rand = seed - Math.floor(seed);
        var heightPct = 35 + Math.round(rand * 65);
        bar.style.height = heightPct + '%';
        bar.style.setProperty('--bar-i', String(i));
        frag.appendChild(bar);
        waveBars.push(bar);
      }
      wave.appendChild(frag);
    })();

    var isSeeking = false;

    function updateWaveFill(ratio) {
      var filledCount = Math.round(ratio * WAVE_BAR_COUNT);
      for (var i = 0; i < waveBars.length; i++) {
        waveBars[i].classList.toggle('is-played', i < filledCount);
      }
      wave.setAttribute('aria-valuenow', String(Math.round(ratio * 100)));
    }

    function updateProgress() {
      if (isSeeking || !audio.duration) return;
      var ratio = audio.currentTime / audio.duration;
      updateWaveFill(ratio);
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }

    function updateDuration() {
      durationEl.textContent = formatTime(audio.duration);
    }

    function seekToRatio(ratio) {
      ratio = Math.min(1, Math.max(0, ratio));
      if (audio.duration) {
        audio.currentTime = ratio * audio.duration;
      }
      updateWaveFill(ratio);
      currentTimeEl.textContent = formatTime(audio.currentTime);
    }

    function ratioFromEvent(event) {
      var rect = wave.getBoundingClientRect();
      var clientX = event.touches ? event.touches[0].clientX : event.clientX;
      return (clientX - rect.left) / rect.width;
    }

    wave.addEventListener('mousedown', function (event) {
      isSeeking = true;
      seekToRatio(ratioFromEvent(event));
    });

    document.addEventListener('mousemove', function (event) {
      if (!isSeeking) return;
      seekToRatio(ratioFromEvent(event));
    });

    document.addEventListener('mouseup', function () {
      if (!isSeeking) return;
      isSeeking = false;
      persist();
    });

    wave.addEventListener('touchstart', function (event) {
      isSeeking = true;
      seekToRatio(ratioFromEvent(event));
    }, { passive: true });

    wave.addEventListener('touchmove', function (event) {
      if (!isSeeking) return;
      seekToRatio(ratioFromEvent(event));
    }, { passive: true });

    wave.addEventListener('touchend', function () {
      if (!isSeeking) return;
      isSeeking = false;
      persist();
    });

    wave.addEventListener('keydown', function (event) {
      var current = audio.duration ? audio.currentTime / audio.duration : 0;
      if (event.key === 'ArrowRight') {
        seekToRatio(current + 0.02);
        persist();
      } else if (event.key === 'ArrowLeft') {
        seekToRatio(current - 0.02);
        persist();
      }
    });

    var saved = readState();
    var currentIndex = 0;

    if (saved && typeof saved.trackIndex === 'number' && MUSIC_PLAYLIST[saved.trackIndex]) {
      currentIndex = saved.trackIndex;
    }

    function attemptPlay() {
      var playPromise = audio.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(function () {
          setPlayingUI(false);
          var resumeOnInteract = function () {
            audio.play().catch(function () {});
            document.removeEventListener('click', resumeOnInteract);
            document.removeEventListener('keydown', resumeOnInteract);
          };
          document.addEventListener('click', resumeOnInteract, { once: true });
          document.addEventListener('keydown', resumeOnInteract, { once: true });
        });
      }
    }

    function loadTrack(index, autoPlay, resumeTime) {
      currentIndex = ((index % MUSIC_PLAYLIST.length) + MUSIC_PLAYLIST.length) % MUSIC_PLAYLIST.length;
      var track = MUSIC_PLAYLIST[currentIndex];

      audio.src = resolvePath(track.arquivo);
      nameEl.textContent = track.nome || '';
      titleEl.textContent = track.titulo || '';
      updateWaveFill(0);
      currentTimeEl.textContent = '0:00';
      durationEl.textContent = '0:00';

      if (coverEl) {
        if (track.capa) {
          coverEl.src = resolvePath(track.capa);
          coverEl.alt = track.titulo || '';
          coverEl.classList.remove('is-hidden');
        } else {
          coverEl.classList.add('is-hidden');
        }
      }

      if (typeof resumeTime === 'number' && isFinite(resumeTime)) {
        audio.currentTime = resumeTime;
      }

      if (autoPlay) {
        attemptPlay();
      }
    }

    function playNext() {
      loadTrack(currentIndex + 1, true);
      persist();
    }

    function playPrev() {
      loadTrack(currentIndex - 1, true);
      persist();
    }

    var initialTime = saved && typeof saved.time === 'number' ? saved.time : 0;
    loadTrack(currentIndex, false, initialTime);
    setBookmarkUI(!!(saved && saved.bookmarked));

    if (saved && saved.playing) {
      attemptPlay();
    }

    audio.addEventListener('play', function () {
      setPlayingUI(true);
      persist();
    });

    audio.addEventListener('pause', function () {
      setPlayingUI(false);
      persist();
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    audio.addEventListener('error', function () {
      titleEl.textContent = 'Arquivo não encontrado';
      console.error('[musica.js] Não foi possível carregar o áudio em: ' + audio.src + ' — confira se o caminho existe a partir da raiz do site.');
    });

    if (coverEl) {
      coverEl.addEventListener('error', function () {
        console.error('[musica.js] Não foi possível carregar a capa em: ' + coverEl.src + ' — confira se o caminho existe a partir da raiz do site.');
      });
    }

    audio.addEventListener('ended', function () {
      playNext();
    });

    toggle.addEventListener('click', function () {
      if (audio.paused) {
        attemptPlay();
      } else {
        audio.pause();
      }
    });

    if (nextBtn) {
      nextBtn.addEventListener('click', playNext);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', playPrev);
    }

    if (bookmark) {
      bookmark.addEventListener('click', function () {
        setBookmarkUI(!bookmark.classList.contains('is-active'));
        persist();
      });
    }

    function persist() {
      writeState({
        trackIndex: currentIndex,
        time: audio.currentTime || 0,
        playing: !audio.paused,
        bookmarked: !!(bookmark && bookmark.classList.contains('is-active')),
        updatedAt: Date.now()
      });
    }

    setInterval(persist, SAVE_INTERVAL_MS);
    window.addEventListener('beforeunload', persist);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') {
        persist();
      }
    });

    window.addEventListener('storage', function (event) {
      if (event.key !== STORAGE_KEY || !event.newValue) return;
      var state = JSON.parse(event.newValue);

      if (typeof state.trackIndex === 'number' && state.trackIndex !== currentIndex) {
        loadTrack(state.trackIndex, state.playing, state.time);
      } else {
        if (typeof state.time === 'number' && Math.abs(state.time - audio.currentTime) > 1.5) {
          audio.currentTime = state.time;
        }
        if (state.playing && audio.paused) {
          attemptPlay();
        } else if (!state.playing && !audio.paused) {
          audio.pause();
        }
      }

      setBookmarkUI(!!state.bookmarked);
    });

    var isDragging = false;
    var dragOffsetX = 0;
    var dragOffsetY = 0;

    function clampPlayerPosition() {
      var rect = player.getBoundingClientRect();
      var maxLeft = window.innerWidth - rect.width - 8;
      var maxTop = window.innerHeight - rect.height - 8;
      var left = Math.min(Math.max(8, rect.left), Math.max(8, maxLeft));
      var top = Math.min(Math.max(8, rect.top), Math.max(8, maxTop));
      player.style.left = left + 'px';
      player.style.top = top + 'px';
      player.style.bottom = 'auto';
      player.style.right = 'auto';
    }

    player.addEventListener('mousedown', function (event) {
      if (event.target.closest('button') || event.target.closest('.musica__wave')) {
        return;
      }
      isDragging = true;
      player.classList.add('dragging');
      var rect = player.getBoundingClientRect();
      dragOffsetX = event.clientX - rect.left;
      dragOffsetY = event.clientY - rect.top;
      event.preventDefault();
    });

    document.addEventListener('mousemove', function (event) {
      if (!isDragging) return;
      player.style.left = (event.clientX - dragOffsetX) + 'px';
      player.style.top = (event.clientY - dragOffsetY) + 'px';
      player.style.bottom = 'auto';
      player.style.right = 'auto';
    });

    document.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      player.classList.remove('dragging');
      clampPlayerPosition();
    });

    window.addEventListener('resize', clampPlayerPosition);
  });
})();