function switchKS(btn,contentId){
  var container=btn.closest('section')||btn.closest('.page');
  container.querySelectorAll('.ks-tab').forEach(function(t){t.classList.remove('active');});
  container.querySelectorAll('.ks-content').forEach(function(c){c.classList.remove('active');});
  btn.classList.add('active');
  var c=document.getElementById(contentId);
  if(c)c.classList.add('active');
}
function toggleFAQ(el){
  var ans=el.nextElementSibling;
  var arrow=el.querySelector('.faq-arrow');
  var isOpen=ans.classList.contains('open');
  var list=el.closest('.faq-list');
  list.querySelectorAll('.faq-a').forEach(function(a){a.classList.remove('open');});
  list.querySelectorAll('.faq-arrow').forEach(function(a){a.classList.remove('open');});
  if(!isOpen){ans.classList.add('open');if(arrow)arrow.classList.add('open');}
}
function toggleEmail(el){
  var body=el.nextElementSibling;
  var arrow=el.querySelector('.toggle-arrow');
  var isOpen=body.classList.contains('open');
  body.classList.toggle('open',!isOpen);
  if(arrow)arrow.classList.toggle('open',!isOpen);
}
function filterTestimonials(cat,btn){
  document.querySelectorAll('#testi-filters .filter-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  document.querySelectorAll('#testi-grid .testi-card').forEach(function(card){
    card.style.display=(cat==='all'||card.dataset.cat.includes(cat))?'flex':'none';
  });
}
function filterResources(cat,btn){
  document.querySelectorAll('.resources-filters .filter-btn').forEach(function(b){b.classList.remove('active');});
  btn.classList.add('active');
  document.querySelectorAll('#resources-grid .blog-card').forEach(function(card){
    card.style.display=(cat==='all'||card.dataset.cat.includes(cat))?'block':'none';
  });
}
function validateEnquiryForm(){
  var name=document.getElementById('f-name').value.trim();
  var email=document.getElementById('f-email').value.trim();
  var consent=document.getElementById('f-consent').checked;
  if(!name||!email){showNotif('Please fill in your name and email address.');return false;}
  if(!consent){showNotif('Please tick the consent checkbox to proceed.');return false;}
  var btn=document.querySelector('.btn-submit');
  if(btn){btn.disabled=true;btn.textContent='Sending…';}
  return true;
}
if(location.search.indexOf('sent=1')!==-1){
  var wrap=document.getElementById('contact-form-wrap');
  var msg=document.getElementById('success-msg');
  if(wrap && msg){wrap.style.display='none';msg.style.display='block';}
}
function showNotif(msg){
  var n=document.getElementById('notif');
  n.textContent=msg;n.classList.add('show');
  setTimeout(function(){n.classList.remove('show');},4000);
}

/* --- contact map, loaded only when asked for ----------------------------
   The Google embed sets cookies the moment it loads, so it stays out of the
   page until a parent actually wants the map. The address and a directions
   link are in the markup either way, so this never hides information. */
function showMap(btn){
  var wrap=btn.closest('.map-embed');
  if(!wrap) return;
  var q=wrap.getAttribute('data-q');
  if(!q) return;
  wrap.innerHTML='';
  wrap.style.display='block';
  wrap.style.padding='0';
  wrap.style.overflow='hidden';
  var f=document.createElement('iframe');
  f.src='https://maps.google.com/maps?q='+q+'&output=embed';
  f.setAttribute('width','100%');
  f.setAttribute('height','100%');
  f.setAttribute('style','border:0;display:block');
  f.setAttribute('loading','lazy');
  f.setAttribute('referrerpolicy','no-referrer-when-downgrade');
  f.setAttribute('title','Horizon Tuition Redbridge location');
  wrap.appendChild(f);
}

