/* Micro-interacțiuni (Motion v13, vendored în motion.mjs) — progressive enhancement:
   fără modulul ăsta site-ul funcționează identic. Nu rulează cu prefers-reduced-motion sau ?noanim —
   iar în acele cazuri motion.mjs (73KB) nici nu se mai descarcă (import dinamic).
   Fiecare efect e izolat în try/catch ca o eroare să nu le oprească pe celelalte. */

var off = matchMedia('(prefers-reduced-motion: reduce)').matches ||
          document.documentElement.classList.contains('no-anim');

window.__motionEnhance = off ? 'off' : 'pending'; // sondă pentru audit

if (!off) import('./motion.mjs').then(function (M) {
  var animate = M.animate, scroll = M.scroll, hover = M.hover, press = M.press;

  // 1) Numerele din hero cresc la prima vedere (o singură dată per număr)
  try {
    document.querySelectorAll('.hero-stats strong[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var suffix = el.getAttribute('data-suffix') || '';
      var sep = el.getAttribute('data-sep') || '';
      var done = false;
      var io = new IntersectionObserver(function (es) {
        if (done || !es.some(function (e) { return e.isIntersecting; })) return;
        done = true;
        io.disconnect();
        animate(0, target, {
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: function (v) {
            var s = String(Math.round(v));
            if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
            el.textContent = s + suffix;
          }
        });
      }, { threshold: 0.9 });
      io.observe(el);
    });
  } catch (e) {}

  // 2) Spring pe CTA-uri și iconițele sociale (doar mouse real, nu touch)
  try {
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var spr = { type: 'spring', stiffness: 420, damping: 24 };
      hover('.cta-row .btn, .nav-cta, .hero-social a', function (el) {
        animate(el, { scale: 1.045 }, spr);
        return function () { animate(el, { scale: 1 }, spr); };
      });
      press('.cta-row .btn, .nav-cta', function (el) {
        animate(el, { scale: 0.965 }, { type: 'spring', stiffness: 550, damping: 32 });
        return function () { animate(el, { scale: 1 }, spr); };
      });
    }
  } catch (e) {}

  // 3) Live Stage: spotlight după mouse (doar desktop) + scena se stinge la scroll
  try {
    var hero = document.querySelector('.hero');
    var grid = hero && hero.querySelector('.hero-grid');
    if (hero && grid) {
      if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
        var spot = document.createElement('div');
        spot.className = 'hero-spot';
        spot.setAttribute('aria-hidden', 'true');
        hero.insertBefore(spot, grid);
        var sx = 50, sy = 30, tx = 50, ty = 30, raf = 0;
        var step = function () {
          sx += (tx - sx) * 0.12;
          sy += (ty - sy) * 0.12;
          spot.style.setProperty('--sx', sx.toFixed(2) + '%');
          spot.style.setProperty('--sy', sy.toFixed(2) + '%');
          raf = (Math.abs(tx - sx) + Math.abs(ty - sy) > 0.2) ? requestAnimationFrame(step) : 0;
        };
        hero.addEventListener('pointermove', function (e) {
          var r = hero.getBoundingClientRect();
          tx = (e.clientX - r.left) / r.width * 100;
          ty = (e.clientY - r.top) / r.height * 100;
          if (!raf) raf = requestAnimationFrame(step);
        }, { passive: true });
      }
      var dim = document.createElement('div');
      dim.className = 'hero-dim';
      dim.setAttribute('aria-hidden', 'true');
      hero.insertBefore(dim, grid);
      scroll(animate(dim, { opacity: [0, 0.85] }, { ease: 'linear' }), {
        target: hero,
        offset: ['start start', 'end start']
      });
    }
  } catch (e) {}

  // 4) Scroll Journey: separatoare-EQ care se ridică o dată la intrare + reveal pe titluri
  try {
    document.documentElement.classList.add('sj');
    document.querySelectorAll('.section').forEach(function (sec) {
      var sep = document.createElement('div');
      sep.className = 'sep-eq';
      sep.setAttribute('aria-hidden', 'true');
      var levels = [];
      for (var i = 0; i < 22; i++) {
        var b = document.createElement('i');
        var bell = Math.sin((i + 1) / 23 * Math.PI);
        levels.push(0.25 + 0.75 * bell * (0.55 + Math.random() * 0.45));
        sep.appendChild(b);
      }
      sec.prepend(sep);
      var io1 = new IntersectionObserver(function (es) {
        if (!es.some(function (e) { return e.isIntersecting; })) return;
        io1.disconnect();
        Array.prototype.forEach.call(sep.children, function (b, i) {
          animate(b, { scaleY: [0, levels[i]] }, { duration: 0.5, delay: i * 0.028, ease: [0.22, 1, 0.36, 1] });
        });
      }, { threshold: 0.9 });
      io1.observe(sep);
      var h2 = sec.querySelector('h2');
      if (h2) {
        h2.style.opacity = '0';
        var io2 = new IntersectionObserver(function (es) {
          if (!es.some(function (e) { return e.isIntersecting; })) return;
          io2.disconnect();
          try {
            animate(h2, {
              clipPath: ['inset(0 100% 0 0)', 'inset(0 0 0 0)'],
              opacity: [0, 1]
            }, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
          } catch (err) {}
          /* plasă de siguranță: orice-ar păți animația, titlul rămâne vizibil */
          setTimeout(function () { h2.style.opacity = ''; h2.style.clipPath = ''; }, 1200);
        }, { threshold: 0.6 });
        io2.observe(h2);
      }
    });
  } catch (e) {}

  // 5) Mixer Deck: vinyl în spatele coperților + tilt 3D pe carduri (doar mouse)
  try {
    document.querySelectorAll('.release .cover').forEach(function (cv) {
      var v = document.createElement('span');
      v.className = 'vinyl';
      v.setAttribute('aria-hidden', 'true');
      cv.parentNode.insertBefore(v, cv.nextSibling);
    });
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var sprT = { type: 'spring', stiffness: 260, damping: 20 };
      document.querySelectorAll('.release').forEach(function (card) {
        card.addEventListener('pointermove', function (e) {
          var r = card.getBoundingClientRect();
          animate(card, {
            rotateY: ((e.clientX - r.left) / r.width - 0.5) * 8,
            rotateX: -((e.clientY - r.top) / r.height - 0.5) * 6
          }, sprT);
        }, { passive: true });
        card.addEventListener('pointerleave', function () {
          animate(card, { rotateY: 0, rotateX: 0 }, sprT);
        });
      });
    }
  } catch (e) {}

  // 6) Lightbox: micro-tranziție la schimbarea pozei
  try {
    var lbImg = document.getElementById('lb-img');
    if (lbImg) {
      new MutationObserver(function () {
        animate(lbImg, { opacity: [0.3, 1], x: [10, 0] }, { duration: 0.26, ease: 'easeOut' });
      }).observe(lbImg, { attributes: true, attributeFilter: ['src'] });
    }
  } catch (e) {}

  window.__motionEnhance = 'on';
}).catch(function () { window.__motionEnhance = 'error'; });
