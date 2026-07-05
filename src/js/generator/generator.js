document.addEventListener('DOMContentLoaded', function () {
  if (window.lucide) {
    lucide.createIcons();
  }

  var views = {
    status: document.getElementById('view-status'),
    gerador: document.getElementById('view-gerador'),
    resultados: document.getElementById('view-resultados')
  };

  var crumbLabels = {
    status: 'Status',
    gerador: 'Gerador',
    resultados: 'Resultados'
  };

  var navButtons = document.querySelectorAll('.sidebar-link[data-view]');
  var topbarCrumbLabel = document.getElementById('topbarCrumbLabel');

  function switchView(viewName) {
    Object.keys(views).forEach(function (key) {
      if (views[key]) views[key].classList.toggle('is-active', key === viewName);
    });
    navButtons.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.view === viewName);
    });
    if (topbarCrumbLabel) topbarCrumbLabel.textContent = crumbLabels[viewName] || 'codywas';
    window.location.hash = viewName;
  }

  navButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { switchView(btn.dataset.view); });
  });

  var sidebarGoGenerate = document.getElementById('sidebarGoGenerate');
  if (sidebarGoGenerate) {
    sidebarGoGenerate.addEventListener('click', function () {
      switchView('gerador');
      var batchInput = document.getElementById('batchCount');
      if (batchInput) batchInput.focus();
    });
  }

  var dismissTipBtn = document.getElementById('dismissTipBtn');
  if (dismissTipBtn) {
    dismissTipBtn.addEventListener('click', function (e) {
      var card = e.target.closest('.sidebar-card');
      if (card) card.style.display = 'none';
    });
  }

  var resultsCountCrumb = document.getElementById('resultsCount');
  var sidebarResultsBadge = document.getElementById('sidebarResultsBadge');
  if (resultsCountCrumb && sidebarResultsBadge) {
    var badgeObserver = new MutationObserver(function () {
      sidebarResultsBadge.textContent = resultsCountCrumb.textContent;
    });
    badgeObserver.observe(resultsCountCrumb, { childList: true, characterData: true, subtree: true });
  }

  var initialView = window.location.hash.replace('#', '');
  if (views[initialView]) {
    switchView(initialView);
  }

  var UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var LOWER = 'abcdefghijklmnopqrstuvwxyz';
  var DIGITS = '0123456789';
  var SYMBOLS = '!@#$%^&*_-+=?';
  var AMBIGUOUS = '0O1lI';
  var OFFENSIVE = ['merda', 'porra', 'buceta', 'puta', 'caralho', 'fdp', 'shit', 'fuck', 'bitch', 'cunt', 'asshole'];
  var SYLL_OPEN = ['ba', 'ka', 'da', 'ga', 'ma', 'na', 'ra', 'sa', 'ta', 'va', 'lo', 'mo', 'ro', 'zo', 'fe', 'ne', 're', 'se', 'ki', 'ri', 'shi', 'zu', 'xu', 'vy', 'ny'];
  var SYLL_CLOSE = ['n', 'r', 'x', 'th', 'sh', 'k', 'z', ''];

  var PRESETS = {
    fraca: { length: 8, upper: false, numbers: true, symbols: false },
    media: { length: 12, upper: true, numbers: true, symbols: false },
    forte: { length: 18, upper: true, numbers: true, symbols: true },
    extrema: { length: 32, upper: true, numbers: true, symbols: true }
  };

  var state = {
    userStyle: 'wordnum',
    userNumbers: true,
    userCapitalize: true,
    userNoRepeat: false,
    userNoDupe: true,
    userSource: 'api',
    separator: '',
    passUpper: true,
    passNumbers: true,
    passSymbols: true,
    passAmbiguous: false,
    passOnlyLetters: false,
    passOnlyNumbers: false,
    passSource: 'api',
    filterOffensive: true,
    sort: 'new',
    cancelRequested: false
  };

  var apiHealth = {
    randomuser: null,
    dinopass: null,
    passwordwolf: null,
    localFallback: false
  };

  var usedUsernames = {};
  var userLengthHistory = [];
  var batchHistory = [];
  var strengthHistory = [];
  var selectedIds = {};
  var nextId = 1;

  var el = {};
  [
    'baseWord', 'suffixWord', 'prefixWord', 'userLength', 'userLengthNum',
    'userLengthBars', 'passLengthBars',
    'passLength', 'passLengthNum', 'batchCount', 'batchCountNum',
    'userNumbersSwitch', 'userCapitalizeSwitch', 'userNoRepeatSwitch', 'userNoDupeSwitch',
    'passUpperSwitch', 'passNumbersSwitch', 'passSymbolsSwitch', 'passAmbiguousSwitch',
    'passOnlyLettersSwitch', 'passOnlyNumbersSwitch',
    'filterOffensiveSwitch',
    'userStyleSelect', 'userSourceSelect', 'passSourceSelect', 'sepSelect', 'sortSelect', 'exportSelect',
    'generateBtn', 'generateBtnLabel', 'cancelBtn', 'clearAllResultsBtn', 'copyAllBtn', 'copyUsersBtn', 'copyPassBtn',
    'resultsList', 'resultsEmpty', 'resultsCount', 'resultsSearch', 'toast',
    'strengthBars', 'strengthLabel', 'entropyValue',
    'progressWrap', 'progressFill', 'progressLabel',
    'userProgressFill', 'userProgressLabel', 'passProgressFill', 'passProgressLabel',
    'userCardStatus', 'passCardStatus', 'batchCardStatus',
    'userBarChart', 'userGraphValue',
    'statTotal', 'statLastBatch', 'statStrength', 'statAvgTime', 'statCopies',
    'statusDot', 'statusLabel',
    'passPreviewBox', 'presetBtns',
    'passMinBtn', 'passMaxBtn', 'passRandomBtn',
    'saveFavoriteBtn', 'loadFavoriteBtn', 'deletePresetBtn', 'resetDefaultsBtn',
    'presetNameInput', 'presetSelect', 'presetSelectMenu', 'presetSelectEmpty',
    'historyList', 'historyCount', 'clearHistoryBtn',
    'cursorGlow',
    'selectAllCheck', 'bulkBar', 'bulkCount', 'bulkCopyBtn', 'bulkFavBtn', 'bulkDeleteBtn',
    'apiDotRandomUser', 'apiDotDinopass', 'apiDotPasswordWolf', 'apiDotLocal',
    'apiStatusRandomUser', 'apiStatusDinopass', 'apiStatusPasswordWolf', 'apiStatusLocal',
    'lineChartSvg', 'lineChartEmpty', 'lineChartAxis', 'heroCurrentValue',
    'strengthChartSvg', 'strengthChartEmpty', 'strengthGraphValue',
    'batchLoadingOverlay', 'batchLoadingTimer', 'batchUnlockBtn'
  ].forEach(function (id) {
    el[id] = document.getElementById(id);
  });

  el.strengthBars = document.querySelectorAll('#strengthBars .strength-bar');
  el.presetBtns = document.querySelectorAll('.preset-btn[data-preset]');

  var generatedAccounts = [];
  var totalGenerated = 0;
  var totalCopies = 0;
  var genTimes = [];
  var currentPage = 1;
  var pageSize = 10;

  function randomInt(max) {
    if (window.crypto && window.crypto.getRandomValues) {
      var buf = new Uint32Array(1);
      window.crypto.getRandomValues(buf);
      return buf[0] % max;
    }
    return Math.floor(Math.random() * max);
  }

  function randomChar(chars) {
    return chars.charAt(randomInt(chars.length));
  }

  function stripAmbiguous(chars) {
    var result = '';
    for (var i = 0; i < chars.length; i++) {
      if (AMBIGUOUS.indexOf(chars[i]) === -1) {
        result += chars[i];
      }
    }
    return result || chars;
  }

  function capitalize(word) {
    if (!word) return word;
    if (!state.userCapitalize) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function sanitizeBase(word) {
    return (word || '').replace(/[^a-zA-Z0-9]/g, '');
  }

  function removeRepeats(word) {
    var result = '';
    for (var i = 0; i < word.length; i++) {
      if (word[i] !== word[i - 1]) result += word[i];
    }
    return result || word;
  }

  function containsOffensive(word) {
    var lower = word.toLowerCase();
    return OFFENSIVE.some(function (bad) {
      return lower.indexOf(bad) !== -1;
    });
  }

  function syntheticWord(minLen) {
    var word = '';
    var guard = 0;
    while (word.length < (minLen || 5) && guard < 12) {
      word += SYLL_OPEN[randomInt(SYLL_OPEN.length)] + SYLL_CLOSE[randomInt(SYLL_CLOSE.length)];
      guard++;
    }
    if (state.filterOffensive && containsOffensive(word) && guard < 12) {
      return syntheticWord(minLen);
    }
    return word;
  }

  function bindRangeAndNumber(range, number, onChange) {
    function sync(value) {
      value = Math.max(parseInt(range.min, 10), Math.min(parseInt(range.max, 10), value));
      range.value = value;
      number.value = value;
      if (onChange) onChange(value);
    }
    range.addEventListener('input', function () { sync(parseInt(range.value, 10)); });
    number.addEventListener('input', function () {
      var v = parseInt(number.value, 10);
      if (!isNaN(v)) sync(v);
    });
    number.addEventListener('blur', function () {
      var v = parseInt(number.value, 10);
      if (isNaN(v)) sync(parseInt(range.value, 10));
    });
    return sync;
  }

  function initBarSlider(container, min, max, getValue, onPick) {
    if (!container) return null;
    var count = max - min + 1;
    var ticks = [];

    for (var i = 0; i < count; i++) {
      var tick = document.createElement('div');
      tick.className = 'bar-slider-tick';
      container.appendChild(tick);
      ticks.push(tick);
    }

    function render() {
      var value = getValue();
      var activeIndex = value - min;
      ticks.forEach(function (tick, i) {
        tick.classList.remove('is-filled', 'is-current');
        if (i === activeIndex) {
          tick.classList.add('is-current');
        } else if (i < activeIndex) {
          tick.classList.add('is-filled');
          tick.style.height = (30 + (i / count) * 55) + '%';
        } else {
          tick.style.height = '28%';
        }
      });
    }

    function pickFromClientX(clientX) {
      var rect = container.getBoundingClientRect();
      var ratio = (clientX - rect.left) / rect.width;
      ratio = Math.max(0, Math.min(1, ratio));
      var value = Math.round(min + ratio * (max - min));
      onPick(value);
      render();
    }

    var dragging = false;

    container.addEventListener('pointerdown', function (e) {
      dragging = true;
      container.setPointerCapture(e.pointerId);
      pickFromClientX(e.clientX);
    });
    container.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      pickFromClientX(e.clientX);
    });
    container.addEventListener('pointerup', function (e) {
      dragging = false;
      container.releasePointerCapture(e.pointerId);
    });
    container.addEventListener('pointercancel', function () {
      dragging = false;
    });

    return { render: render };
  }

  var userLengthBarSlider = null;
  var passLengthBarSlider = null;

  var userLengthSync = bindRangeAndNumber(el.userLength, el.userLengthNum, function (v) {
    updateUserGraph(v);
    if (userLengthBarSlider) userLengthBarSlider.render();
  });

  var passLengthSync = bindRangeAndNumber(el.passLength, el.passLengthNum, function () {
    clearPresetActive();
    updateStrengthPreview();
    if (passLengthBarSlider) passLengthBarSlider.render();
  });

  bindRangeAndNumber(el.batchCount, el.batchCountNum, function (v) {});

  userLengthBarSlider = initBarSlider(
    el.userLengthBars,
    parseInt(el.userLength.min, 10),
    parseInt(el.userLength.max, 10),
    function () { return parseInt(el.userLength.value, 10); },
    function (value) { userLengthSync(value); }
  );

  passLengthBarSlider = initBarSlider(
    el.passLengthBars,
    parseInt(el.passLength.min, 10),
    parseInt(el.passLength.max, 10),
    function () { return parseInt(el.passLength.value, 10); },
    function (value) { passLengthSync(value); }
  );

  if (userLengthBarSlider) userLengthBarSlider.render();
  if (passLengthBarSlider) passLengthBarSlider.render();

  function bindSwitch(btn, key) {
    if (!btn) return;
    btn.addEventListener('click', function () {
      btn.classList.add('is-popping');
      setTimeout(function () { btn.classList.remove('is-popping'); }, 220);
      btn.classList.toggle('is-on');
      state[key] = btn.classList.contains('is-on');
      updateStrengthPreview();
    });
  }

  bindSwitch(el.userNumbersSwitch, 'userNumbers');
  bindSwitch(el.userCapitalizeSwitch, 'userCapitalize');
  bindSwitch(el.userNoRepeatSwitch, 'userNoRepeat');
  bindSwitch(el.userNoDupeSwitch, 'userNoDupe');
  bindSwitch(el.passUpperSwitch, 'passUpper');
  bindSwitch(el.passNumbersSwitch, 'passNumbers');
  bindSwitch(el.passSymbolsSwitch, 'passSymbols');
  bindSwitch(el.passAmbiguousSwitch, 'passAmbiguous');
  bindSwitch(el.passOnlyLettersSwitch, 'passOnlyLetters');
  bindSwitch(el.passOnlyNumbersSwitch, 'passOnlyNumbers');
  bindSwitch(el.filterOffensiveSwitch, 'filterOffensive');

  function clearPresetActive() {
    el.presetBtns.forEach(function (b) { b.classList.remove('is-active'); });
  }

  el.presetBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var preset = PRESETS[btn.getAttribute('data-preset')];
      if (!preset) return;
      clearPresetActive();
      btn.classList.add('is-active');

      passLengthSync(preset.length);

      setSwitchState(el.passUpperSwitch, 'passUpper', preset.upper);
      setSwitchState(el.passNumbersSwitch, 'passNumbers', preset.numbers);
      setSwitchState(el.passSymbolsSwitch, 'passSymbols', preset.symbols);

      updateStrengthPreview();
    });
  });

  function setSwitchState(btn, key, value) {
    if (!btn) return;
    if (value) {
      btn.classList.add('is-on');
    } else {
      btn.classList.remove('is-on');
    }
    state[key] = value;
  }

  if (el.passMinBtn) {
    el.passMinBtn.addEventListener('click', function () {
      clearPresetActive();
      passLengthSync(parseInt(el.passLength.min, 10));
      updateStrengthPreview();
    });
  }

  if (el.passMaxBtn) {
    el.passMaxBtn.addEventListener('click', function () {
      clearPresetActive();
      passLengthSync(parseInt(el.passLength.max, 10));
      updateStrengthPreview();
    });
  }

  if (el.passRandomBtn) {
    el.passRandomBtn.addEventListener('click', function () {
      clearPresetActive();
      var min = parseInt(el.passLength.min, 10);
      var max = parseInt(el.passLength.max, 10);
      var value = min + randomInt(max - min + 1);
      passLengthSync(value);
      updateStrengthPreview();
    });
  }

  function setupSelect(wrap, stateKey, onSelect) {
    if (!wrap) return;
    var btn = wrap.querySelector('.select-btn');
    var options = wrap.querySelectorAll('.select-option');

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelectorAll('.select-wrap.is-open').forEach(function (w) {
        if (w !== wrap) w.classList.remove('is-open');
      });
      wrap.classList.toggle('is-open');
    });

    options.forEach(function (opt) {
      opt.addEventListener('click', function () {
        options.forEach(function (o) { o.classList.remove('is-active'); });
        opt.classList.add('is-active');
        btn.querySelector('span').textContent = opt.textContent;
        if (stateKey) state[stateKey] = opt.getAttribute('data-value');
        wrap.classList.remove('is-open');
        if (onSelect) onSelect(opt.getAttribute('data-value'));
      });
    });
  }

  setupSelect(el.userStyleSelect, 'userStyle');
  setupSelect(el.userSourceSelect, 'userSource');
  setupSelect(el.passSourceSelect, 'passSource');
  setupSelect(el.sepSelect, 'separator');
  setupSelect(el.sortSelect, 'sort', function () {
    currentPage = 1;
    renderResults();
  });
  setupSelect(el.exportSelect, null, function (value) {
    if (value) exportResults(value);
    el.exportSelect.querySelector('.select-btn span').textContent = 'Exportar';
  });

  document.addEventListener('click', function () {
    document.querySelectorAll('.select-wrap.is-open').forEach(function (w) {
      w.classList.remove('is-open');
    });
  });

  document.addEventListener('mousemove', function (e) {
    if (el.cursorGlow) {
      el.cursorGlow.style.left = e.clientX + 'px';
      el.cursorGlow.style.top = e.clientY + 'px';
      el.cursorGlow.classList.add('is-visible');
    }
  });

  document.addEventListener('mouseleave', function () {
    if (el.cursorGlow) el.cursorGlow.classList.remove('is-visible');
  });

  /* ===== Gráfico "Distribuição de comprimento" — corrigido =====
     Bug anterior: cada evento de input do slider empurrava um novo
     valor no histórico, então arrastar o controle gerava dezenas de
     entradas repetidas ou quase idênticas (10, 12, 12, 12, 12...),
     lotando o gráfico com barras redundantes e ilegíveis.
     Agora: só registramos uma entrada quando o valor efetivamente
     muda em relação ao último valor salvo, então o gráfico mostra
     a real progressão de valores escolhidos, sem repetição. */
  function updateUserGraph(currentLength) {
    var last = userLengthHistory[userLengthHistory.length - 1];
    if (last !== currentLength) {
      userLengthHistory.push(currentLength);
      if (userLengthHistory.length > 12) userLengthHistory.shift();
    }
    renderBarChart(el.userBarChart, userLengthHistory, 24);
    el.userGraphValue.textContent = currentLength + ' caracteres';
  }

  function renderBarChart(container, values, minMax) {
    if (!container) return;
    container.innerHTML = '';
    if (!values.length) {
      var empty = document.createElement('div');
      empty.className = 'bar-chart-empty';
      empty.textContent = 'sem dados ainda';
      container.appendChild(empty);
      return;
    }

    // Escala em relação ao range real dos valores já gerados, não ao
    // máximo absoluto do slider (minMax). Isso evita que diferenças
    // pequenas entre valores (ex: 9 vs 10) fiquem visualmente
    // imperceptíveis quando o slider vai até 24 ou 48.
    var dataMax = Math.max.apply(null, values);
    var dataMin = Math.min.apply(null, values);
    var range = dataMax - dataMin;

    values.forEach(function (val, i) {
      var col = document.createElement('div');
      col.className = 'bar-chart-col';
      if (i === values.length - 1) col.classList.add('is-current');

      var heightPct;
      if (range === 0) {
        // Todos os valores são iguais (inclui o caso de só 1 barra):
        // usa uma altura fixa e legível em vez de escalar contra o
        // máximo do slider, que deixava a barra gigante e sem contexto.
        heightPct = 55;
      } else {
        // Escala entre 25% (menor valor) e 100% (maior valor) do range
        // real, então toda variação nos dados fica visível.
        heightPct = 25 + ((val - dataMin) / range) * 75;
      }
      col.style.height = heightPct + '%';

      var tip = document.createElement('span');
      tip.className = 'bar-chart-tip';
      tip.textContent = val;
      col.appendChild(tip);
      container.appendChild(col);
    });
  }

  var SVG_NS = 'http://www.w3.org/2000/svg';

  function svgEl(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (key) {
      node.setAttribute(key, attrs[key]);
    });
    return node;
  }

  function buildLinePath(points, width, height, padding) {
    if (points.length < 2) return { line: '', area: '' };
    var maxVal = Math.max.apply(null, points.concat([1]));
    var minVal = Math.min.apply(null, points.concat([0]));
    var range = maxVal - minVal || 1;
    var stepX = (width - padding * 2) / (points.length - 1);

    var coords = points.map(function (val, i) {
      var x = padding + i * stepX;
      var y = padding + (1 - (val - minVal) / range) * (height - padding * 2);
      return [x, y];
    });

    var line = 'M ' + coords[0][0] + ' ' + coords[0][1];
    for (var i = 1; i < coords.length; i++) {
      var prev = coords[i - 1];
      var curr = coords[i];
      var midX = (prev[0] + curr[0]) / 2;
      line += ' C ' + midX + ' ' + prev[1] + ', ' + midX + ' ' + curr[1] + ', ' + curr[0] + ' ' + curr[1];
    }

    var area = line + ' L ' + coords[coords.length - 1][0] + ' ' + (height - padding) +
      ' L ' + coords[0][0] + ' ' + (height - padding) + ' Z';

    return { line: line, area: area, coords: coords };
  }

  function renderLineChart(svg, emptyEl, values, opts) {
    if (!svg) return;
    opts = opts || {};
    var width = opts.width || 760;
    var height = opts.height || 200;
    var padding = opts.padding || 18;

    svg.innerHTML = '';

    if (values.length === 0) {
      if (emptyEl) emptyEl.classList.add('is-visible');
      return;
    }
    if (emptyEl) emptyEl.classList.remove('is-visible');

    var plotValues = values.length === 1 ? [values[0], values[0]] : values;
    var built = buildLinePath(plotValues, width, height, padding);

    var gridCount = 4;
    for (var g = 0; g <= gridCount; g++) {
      var gy = padding + (g / gridCount) * (height - padding * 2);
      svg.appendChild(svgEl('line', {
        x1: padding, x2: width - padding, y1: gy, y2: gy,
        class: 'status-grid-line'
      }));
    }

    var gradientId = 'lineGrad_' + Math.random().toString(36).slice(2, 8);
    var defs = svgEl('defs', {});
    var gradient = svgEl('linearGradient', { id: gradientId, x1: '0', y1: '0', x2: '0', y2: '1' });
    gradient.appendChild(svgEl('stop', { offset: '0%', class: 'status-grad-start' }));
    gradient.appendChild(svgEl('stop', { offset: '100%', class: 'status-grad-end' }));
    defs.appendChild(gradient);
    svg.appendChild(defs);

    svg.appendChild(svgEl('path', { d: built.area, fill: 'url(#' + gradientId + ')', class: 'status-area-path' }));
    svg.appendChild(svgEl('path', { d: built.line, class: 'status-line-path' }));

    built.coords.forEach(function (pt, i) {
      var isLast = i === built.coords.length - 1;
      if (values.length === 1 && i === 0) return;
      svg.appendChild(svgEl('circle', {
        cx: pt[0], cy: pt[1], r: isLast ? 4.5 : 3,
        class: isLast ? 'status-line-dot is-current' : 'status-line-dot'
      }));
    });
  }

  function updateLineChartAxis(count) {
    if (!el.lineChartAxis) return;
    el.lineChartAxis.innerHTML = '';
    if (count < 1) return;
    if (count === 1) {
      var only = document.createElement('span');
      only.textContent = 'Leva 1';
      el.lineChartAxis.appendChild(only);
      return;
    }
    var labels = count <= 6 ? count : 6;
    for (var i = 0; i < labels; i++) {
      var idx = Math.round((i / (labels - 1)) * (count - 1)) + 1;
      var span = document.createElement('span');
      span.textContent = 'Leva ' + idx;
      el.lineChartAxis.appendChild(span);
    }
  }

  function updateStatusGraphs() {
    renderLineChart(el.lineChartSvg, el.lineChartEmpty, batchHistory, { width: 760, height: 200, padding: 18 });
    updateLineChartAxis(batchHistory.length);
    if (el.heroCurrentValue) {
      el.heroCurrentValue.textContent = batchHistory.length ? batchHistory[batchHistory.length - 1] : '0';
    }

    renderLineChart(el.strengthChartSvg, el.strengthChartEmpty, strengthHistory, { width: 340, height: 130, padding: 14 });
    if (el.strengthGraphValue) {
      el.strengthGraphValue.textContent = strengthHistory.length
        ? strengthMeta(strengthHistory[strengthHistory.length - 1]).label
        : '—';
    }
  }

  function fetchWithTimeout(url, ms) {
    var controller = new AbortController();
    var timer = setTimeout(function () { controller.abort(); }, ms || 5000);
    return fetch(url, { signal: controller.signal }).finally(function () {
      clearTimeout(timer);
    });
  }

  function setApiHealth(key, online) {
    apiHealth[key] = online;
    var dotMap = {
      randomuser: el.apiDotRandomUser,
      dinopass: el.apiDotDinopass,
      passwordwolf: el.apiDotPasswordWolf,
      localFallback: el.apiDotLocal
    };
    var statusMap = {
      randomuser: el.apiStatusRandomUser,
      dinopass: el.apiStatusDinopass,
      passwordwolf: el.apiStatusPasswordWolf,
      localFallback: el.apiStatusLocal
    };
    var dot = dotMap[key];
    var statusText = statusMap[key];
    if (dot) {
      dot.classList.remove('is-online', 'is-offline', 'is-pending');
      dot.classList.add(online ? 'is-online' : 'is-offline');
    }
    if (statusText) {
      statusText.textContent = online ? 'online' : 'indisponível';
    }
    refreshGlobalStatus();
  }

  function refreshGlobalStatus() {
    var anyOffline = [apiHealth.randomuser, apiHealth.dinopass, apiHealth.passwordwolf].some(function (v) {
      return v === false;
    });
    if (anyOffline && !document.body.classList.contains('is-generating')) {
      el.statusDot.classList.add('has-warning');
    } else {
      el.statusDot.classList.remove('has-warning');
    }
  }

  async function fetchRealName() {
    try {
      var res = await fetchWithTimeout('https://randomuser.me/api/?inc=name&noinfo', 5000);
      if (!res.ok) throw new Error('randomuser falhou');
      var data = await res.json();
      setApiHealth('randomuser', true);
      var name = data.results[0].name;
      return sanitizeBase(name.first + name.last);
    } catch (e) {
      setApiHealth('randomuser', false);
      return null;
    }
  }

  async function fetchApiPassword(length) {
    try {
      var params = [
        'length=' + length,
        'upper=' + (state.passUpper ? 'on' : 'off'),
        'special=' + (state.passSymbols ? 'on' : 'off'),
        'exclude_similar_characters=' + (state.passAmbiguous ? 'on' : 'off')
      ].join('&');
      var res = await fetchWithTimeout('https://passwordwolf.com/api/?' + params, 5000);
      if (!res.ok) throw new Error('passwordwolf falhou');
      var data = await res.json();
      setApiHealth('passwordwolf', true);
      return data[0].password;
    } catch (e) {
      setApiHealth('passwordwolf', false);
      try {
        var res2 = await fetchWithTimeout('https://www.dinopass.com/password/strong', 5000);
        if (!res2.ok) throw new Error('dinopass falhou');
        var text = await res2.text();
        setApiHealth('dinopass', true);
        return text.replace(/"/g, '');
      } catch (e2) {
        setApiHealth('dinopass', false);
        return null;
      }
    }
  }

  function buildUsernameCore(length) {
    var style = state.userStyle;
    var base = sanitizeBase(el.baseWord.value.trim());
    var core = '';

    if (base) {
      if (style === 'random') {
        core = capitalize(base);
      } else if (style === 'camel') {
        core = capitalize(base) + capitalize(syntheticWord(4));
      } else {
        core = capitalize(base);
        while (core.length < length) {
          core += syntheticWord(4);
        }
      }
    } else if (style === 'camel') {
      core = capitalize(syntheticWord(4)) + capitalize(syntheticWord(4));
    } else if (style === 'random') {
      core = randomChar(UPPER);
      while (core.length < length) {
        core += randomChar(UPPER + LOWER);
      }
    } else {
      core = capitalize(syntheticWord(4));
      while (core.length < length) {
        core += syntheticWord(4);
      }
    }

    setApiHealth('localFallback', true);
    return core;
  }

  async function resolveUsernameCore(length) {
    var hasBaseWord = sanitizeBase(el.baseWord.value.trim()).length > 0;
    if (!hasBaseWord && (state.userSource === 'api' || state.userStyle === 'realname')) {
      var realName = await fetchRealName();
      if (realName) return realName;
    }
    return buildUsernameCore(length);
  }

  async function generateUsername() {
    var length = parseInt(el.userLength.value, 10);
    var sep = state.separator || '';
    var suffix = sanitizeBase(el.suffixWord.value.trim());
    var prefix = sanitizeBase(el.prefixWord.value.trim());

    var username;
    var attempts = 0;

    do {
      attempts++;

      var reserved = (sep ? sep.length : 0) + suffix.length + prefix.length + (state.userNumbers ? 2 : 0);
      var coreTarget = Math.max(2, length - reserved);
      var core = (await resolveUsernameCore(coreTarget)).slice(0, coreTarget);

      if (state.userNoRepeat) core = removeRepeats(core);
      if (!core) core = syntheticWord(coreTarget);

      var numbers = '';
      if (state.userNumbers) {
        for (var d = 0; d < 2; d++) numbers += randomChar(DIGITS);
      }

      var parts = [];
      if (prefix) parts.push(prefix);
      parts.push(core);
      if (numbers) parts.push(numbers);
      if (suffix) parts.push(suffix);

      username = parts.join(sep).slice(0, Math.max(length, 4));

      if (state.filterOffensive && containsOffensive(username) && attempts < 10) {
        username = null;
        continue;
      }

      if (state.userNoDupe && usedUsernames[username] && attempts < 15) {
        username = null;
        continue;
      }
    } while (!username && attempts < 15);

    username = username || (syntheticWord(6) + randomInt(9999));
    usedUsernames[username] = true;
    return username;
  }

  function buildPasswordPool() {
    var pool = LOWER;
    var required = [];

    if (state.passOnlyNumbers) {
      return { pool: DIGITS, required: [] };
    }

    if (state.passOnlyLetters) {
      pool = LOWER;
      if (state.passUpper) {
        pool += UPPER;
        required.push(randomChar(UPPER));
      }
      if (state.passAmbiguous) pool = stripAmbiguous(pool);
      return { pool: pool, required: required };
    }

    if (state.passUpper) {
      pool += UPPER;
      required.push(randomChar(UPPER));
    }
    if (state.passNumbers) {
      pool += DIGITS;
      required.push(randomChar(DIGITS));
    }
    if (state.passSymbols) {
      pool += SYMBOLS;
      required.push(randomChar(SYMBOLS));
    }

    if (state.passAmbiguous) {
      pool = stripAmbiguous(pool);
      required = required.map(function (ch) {
        return AMBIGUOUS.indexOf(ch) === -1 ? ch : randomChar(LOWER);
      });
    }

    return { pool: pool, required: required };
  }

  function generatePasswordLocal(length) {
    var built = buildPasswordPool();
    var pool = built.pool;
    var passwordChars = built.required.slice();

    while (passwordChars.length < length) {
      passwordChars.push(randomChar(pool));
    }

    for (var i = passwordChars.length - 1; i > 0; i--) {
      var j = randomInt(i + 1);
      var tmp = passwordChars[i];
      passwordChars[i] = passwordChars[j];
      passwordChars[j] = tmp;
    }

    setApiHealth('localFallback', true);
    return passwordChars.slice(0, length).join('');
  }

  async function generatePassword() {
    var length = parseInt(el.passLength.value, 10);

    if (state.passSource === 'api') {
      var apiPass = await fetchApiPassword(length);
      if (apiPass && apiPass.length >= Math.min(length, 4)) {
        return (apiPass.length >= length ? apiPass.slice(0, length) : apiPass + generatePasswordLocal(length - apiPass.length));
      }
    }

    return generatePasswordLocal(length);
  }

  function scorePassword(password) {
    var length = password.length;
    var hasUpper = /[A-Z]/.test(password);
    var hasLower = /[a-z]/.test(password);
    var hasDigit = /[0-9]/.test(password);
    var hasSymbol = /[^A-Za-z0-9]/.test(password);
    var variety = [hasUpper, hasLower, hasDigit, hasSymbol].filter(Boolean).length;

    var score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 18) score++;
    if (variety >= 3) score++;
    if (variety === 4) score++;

    return Math.max(1, Math.min(5, score));
  }

  function calcEntropy(password) {
    var poolSize = 0;
    if (/[a-z]/.test(password)) poolSize += 26;
    if (/[A-Z]/.test(password)) poolSize += 26;
    if (/[0-9]/.test(password)) poolSize += 10;
    if (/[^A-Za-z0-9]/.test(password)) poolSize += SYMBOLS.length;
    if (poolSize === 0) poolSize = 26;
    return Math.round(password.length * Math.log2(poolSize));
  }

  function strengthMeta(score) {
    if (score <= 2) return { label: 'Fraca', cls: 'is-filled-weak', tone: 'weak' };
    if (score <= 3) return { label: 'Média', cls: 'is-filled-medium', tone: 'medium' };
    return { label: 'Forte', cls: 'is-filled-strong', tone: 'strong' };
  }

  function paintStrengthBars(score) {
    var meta = strengthMeta(score);
    el.strengthBars.forEach(function (bar, index) {
      bar.classList.remove('is-filled-weak', 'is-filled-medium', 'is-filled-strong');
      if (index < score) {
        bar.classList.add(meta.cls);
      }
    });
    el.strengthLabel.textContent = meta.label;
    el.strengthLabel.className = 'graph-value tone-' + meta.tone;
    return meta;
  }

  function updateStrengthPreview() {
    var preview = generatePasswordLocal(parseInt(el.passLength.value, 10));
    var score = scorePassword(preview);
    paintStrengthBars(score);
    el.entropyValue.textContent = calcEntropy(preview) + ' bits';
    el.passPreviewBox.textContent = preview;
  }

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add('is-visible');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(function () {
      el.toast.classList.remove('is-visible');
    }, 1800);
  }

  function bumpStat(node) {
    node.classList.remove('is-updating');
    void node.offsetWidth;
    node.classList.add('is-updating');
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text);
    } else {
      var temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
    totalCopies++;
    el.statCopies.textContent = totalCopies;
    bumpStat(el.statCopies);
  }

  function setStatus(active, label) {
    el.statusLabel.textContent = label;
    document.body.classList.toggle('is-generating', active);
    if (active) {
      el.statusDot.classList.add('is-active');
      el.statusDot.classList.remove('has-warning');
    } else {
      el.statusDot.classList.remove('is-active');
      refreshGlobalStatus();
    }
    [el.userCardStatus, el.passCardStatus, el.batchCardStatus].forEach(function (badge) {
      if (!badge) return;
      badge.textContent = active ? 'gerando' : 'pronto';
      badge.classList.toggle('is-working', active);
    });
  }

  function getFilteredSortedAccounts() {
    var query = (el.resultsSearch.value || '').toLowerCase().trim();
    var list = generatedAccounts.filter(function (a) {
      if (!query) return true;
      return a.username.toLowerCase().indexOf(query) !== -1 || a.password.toLowerCase().indexOf(query) !== -1;
    });

    list = list.slice();

    if (state.sort === 'old') list.reverse();
    else if (state.sort === 'strong') list.sort(function (a, b) { return b.score - a.score; });
    else if (state.sort === 'weak') list.sort(function (a, b) { return a.score - b.score; });
    else if (state.sort === 'az') list.sort(function (a, b) { return a.username.localeCompare(b.username); });

    return list;
  }

  function updateBulkBar() {
    var count = Object.keys(selectedIds).length;
    if (!el.bulkBar) return;
    el.bulkBar.classList.toggle('is-visible', count > 0);
    if (el.bulkCount) el.bulkCount.textContent = count;
    if (el.selectAllCheck) {
      var visible = getFilteredSortedAccounts();
      el.selectAllCheck.checked = visible.length > 0 && visible.every(function (a) { return selectedIds[a.id]; });
    }
  }

  function renderResults() {
    el.resultsCount.textContent = generatedAccounts.length;
    el.statTotal.textContent = totalGenerated;

    var list = getFilteredSortedAccounts();

    if (generatedAccounts.length === 0) {
      el.resultsList.innerHTML = '';
      el.resultsList.appendChild(el.resultsEmpty);
      el.statStrength.textContent = '—';
      renderPagination(0);
      updateBulkBar();
      return;
    }

    el.resultsList.innerHTML = '';

    var totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    var pageItems = list.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    var fragment = document.createDocumentFragment();

    pageItems.forEach(function (account) {
      var card = document.createElement('div');
      card.className = 'result-card';
      if (selectedIds[account.id]) card.classList.add('is-selected');

      var topRow = document.createElement('div');
      topRow.className = 'result-card-top';

      var checkWrap = document.createElement('input');
      checkWrap.type = 'checkbox';
      checkWrap.className = 'result-check';
      checkWrap.checked = !!selectedIds[account.id];
      checkWrap.addEventListener('change', function () {
        if (checkWrap.checked) selectedIds[account.id] = true;
        else delete selectedIds[account.id];
        card.classList.toggle('is-selected', checkWrap.checked);
        updateBulkBar();
      });

      var indexEl = document.createElement('span');
      indexEl.className = 'result-index';
      indexEl.textContent = generatedAccounts.indexOf(account) + 1;

      var userValue = document.createElement('span');
      userValue.className = 'result-user-value';
      userValue.textContent = account.username;

      var tag = document.createElement('span');
      tag.className = 'result-strength-tag tone-' + strengthMeta(account.score).tone;
      tag.textContent = account.strengthLabel;

      var timeEl = document.createElement('span');
      timeEl.className = 'result-time';
      timeEl.textContent = account.time;

      var actions = document.createElement('div');
      actions.className = 'result-actions';

      var favBtn = document.createElement('button');
      favBtn.type = 'button';
      favBtn.className = 'result-fav-btn' + (account.fav ? ' is-fav' : '');
      favBtn.innerHTML = '<i data-lucide="star"></i>';
      favBtn.addEventListener('click', function () {
        account.fav = !account.fav;
        renderResults();
      });

      var copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'result-copy-btn';
      copyBtn.innerHTML = '<i data-lucide="copy"></i>';
      copyBtn.addEventListener('click', function () {
        copyText(account.username + ' | ' + account.password);
        showToast('Copiado para a área de transferência');
      });

      var delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'result-del-btn';
      delBtn.innerHTML = '<i data-lucide="x"></i>';
      delBtn.addEventListener('click', function () {
        var idx = generatedAccounts.indexOf(account);
        if (idx !== -1) generatedAccounts.splice(idx, 1);
        delete selectedIds[account.id];
        renderResults();
      });

      actions.appendChild(favBtn);
      actions.appendChild(copyBtn);
      actions.appendChild(delBtn);

      topRow.appendChild(checkWrap);
      topRow.appendChild(indexEl);
      topRow.appendChild(userValue);
      topRow.appendChild(tag);
      topRow.appendChild(timeEl);
      topRow.appendChild(actions);

      var bottomRow = document.createElement('div');
      bottomRow.className = 'result-card-bottom';

      var passLabel = document.createElement('span');
      passLabel.className = 'result-pass-label';
      passLabel.textContent = 'Senha';

      var passValue = document.createElement('span');
      passValue.className = 'result-pass-value';
      passValue.textContent = account.password;

      bottomRow.appendChild(passLabel);
      bottomRow.appendChild(passValue);

      card.appendChild(topRow);
      card.appendChild(bottomRow);

      fragment.appendChild(card);
    });

    el.resultsList.appendChild(fragment);

    var scoreSum = generatedAccounts.reduce(function (sum, a) { return sum + a.score; }, 0);
    var avgScore = Math.round(scoreSum / generatedAccounts.length);
    el.statStrength.textContent = strengthMeta(avgScore).label;

    renderPagination(totalPages);
    updateBulkBar();

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function renderPagination(totalPages) {
    var existing = document.querySelector('.pagination-row');
    if (existing) existing.remove();

    if (totalPages <= 1) return;

    var row = document.createElement('div');
    row.className = 'pagination-row';

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'page-btn';
    prev.textContent = '‹';
    prev.disabled = currentPage === 1;
    prev.addEventListener('click', function () {
      if (currentPage > 1) { currentPage--; renderResults(); }
    });
    row.appendChild(prev);

    var windowStart = Math.max(1, currentPage - 2);
    var windowEnd = Math.min(totalPages, windowStart + 4);
    windowStart = Math.max(1, windowEnd - 4);

    for (var p = windowStart; p <= windowEnd; p++) {
      (function (p) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'page-btn' + (p === currentPage ? ' is-active' : '');
        btn.textContent = p;
        btn.addEventListener('click', function () { currentPage = p; renderResults(); });
        row.appendChild(btn);
      })(p);
    }

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'page-btn';
    next.textContent = '›';
    next.disabled = currentPage === totalPages;
    next.addEventListener('click', function () {
      if (currentPage < totalPages) { currentPage++; renderResults(); }
    });
    row.appendChild(next);

    el.resultsList.parentNode.appendChild(row);
  }

  el.resultsSearch.addEventListener('input', function () {
    currentPage = 1;
    renderResults();
  });

  if (el.selectAllCheck) {
    el.selectAllCheck.addEventListener('change', function () {
      var visible = getFilteredSortedAccounts();
      if (el.selectAllCheck.checked) {
        visible.forEach(function (a) { selectedIds[a.id] = true; });
      } else {
        visible.forEach(function (a) { delete selectedIds[a.id]; });
      }
      renderResults();
    });
  }

  if (el.bulkCopyBtn) {
    el.bulkCopyBtn.addEventListener('click', function () {
      var chosen = generatedAccounts.filter(function (a) { return selectedIds[a.id]; });
      if (!chosen.length) return;
      copyText(chosen.map(function (a) { return a.username + ' | ' + a.password; }).join('\n'));
      showToast(chosen.length + ' conta(s) copiadas');
    });
  }

  if (el.bulkFavBtn) {
    el.bulkFavBtn.addEventListener('click', function () {
      generatedAccounts.forEach(function (a) {
        if (selectedIds[a.id]) a.fav = true;
      });
      renderResults();
      showToast('Favoritadas');
    });
  }

  if (el.bulkDeleteBtn) {
    el.bulkDeleteBtn.addEventListener('click', function () {
      var count = Object.keys(selectedIds).length;
      generatedAccounts = generatedAccounts.filter(function (a) { return !selectedIds[a.id]; });
      selectedIds = {};
      currentPage = 1;
      renderResults();
      showToast(count + ' conta(s) removidas');
    });
  }

  function addHistoryEntry(count, avgStrength) {
    var entry = document.createElement('div');
    entry.className = 'history-item';
    var now = new Date();
    entry.innerHTML = '<span><strong>' + count + '</strong> conta(s) geradas</span><span>' + avgStrength + '</span><span>' + now.toLocaleTimeString('pt-BR') + '</span>';

    var emptyState = el.historyList.querySelector('.results-empty');
    if (emptyState) el.historyList.innerHTML = '';

    el.historyList.insertBefore(entry, el.historyList.firstChild);

    var count2 = el.historyList.querySelectorAll('.history-item').length;
    el.historyCount.textContent = count2;
  }

  if (el.clearHistoryBtn) {
    el.clearHistoryBtn.addEventListener('click', function () {
      el.historyList.innerHTML = '<div class="results-empty"><i data-lucide="clock"></i><span>Nenhuma geração no histórico ainda</span></div>';
      el.historyCount.textContent = '0';
      if (window.lucide) lucide.createIcons();
    });
  }

  function exportResults(format) {
    if (generatedAccounts.length === 0) {
      showToast('Nada para exportar');
      return;
    }

    var content, mime, filename;

    if (format === 'txt') {
      content = generatedAccounts.map(function (a) { return a.username + ' | ' + a.password; }).join('\n');
      mime = 'text/plain';
      filename = 'contas.txt';
    } else if (format === 'csv') {
      var rows = ['usuario,senha,forca,data'];
      generatedAccounts.forEach(function (a) {
        rows.push([a.username, a.password, a.strengthLabel, a.time].join(','));
      });
      content = rows.join('\n');
      mime = 'text/csv';
      filename = 'contas.csv';
    } else {
      content = JSON.stringify(generatedAccounts.map(function (a) {
        return { username: a.username, password: a.password, strength: a.strengthLabel, time: a.time };
      }), null, 2);
      mime = 'application/json';
      filename = 'contas.json';
    }

    var blob = new Blob([content], { type: mime });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Exportado como ' + filename);
  }

  function setCardProgress(fillEl, labelEl, wrapEl, pct) {
    fillEl.style.width = pct + '%';
    labelEl.textContent = pct + '%';
    if (wrapEl) wrapEl.classList.toggle('is-visible', pct > 0 && pct < 100);
  }

  /* ===== Overlay de loading do card "Geração" =====
     Mostra o spinner (estilo Flowbite) enquanto a geração roda.
     Depois de 30s o botão "Liberar controles" aparece, permitindo
     ao usuário mexer nas configs de novo mesmo se a geração ainda
     estiver rolando (ex: leva grande/API lenta). Ao terminar a
     geração normalmente, o overlay some sozinho antes disso. */
  var LOADING_UNLOCK_MS = 30000;
  var loadingTimerInterval = null;
  var loadingUnlockTimeout = null;
  var loadingStartedAt = null;

  function showBatchLoading() {
    if (!el.batchLoadingOverlay) return;
    loadingStartedAt = Date.now();

    el.batchLoadingOverlay.classList.add('is-visible');
    var batchCard = el.batchLoadingOverlay.closest('.dash-card');
    if (batchCard) batchCard.classList.add('is-locked');

    if (el.batchUnlockBtn) el.batchUnlockBtn.classList.remove('is-visible');
    if (el.batchLoadingTimer) el.batchLoadingTimer.textContent = '0s';

    clearInterval(loadingTimerInterval);
    loadingTimerInterval = setInterval(function () {
      var elapsed = Math.floor((Date.now() - loadingStartedAt) / 1000);
      if (el.batchLoadingTimer) el.batchLoadingTimer.textContent = elapsed + 's';
    }, 1000);

    clearTimeout(loadingUnlockTimeout);
    loadingUnlockTimeout = setTimeout(function () {
      if (el.batchUnlockBtn) el.batchUnlockBtn.classList.add('is-visible');
    }, LOADING_UNLOCK_MS);
  }

  function hideBatchLoading() {
    if (!el.batchLoadingOverlay) return;
    el.batchLoadingOverlay.classList.remove('is-visible');
    var batchCard = el.batchLoadingOverlay.closest('.dash-card');
    if (batchCard) batchCard.classList.remove('is-locked');

    clearInterval(loadingTimerInterval);
    clearTimeout(loadingUnlockTimeout);
    loadingTimerInterval = null;
    loadingUnlockTimeout = null;
  }

  if (el.batchUnlockBtn) {
    el.batchUnlockBtn.addEventListener('click', function () {
      hideBatchLoading();
      showToast('Controles liberados');
    });
  }

  async function runBatch(count) {
    state.cancelRequested = false;
    el.generateBtn.disabled = true;
    el.generateBtnLabel.textContent = 'Gerando...';
    el.cancelBtn.style.display = 'flex';
    setStatus(true, 'Gerando...');
    el.progressWrap.classList.add('is-visible');
    showBatchLoading();

    var produced = 0;
    var newAccounts = [];

    try {
      for (var i = 0; i < count; i++) {
        if (state.cancelRequested) break;

        var stepStart = performance.now();
        var username, password;

        try {
          username = await generateUsername();
        } catch (e) {
          username = syntheticWord(6) + randomInt(9999);
        }

        try {
          password = await generatePassword();
        } catch (e) {
          password = generatePasswordLocal(parseInt(el.passLength.value, 10));
        }

        var score = scorePassword(password);
        var stepTime = performance.now() - stepStart;
        genTimes.push(stepTime);
        if (genTimes.length > 40) genTimes.shift();

        strengthHistory.push(score);
        if (strengthHistory.length > 24) strengthHistory.shift();

        newAccounts.unshift({
          id: 'acc_' + (nextId++),
          username: username,
          password: password,
          score: score,
          strengthLabel: strengthMeta(score).label,
          time: new Date().toLocaleTimeString('pt-BR'),
          fav: false
        });

        produced++;
        var pct = Math.round((produced / count) * 100);

        setCardProgress(el.progressFill, el.progressLabel, el.progressWrap, pct);
        setCardProgress(el.userProgressFill, el.userProgressLabel, null, pct);
        setCardProgress(el.passProgressFill, el.passProgressLabel, null, pct);

        await new Promise(function (resolve) { setTimeout(resolve, 40); });
      }
    } catch (e) {
      showToast('Ocorreu um erro durante a geração');
    } finally {
      hideBatchLoading();
      finishBatch(newAccounts, produced);
    }
  }

  function finishBatch(newAccounts, count) {
    generatedAccounts = newAccounts.concat(generatedAccounts);
    totalGenerated += count;
    currentPage = 1;

    el.statLastBatch.textContent = count;
    bumpStat(el.statLastBatch);
    bumpStat(el.statTotal);

    batchHistory.push(count);
    if (batchHistory.length > 20) batchHistory.shift();
    updateStatusGraphs();

    if (genTimes.length) {
      var avgMs = genTimes.reduce(function (a, b) { return a + b; }, 0) / genTimes.length;
      el.statAvgTime.textContent = avgMs < 1000 ? Math.round(avgMs) + 'ms' : (avgMs / 1000).toFixed(1) + 's';
      bumpStat(el.statAvgTime);
    }

    renderResults();

    var avgScore = count > 0
      ? Math.round(generatedAccounts.slice(0, count).reduce(function (s, a) { return s + a.score; }, 0) / count)
      : 0;
    addHistoryEntry(count, count > 0 ? strengthMeta(avgScore).label : '—');

    showToast(state.cancelRequested ? 'Geração cancelada' : (count === 1 ? 'Conta gerada' : count + ' contas geradas'));

    setStatus(false, 'Pronto');
    el.generateBtn.disabled = false;
    el.generateBtnLabel.textContent = 'Gerar';
    el.cancelBtn.style.display = 'none';
    el.generateBtn.classList.add('is-success');
    setTimeout(function () { el.generateBtn.classList.remove('is-success'); }, 500);

    setTimeout(function () {
      setCardProgress(el.progressFill, el.progressLabel, el.progressWrap, 0);
      setCardProgress(el.userProgressFill, el.userProgressLabel, null, 0);
      setCardProgress(el.passProgressFill, el.passProgressLabel, null, 0);
    }, 500);

    if (count > 0) {
      setTimeout(function () { switchView('resultados'); }, 350);
    }
  }

  el.generateBtn.addEventListener('click', function () {
    var count = parseInt(el.batchCount.value, 10);
    runBatch(count);
  });

  el.cancelBtn.addEventListener('click', function () {
    state.cancelRequested = true;
  });

  el.clearAllResultsBtn.addEventListener('click', function () {
    if (generatedAccounts.length === 0) {
      showToast('Nada para limpar');
      return;
    }
    generatedAccounts = [];
    selectedIds = {};
    currentPage = 1;
    renderResults();
    showToast('Resultados limpos');
  });

  el.copyAllBtn.addEventListener('click', function () {
    if (generatedAccounts.length === 0) {
      showToast('Nada para copiar');
      return;
    }
    var lines = generatedAccounts.map(function (a) {
      return a.username + ' | ' + a.password;
    });
    copyText(lines.join('\n'));
    showToast('Todos os resultados copiados');
  });

  el.copyUsersBtn.addEventListener('click', function () {
    if (generatedAccounts.length === 0) {
      showToast('Nada para copiar');
      return;
    }
    copyText(generatedAccounts.map(function (a) { return a.username; }).join('\n'));
    showToast('Usuários copiados');
  });

  el.copyPassBtn.addEventListener('click', function () {
    if (generatedAccounts.length === 0) {
      showToast('Nada para copiar');
      return;
    }
    copyText(generatedAccounts.map(function (a) { return a.password; }).join('\n'));
    showToast('Senhas copiadas');
  });

  var PRESET_STORAGE_KEY = 'codywas_gerador_presets_v2';
  var selectedPresetId = null;

  function loadAllPresets() {
    try {
      var raw = localStorage.getItem(PRESET_STORAGE_KEY);
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveAllPresets(list) {
    try {
      localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  function refreshSelectText(text) {
    if (!el.presetSelect) return;
    var span = el.presetSelect.querySelector('.select-btn span');
    if (span) span.textContent = text;
  }

  function renderPresetMenu() {
    if (!el.presetSelectMenu) return;
    var presets = loadAllPresets();
    el.presetSelectMenu.innerHTML = '';

    if (presets.length === 0) {
      var empty = document.createElement('div');
      empty.className = 'select-menu-empty';
      empty.id = 'presetSelectEmpty';
      empty.textContent = 'Nenhum preset salvo ainda';
      el.presetSelectMenu.appendChild(empty);
      selectedPresetId = null;
      refreshSelectText('Nenhum preset selecionado');
      return;
    }

    var stillExists = presets.some(function (p) { return p.id === selectedPresetId; });
    if (!stillExists) selectedPresetId = null;

    presets.forEach(function (preset) {
      var opt = document.createElement('div');
      opt.className = 'preset-option' + (preset.id === selectedPresetId ? ' is-active' : '');
      opt.dataset.id = preset.id;

      var dot = document.createElement('span');
      dot.className = 'preset-option-dot';

      var body = document.createElement('div');
      body.className = 'preset-option-body';

      var name = document.createElement('span');
      name.className = 'preset-option-name';
      name.textContent = preset.name;

      var meta = document.createElement('span');
      meta.className = 'preset-option-meta';
      meta.textContent = preset.savedAt ? new Date(preset.savedAt).toLocaleDateString('pt-BR') : '';

      body.appendChild(name);
      body.appendChild(meta);
      opt.appendChild(dot);
      opt.appendChild(body);

      opt.addEventListener('click', function () {
        selectedPresetId = preset.id;
        el.presetNameInput.value = preset.name;
        refreshSelectText(preset.name);
        el.presetSelect.classList.remove('is-open');
        renderPresetMenu();
      });

      el.presetSelectMenu.appendChild(opt);
    });

    if (selectedPresetId) {
      var current = presets.find(function (p) { return p.id === selectedPresetId; });
      if (current) refreshSelectText(current.name);
    } else {
      refreshSelectText('Nenhum preset selecionado');
    }
  }

  if (el.presetSelect) {
    var presetSelectBtn = el.presetSelect.querySelector('.select-btn');
    presetSelectBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      document.querySelectorAll('.select-wrap.is-open').forEach(function (w) {
        if (w !== el.presetSelect) w.classList.remove('is-open');
      });
      el.presetSelect.classList.toggle('is-open');
    });
  }

  function collectGenerationSnapshot() {
    return {
      baseWord: el.baseWord.value,
      suffixWord: el.suffixWord.value,
      prefixWord: el.prefixWord.value,
      userLength: el.userLength.value,
      passLength: el.passLength.value,
      batchCount: el.batchCount.value,
      state: JSON.parse(JSON.stringify(state))
    };
  }

  function applyGenerationSnapshot(snap) {
    el.baseWord.value = snap.baseWord || '';
    el.suffixWord.value = snap.suffixWord || '';
    el.prefixWord.value = snap.prefixWord || '';

    userLengthSync(parseInt(snap.userLength, 10) || parseInt(el.userLength.value, 10));
    passLengthSync(parseInt(snap.passLength, 10) || parseInt(el.passLength.value, 10));

    el.batchCount.value = snap.batchCount || el.batchCount.value;
    el.batchCountNum.value = snap.batchCount || el.batchCountNum.value;

    if (snap.state) {
      Object.keys(snap.state).forEach(function (k) { state[k] = snap.state[k]; });
    }

    var switchMap = {
      userNumbers: el.userNumbersSwitch,
      userCapitalize: el.userCapitalizeSwitch,
      userNoRepeat: el.userNoRepeatSwitch,
      userNoDupe: el.userNoDupeSwitch,
      passUpper: el.passUpperSwitch,
      passNumbers: el.passNumbersSwitch,
      passSymbols: el.passSymbolsSwitch,
      passAmbiguous: el.passAmbiguousSwitch,
      passOnlyLetters: el.passOnlyLettersSwitch,
      passOnlyNumbers: el.passOnlyNumbersSwitch,
      filterOffensive: el.filterOffensiveSwitch
    };
    Object.keys(switchMap).forEach(function (key) {
      var btn = switchMap[key];
      if (!btn) return;
      btn.classList.toggle('is-on', !!state[key]);
    });

    var selectMap = {
      userStyleSelect: { key: 'userStyle', wrap: el.userStyleSelect },
      userSourceSelect: { key: 'userSource', wrap: el.userSourceSelect },
      passSourceSelect: { key: 'passSource', wrap: el.passSourceSelect },
      sepSelect: { key: 'separator', wrap: el.sepSelect }
    };
    Object.keys(selectMap).forEach(function (name) {
      var cfg = selectMap[name];
      if (!cfg.wrap) return;
      var options = cfg.wrap.querySelectorAll('.select-option');
      var btnSpan = cfg.wrap.querySelector('.select-btn span');
      options.forEach(function (opt) {
        var match = opt.getAttribute('data-value') === (state[cfg.key] || '');
        opt.classList.toggle('is-active', match);
        if (match && btnSpan) btnSpan.textContent = opt.textContent;
      });
    });

    clearPresetActive();
    updateUserGraph(parseInt(el.userLength.value, 10));
    updateStrengthPreview();
  }

  if (el.saveFavoriteBtn) {
    el.saveFavoriteBtn.addEventListener('click', function () {
      var name = (el.presetNameInput.value || '').trim();
      if (!name) {
        showToast('Digite um nome para o preset');
        return;
      }

      var presets = loadAllPresets();
      var snapshot = collectGenerationSnapshot();
      var existing = presets.find(function (p) { return p.name.toLowerCase() === name.toLowerCase(); });

      if (existing) {
        existing.savedAt = Date.now();
        Object.assign(existing, snapshot);
        selectedPresetId = existing.id;
      } else {
        var preset = Object.assign({ id: 'preset_' + Date.now() + '_' + randomInt(9999), name: name, savedAt: Date.now() }, snapshot);
        presets.push(preset);
        selectedPresetId = preset.id;
      }

      if (saveAllPresets(presets)) {
        renderPresetMenu();
        showToast('Preset "' + name + '" salvo');
      } else {
        showToast('Não foi possível salvar o preset');
      }
    });
  }

  if (el.loadFavoriteBtn) {
    el.loadFavoriteBtn.addEventListener('click', function () {
      var presets = loadAllPresets();
      if (presets.length === 0) {
        showToast('Nenhum preset salvo');
        return;
      }

      var target = null;
      if (selectedPresetId) {
        target = presets.find(function (p) { return p.id === selectedPresetId; });
      }
      if (!target) {
        var name = (el.presetNameInput.value || '').trim().toLowerCase();
        if (name) target = presets.find(function (p) { return p.name.toLowerCase() === name; });
      }

      if (!target) {
        showToast('Selecione um preset na lista');
        return;
      }

      applyGenerationSnapshot(target);
      el.presetNameInput.value = target.name;
      selectedPresetId = target.id;
      renderPresetMenu();
      showToast('Preset "' + target.name + '" carregado');
    });
  }

  if (el.deletePresetBtn) {
    el.deletePresetBtn.addEventListener('click', function () {
      var presets = loadAllPresets();
      if (presets.length === 0) {
        showToast('Nenhum preset salvo');
        return;
      }

      var target = null;
      if (selectedPresetId) {
        target = presets.find(function (p) { return p.id === selectedPresetId; });
      }
      if (!target) {
        var name = (el.presetNameInput.value || '').trim().toLowerCase();
        if (name) target = presets.find(function (p) { return p.name.toLowerCase() === name; });
      }

      if (!target) {
        showToast('Selecione um preset na lista');
        return;
      }

      var remaining = presets.filter(function (p) { return p.id !== target.id; });
      saveAllPresets(remaining);
      selectedPresetId = null;
      renderPresetMenu();
      showToast('Preset "' + target.name + '" excluído');
    });
  }

  if (el.resetDefaultsBtn) {
    el.resetDefaultsBtn.addEventListener('click', function () {
      location.reload();
    });
  }

  renderPresetMenu();

  renderResults();
  updateStrengthPreview();
  updateUserGraph(parseInt(el.userLength.value, 10));
  updateStatusGraphs();
  setStatus(false, 'Pronto');
});