/* --- 11+ Mock Exams promo popup --- */
function initPromoPopup(){
  var mocks=[
    {label:'Mock 1',date:new Date('2026-07-12T00:00:00+01:00'),display:'12 July'},
    {label:'Mock 2',date:new Date('2026-08-02T00:00:00+01:00'),display:'2 August'},
    {label:'Mock 3',date:new Date('2026-08-26T00:00:00+01:00'),display:'26 August'}
  ];
  var now=new Date();
  var upcoming=mocks.filter(function(m){return m.date>now;});
  if(upcoming.length===0)return; // promo retired, last mock has passed
  if(location.pathname.indexOf('/contact')===0)return; // don't pop up on the booking page itself
  var dismissed=localStorage.getItem('htr_promo_dismissed');
  if(dismissed && new Date(dismissed).toDateString()===now.toDateString())return;

  var rows=upcoming.map(function(m,i){
    return '<div class="promo-date-row'+(i===0?' next':'')+'"><span>'+m.label+'</span><strong>'+m.display+'</strong></div>';
  }).join('');

  var overlay=document.createElement('div');
  overlay.className='promo-overlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-label','11+ Mock Exams promotion');
  overlay.innerHTML=
    '<div class="promo-card">'+
      '<div class="promo-card-top">'+
        '<button class="promo-close" aria-label="Close">&times;</button>'+
        '<div class="promo-badge">🎯 11+ Mock Exams</div>'+
        '<h3>GL &amp; CSSE Mock Exams</h3>'+
        '<p>Real exam conditions, marked and returned with feedback.</p>'+
      '</div>'+
      '<div class="promo-card-body">'+
        '<div class="promo-dates">'+rows+'</div>'+
        '<div class="promo-price"><span class="num">£28</span><span class="note">per exam · 12:00-2:00pm</span></div>'+
        '<div class="promo-btns">'+
          '<a class="btn-primary" href="/contact/?promo=11plus-mock">Book a Place →</a>'+
          '<a class="promo-btn-outline" href="tel:02080586815">Call to Book</a>'+
        '</div>'+
      '</div>'+
    '</div>';
  document.body.appendChild(overlay);

  function closePromo(){
    overlay.classList.remove('show');
    localStorage.setItem('htr_promo_dismissed',new Date().toISOString());
    setTimeout(function(){overlay.remove();},350);
  }
  overlay.querySelector('.promo-close').addEventListener('click',closePromo);
  overlay.addEventListener('click',function(e){if(e.target===overlay)closePromo();});
  document.addEventListener('keydown',function esc(e){
    if(e.key==='Escape'){closePromo();document.removeEventListener('keydown',esc);}
  });
  setTimeout(function(){overlay.classList.add('show');},900);
}
document.addEventListener('DOMContentLoaded',initPromoPopup);

/* If arriving from the promo CTA, pre-tick 11+ Preparation on the contact form */
if(location.search.indexOf('promo=11plus-mock')!==-1){
  document.addEventListener('DOMContentLoaded',function(){
    var group=document.getElementById('f-subject-group');
    if(group){
      var box=group.querySelector('input[value="11+ Preparation"]');
      if(box)box.checked=true;
    }
    var msg=document.getElementById('f-message');
    if(msg && !msg.value)msg.value='Enquiring about the 11+ Mock Exam sessions.';
  });
}


