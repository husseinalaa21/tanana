// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileClose');

function openMobileNav(){
  mobileNav.classList.add('open');
  hamburger.setAttribute('aria-expanded','true');
  mobileNav.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
}
function closeMobileNav(){
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded','false');
  mobileNav.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', ()=>{
  const expanded = hamburger.getAttribute('aria-expanded') === 'true';
  if(expanded) closeMobileNav(); else openMobileNav();
});

mobileClose?.addEventListener('click', ()=> closeMobileNav());

// Close when clicking a nav link
document.addEventListener('click', (e)=>{
  if(e.target.matches('.mobile-nav-list a')) closeMobileNav();
});

// Close on Escape
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeMobileNav();
});

// Appointment form toggles
function toggleTrack(){
  const book = document.getElementById('book');
  const track = document.getElementById('track');
  if(book && track){
    book.style.display = 'none';
    track.style.display = 'block';
  }
}
function toggleBook(){
  const book = document.getElementById('book');
  const track = document.getElementById('track');
  if(book && track){
    track.style.display = 'none';
    book.style.display = 'block';
  }
}

// initial state
window.addEventListener('DOMContentLoaded', ()=>{
  const track = document.getElementById('track');
  if(track) track.style.display = 'none';
});

// Background slideshow for main_background
window.addEventListener('DOMContentLoaded', ()=>{
  const slides = [
    {
      id: 'a1',
      title: 'Accounting & Taxation',
      subject: 'Accurate bookkeeping and compliant tax preparation.',
      description: 'We manage your books, prepare timely tax returns, and ensure compliance so you avoid penalties and keep more of what you earn.',
      bg: './images/a-1.jpg',
      link: 'tax.html'
    },
    {
      id: 'a2',
      title: 'Tanana Insurance',
      subject: 'The best way to secure your investments, properties and loved ones from unplanned catastrophies is getting an insurance cover.',
      description: 'We want the best for you, your investments, properties and loved ones, and that is evident in the establishment of our insurance agency arm, Tanana Insurance Agency.',
      bg: './images/a-2.jpg',
      link: 'services.html'
    },
    {
      id: 'a3',
      title: 'Realty & Mortgage Services',
      subject: 'Helping buyers, sellers, and borrowers connect and succeed.',
      description: 'Property matching, market guidance, and mortgage options to help you buy, sell, or refinance with confidence.',
      bg: './images/a-3.jpg',
      link: 'services.html'
    },
    {
      id: 'a4',
      title: 'Immigration & Translation',
      subject: 'Expert support for immigration processes and official translations.',
      description: 'Assistance with visa paperwork, document translation, and navigating immigration requirements for individuals and families.',
      bg: './images/a-4.jpg',
      link: 'contact.html'
    }
  ];

  const mainBg = document.querySelector('.main_background');
  const mainInfo = document.querySelector('.main_info');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');
  if(!mainBg || !mainInfo) return;

  let idx = 0;
  let autoTimer = null;
  let gestureStartX = null;

  function showSlide(i){
    const slideIndex = ((i % slides.length) + slides.length) % slides.length;
    const slide = slides[slideIndex];
    idx = slideIndex;
    // fade text
    mainInfo.style.opacity = 0;
    // change background (will be visible under blue overlay)
    mainBg.style.backgroundImage = `url("${slide.bg}")`;
    // update text and CTA after short delay for smooth transition
    setTimeout(()=>{
      const h = mainInfo.querySelector('h1');
      const subj = mainInfo.querySelector('.subject');
      const desc = mainInfo.querySelector('.description');
      const cta = document.getElementById('slideTag');
      if(h) h.textContent = slide.title;
      if(subj) subj.textContent = slide.subject;
      if(desc) desc.textContent = slide.description || '';
      if(cta){
        if(slide.link){ cta.href = slide.link; cta.style.display = 'inline-block'; }
        else { cta.style.display = 'none'; }
      }
      mainInfo.style.opacity = 1;
    }, 350);
  }

  function nextSlide(){
    showSlide(idx + 1);
  }

  function prevSlide(){
    showSlide(idx - 1);
  }

  function stopAuto(){
    if(autoTimer){
      clearInterval(autoTimer);
      autoTimer = null;
    }
  }

  function startAuto(){
    stopAuto();
    autoTimer = setInterval(nextSlide, 10000);
  }

  function resetAuto(){
    startAuto();
  }

  // preload images
  slides.forEach(s=>{ const img=new Image(); img.src=s.bg; });

  showSlide(idx);
  startAuto();

  heroNext?.addEventListener('click', ()=>{
    nextSlide();
    resetAuto();
  });

  heroPrev?.addEventListener('click', ()=>{
    prevSlide();
    resetAuto();
  });

  function handleSwipe(startX, endX){
    if(startX === null || endX === null) return;
    const diff = endX - startX;
    const threshold = 45;
    if(Math.abs(diff) < threshold) return;
    if(diff < 0) nextSlide();
    else prevSlide();
    resetAuto();
  }

  mainBg.addEventListener('touchstart', (event)=>{
    gestureStartX = event.changedTouches[0]?.clientX ?? null;
  }, { passive: true });

  mainBg.addEventListener('touchend', (event)=>{
    const endX = event.changedTouches[0]?.clientX ?? null;
    handleSwipe(gestureStartX, endX);
    gestureStartX = null;
  }, { passive: true });

  mainBg.addEventListener('pointerdown', (event)=>{
    if(event.pointerType === 'mouse' && event.button !== 0) return;
    gestureStartX = event.clientX;
  });

  mainBg.addEventListener('pointerup', (event)=>{
    handleSwipe(gestureStartX, event.clientX);
    gestureStartX = null;
  });

  // previously generated service cards here, now handled statically in HTML
});

