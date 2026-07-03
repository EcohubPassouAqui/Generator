const EN_ADJ = ['Shadow', 'Silent', 'Crimson', 'Frost', 'Lunar', 'Blaze', 'Storm', 'Iron', 'Ghost', 'Neon', 'Turbo', 'Cyber', 'Royal', 'Wild', 'Swift', 'Dark', 'Golden', 'Savage', 'Mystic', 'Rapid'];
const EN_NOUN = ['Wolf', 'Ninja', 'Phoenix', 'Tiger', 'Hunter', 'Knight', 'Dragon', 'Falcon', 'Raven', 'Viper', 'Panther', 'Warrior', 'Hawk', 'Titan', 'Rider', 'Blade', 'Fox', 'Bear', 'Reaper', 'Star'];
const PT_ADJ = ['Sombrio', 'Veloz', 'Ferrenho', 'Lunar', 'Selvagem', 'Fantasma', 'Feroz', 'Gelido', 'Dourado', 'Mistico', 'Bravo', 'Astuto', 'Rebelde', 'Furtivo', 'Eletrico', 'Nobre', 'Cruel', 'Livre', 'Turbo', 'Cinzento'];
const PT_NOUN = ['Lobo', 'Ninja', 'Fenix', 'Tigre', 'Cacador', 'Cavaleiro', 'Dragao', 'Falcao', 'Corvo', 'Vibora', 'Pantera', 'Guerreiro', 'Espectro', 'Gaviao', 'Titan', 'Justiceiro', 'Lamina', 'Raposa', 'Urso', 'Estrela'];

const ICONS = {
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.94 10.94 0 0 1 12 19c-7 0-11-7-11-7a18.6 18.6 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 7 11 7a18.6 18.6 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.1 8.3 22 9.3 17 14.1 18.2 21 12 17.8 5.8 21 7 14.1 2 9.3 8.9 8.3 12 2"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
};

const TOAST_ICONS = {
    success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

const FORMAT_LABELS = {
    simples: 'Palavra + Numero',
    composto: 'Adjetivo + Substantivo',
    prefixo: 'Prefixo + Numero',
    aleatorio: 'Aleatorio'
};

const state = {
    results: [],
    filtered: [],
    page: 1,
    pageSize: 8,
    favorites: new Set(),
    history: [],
    sessionTotal: 0,
    lastGenTime: 0,
    currentDelay: 400
};

function el(id) {
    return document.getElementById(id);
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
    return list[randomInt(0, list.length - 1)];
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randomInt(0, i);
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
    }
    return arr;
}

function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function sanitizeWord(str) {
    return (str || '').replace(/[^a-zA-Z0-9]/g, '');
}

function randomDigits(min, max) {
    const len = randomInt(min, max);
    let out = '';
    for (let i = 0; i < len; i++) {
        out += String(randomInt(0, 9));
    }
    return out;
}

function randomAlphaNumeric(len) {
    const pool = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let out = '';
    for (let i = 0; i < len; i++) {
        out += pool[randomInt(0, pool.length - 1)];
    }
    return out;
}

