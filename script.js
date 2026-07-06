/* ============================================================
   Gourmet Garden — script.js
   All animations, cart, form, and interactions
   ============================================================ */

'use strict';

/* ─── Cart State ─── */
let cart = [];
try { cart = JSON.parse(localStorage.getItem('gourmetCart')) || []; } catch(e) { cart = []; }
let orderMode = 'delivery';
let selectedPayment = 'upi';

function saveCart() {
  try { localStorage.setItem('gourmetCart', JSON.stringify(cart)); } catch(e) {}
}

/* ================================================================
   PAGE LOADER
   ================================================================ */
window.addEventListener('load', function() {
  var loader = document.getElementById('page-loader');
  if (!loader) return;
  setTimeout(function() {
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
    setTimeout(function() { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 700);
  }, 1300);
});

/* ================================================================
   STICKY NAV
   ================================================================ */
(function() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 60); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ================================================================
   HAMBURGER / MOBILE NAV
   ================================================================ */
(function() {
  var btn      = document.getElementById('hamburger-btn');
  var closeBtn = document.getElementById('mobile-close-btn');
  var mNav     = document.getElementById('mobile-nav');
  if (!btn || !mNav) return;

  function openNav()  { mNav.classList.add('open'); btn.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeNav() { mNav.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow = ''; }

  btn.addEventListener('click', openNav);
  if (closeBtn) closeBtn.addEventListener('click', closeNav);
  mNav.addEventListener('click', function(e) { if (e.target.tagName === 'A') closeNav(); });
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeNav(); });
})();

/* ================================================================
   SCROLL REVEAL — Intersection Observer
   ================================================================ */
(function() {
  var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!els.length || !('IntersectionObserver' in window)) {
    // Fallback: show all
    els.forEach(function(el) { el.classList.add('revealed'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  els.forEach(function(el) { obs.observe(el); });
})();

/* ================================================================
   HERO PARALLAX (index.html)
   ================================================================ */
(function() {
  var bg = document.getElementById('hero-bg');
  if (!bg) return;
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      bg.style.transform = 'translateY(' + (window.scrollY * 0.3) + 'px)';
      ticking = false;
    });
  }, { passive: true });
})();

/* ================================================================
   3D PLATE — Mouse Tilt (index.html)
   ================================================================ */
(function() {
  var plate = document.getElementById('plate-3d');
  var hero  = document.querySelector('.hero-section');
  if (!plate || !hero) return;

  hero.addEventListener('mousemove', function(e) {
    var rect = hero.getBoundingClientRect();
    var cx = rect.left + rect.width  / 2;
    var cy = rect.top  + rect.height / 2;
    var rotY = ((e.clientX - cx) / (rect.width  / 2)) * 12;
    var rotX = -((e.clientY - cy) / (rect.height / 2)) * 8;
    plate.style.transition = 'transform 0.12s ease-out';
    plate.style.transform  = 'rotateX(' + (rotX + 8) + 'deg) rotateY(' + (rotY - 8) + 'deg)';
  });

  hero.addEventListener('mouseleave', function() {
    plate.style.transition = 'transform 0.8s ease-out';
    plate.style.transform  = '';
  });
})();

/* ================================================================
   ABOUT PAGE PARALLAX (about.html)
   ================================================================ */
(function() {
  var l1 = document.getElementById('about-layer1');
  var l2 = document.getElementById('about-layer2');
  if (!l1 && !l2) return;
  var ticking = false;
  window.addEventListener('scroll', function() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function() {
      var sy = window.scrollY;
      if (l1) l1.style.transform = 'translateY(' + (sy * 0.12) + 'px)';
      if (l2) l2.style.transform = 'translateY(' + (sy * 0.25) + 'px)';
      ticking = false;
    });
  }, { passive: true });
})();

/* ================================================================
   MAGNETIC BUTTONS
   ================================================================ */
(function() {
  document.querySelectorAll('.magnetic').forEach(function(el) {
    el.addEventListener('mousemove', function(e) {
      var r  = el.getBoundingClientRect();
      var dx = (e.clientX - r.left - r.width  / 2) * 0.22;
      var dy = (e.clientY - r.top  - r.height / 2) * 0.22;
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.04)';
    });
    el.addEventListener('mouseleave', function() {
      el.style.transform = '';
    });
  });
})();

/* ================================================================
   RIPPLE on .btn clicks
   ================================================================ */
document.addEventListener('click', function(e) {
  var btn = e.target.closest && e.target.closest('.btn');
  if (!btn) return;
  var r = btn.getBoundingClientRect();
  var sz = Math.max(r.width, r.height);
  var x  = e.clientX - r.left - sz / 2;
  var y  = e.clientY - r.top  - sz / 2;
  var rip = document.createElement('span');
  rip.className = 'ripple';
  rip.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;left:' + x + 'px;top:' + y + 'px;';
  btn.appendChild(rip);
  rip.addEventListener('animationend', function() { rip.parentNode && rip.parentNode.removeChild(rip); });
});

