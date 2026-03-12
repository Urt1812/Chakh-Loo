// ============================================
//  Chakh लो – Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHamburger();
  initScrollReveal();
  initWishlist();
});

// ---- NAVBAR SCROLL ----
function initNavbar() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ---- HAMBURGER MENU ----
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const links = document.getElementById('navLinks');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !links.contains(e.target)) {
      links.classList.remove('open');
    }
  });
}

// ---- SCROLL REVEAL ----
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => obs.observe(el));
}

// ---- WISHLIST ----
function initWishlist() {
  const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
  document.querySelectorAll('.wishlist-btn').forEach((btn, i) => {
    if (saved.includes(i)) { btn.textContent = '♥'; btn.classList.add('active'); }
  });
}
function toggleWishlist(btn) {
  const btns = [...document.querySelectorAll('.wishlist-btn')];
  const idx = btns.indexOf(btn);
  const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
  if (btn.classList.contains('active')) {
    btn.classList.remove('active');
    btn.textContent = '♡';
    const i = saved.indexOf(idx);
    if (i > -1) saved.splice(i, 1);
  } else {
    btn.classList.add('active');
    btn.textContent = '♥';
    saved.push(idx);
  }
  localStorage.setItem('wishlist', JSON.stringify(saved));
}

// ---- NEWSLETTER ----
function handleSubscribe(e) {
  e.preventDefault();
  const email = document.getElementById('nlEmail').value;
  const form = e.target;
  const success = document.getElementById('nlSuccess');
  if (email) {
    form.style.display = 'none';
    success.style.display = 'inline-block';
  }
}

// ---- NAV SEARCH ----
function handleNavSearch() {
  const q = document.getElementById('navSearchInput')?.value.trim();
  if (q) window.location.href = `menu.html?q=${encodeURIComponent(q)}`;
}
document.getElementById('navSearchInput')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleNavSearch();
});

// ---- MENU PAGE ----
function initMenuPage() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.menu-item');
  const searchInput = document.getElementById('menuSearch');
  const params = new URLSearchParams(window.location.search);
  const initCat = params.get('cat') || 'all';
  const initQ = params.get('q') || '';

  if (searchInput && initQ) searchInput.value = initQ;

  function filterItems() {
    const activeCat = document.querySelector('.filter-btn.active')?.dataset.cat || 'all';
    const q = searchInput ? searchInput.value.toLowerCase() : '';
    items.forEach(item => {
      const cat = item.dataset.cat || '';
      const name = item.querySelector('h3')?.textContent.toLowerCase() || '';
      const desc = item.querySelector('p')?.textContent.toLowerCase() || '';
      const catMatch = activeCat === 'all' || cat === activeCat;
      const qMatch = !q || name.includes(q) || desc.includes(q) || cat.includes(q);
      item.classList.toggle('visible', catMatch && qMatch);
    });
  }

  filterBtns.forEach(btn => {
    if (btn.dataset.cat === initCat) btn.classList.add('active');
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterItems();
    });
  });

  if (searchInput) searchInput.addEventListener('input', filterItems);

  filterItems();
}

// ---- CONTACT FORM ----
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    form.style.display = 'none';
    success.style.display = 'block';
  });
}

// Run page-specific init
if (document.querySelector('.menu-grid')) initMenuPage();
if (document.getElementById('contactForm')) initContactForm();