function clampUsername(name) {
    name = name.replace(/[^a-zA-Z0-9]/g, '');
    if (!/^[A-Za-z]/.test(name)) {
        name = pick(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K']) + name;
    }
    if (name.length < 3) {
        name += randomDigits(3, 3);
    }
    if (name.length > 20) {
        name = name.slice(0, 20);
    }
    return name;
}

function buildUsername(config, used) {
    const nounList = config.lang === 'en' ? EN_NOUN : PT_NOUN;
    const adjList = config.lang === 'en' ? EN_ADJ : PT_ADJ;
    const sizeRange = config.nameSize === 'longo' ? [3, 5] : [2, 3];
    let name = '';
    let attempts = 0;
    do {
        if (config.format === 'simples') {
            const base = config.baseWord ? sanitizeWord(config.baseWord) : '';
            name = capitalize(base || pick(nounList));
            if (config.autoSuffix) {
                name += randomDigits(sizeRange[0], sizeRange[1]);
            }
        } else if (config.format === 'composto') {
            const adj = capitalize(pick(adjList));
            const base = config.baseWord ? sanitizeWord(config.baseWord) : '';
            const noun = capitalize(base || pick(nounList));
            name = adj + noun;
            if (config.nameSize === 'curto') {
                name = name.slice(0, 10);
            }
            if (config.autoSuffix) {
                name += randomDigits(sizeRange[0], sizeRange[1]);
            }
        } else if (config.format === 'prefixo') {
            const prefix = sanitizeWord(config.prefix) || 'Player';
            name = capitalize(prefix);
            const digitRange = config.autoSuffix ? sizeRange : [1, 2];
            name += randomDigits(digitRange[0], digitRange[1]);
        } else {
            const len = config.nameSize === 'longo' ? randomInt(12, 16) : randomInt(6, 8);
            name = randomAlphaNumeric(len);
        }
        name = clampUsername(name);
        attempts++;
    } while (config.avoidDuplicates && used.has(name.toLowerCase()) && attempts < 60);
    used.add(name.toLowerCase());
    return name;
}

function buildPassword(config) {
    if (config.customPassword && config.customPasswordValue) {
        return config.customPasswordValue;
    }
    const pools = [];
    if (config.upper) pools.push(config.avoidSimilar ? 'ABCDEFGHJKLMNPQRSTUVWXYZ' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    if (config.lower) pools.push(config.avoidSimilar ? 'abcdefghjkmnpqrstuvwxyz' : 'abcdefghijklmnopqrstuvwxyz');
    if (config.numbers) pools.push(config.avoidSimilar ? '23456789' : '0123456789');
    if (config.symbols) pools.push('!@#$%^&*_-+=?');
    const activePools = pools.length ? pools : ['abcdefghijkmnpqrstuvwxyz23456789'];
    const length = Math.max(config.length, activePools.length);
    const chars = new Array(length).fill('');
    let filled = 0;
    if (config.strong) {
        activePools.forEach(function (pool) {
            chars[filled] = pool[randomInt(0, pool.length - 1)];
            filled++;
        });
    }
    const allChars = activePools.join('');
    for (let i = filled; i < length; i++) {
        chars[i] = allChars[randomInt(0, allChars.length - 1)];
    }
    return shuffleArray(chars).join('');
}

function maskPassword(pw) {
    return '\u2022'.repeat(pw.length);
}

function readConfig() {
    const qty = clampNumber(parseInt(el('field-qty').value, 10) || 5, 1, 100);
    el('field-qty').value = qty;
    const length = clampNumber(parseInt(el('field-pass-length').value, 10) || 12, 6, 32);
    el('field-pass-length').value = length;
    const customPassword = el('field-custom-pass-toggle').checked;
    const customPasswordValue = el('field-custom-pass-value').value.trim();
    let warning = null;
    if (!customPassword && !el('field-upper').checked && !el('field-lower').checked && !el('field-numbers').checked && !el('field-symbols').checked) {
        el('field-lower').checked = true;
        el('field-numbers').checked = true;
        warning = 'Nenhum tipo de caractere selecionado. Ativei letras minusculas e numeros automaticamente.';
    }
    const sizeInput = document.querySelector('input[name="nameSize"]:checked');
    return {
        qty: qty,
        format: el('field-format').value,
        lang: el('field-lang').value,
        baseWord: el('field-baseword').value.trim(),
        prefix: el('field-prefix').value.trim(),
        nameSize: sizeInput ? sizeInput.value : 'curto',
        autoSuffix: el('field-autosuffix').checked,
        avoidDuplicates: el('field-avoid-dup').checked,
        customPassword: customPassword,
        customPasswordValue: customPasswordValue,
        length: length,
        upper: el('field-upper').checked,
        lower: el('field-lower').checked,
        numbers: el('field-numbers').checked,
        symbols: el('field-symbols').checked,
        strong: el('field-strong').checked,
        avoidSimilar: el('field-avoid-similar').checked,
        autoCopy: el('field-auto-copy').checked,
        autoDownload: el('field-auto-download').checked,
        warning: warning
    };
}

function generateAccounts(config) {
    const used = new Set();
    if (config.avoidDuplicates) {
        state.results.forEach(function (item) {
            used.add(item.username.toLowerCase());
        });
    }
    const list = [];
    for (let i = 0; i < config.qty; i++) {
        const username = buildUsername(config, used);
        const password = buildPassword(config);
        list.push({ username: username, password: password, favorite: state.favorites.has(username.toLowerCase()) });
    }
    return list;
}

function iconButton(icon, tooltip, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'icon-btn tooltip';
    btn.setAttribute('data-tooltip', tooltip);
    btn.setAttribute('aria-label', tooltip);
    btn.innerHTML = ICONS[icon];
    btn.addEventListener('click', onClick);
    return btn;
}

function flashButton(btn) {
    const original = btn.innerHTML;
    btn.innerHTML = ICONS.check;
    btn.classList.add('flash');
    window.setTimeout(function () {
        btn.innerHTML = original;
        btn.classList.remove('flash');
    }, 900);
}

function buildResultRow(item, number) {
    const row = document.createElement('div');
    row.className = 'result-row';

    const num = document.createElement('span');
    num.className = 'result-number';
    num.textContent = String(number).padStart(2, '0');

    const userWrap = document.createElement('div');
    userWrap.className = 'result-field';
    const userLabel = document.createElement('span');
    userLabel.className = 'result-label';
    userLabel.textContent = 'Usuario';
    const userValue = document.createElement('span');
    userValue.className = 'result-value';
    userValue.textContent = item.username;
    userWrap.appendChild(userLabel);
    userWrap.appendChild(userValue);

    const passWrap = document.createElement('div');
    passWrap.className = 'result-field';
    const passLabel = document.createElement('span');
    passLabel.className = 'result-label';
    passLabel.textContent = 'Senha';
    const passValue = document.createElement('span');
    passValue.className = 'result-value';
    passValue.textContent = maskPassword(item.password);
    passValue.dataset.real = item.password;
    passValue.dataset.masked = 'true';
    passWrap.appendChild(passLabel);
    passWrap.appendChild(passValue);

    const actions = document.createElement('div');
    actions.className = 'result-actions';

    const toggleBtn = iconButton('eye', 'Mostrar senha', function () {
        const isMasked = passValue.dataset.masked === 'true';
        passValue.textContent = isMasked ? passValue.dataset.real : maskPassword(passValue.dataset.real);
        passValue.dataset.masked = isMasked ? 'false' : 'true';
        toggleBtn.innerHTML = isMasked ? ICONS.eyeOff : ICONS.eye;
        toggleBtn.setAttribute('data-tooltip', isMasked ? 'Ocultar senha' : 'Mostrar senha');
    });

    const copyUserBtn = iconButton('copy', 'Copiar usuario', function () {
        copyText(item.username).then(function () {
            flashButton(copyUserBtn);
            showToast('Usuario copiado.', 'success');
        });
    });

    const copyPassBtn = iconButton('copy', 'Copiar senha', function () {
        copyText(item.password).then(function () {
            flashButton(copyPassBtn);
            showToast('Senha copiada.', 'success');
        });
    });

    const favBtn = iconButton('star', item.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos', function () {
        item.favorite = !item.favorite;
        const key = item.username.toLowerCase();
        if (item.favorite) {
            state.favorites.add(key);
        } else {
            state.favorites.delete(key);
        }
        persistFavorites();
        favBtn.classList.toggle('active', item.favorite);
        favBtn.setAttribute('data-tooltip', item.favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos');
        if (el('field-fav-only').checked) {
            applyFilter();
            renderResults();
            updateStats();
        }
    });
    favBtn.classList.toggle('active', item.favorite);

    actions.appendChild(toggleBtn);
    actions.appendChild(copyUserBtn);
    actions.appendChild(copyPassBtn);
    actions.appendChild(favBtn);

    row.appendChild(num);
    row.appendChild(userWrap);
    row.appendChild(passWrap);
    row.appendChild(actions);
    return row;
}

function applyFilter() {
    const query = el('field-search').value.trim().toLowerCase();
    const favOnly = el('field-fav-only').checked;
    state.filtered = state.results.filter(function (item) {
        const matchesQuery = !query || item.username.toLowerCase().indexOf(query) !== -1;
        const matchesFav = !favOnly || item.favorite;
        return matchesQuery && matchesFav;
    });
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    if (state.page > totalPages) {
        state.page = totalPages;
    }
}

function renderResults() {
    const list = el('results-list');
    const empty = el('results-empty');
    list.innerHTML = '';
    if (state.filtered.length === 0) {
        empty.classList.remove('hidden');
        list.classList.add('hidden');
        renderPagination();
        return;
    }
    empty.classList.add('hidden');
    list.classList.remove('hidden');
    const startIndex = (state.page - 1) * state.pageSize;
    const pageItems = state.filtered.slice(startIndex, startIndex + state.pageSize);
    pageItems.forEach(function (item, idx) {
        list.appendChild(buildResultRow(item, startIndex + idx + 1));
    });
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
    el('page-indicator').textContent = 'Pagina ' + state.page + ' de ' + totalPages;
    el('btn-prev-page').disabled = state.page <= 1;
    el('btn-next-page').disabled = state.page >= totalPages;
}

function renderSkeleton(count) {
    const skeleton = el('results-skeleton');
    skeleton.innerHTML = '';
    const total = clampNumber(count, 1, 6);
    for (let i = 0; i < total; i++) {
        const row = document.createElement('div');
        row.className = 'skeleton-row';
        skeleton.appendChild(row);
    }
}

function updateStats() {
    el('stat-total-count').textContent = state.sessionTotal;
    el('stat-gen-time').textContent = state.lastGenTime + 'ms';
    el('stat-showing-count').textContent = state.filtered.length;
}

function setLoading(isLoading) {
    const btn = el('btn-generate');
    const bar = el('generate-progress');
    const fill = el('generate-progress-fill');
    const skeleton = el('results-skeleton');
    const list = el('results-list');
    const empty = el('results-empty');
    if (isLoading) {
        btn.disabled = true;
        btn.classList.add('is-loading');
        bar.classList.add('show');
        fill.style.transition = 'none';
        fill.style.width = '0%';
        void fill.offsetWidth;
        fill.style.transition = 'width ' + state.currentDelay + 'ms ease';
        fill.style.width = '100%';
        skeleton.classList.add('show');
        list.classList.add('hidden');
        empty.classList.add('hidden');
    } else {
        btn.disabled = false;
        btn.classList.remove('is-loading');
        bar.classList.remove('show');
        skeleton.classList.remove('show');
        list.classList.remove('hidden');
    }
}

function runGeneration() {
    const config = readConfig();
    if (config.customPassword && !config.customPasswordValue) {
        showToast('Senha personalizada vazia. Gerando senhas aleatorias no lugar.', 'warning');
        config.customPassword = false;
    }
    if (config.warning) {
        showToast(config.warning, 'warning');
    }
    state.currentDelay = clampNumber(300 + config.qty * 12, 300, 1400);
    renderSkeleton(config.qty);
    setLoading(true);
    const start = performance.now();
    window.setTimeout(function () {
        const results = generateAccounts(config);
        state.results = results;
        state.page = 1;
        state.lastGenTime = Math.round(performance.now() - start);
        state.sessionTotal += results.length;
        applyFilter();
        setLoading(false);
        renderResults();
        updateStats();
        saveHistory(config, results);
        showToast('Geradas ' + results.length + ' contas com sucesso.', 'success');
        if (config.autoCopy) {
            copyAllToClipboard(true);
        }
        if (config.autoDownload) {
            exportTXT(true);
        }
    }, state.currentDelay);
}

function clearAll() {
    state.results = [];
    state.filtered = [];
    state.page = 1;
    el('field-search').value = '';
    el('field-fav-only').checked = false;
    applyFilter();
    renderResults();
    updateStats();
    showToast('Resultados limpos.', 'info');
}

function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
        document.execCommand('copy');
    } finally {
        document.body.removeChild(textarea);
    }
    return Promise.resolve();
}