/* --- reveal on scroll ---------------------------------------------------
   A rAF-throttled sweep rather than IntersectionObserver: an observer never
   fires for elements you jump straight past (anchor links, end-key, restored
   scroll position), which leaves that content permanently invisible. This
   cannot get stuck - anything at or above the fold is always revealed. */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SEL = '.section-head,.card,.pricing-card,.testimonial,.blog-card,.qual-badge,'
          + '.step,.policy-section,.hiw-step,.trust-item';
  document.addEventListener('DOMContentLoaded', function(){
    var els = [].slice.call(document.querySelectorAll(SEL));
    if(!els.length) return;
    if(reduce){ return; }                      // leave fully visible, no .reveal class
    els.forEach(function(el){ el.classList.add('reveal'); });
    var pending = false;
    function sweep(){
      pending = false;
      var doc = document.documentElement;
      var h = window.innerHeight || doc.clientHeight || 800;
      // Just below the fold. Much earlier than this and the transition has
      // already finished before the element scrolls into view, so the motion
      // is never actually seen; much later and it pops in after you are
      // already looking at the space it occupies.
      var line = h * 1.05;
      // If there is no scroll left to give, nothing below can ever cross the
      // line. Short pages would otherwise strand their last rows invisible.
      var maxScroll = Math.max(0, doc.scrollHeight - h);
      var atEnd = (window.pageYOffset || doc.scrollTop || 0) >= maxScroll - 2;
      var cut = 0;
      for(var i = 0; i < els.length; i++){
        if(atEnd || els[i].getBoundingClientRect().top < line){
          // stagger within this batch, not by position in the page: otherwise
          // anything revealed later on scroll starts on a long fixed delay
          els[i].style.transitionDelay = Math.min(i, 5) * 90 + 'ms';
          els[i].classList.add('is-in');
          cut = i + 1;                          // reveal once, then stop watching
        } else break;                           // document order: the rest are lower
      }
      if(cut) els.splice(0, cut);
      if(!els.length){
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      }
    }
    function onScroll(){
      if(pending) return;
      pending = true;
      window.requestAnimationFrame(sweep);
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);

    // Let the hidden state paint for one frame before revealing anything.
    // Adding .reveal and .is-in in the same frame means the browser never
    // renders opacity:0, so there is no transition and content simply
    // appears. Above the fold that is every element on the page.
    var started = false;
    function start(){ if(started) return; started = true; sweep(); }
    if(window.requestAnimationFrame){
      requestAnimationFrame(function(){
        requestAnimationFrame(function(){ setTimeout(start, 180); });
      });
    }
    setTimeout(start, 600);      // if rAF is throttled, do not wait forever
    // last-resort safety: never leave content hidden
    setTimeout(function(){
      // Last resort: drop the hiding class outright rather than adding the
      // shown one. Removing .reveal takes opacity:0 out of play entirely, so
      // the element is visible even if transitions never painted.
      document.querySelectorAll('.reveal:not(.is-in)').forEach(function(el){
        el.classList.remove('reveal');
        el.style.transitionDelay = '';
      });
    }, 2500);
  });
})();


/* --- expandable menu ---------------------------------------------------- */
function toggleMenu(e){
  if(e) e.stopPropagation();
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('megaMenu');
  if(!btn || !menu) return;
  var open = btn.getAttribute('aria-expanded') === 'true';
  if(open){ closeMenu(); return; }
  btn.setAttribute('aria-expanded','true');
  menu.hidden = false;
  menu.classList.add('animating');
  var nv = document.querySelector('nav'); if(nv) nv.classList.add('menu-open');
  var bd = document.createElement('div');
  bd.className = 'mega-backdrop';
  bd.id = 'megaBackdrop';
  bd.addEventListener('click', closeMenu);
  document.body.appendChild(bd);
}
function closeMenu(){
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('megaMenu');
  if(!btn || !menu) return;
  btn.setAttribute('aria-expanded','false');
  menu.hidden = true;
  menu.classList.remove('animating');
  var nv = document.querySelector('nav'); if(nv) nv.classList.remove('menu-open');
  var bd = document.getElementById('megaBackdrop');
  if(bd) bd.remove();
}
document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });
document.addEventListener('click', function(e){
  var menu = document.getElementById('megaMenu');
  var btn = document.getElementById('menuBtn');
  if(!menu || menu.hidden) return;
  if(!menu.contains(e.target) && btn && !btn.contains(e.target)) closeMenu();
});

