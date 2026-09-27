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

/* --- 11+ timeline: continuous drag, colour tracks progress --------------- */
document.addEventListener('DOMContentLoaded', function(){
  var tl = document.getElementById('plusTimeline');
  if(!tl) return;
  var dots = [].slice.call(tl.querySelectorAll('.tl-dot'));
  var panels = [].slice.call(tl.querySelectorAll('.tl-panel'));
  var range = document.getElementById('tlRange');
  var fill = document.getElementById('tlFill');
  var last = -1;
  var STOPS = [[59,130,246], [255,198,26], [22,163,74]];   // blue, amber, green

  function mix(a, b, t){
    return 'rgb(' + Math.round(a[0]+(b[0]-a[0])*t) + ','
                  + Math.round(a[1]+(b[1]-a[1])*t) + ','
                  + Math.round(a[2]+(b[2]-a[2])*t) + ')';
  }
  function colourAt(p){                                    // p is 0..1
    var seg = p * (STOPS.length - 1);
    var i = Math.min(STOPS.length - 2, Math.floor(seg));
    return mix(STOPS[i], STOPS[i+1], seg - i);
  }
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
      var label = dots[i] ? dots[i].textContent.trim() : '';
      range.setAttribute('aria-valuetext', label);
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


/* --- let people dismiss the contact bar --------------------------------- */
function hidePhoneBar(){
  document.documentElement.classList.add('no-phone-bar');
  try{ localStorage.setItem('htr-bar','off'); }catch(e){}
}
