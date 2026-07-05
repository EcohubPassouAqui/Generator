// by rip_sheldoohz
const SOUND_ENABLED = false;
const REDIRECT_URL = 'generator.html';

const fill = document.querySelector('.progress-fill');
const percentEl = document.querySelector('.progress-percent');
const stageEl = document.getElementById('stage-text');
const stageCaptionEl = document.getElementById('stage-caption');
const screen = document.getElementById('loading-screen');
const progressBar = document.getElementById('progress-bar');
const logoWrap = document.querySelector('.logo-wrap');
const successCheck = document.getElementById('success-check');
const timeRemainingEl = document.getElementById('time-remaining');

const stages = [
    { text: 'Inicializando...', target: 20, delay: 400 },
    { text: 'Carregando recursos...', target: 50, delay: 500 },
    { text: 'Preparando interface...', target: 80, delay: 500 },
    { text: 'Finalizando...', target: 99, delay: 400 }
];

const totalDuration = stages.reduce((sum, stage) => sum + stage.delay, 0);
const startTime = performance.now();

function setProgress(value) {
    fill.style.width = value + '%';
    percentEl.textContent = Math.floor(value) + '%';
}

function updateTimeRemaining() {
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(totalDuration - elapsed, 0);
    const seconds = Math.ceil(remaining / 1000);
    timeRemainingEl.textContent = remaining > 0 ? '~' + seconds + 's restante' + (seconds > 1 ? 's' : '') : '';
}

const timeInterval = setInterval(updateTimeRemaining, 200);

function animateProgress(from, to, duration) {
    return new Promise(resolve => {
        const start = performance.now();
        function step(now) {
            const elapsed = now - start;
            const t = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            setProgress(from + (to - from) * eased);
            if (t < 1) {
                requestAnimationFrame(step);
            } else {
                resolve();
            }
        }
        requestAnimationFrame(step);
    });
}

async function runStages() {
    let current = 0;
    for (let i = 0; i < stages.length; i++) {
        const stage = stages[i];
        stageEl.textContent = stage.text;
        stageCaptionEl.textContent = 'Etapa ' + (i + 1) + ' de ' + stages.length;
        await animateProgress(current, stage.target, stage.delay);
        current = stage.target;
    }
}

function playSuccessSound() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.3);
}

function finish() {
    clearInterval(timeInterval);
    stageEl.textContent = 'Concluído';
    stageCaptionEl.textContent = '';
    timeRemainingEl.textContent = '';
    setProgress(100);
    progressBar.classList.add('complete');
    logoWrap.classList.add('complete');
    successCheck.classList.add('show');
    if (SOUND_ENABLED) playSuccessSound();
    setTimeout(() => {
        screen.classList.add('hidden');
        setTimeout(() => {
            window.location.href = REDIRECT_URL;
        }, 600);
    }, 700);
}

let pageLoaded = false;
let stagesDone = false;

function tryFinish() {
    if (pageLoaded && stagesDone) finish();
}

runStages().then(() => {
    stagesDone = true;
    tryFinish();
});

window.addEventListener('load', () => {
    pageLoaded = true;
    tryFinish();
});