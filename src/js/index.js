document.addEventListener('DOMContentLoaded', function () {
  if (window.lucide) {
    lucide.createIcons();
  }

  var bg = document.querySelector('.bg');
  var isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (bg && isFinePointer) {
    document.addEventListener('mousemove', function (event) {
      var x = (event.clientX / window.innerWidth - 0.5) * 14;
      var y = (event.clientY / window.innerHeight - 0.5) * 14;
      bg.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
    });
  }

  var mainDropdown = document.getElementById('mainDropdown');
  var mainDropdownTrigger = document.getElementById('mainDropdownTrigger');
  var mainDropdownMenu = document.getElementById('mainDropdownMenu');
  var mainDropdownDataEl = document.getElementById('mainDropdownData');

  function closeDropdown() {
    mainDropdown.classList.remove('open');
    mainDropdownTrigger.setAttribute('aria-expanded', 'false');
  }

  function openDropdown() {
    mainDropdown.classList.add('open');
    mainDropdownTrigger.setAttribute('aria-expanded', 'true');
  }

  if (mainDropdown && mainDropdownTrigger && mainDropdownMenu && mainDropdownDataEl) {
    var items = JSON.parse(mainDropdownDataEl.textContent);

    items.forEach(function (data, index) {
      var item = document.createElement('button');
      item.className = 'nav-dropdown-item';
      item.type = 'button';
      item.style.setProperty('--item-index', index);
      item.innerHTML =
        '<i data-lucide="' + data.icon + '"></i>' +
        '<span>' + data.label + '</span>' +
        '<i data-lucide="check" class="nav-dropdown-check"></i>';

      item.addEventListener('click', function () {
        Array.prototype.slice.call(mainDropdownMenu.children).forEach(function (other) {
          other.classList.remove('active');
        });
        item.classList.add('active');

        closeDropdown();

        if (data.href) {
          window.location.href = data.href;
        }
      });

      mainDropdownMenu.appendChild(item);
    });

    if (window.lucide) {
      lucide.createIcons();
    }

    mainDropdownTrigger.addEventListener('click', function (event) {
      event.stopPropagation();
      if (mainDropdown.classList.contains('open')) {
        closeDropdown();
      } else {
        openDropdown();
      }
    });

    document.addEventListener('click', function (event) {
      if (!mainDropdown.contains(event.target)) {
        closeDropdown();
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
        closeDropdown();
      }
    });
  }
});