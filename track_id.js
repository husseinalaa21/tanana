window.addEventListener('DOMContentLoaded', ()=>{
  const trackLookupForm = document.getElementById('trackLookupForm');
  if(!trackLookupForm) return;

  const appointmentIdInput = document.getElementById('appointmentId');
  const feedback = document.getElementById('trackFeedback');
  const resultSection = document.getElementById('appointmentResult');
  const uploadSection = document.getElementById('docUploadSection');
  const docUploadForm = document.getElementById('docUploadForm');
  const docsInput = document.getElementById('appointmentDocs');
  const selectedDocsInfo = document.getElementById('selectedDocsInfo');
  const savedDocsContainer = document.getElementById('savedDocs');
  const appointmentIdLocked = document.getElementById('appointmentIdLocked');

  const DOCS_KEY = 'tanana_track_docs';
  const MAX_DOCS = 30;

  const demoAppointment = {
    id: '1234',
    name: 'Demo Client',
    email: 'demo.client@tanana.com',
    phone: '(586) 553-9116',
    service: 'Tax Accounting',
    status: 'Pending Documents'
  };

  function normalizeAppointmentId(value){
    return (value || '').trim();
  }

  function isDemoAppointment(id){
    return id === demoAppointment.id;
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

  function renderAppointmentInfo(appointment){
    const map = {
      id: appointment.id,
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      service: appointment.service,
      status: appointment.status
    };

    Object.entries(map).forEach(([key, value])=>{
      const field = resultSection.querySelector(`[data-field="${key}"]`);
      if(field) field.textContent = value || '-';
    });

    resultSection.hidden = false;
    uploadSection.hidden = false;
    appointmentIdLocked.value = appointment.id;
  }

  function formatFileSize(size){
    const bytes = Number(size) || 0;
    if(bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  function renderSelectedDocs(files){
    if(!selectedDocsInfo) return;

    if(!files.length){
      selectedDocsInfo.innerHTML = '<p>No files selected.</p>';
      return;
    }

    const listHtml = files.map((file)=>{
      return `<li><strong>File:</strong> ${file.name} <span>·</span> <strong>Size:</strong> ${formatFileSize(file.size)}</li>`;
    }).join('');

    selectedDocsInfo.innerHTML = `<h3>Selected Files (${files.length})</h3><ul>${listHtml}</ul>`;
  }

  function renderSavedDocs(appointmentId){
    const docsByAppointment = loadDocsByAppointment();
    const docs = docsByAppointment[appointmentId] || [];

    if(!docs.length){
      savedDocsContainer.innerHTML = '<p>No attachments uploaded yet.</p>';
      return;
    }

    const listHtml = docs.map((doc)=>{
      return `<li><strong>File:</strong> ${doc.name} <span>·</span> <strong>Size:</strong> ${formatFileSize(doc.size)}</li>`;
    }).join('');

    savedDocsContainer.innerHTML = `<h3>Saved Attachments (${docs.length}/${MAX_DOCS})</h3><ul>${listHtml}</ul>`;
  }

  function readFileAsDataUrl(file){
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = ()=> resolve(String(reader.result || ''));
      reader.onerror = ()=> reject(new Error('File read failed'));
      reader.readAsDataURL(file);
    });
  }

  function lookupAppointment(appointmentId){
    const normalized = normalizeAppointmentId(appointmentId);
    if(!isDemoAppointment(normalized)){
      renderFeedback('Invalid appointment ID. Please use demo ID 1234.', 'error');
      resultSection.hidden = true;
      uploadSection.hidden = true;
      appointmentIdLocked.value = '';
      savedDocsContainer.innerHTML = '';
      return;
    }

    renderFeedback('Appointment found. You can now add attachments.', 'success');
    renderAppointmentInfo(demoAppointment);
    renderSavedDocs(normalized);
  }

  trackLookupForm.addEventListener('submit', (event)=>{
    event.preventDefault();
    lookupAppointment(appointmentIdInput.value);
  });

  docsInput?.addEventListener('change', ()=>{
    const files = Array.from(docsInput.files || []);
    renderSelectedDocs(files);
  });

  docUploadForm?.addEventListener('submit', async (event)=>{
    event.preventDefault();

    const appointmentId = normalizeAppointmentId(appointmentIdLocked.value);
    const files = Array.from(docsInput?.files || []);

    if(!isDemoAppointment(appointmentId)){
      renderFeedback('Please submit valid appointment ID first.', 'error');
      return;
    }

    if(!files.length){
      renderFeedback('Please select at least one document.', 'error');
      return;
    }

    const docsByAppointment = loadDocsByAppointment();
    const existingDocs = docsByAppointment[appointmentId] || [];

    if(existingDocs.length >= MAX_DOCS){
      renderFeedback('Maximum 30 documents already uploaded.', 'error');
      return;
    }

    if(existingDocs.length + files.length > MAX_DOCS){
      renderFeedback(`You can upload only ${MAX_DOCS - existingDocs.length} more document(s).`, 'error');
      return;
    }

    try {
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
      renderSelectedDocs([]);

      renderFeedback('Documents saved successfully.', 'success');
      renderSavedDocs(appointmentId);
    } catch {
      renderFeedback('Could not save selected documents. Please try again.', 'error');
    }
  });

  const params = new URLSearchParams(window.location.search);
  const incomingId = normalizeAppointmentId(params.get('appointment_id') || '');
  if(incomingId){
    appointmentIdInput.value = incomingId;
    lookupAppointment(incomingId);
  }
});