// make static service cards act like buttons (keyboard accessible)
window.addEventListener('DOMContentLoaded', ()=>{
  document.querySelectorAll('.part_b .service[data-link]').forEach(el=>{
    el.addEventListener('click', ()=>{
      const link = el.dataset.link;
      if(link) window.location.href = link;
    });
    el.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });
});

// testimonials slider
window.addEventListener('DOMContentLoaded', ()=>{
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  if(!track || !prevBtn || !nextBtn) return;

  const slides = Array.from(track.querySelectorAll('.testimonial-slide'));
  if(!slides.length) return;

  let index = 0;
  let timer = null;

  function getPerView(){
    if(window.innerWidth <= 640) return 1;
    if(window.innerWidth <= 991) return 2;
    return 3;
  }

  function getStepSize(){
    const gap = 24;
    const slideWidth = slides[0].getBoundingClientRect().width;
    return slideWidth + gap;
  }

  function render(){
    const perView = getPerView();
    const maxIndex = Math.max(0, slides.length - perView);
    if(index > maxIndex) index = maxIndex;
    if(index < 0) index = 0;
    const shiftX = index * getStepSize();
    track.style.transform = `translateX(-${shiftX}px)`;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === maxIndex;
    prevBtn.style.opacity = prevBtn.disabled ? '0.55' : '1';
    nextBtn.style.opacity = nextBtn.disabled ? '0.55' : '1';
  }

  function next(){
    const perView = getPerView();
    const maxIndex = Math.max(0, slides.length - perView);
    index = index >= maxIndex ? 0 : index + 1;
    render();
  }

  function prev(){
    const perView = getPerView();
    const maxIndex = Math.max(0, slides.length - perView);
    index = index <= 0 ? maxIndex : index - 1;
    render();
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  function startAuto(){
    stopAuto();
    timer = setInterval(next, 5000);
  }

  function stopAuto(){
    if(timer){
      clearInterval(timer);
      timer = null;
    }
  }

  const slider = track.closest('.testimonials-slider');
  slider?.addEventListener('mouseenter', stopAuto);
  slider?.addEventListener('mouseleave', startAuto);

  window.addEventListener('resize', render);

  render();
  startAuto();
});

// limit testimonial text length to 300 characters
window.addEventListener('DOMContentLoaded', ()=>{
  const maxLen = 300;
  document.querySelectorAll('.testimonial-text').forEach((el)=>{
    const original = (el.textContent || '').trim();
    if(original.length > maxLen){
      el.textContent = `${original.slice(0, maxLen).trimEnd()}..`;
    }
  });
});

