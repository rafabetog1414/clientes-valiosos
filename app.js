document.documentElement.classList.add('js');
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');

  function navState(){ nav.classList.toggle('stuck', scrollY > 40); }
  addEventListener('scroll', navState, {passive:true}); navState();

  burger.addEventListener('click', function(){
    var open = nav.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  });
  document.querySelectorAll('#navLinks a').forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('nav-open'); burger.setAttribute('aria-expanded','false'); });
  });

  var sr = document.querySelectorAll('.sr');
  if('IntersectionObserver' in window && !reduce){
    var o = new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('on'); o.unobserve(e.target);} }); }, {threshold:.12, rootMargin:'0px 0px -40px 0px'});
    sr.forEach(function(el){ o.observe(el); });
  } else { sr.forEach(function(el){ el.classList.add('on'); }); }

  var h1 = document.querySelector('.hero-h1');
  if(h1){ requestAnimationFrame(function(){ setTimeout(function(){ h1.classList.add('in'); }, 120); }); }

  function counter(el, target, suffix, dur){
    if(!el) return;
    if(reduce){ el.innerHTML = target + '<span>' + suffix + '</span>'; return; }
    var s = performance.now();
    (function tick(now){
      var t = Math.min((now - s)/dur, 1);
      var e = 1 - Math.pow(1 - t, 3);
      el.innerHTML = Math.round(e*target) + '<span>' + suffix + '</span>';
      if(t < 1) requestAnimationFrame(tick);
    })(s);
  }
  var statsDone = false;
  var statsEl = document.getElementById('stats');
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(es){
      if(es[0].isIntersecting && !statsDone){
        statsDone = true;
        counter(document.getElementById('c1'), 63, '%', 1700);
        counter(document.getElementById('c2'), 85, '%', 1900);
      }
    }, {threshold:.4}).observe(statsEl);
  } else {
    counter(document.getElementById('c1'),63,'%',0); counter(document.getElementById('c2'),85,'%',0);
  }

  var bar = document.getElementById('progress');
  var top = document.getElementById('totop');
  var mcta = document.getElementById('mcta');
  var wafloat = document.getElementById('wafloat');
  if(window.innerWidth <= 760){ document.body.classList.add('has-mcta'); }
  function onScroll(){
    var h = document.documentElement;
    var sc = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = (sc*100) + '%';
    top.classList.toggle('show', h.scrollTop > 600);
    if(mcta){ mcta.classList.toggle('show', h.scrollTop > 700); }
    if(wafloat){ wafloat.classList.toggle('show', h.scrollTop > 220); }
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();
  top.addEventListener('click', function(){ scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'}); });

  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = a.getAttribute('href'); if(id === '#') return;
      var t = document.querySelector(id); if(!t) return;
      e.preventDefault();
      t.scrollIntoView({behavior: reduce ? 'auto' : 'smooth', block:'start'});
    });
  });

  if(reduce) return;

  var hero = document.getElementById('hero');
  var orbs = [].slice.call(document.querySelectorAll('.hero-orb'));
  if(hero){
    hero.addEventListener('pointermove', function(e){
      var r = hero.getBoundingClientRect();
      var dx = (e.clientX - r.width/2)/r.width, dy = (e.clientY - r.height/2)/r.height;
      orbs.forEach(function(o,i){ o.style.transform = 'translate(' + (dx*(i+1)*20) + 'px,' + (dy*(i+1)*20) + 'px)'; });
    });
    hero.addEventListener('pointerleave', function(){ orbs.forEach(function(o){ o.style.transform=''; }); });
  }

  document.querySelectorAll('.svc,.vy-card,.step').forEach(function(card){
    card.addEventListener('pointermove', function(e){
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left)/r.width - .5, py = (e.clientY - r.top)/r.height - .5;
      card.style.transform = 'perspective(900px) rotateX(' + (-py*4) + 'deg) rotateY(' + (px*5) + 'deg) translateY(-5px)';
    });
    card.addEventListener('pointerleave', function(){ card.style.transform=''; });
  });

  document.querySelectorAll('.btn-gold,.nav-cta').forEach(function(b){
    b.addEventListener('pointermove', function(e){
      var r = b.getBoundingClientRect();
      b.style.transform = 'translate(' + ((e.clientX-r.left-r.width/2)*.15) + 'px,' + ((e.clientY-r.top-r.height/2)*.22) + 'px)';
    });
    b.addEventListener('pointerleave', function(){ b.style.transform=''; });
  });

  var band = document.querySelector('.band');
  if(band){
    var bg = band.querySelector('.band-bg');
    function bandUpd(){
      var r = band.getBoundingClientRect();
      if(r.bottom < 0 || r.top > innerHeight) return;
      var p = (innerHeight - r.top)/(innerHeight + r.height);
      bg.style.transform = 'translateY(' + ((p-.5)*50) + 'px)';
    }
    addEventListener('scroll', bandUpd, {passive:true}); addEventListener('resize', bandUpd); bandUpd();
  }
})();