/* ================================================================
   ANIMATED COUNTERS
   ================================================================ */
(function() {
  var counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  if (!('IntersectionObserver' in window)) {
    counters.forEach(function(el) { el.textContent = el.dataset.target; });
    return;
  }
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var target = parseFloat(el.dataset.target || '0');
      var isFloat = target % 1 !== 0;
      var dur = 1600;
      var start = performance.now();
      function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var ease = 1 - Math.pow(1 - p, 3);
        el.textContent = isFloat ? (target * ease).toFixed(1) : Math.round(target * ease);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(function(el) { obs.observe(el); });
})();

/* ================================================================
   CUISINE STRIPS — click to go to order page (index.html)
   ================================================================ */
(function() {
  document.querySelectorAll('.cuisine-strip').forEach(function(strip) {
    strip.setAttribute('role', 'link');
    strip.setAttribute('tabindex', '0');
    strip.style.cursor = 'pointer';
    strip.addEventListener('click', function() { window.location.href = 'order.html'; });
    strip.addEventListener('keydown', function(e) { if (e.key === 'Enter') window.location.href = 'order.html'; });
  });
})();

/* ================================================================
   SMOOTH SCROLL for #anchor links
   ================================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var id = link.getAttribute('href');
    if (id === '#') return;
    var target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ================================================================
   ORDER PAGE — Menu filter tabs
   ================================================================ */
window.filterMenu = function(category) {
  // Update tab active state
  var tabs = document.querySelectorAll('.menu-tab');
  var cats = ['all','fastfood','mains','chinese','breakfast','desserts'];
  tabs.forEach(function(tab, i) {
    var isActive = cats[i] === category;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  // Show/hide items
  document.querySelectorAll('.menu-item').forEach(function(item) {
    var show = category === 'all' || item.dataset.cat === category;
    item.style.display = show ? 'grid' : 'none';
  });

  // Show/hide section headers
  document.querySelectorAll('.menu-section-header').forEach(function(hdr) {
    var targetCat = hdr.dataset.for;
    hdr.style.display = (category === 'all' || targetCat === category) ? '' : 'none';
  });
};

window.setOrderMode = function(mode) {
  orderMode = mode;
  document.querySelectorAll('.mode-btn').forEach(function(b) { b.classList.remove('active'); });
  var active = document.getElementById('btn-' + mode);
  if (active) active.classList.add('active');
};

/* ================================================================
   CART
   ================================================================ */
window.addToCart = function(btn, name, price) {
  var existing = null;
  cart.forEach(function(i) { if (i.name === name) existing = i; });
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name: name, price: price, qty: 1 });
  }
  var orig = btn.innerHTML;
  btn.classList.add('added');
  btn.innerHTML = '✓';
  setTimeout(function() { btn.classList.remove('added'); btn.innerHTML = orig; }, 1100);
  saveCart();
  renderCart();
};

window.changeQty = function(idx, delta) {
  if (!cart[idx]) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  renderCart();
};

function renderCart() {
  var itemsEl    = document.getElementById('cart-items');
  var emptyEl    = document.getElementById('cart-empty');
  var footerEl   = document.getElementById('cart-footer');
  var countEl    = document.getElementById('cart-count');
  var stickyEl   = document.getElementById('sticky-cart-count');
  var subtotalEl = document.getElementById('cart-subtotal');
  var taxEl      = document.getElementById('cart-tax');
  var totalEl    = document.getElementById('cart-total');

  if (!itemsEl) return;

  var totalQty  = cart.reduce(function(s, i) { return s + i.qty; }, 0);
  var subtotal  = cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  var tax       = Math.round(subtotal * 0.05);
  var grand     = subtotal + tax;

  if (countEl)    countEl.textContent  = totalQty;
  if (stickyEl)   stickyEl.textContent = totalQty;
  if (subtotalEl) subtotalEl.textContent = '\u20b9' + subtotal;
  if (taxEl)      taxEl.textContent    = '\u20b9' + tax;
  if (totalEl)    totalEl.textContent  = '\u20b9' + grand;

  if (emptyEl)  emptyEl.style.display  = cart.length ? 'none' : 'block';
  if (footerEl) footerEl.style.display = cart.length ? 'block' : 'none';

  itemsEl.innerHTML = '';
  cart.forEach(function(item, idx) {
    var div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML =
      '<span class="cart-item-name">' + item.name + '</span>' +
      '<div class="cart-item-qty">' +
        '<button class="qty-btn" onclick="changeQty(' + idx + ',-1)" aria-label="Decrease">\u2212</button>' +
        '<span class="qty-num">' + item.qty + '</span>' +
        '<button class="qty-btn" onclick="changeQty(' + idx + ',1)" aria-label="Increase">+</button>' +
      '</div>' +
      '<span class="cart-item-price">\u20b9' + (item.price * item.qty) + '</span>';
    itemsEl.appendChild(div);
  });
}

/* ================================================================
   PAYMENT FLOW
   ================================================================ */
