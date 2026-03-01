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
  if(!mainBg || !mainInfo) return;

  let idx = 0;

  function showSlide(i){
    const slide = slides[i % slides.length];
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

  // preload images
  slides.forEach(s=>{ const img=new Image(); img.src=s.bg; });

  showSlide(idx);
  setInterval(()=>{ idx = (idx+1) % slides.length; showSlide(idx); }, 10000);

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

// track page: validate appointment ID, show details, and save uploaded docs
window.addEventListener('DOMContentLoaded', ()=>{
  const trackLookupForm = document.getElementById('trackLookupForm');
  if(!trackLookupForm) return;

  const appointmentIdInput = document.getElementById('appointmentId');
  const feedback = document.getElementById('trackFeedback');
  const resultSection = document.getElementById('appointmentResult');
  const uploadSection = document.getElementById('docUploadSection');
  const docUploadForm = document.getElementById('docUploadForm');
  const docsInput = document.getElementById('appointmentDocs');
  const savedDocsContainer = document.getElementById('savedDocs');
  const appointmentIdLocked = document.getElementById('appointmentIdLocked');

  const APPOINTMENT_KEY = 'tanana_appointment_records';
  const DOCS_KEY = 'tanana_appointment_documents';

  const seedAppointments = {
    'TN-1001': {
      id: 'TN-1001',
      client: 'Mona Al-Khafaji',
      service: 'Tax Accounting',
      date: '2026-03-05 10:00 AM',
      status: 'Pending Documents',
      agent: 'Ibrahim Tanana',
      notes: 'Please upload your W-2, 1099, and ID copy.'
    },
    'TN-1002': {
      id: 'TN-1002',
      client: 'Ali Hussein',
      service: 'Immigration & Translation',
      date: '2026-03-07 01:30 PM',
      status: 'In Review',
      agent: 'Zahara',
      notes: 'Upload passport scan and translated birth certificate.'
    },
    'TN-1003': {
      id: 'TN-1003',
      client: 'Nora Abbas',
      service: 'Realty & Mortgage',
      date: '2026-03-10 11:15 AM',
      status: 'Awaiting Documents',
      agent: 'Kassem Tanana',
      notes: 'Upload pay stubs, bank statements, and property documents.'
    }
  };

  function normalizeAppointmentId(value){
    return (value || '').trim().toUpperCase();
  }

  function loadAppointments(){
    const raw = localStorage.getItem(APPOINTMENT_KEY);
    if(!raw){
      localStorage.setItem(APPOINTMENT_KEY, JSON.stringify(seedAppointments));
      return { ...seedAppointments };
    }
    try {
      const parsed = JSON.parse(raw);
      if(parsed && typeof parsed === 'object') return parsed;
      return { ...seedAppointments };
    } catch {
      localStorage.setItem(APPOINTMENT_KEY, JSON.stringify(seedAppointments));
      return { ...seedAppointments };
    }
  }

  function loadDocsByAppointment(){
    const raw = localStorage.getItem(DOCS_KEY);
    if(!raw) return {};
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function saveDocsByAppointment(value){
    localStorage.setItem(DOCS_KEY, JSON.stringify(value));
  }

  function renderFeedback(message, type){
    feedback.textContent = message || '';
    feedback.classList.remove('success', 'error');
    if(type === 'success') feedback.classList.add('success');
    if(type === 'error') feedback.classList.add('error');
  }

  function renderAppointment(record){
    const map = {
      id: record.id,
      client: record.client,
      service: record.service,
      date: record.date,
      status: record.status,
      agent: record.agent,
      notes: record.notes
    };

    Object.entries(map).forEach(([key, value])=>{
      const field = resultSection.querySelector(`[data-field="${key}"]`);
      if(field) field.textContent = value || '-';
    });

    resultSection.hidden = false;
    uploadSection.hidden = false;
    appointmentIdLocked.value = record.id;
  }

  function renderSavedDocs(appointmentId){
    const docsByAppointment = loadDocsByAppointment();
    const docs = docsByAppointment[appointmentId] || [];

    if(!docs.length){
      savedDocsContainer.innerHTML = '<p>No documents uploaded for this appointment yet.</p>';
      return;
    }

    const listHtml = docs.map((doc)=>{
      const sizeKb = Math.max(1, Math.round((doc.size || 0) / 1024));
      return `<li><a href="${doc.dataUrl}" download="${doc.name}">${doc.name}</a> · ${sizeKb} KB · Uploaded ${doc.uploadedAt}</li>`;
    }).join('');

    savedDocsContainer.innerHTML = `<h3>Saved Documents</h3><ul>${listHtml}</ul>`;
  }

  function readFileAsDataUrl(file){
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = ()=> resolve(String(reader.result || ''));
      reader.onerror = ()=> reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  const appointments = loadAppointments();

  function lookupAppointment(appointmentId){
    const normalizedId = normalizeAppointmentId(appointmentId);
    const record = appointments[normalizedId];

    if(!normalizedId || !record){
      renderFeedback('Appointment ID is invalid. Please check and try again.', 'error');
      resultSection.hidden = true;
      uploadSection.hidden = true;
      appointmentIdLocked.value = '';
      savedDocsContainer.innerHTML = '';
      return;
    }

    renderFeedback('Appointment found. You can now upload your documents.', 'success');
    renderAppointment(record);
    renderSavedDocs(normalizedId);
  }

  trackLookupForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    lookupAppointment(appointmentIdInput.value);
  });

  docUploadForm?.addEventListener('submit', async (event)=>{
    event.preventDefault();

    const appointmentId = normalizeAppointmentId(appointmentIdLocked.value);
    const files = Array.from(docsInput?.files || []);

    if(!appointmentId){
      renderFeedback('Please validate your appointment ID first.', 'error');
      return;
    }

    if(!appointments[appointmentId]){
      renderFeedback('Invalid appointment ID. Please submit the ID again.', 'error');
      return;
    }

    if(!files.length){
      renderFeedback('Please select at least one document to upload.', 'error');
      return;
    }

    try {
      const docsByAppointment = loadDocsByAppointment();
      const existingDocs = docsByAppointment[appointmentId] || [];

      const prepared = await Promise.all(files.map(async (file)=>({
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toLocaleString(),
        dataUrl: await readFileAsDataUrl(file)
      })));

      docsByAppointment[appointmentId] = [...existingDocs, ...prepared];
      saveDocsByAppointment(docsByAppointment);
      docsInput.value = '';

      renderFeedback('Documents saved successfully. Our office can now review them.', 'success');
      renderSavedDocs(appointmentId);
    } catch {
      renderFeedback('Could not save the selected documents. Please try again.', 'error');
    }
  });

  const urlParams = new URLSearchParams(window.location.search);
  const incomingId = normalizeAppointmentId(urlParams.get('appointment_id') || '');
  if(incomingId){
    appointmentIdInput.value = incomingId;
    lookupAppointment(incomingId);
  }
});