/* --- review rail arrows -------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('.reviews-scroller').forEach(function(track){
    if(track.parentNode.classList.contains('reviews-rail')) return;
    var rail = document.createElement('div');
    rail.className = 'reviews-rail';
    track.parentNode.insertBefore(rail, track);
    rail.appendChild(track);
    var prev = document.createElement('button');
    prev.className = 'rail-btn rail-prev'; prev.type = 'button';
    prev.setAttribute('aria-label','Previous reviews'); prev.innerHTML = '&#8249;';
    var next = document.createElement('button');
    next.className = 'rail-btn rail-next'; next.type = 'button';
    next.setAttribute('aria-label','More reviews'); next.innerHTML = '&#8250;';
    rail.appendChild(prev); rail.appendChild(next);
    function step(){
      var card = track.firstElementChild;
      return card ? card.getBoundingClientRect().width + 20 : track.clientWidth * 0.8;
    }
    prev.addEventListener('click', function(){ track.scrollBy({left:-step(), behavior:'smooth'}); });
    next.addEventListener('click', function(){ track.scrollBy({left: step(), behavior:'smooth'}); });
    function sync(){
      prev.disabled = track.scrollLeft < 8;
      next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    }
    track.addEventListener('scroll', sync, {passive:true});
    window.addEventListener('resize', sync);
    sync();
  });
});


/* --- terms gate: accept only after reading to the end ------------------- */
document.addEventListener('DOMContentLoaded', function(){
  var box = document.getElementById('tcScroll');
  if(!box) return;
  var wrap = document.getElementById('tcAccept');
  var check = document.getElementById('tcCheck');
  var go = document.getElementById('tcContinue');
  var bar = document.getElementById('tcBar');
  var hint = document.getElementById('tcHint');
  var reachedEnd = false;

  function update(){
    var max = box.scrollHeight - box.clientHeight;
    var pct = max <= 0 ? 100 : Math.min(100, Math.round(box.scrollTop / max * 100));
    if(bar) bar.style.width = pct + '%';
    // max <= 0 means everything already fits on screen, so it has been seen
    if(!reachedEnd && (max <= 0 || box.scrollTop >= max - 24)){
      reachedEnd = true;
      check.disabled = false;
      wrap.classList.add('ready');
      if(hint) hint.textContent = 'Thanks for reading. Tick the box below to continue.';
    }
  }
  function sync(){ go.disabled = !(reachedEnd && check.checked); }

  box.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  check.addEventListener('change', sync);
  update(); sync();

  go.addEventListener('click', function(){
    if(go.disabled) return;
    var stamp = new Date().toISOString();
    var url = go.getAttribute('data-next');
    var join = url.indexOf('?') === -1 ? '?' : '&';
    location.href = url + join + 'tc=' + encodeURIComponent(go.getAttribute('data-version'))
                  + '&tcAt=' + encodeURIComponent(stamp);
  });
});

/* --- carry the acceptance into the registration submission -------------- */
document.addEventListener('DOMContentLoaded', function(){
  var form = document.getElementById('registration-form');
  if(!form) return;
  var p = new URLSearchParams(location.search);
  if(!p.get('tc')) return;
  var f = document.createElement('input');
  f.type = 'hidden';
  f.name = 'Terms Accepted';
  f.value = p.get('tc') + ' at ' + (p.get('tcAt') || 'unknown time');
  form.appendChild(f);
});


