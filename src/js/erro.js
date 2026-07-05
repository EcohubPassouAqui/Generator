document.addEventListener('DOMContentLoaded', function () {

  var ERRORS = {
    '403': { title: 'Acesso negado', subtitle: 'Você não tem permissão para acessar este recurso.' },
    '404': { title: 'Página não encontrada', subtitle: 'O recurso que você tentou acessar não existe ou foi movido.' },
    '500': { title: 'Erro interno do servidor', subtitle: 'Algo deu errado do nosso lado. Já estamos verificando.' },
    '503': { title: 'Serviço indisponível', subtitle: 'O sistema está temporariamente fora do ar para manutenção.' }
  };

  function getCode() {
    var params = new URLSearchParams(window.location.search);
    var code = params.get('code');
    return ERRORS[code] ? code : '404';
  }

  function renderCode() {
    var code = getCode();
    var data = ERRORS[code];

    document.body.setAttribute('data-error', code);

    var codeEl = document.getElementById('error-code');
    if (codeEl) {
      codeEl.textContent = code;
      codeEl.setAttribute('data-text', code);
    }

    var layerSpans = document.querySelectorAll('.error-code-layers span');
    layerSpans.forEach(function (span) {
      span.textContent = code;
    });

    var httpEl = document.getElementById('error-http');
    if (httpEl) {
      var dot = httpEl.querySelector('.fb-badge-dot');
      httpEl.textContent = 'HTTP ' + code;
      if (dot) httpEl.prepend(dot);
    }

    var titleEl = document.getElementById('error-title');
    if (titleEl) titleEl.textContent = data.title;

    var subtitleEl = document.getElementById('error-subtitle');
    if (subtitleEl) subtitleEl.textContent = data.subtitle;

    document.title = 'codywas · ' + code;
  }

  function spawnParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    var count = window.innerWidth < 600 ? 16 : 30;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'particle';
      var size = (Math.random() * 2.4 + 1).toFixed(1) + 'px';
      var left = (Math.random() * 100).toFixed(2) + '%';
      var dur = (Math.random() * 10 + 10).toFixed(1) + 's';
      var delay = (-Math.random() * 20).toFixed(1) + 's';
      var drift = (Math.random() * 60 - 30).toFixed(0) + 'px';
      var opac = (Math.random() * .4 + .2).toFixed(2);
      p.style.setProperty('--size', size);
      p.style.left = left;
      p.style.setProperty('--dur', dur);
      p.style.setProperty('--delay', delay);
      p.style.setProperty('--drift', drift);
      p.style.setProperty('--opac', opac);
      frag.appendChild(p);
    }
    container.appendChild(frag);
  }

  function spawnStars() {
    var container = document.getElementById('stars');
    if (!container) return;
    var count = window.innerWidth < 600 ? 30 : 60;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var s = document.createElement('span');
      s.className = 'star';
      var size = (Math.random() * 1.6 + .6).toFixed(1) + 'px';
      var top = (Math.random() * 100).toFixed(2) + '%';
      var left = (Math.random() * 100).toFixed(2) + '%';
      var dur = (Math.random() * 3 + 2).toFixed(1) + 's';
      var delay = (-Math.random() * 5).toFixed(1) + 's';
      var opac = (Math.random() * .5 + .25).toFixed(2);
      s.style.setProperty('--ssize', size);
      s.style.top = top;
      s.style.left = left;
      s.style.setProperty('--sdur', dur);
      s.style.setProperty('--sdelay', delay);
      s.style.setProperty('--sopac', opac);
      frag.appendChild(s);
    }
    container.appendChild(frag);
  }

  function initMouseParallax() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var root = document.documentElement;
    var maxTilt = 6;

    window.addEventListener('mousemove', function (e) {
      var xRatio = e.clientX / window.innerWidth;
      var yRatio = e.clientY / window.innerHeight;

      var tiltY = (xRatio - .5) * maxTilt * 2;
      var tiltX = (yRatio - .5) * -maxTilt * 2;

      root.style.setProperty('--tilt-x', tiltX.toFixed(2) + 'deg');
      root.style.setProperty('--tilt-y', tiltY.toFixed(2) + 'deg');
      root.style.setProperty('--mx', (xRatio * 100).toFixed(2) + '%');
      root.style.setProperty('--my', (yRatio * 100).toFixed(2) + '%');
    }, { passive: true });
  }

  function initGlitch() {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var codeEl = document.getElementById('error-code');
    if (!codeEl) return;

    function triggerGlitch() {
      codeEl.classList.add('is-glitching');
      setTimeout(function () {
        codeEl.classList.remove('is-glitching');
      }, 320);
      var next = Math.random() * 5000 + 4000;
      setTimeout(triggerGlitch, next);
    }

    setTimeout(triggerGlitch, Math.random() * 4000 + 3000);
  }

  function goToPainel() {
    window.location.href = '../../index.html';
  }

  function initBackButton() {
    var btn = document.getElementById('btn-voltar');
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (btn.classList.contains('is-loading')) return;
      btn.classList.add('is-loading');
      setTimeout(goToPainel, 5000);
    });
  }

  renderCode();
  spawnParticles();
  spawnStars();
  initMouseParallax();
  initGlitch();
  initBackButton();

});