window.showPayment = function() {
  if (!cart.length) { alert('Please add at least one item!'); return; }
  var payEl = document.getElementById('payment');
  if (payEl) {
    payEl.classList.add('visible');
    setTimeout(function() { payEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, 100);
  }
};

window.selectPayment = function(el, method) {
  selectedPayment = method;
  document.querySelectorAll('.payment-method').forEach(function(m) { m.classList.remove('selected'); });
  el.classList.add('selected');
};

window.processPayment = function() {
  if (!cart.length) return;
  var grand   = (document.getElementById('cart-total') || {}).textContent || '₹0';
  var msgs    = {
    upi:  'Order confirmed! Pay ' + grand + ' via UPI. WhatsApp confirmation sent. 🎉',
    card: 'Card payment of ' + grand + ' being processed. Order confirmed! 🎉',
    cod:  'Order confirmed! Pay ' + grand + ' cash on delivery. 📦'
  };
  var successEl = document.getElementById('order-success');
  var msgEl     = document.getElementById('success-msg');
  if (msgEl)     msgEl.textContent = msgs[selectedPayment] || msgs.upi;
  if (successEl) successEl.style.display = 'block';

  var payEl = document.getElementById('payment');
  if (payEl) {
    payEl.querySelectorAll('.btn-primary, .btn-ghost, .payment-method, h4').forEach(function(e) { e.style.display = 'none'; });
  }

  var itemList = cart.map(function(i) { return i.name + ' \xd7' + i.qty; }).join(', ');
  var waMsg    = encodeURIComponent('New Order!\nItems: ' + itemList + '\nTotal: ' + grand + '\nMode: ' + orderMode);
  setTimeout(function() { window.open('https://wa.me/919876543210?text=' + waMsg, '_blank'); }, 1500);

  cart = [];
  saveCart();
  renderCart();
};

window.backToCart = function() {
  var payEl = document.getElementById('payment');
  if (payEl) payEl.classList.remove('visible');
};

window.resetOrder = function() {
  var payEl = document.getElementById('payment');
  if (payEl) {
    payEl.classList.remove('visible');
    payEl.querySelectorAll('.btn-primary, .btn-ghost, .payment-method, h4').forEach(function(e) { e.style.display = ''; });
  }
  var successEl = document.getElementById('order-success');
  if (successEl) successEl.style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

/* ================================================================
   RESERVATION FORM (reserve.html)
   ================================================================ */
(function() {
  var form = document.getElementById('reservation-form');
  if (!form) return;

  var successEl = document.getElementById('form-success');
  var errorEl   = document.getElementById('form-error');
  var btn       = document.getElementById('res-submit-btn');
  var spanEl    = btn && btn.querySelector('span');

  function showMsg(el, msg) {
    if (!el) return;
    el.textContent = msg;
    el.style.display = 'block';
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(function() { el.style.display = 'none'; }, 7000);
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var name   = (form.querySelector('#res-name')   || {}).value || '';
    var phone  = (form.querySelector('#res-phone')  || {}).value || '';
    var guests = (form.querySelector('#res-guests') || {}).value || '';
    var time   = (form.querySelector('#res-time')   || {}).value || '';
    name = name.trim(); phone = phone.trim();

    if (!name || !phone || !guests || !time) {
      showMsg(errorEl, 'Please fill in all required fields.');
      return;
    }
    if (btn) btn.disabled = true;
    if (spanEl) spanEl.textContent = 'Sending…';

    // Directly open WhatsApp (Formspree URL is placeholder)
    var waMsg = encodeURIComponent('Hi! Table Reservation\nName: ' + name + '\nPhone: ' + phone + '\nGuests: ' + guests + '\nTime: ' + time);
    window.open('https://wa.me/919876543210?text=' + waMsg, '_blank');
    form.reset();
    // Reset select labels
    document.querySelectorAll('.form-select').forEach(function(s) { updateSelectLabel(s); });
    showMsg(successEl, '✅ WhatsApp opened! We\'ll confirm your reservation shortly.');

    setTimeout(function() {
      if (btn) btn.disabled = false;
      if (spanEl) spanEl.textContent = 'Confirm Reservation';
    }, 2000);
  });
})();

/* ================================================================
   FLOATING LABEL — select elements
   ================================================================ */
function updateSelectLabel(sel) {
  var label = sel.parentElement && sel.parentElement.querySelector('.form-label');
  if (!label) return;
  if (sel.value) {
    label.style.top = '6px';
    label.style.fontSize = '0.7rem';
    label.style.color = 'var(--clr-primary)';
  } else {
    label.style.top = '14px';
    label.style.fontSize = '0.85rem';
    label.style.color = 'var(--clr-text-muted)';
  }
}
(function() {
  document.querySelectorAll('.form-select').forEach(function(sel) {
    sel.addEventListener('change', function() { updateSelectLabel(sel); });
    updateSelectLabel(sel);
  });
})();

/* ================================================================
   INIT — ORDER PAGE
   ================================================================ */
(function() {
  if (!document.getElementById('order')) return;
  filterMenu('all');
  renderCart();
})();