/* --- count up numbers when they scroll into view ------------------------ */
document.addEventListener('DOMContentLoaded', function(){
  var nums = [].slice.call(document.querySelectorAll('.stat-num[data-count]'));
  if(!nums.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ nums.forEach(function(n){ n.textContent = n.getAttribute('data-count'); }); return; }
  function run(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var start = null, dur = 900;
    // the element already shows the real number; only blank it once we know
    // a frame is actually running, so a stalled rAF never leaves a "0" on screen
    function frame(t){
      if(start === null) start = t;
      var p = Math.min(1, (t - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if(p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var pending = nums.slice();
  function sweep(){
    var h = window.innerHeight || 0;
    for(var i = pending.length - 1; i >= 0; i--){
      if(pending[i].getBoundingClientRect().top < h * 0.9){
        run(pending[i]); pending.splice(i, 1);
      }
    }
    if(!pending.length) window.removeEventListener('scroll', onScroll);
  }
  var queued = false;
  function onScroll(){ if(queued) return; queued = true;
    requestAnimationFrame(function(){ queued = false; sweep(); }); }
  window.addEventListener('scroll', onScroll, {passive:true});
  sweep();
  // never leave a zero on screen
  setTimeout(function(){ pending.forEach(function(n){
    n.textContent = n.getAttribute('data-count'); }); }, 1600);
});

/* --- registration progress fills as sections are completed -------------- */
document.addEventListener('DOMContentLoaded', function(){
  var form = document.getElementById('registration-form');
  var bar = document.querySelector('.reg-progress');
  if(!form || !bar) return;
  var pips = [].slice.call(bar.querySelectorAll('span'));
  var sections = [].slice.call(form.querySelectorAll('.reg-section'));
  if(!pips.length || !sections.length) return;
  function update(){
    sections.forEach(function(sec, i){
      if(!pips[i]) return;
      var req = [].slice.call(sec.querySelectorAll('[required]'));
      var filled = req.filter(function(f){
        return f.type === 'checkbox' ? f.checked : String(f.value || '').trim() !== '';
      }).length;
      // sections with nothing mandatory count as complete, otherwise the
      // optional medical section stays grey however much a parent fills in
      pips[i].classList.toggle('done', req.length === 0 || filled === req.length);
      pips[i].classList.toggle('part', filled > 0 && filled < req.length);
    });
  }
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  update();
});

/* --- exam timelines: continuous drag, colour tracks progress ------------ */
document.addEventListener('DOMContentLoaded', function(){
  var STOPS = [[59,130,246], [255,198,26], [22,163,74]];   // blue, amber, green
  function mix(a, b, t){
    return 'rgb(' + Math.round(a[0]+(b[0]-a[0])*t) + ','
                  + Math.round(a[1]+(b[1]-a[1])*t) + ','
                  + Math.round(a[2]+(b[2]-a[2])*t) + ')';
  }
  function colourAt(p){
    var seg = p * (STOPS.length - 1);
    var i = Math.min(STOPS.length - 2, Math.floor(seg));
    return mix(STOPS[i], STOPS[i+1], seg - i);
  }
  [].slice.call(document.querySelectorAll('.tl')).forEach(function(tl){
    var dots = [].slice.call(tl.querySelectorAll('.tl-dot'));
    var panels = [].slice.call(tl.querySelectorAll('.tl-panel'));
    var range = tl.querySelector('.tl-range');
    var fill = tl.querySelector('.tl-fill');
    if(!dots.length || !range) return;
    var last = -1;

    function apply(){
      var max = parseFloat(range.max) || 1000;
      var p = Math.min(1, Math.max(0, parseFloat(range.value) / max));
      tl.style.setProperty('--tl-c', colourAt(p));
      if(fill) fill.style.width = (p * 100) + '%';

      var i = Math.round(p * (dots.length - 1));
      dots.forEach(function(d, n){
        d.classList.toggle('is-on', n === i);
        d.classList.toggle('is-done', n < i);
        d.setAttribute('aria-pressed', n === i ? 'true' : 'false');
      });
      if(i !== last){
        last = i;
        panels.forEach(function(pn, n){
          pn.classList.remove('is-on');
          if(n === i){ void pn.offsetWidth; pn.classList.add('is-on'); }
        });
        if(dots[i]) range.setAttribute('aria-valuetext', dots[i].textContent.trim());
      }
    }

    range.addEventListener('input', apply);
    range.addEventListener('change', apply);
    dots.forEach(function(d){
      d.addEventListener('click', function(){
        var n = parseInt(d.getAttribute('data-i'), 10) || 0;
        range.value = Math.round(n / (dots.length - 1) * (parseFloat(range.max) || 1000));
        apply();
      });
    });
    apply();
  });
});


/* --- let people dismiss the contact bar --------------------------------- */
function hidePhoneBar(){
  document.documentElement.classList.add('no-phone-bar');
  try{ localStorage.setItem('htr-bar','off'); }catch(e){}
}


/* --- homepage: hero reveal, odometers, pinned sequence, year explorer ----
   Every block below is guarded, so this file stays safe on pages that do
   not contain these elements. */
(function(){
  var reduce = window.matchMedia &&
               window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function unmask(){
    document.querySelectorAll('.masked').forEach(function(h){
      h.classList.remove('masked');
    });
  }

  /* ---- hero ---- */
  var hero = document.getElementById('nhero');
  if(hero){
    if(reduce){ hero.classList.add('in'); unmask(); }
    else {
      requestAnimationFrame(function(){
        setTimeout(function(){ hero.classList.add('in'); }, 120);
      });
      /* visibility must never depend on an animation having run */
      setTimeout(function(){ unmask(); hero.classList.add('in'); }, 4000);
    }
  }

  /* ---- split one sentence into words ---- */
  document.querySelectorAll('[data-split]').forEach(function(p){
    var words = p.textContent.trim().split(/\s+/);
    p.textContent = '';
    words.forEach(function(w,i){
      var el = document.createElement('w');
      el.textContent = w;
      el.style.transitionDelay = (i*40) + 'ms';
      p.appendChild(el);
      if(i < words.length-1) p.appendChild(document.createTextNode(' '));
    });
  });

  /* ---- odometers ---- */
  document.querySelectorAll('.odo').forEach(function(o){
    String(o.dataset.n).split('').forEach(function(d,i){
      var wrap = document.createElement('span'); wrap.className = 'odo-d';
      var col  = document.createElement('span'); col.className  = 'odo-col';
      for(var n=0;n<=9;n++){
        var s = document.createElement('s'); s.textContent = n; col.appendChild(s);
      }
      col.dataset.target = d;
      col.style.transitionDelay = (i*110) + 'ms';
      wrap.appendChild(col); o.appendChild(wrap);
    });
  });
  function roll(root){
    root.querySelectorAll('.odo-col').forEach(function(c){
      c.style.transform = 'translateY(-' + c.dataset.target + 'em)';
    });
  }

  /* ---- reveal driver ---- */
  var items = [].slice.call(document.querySelectorAll('[data-anim]'));
  var stats = document.querySelector('.nstats');
  if(reduce){
    items.forEach(function(el){ el.classList.add('in'); });
    document.querySelectorAll('.shots').forEach(function(s){ s.classList.add('shown'); });
    roll(document);
  } else if(items.length || stats){
    if(items.length){
      var io = new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
        });
      },{threshold:0.25});
      items.forEach(function(el){ io.observe(el); });
    }
    if(stats){
      var io2 = new IntersectionObserver(function(es){
        es.forEach(function(e){ if(e.isIntersecting){ roll(e.target); io2.disconnect(); } });
      },{threshold:0.4});
      io2.observe(stats);
    }
    /* safety net for anything whose base state hides content */
    setTimeout(function(){
      document.querySelectorAll('.shots').forEach(function(s){ s.classList.add('shown'); });
      roll(document);
    }, 5000);
  }

  /* ---- pinned session sequence ---- */
  var steps = [].slice.call(document.querySelectorAll('.pin-step'));
  var panes = [].slice.call(document.querySelectorAll('.pin-pane'));
  var badge = document.getElementById('pin-badge');
  if(steps.length && panes.length){
    var io3 = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting) return;
        var i = steps.indexOf(e.target);
        steps.forEach(function(s,n){ s.classList.toggle('on', n===i); });
        panes.forEach(function(p,n){ p.classList.toggle('on', n===i); });
        if(badge) badge.textContent = steps[i].dataset.badge;
      });
    },{rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(s){ io3.observe(s); });
  }

  /* ---- year explorer ---- */
  var rail = document.querySelector('.yx-rail');
  if(!rail) return;

  var YEARS = {
    '2':{ks:'Key Stage 1',t:'Year 2',
      d:'The KS1 SATs have been non statutory since 2023, so whether your child sits them is up to their school. Either way this is the year the foundations get set.',
      c:['Phonics and reading fluency','Sentence structure','Place value','Addition and subtraction','Times tables'],
      e:'KS1 SATs',w:'Optional',ft:'Foundations year',
      fs:'Reading and number confidence before KS2 begins.'},
    '3':{ks:'Key Stage 2',t:'Year 3',
      d:'The step up from infants. The work gets longer and more independent, and gaps that open here tend to stay open without help.',
      c:['Reading comprehension','Written calculation','Fractions','Grammar and punctuation','Spelling'],
      e:'Nothing yet',w:'Groundwork',ft:'Catch it early',
      fs:'The cheapest gap to close is the one you close in Year 3.'},
    '4':{ks:'Key Stage 2',t:'Year 4',
      d:'Where 11+ preparation starts if you are considering it. Two years out is the comfortable runway, not the panicked one.',
      c:['Times tables to 12','Reasoning and problem solving','Inference in reading','Vocabulary building','Verbal reasoning'],
      e:'11+ prep begins',w:'Two years out',ft:'11+ starts here',
      fs:'GL Assessment and CSSE are the two we prepare for.'},
    '5':{ks:'Key Stage 2',t:'Year 5',
      d:'The year that matters most for the 11+. The exam is sat in September of Year 6, which means the real preparation window closes at the end of Year 5.',
      c:['Verbal reasoning','Non verbal reasoning','Comprehension under timing','Advanced arithmetic','Exam technique'],
      e:'11+',w:'Next September',ft:'The decisive year',
      fs:'Year 6 is too late to start. This is the window.'},
    '6':{ks:'Key Stage 2',t:'Year 6',
      d:'Two things land this year. The 11+ is sat in the middle of September, right at the start of term, and the KS2 SATs follow in May.',
      c:['11+ final practice','SATs arithmetic','SATs reasoning','Reading paper technique','SPaG'],
      e:'11+, then SATs',w:'Sept, then May',ft:'Two exams, one year',
      fs:'The 11+ is sat before most of Year 6 has been taught.'},
    '7':{ks:'Key Stage 3',t:'Years 7 to 9',
      d:'The quiet years with no external exam, which is exactly why they get neglected. What happens here decides which GCSE tier your child ends up on.',
      c:['Algebra foundations','Geometry','Literary analysis','Extended writing','Science fundamentals'],
      e:'Setting for GCSE',w:'Decided in Year 9',ft:'Nothing to show, everything at stake',
      fs:'Tier decisions get made on Key Stage 3 performance.'},
    '10':{ks:'Key Stage 4',t:'Years 10 and 11',
      d:'Year 10 covers most of the content and Year 11 turns it into marks. We work across AQA, Edexcel and OCR for Maths, English and Science.',
      c:['Past paper technique','Higher tier topics','Set text analysis','Required practicals','Mark scheme strategy'],
      e:'GCSEs',w:'May and June',ft:'Content, then technique',
      fs:'Knowing it and being able to show it are different skills.'}
  };

  function $(id){ return document.getElementById(id); }
  function paintYear(y){
    var d = YEARS[y]; if(!d) return;
    $('yx-kick').textContent  = d.ks;
    $('yx-title').textContent = d.t;
    $('yx-desc').textContent  = d.d;
    $('yx-exam').textContent  = d.e;
    $('yx-when').textContent  = d.w;
    $('yx-cost').textContent  = '£20';
    $('yx-ft').textContent    = d.ft;
    $('yx-fs').textContent    = d.fs;
    var cov = $('yx-cov'); cov.innerHTML = '';
    d.c.forEach(function(c){
      var s = document.createElement('span'); s.textContent = c; cov.appendChild(s);
    });
    var left = document.querySelector('.yx-left');
    left.classList.remove('yxfade'); void left.offsetWidth; left.classList.add('yxfade');
  }

  rail.addEventListener('click', function(e){
    var b = e.target.closest('button'); if(!b) return;
    rail.querySelectorAll('button').forEach(function(x){
      x.setAttribute('aria-selected','false');
    });
    b.setAttribute('aria-selected','true');
    paintYear(b.dataset.y);
  });
  rail.addEventListener('keydown', function(e){
    if(e.key!=='ArrowRight' && e.key!=='ArrowLeft') return;
    var bs = [].slice.call(rail.querySelectorAll('button'));
    var i = bs.indexOf(document.activeElement); if(i<0) return;
    var n = (i + (e.key==='ArrowRight'?1:-1) + bs.length) % bs.length;
    bs[n].focus(); bs[n].click(); e.preventDefault();
  });
  paintYear('2');
})();