function copyAllToClipboard(silent) {
    if (state.results.length === 0) {
        if (!silent) showToast('Nenhuma conta para copiar.', 'warning');
        return;
    }
    const text = state.results.map(function (r) {
        return r.username + ':' + r.password;
    }).join('\n');
    copyText(text).then(function () {
        if (!silent) showToast('Todas as contas foram copiadas.', 'success');
    });
}

function downloadFile(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function exportTXT(silent) {
    if (state.results.length === 0) {
        showToast('Nenhuma conta para exportar.', 'warning');
        return;
    }
    const lines = state.results.map(function (r, i) {
        return (i + 1) + '. Usuario: ' + r.username + ' | Senha: ' + r.password;
    });
    downloadFile('contas-geradas.txt', lines.join('\n'), 'text/plain');
    if (!silent) showToast('Arquivo TXT exportado.', 'success');
}

function csvEscape(value) {
    const str = String(value);
    if (/[",\n]/.test(str)) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function exportCSV() {
    if (state.results.length === 0) {
        showToast('Nenhuma conta para exportar.', 'warning');
        return;
    }
    const rows = [['usuario', 'senha']].concat(state.results.map(function (r) {
        return [r.username, r.password];
    }));
    const csv = rows.map(function (row) {
        return row.map(csvEscape).join(',');
    }).join('\n');
    downloadFile('contas-geradas.csv', csv, 'text/csv');
    showToast('Arquivo CSV exportado.', 'success');
}

function exportJSON() {
    if (state.results.length === 0) {
        showToast('Nenhuma conta para exportar.', 'warning');
        return;
    }
    const data = state.results.map(function (r) {
        return { usuario: r.username, senha: r.password };
    });
    downloadFile('contas-geradas.json', JSON.stringify(data, null, 2), 'application/json');
    showToast('Arquivo JSON exportado.', 'success');
}

function syncCustomPasswordState() {
    const active = el('field-custom-pass-toggle').checked;
    el('field-custom-pass-value').disabled = !active;
    const group = el('password-charset-group');
    group.classList.toggle('disabled-group', active);
    Array.prototype.forEach.call(group.querySelectorAll('input'), function (input) {
        input.disabled = active;
    });
}

function saveConfig() {
    const config = readConfig();
    localStorage.setItem('generator_config', JSON.stringify(config));
    showToast('Configuracao salva.', 'success');
}

function loadConfig() {
    const raw = localStorage.getItem('generator_config');
    if (!raw) return;
    let config;
    try {
        config = JSON.parse(raw);
    } catch (e) {
        return;
    }
    el('field-qty').value = config.qty || 5;
    el('field-format').value = config.format || 'simples';
    el('field-lang').value = config.lang || 'pt';
    el('field-baseword').value = config.baseWord || '';
    el('field-prefix').value = config.prefix || '';
    const sizeInput = document.querySelector('input[name="nameSize"][value="' + (config.nameSize || 'curto') + '"]');
    if (sizeInput) sizeInput.checked = true;
    el('field-autosuffix').checked = config.autoSuffix !== false;
    el('field-avoid-dup').checked = config.avoidDuplicates !== false;
    el('field-custom-pass-toggle').checked = !!config.customPassword;
    el('field-custom-pass-value').value = config.customPasswordValue || '';
    el('field-pass-length').value = config.length || 12;
    el('field-upper').checked = config.upper !== false;
    el('field-lower').checked = config.lower !== false;
    el('field-numbers').checked = config.numbers !== false;
    el('field-symbols').checked = !!config.symbols;
    el('field-strong').checked = config.strong !== false;
    el('field-avoid-similar').checked = config.avoidSimilar !== false;
    el('field-auto-copy').checked = !!config.autoCopy;
    el('field-auto-download').checked = !!config.autoDownload;
}

function formatFormatLabel(format) {
    return FORMAT_LABELS[format] || format;
}

function persistFavorites() {
    localStorage.setItem('generator_favorites', JSON.stringify(Array.from(state.favorites)));
}

function loadFavorites() {
    const raw = localStorage.getItem('generator_favorites');
    if (!raw) return;
    try {
        state.favorites = new Set(JSON.parse(raw));
    } catch (e) {
        state.favorites = new Set();
    }
}

function saveHistory(config, results) {
    const entry = {
        timestamp: Date.now(),
        qty: results.length,
        format: config.format,
        results: results.map(function (r) {
            return { username: r.username, password: r.password };
        })
    };
    state.history.unshift(entry);
    state.history = state.history.slice(0, 10);
    localStorage.setItem('generator_history', JSON.stringify(state.history));
    renderHistory();
}

function loadHistory() {
    const raw = localStorage.getItem('generator_history');
    if (!raw) return;
    try {
        state.history = JSON.parse(raw) || [];
    } catch (e) {
        state.history = [];
    }
    renderHistory();
}

function renderHistory() {
    const container = el('history-list');
    container.innerHTML = '';
    if (state.history.length === 0) {
        const empty = document.createElement('p');
        empty.className = 'history-empty';
        empty.textContent = 'Nenhuma geracao no historico ainda.';
        container.appendChild(empty);
        return;
    }
    state.history.forEach(function (entry) {
        const item = document.createElement('div');
        item.className = 'history-item';

        const info = document.createElement('div');
        info.className = 'history-info';
        const title = document.createElement('span');
        title.className = 'history-title';
        title.textContent = entry.qty + ' contas - ' + formatFormatLabel(entry.format);
        const time = document.createElement('span');
        time.className = 'history-time';
        time.textContent = new Date(entry.timestamp).toLocaleString('pt-BR');
        info.appendChild(title);
        info.appendChild(time);

        const restoreBtn = document.createElement('button');
        restoreBtn.type = 'button';
        restoreBtn.className = 'btn btn-ghost btn-small';
        restoreBtn.textContent = 'Restaurar';
        restoreBtn.addEventListener('click', function () {
            state.results = entry.results.map(function (r) {
                return { username: r.username, password: r.password, favorite: state.favorites.has(r.username.toLowerCase()) };
            });
            state.page = 1;
            applyFilter();
            renderResults();
            updateStats();
            showToast('Historico restaurado.', 'info');
        });

        item.appendChild(info);
        item.appendChild(restoreBtn);
        container.appendChild(item);
    });
}

function loadTheme() {
    const theme = localStorage.getItem('generator_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('generator_theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    const btn = el('btn-theme-toggle');
    btn.innerHTML = theme === 'dark' ? ICONS.moon : ICONS.sun;
    btn.setAttribute('data-tooltip', theme === 'dark' ? 'Tema claro' : 'Tema escuro');
}

function showToast(message, type) {
    const container = el('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast toast-' + (type || 'info');
    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.innerHTML = TOAST_ICONS[type] || TOAST_ICONS.info;
    const text = document.createElement('span');
    text.className = 'toast-text';
    text.textContent = message;
    toast.appendChild(icon);
    toast.appendChild(text);
    container.appendChild(toast);
    window.requestAnimationFrame(function () {
        toast.classList.add('show');
    });
    window.setTimeout(function () {
        toast.classList.remove('show');
        window.setTimeout(function () {
            toast.remove();
        }, 300);
    }, 3200);
}

function bindEvents() {
    el('btn-generate').addEventListener('click', runGeneration);
    el('btn-regenerate').addEventListener('click', runGeneration);
    el('btn-clear').addEventListener('click', clearAll);
    el('btn-save-config').addEventListener('click', saveConfig);
    el('btn-copy-all').addEventListener('click', function () {
        copyAllToClipboard(false);
    });
    el('btn-export-txt').addEventListener('click', function () {
        exportTXT(false);
    });
    el('btn-export-csv').addEventListener('click', exportCSV);
    el('btn-export-json').addEventListener('click', exportJSON);
    el('btn-theme-toggle').addEventListener('click', toggleTheme);
    el('btn-clear-history').addEventListener('click', function () {
        state.history = [];
        localStorage.removeItem('generator_history');
        renderHistory();
        showToast('Historico apagado.', 'info');
    });
    el('field-custom-pass-toggle').addEventListener('change', syncCustomPasswordState);
    el('field-search').addEventListener('input', function () {
        state.page = 1;
        applyFilter();
        renderResults();
        updateStats();
    });
    el('field-fav-only').addEventListener('change', function () {
        state.page = 1;
        applyFilter();
        renderResults();
        updateStats();
    });
    el('btn-prev-page').addEventListener('click', function () {
        if (state.page > 1) {
            state.page--;
            renderResults();
        }
    });
    el('btn-next-page').addEventListener('click', function () {
        const totalPages = Math.max(1, Math.ceil(state.filtered.length / state.pageSize));
        if (state.page < totalPages) {
            state.page++;
            renderResults();
        }
    });
    document.addEventListener('keydown', function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runGeneration();
            return;
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            el('field-search').focus();
            return;
        }
        if (e.key === 'Escape' && document.activeElement === el('field-search')) {
            el('field-search').value = '';
            applyFilter();
            renderResults();
            updateStats();
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadFavorites();
    loadHistory();
    loadTheme();
    loadConfig();
    syncCustomPasswordState();
    applyFilter();
    renderResults();
    updateStats();
    bindEvents();
});