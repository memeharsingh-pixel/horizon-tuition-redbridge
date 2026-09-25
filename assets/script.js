function toggleMobileNav(){
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('navToggle').classList.toggle('open');
}
function closeMobileNav(){
  document.getElementById('navLinks').classList.remove('open');
  document.getElementById('navToggle').classList.remove('open');
  document.getElementById('navDropdown').classList.remove('open');
}
function toggleNavDropdown(e){
  if(window.innerWidth<=768){
    e.preventDefault();
    e.stopPropagation();
    document.getElementById('navDropdown').classList.toggle('open');
  }
}
document.addEventListener('click',function(e){
  var nav=document.querySelector('nav');
  if(nav && !nav.contains(e.target)){closeMobileNav();}
});
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
