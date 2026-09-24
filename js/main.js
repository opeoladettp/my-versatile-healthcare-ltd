/**
 * MY VERSATILE HEALTHCARE LTD - JAVASCRIPT CONTROLLER
 * Newcastle Upon Tyne Clinical Home Care Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 0. Dynamic Navbar Height Synchronization ---
  const navbar = document.getElementById('navbar');
  function syncNavbarHeight() {
    if (!navbar) return;
    const h = navbar.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--navbar-h', `${Math.round(h)}px`);
  }
  syncNavbarHeight();
  window.addEventListener('resize', syncNavbarHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncNavbarHeight);
  }

  // --- 1. Sticky Navigation & Active Link Tracker ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // --- 2. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksMenu = document.getElementById('navLinks');

  if (mobileToggle && navLinksMenu) {
    mobileToggle.addEventListener('click', () => {
      navLinksMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('.material-symbols-outlined');
      if (navLinksMenu.classList.contains('active')) {
        icon.textContent = 'close';
      } else {
        icon.textContent = 'menu';
      }
    });

    // Close menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });
  }

  // --- 3. Assessment Form Submission via FormSend API ---
  const assessmentForm = document.getElementById('assessmentForm');
  if (assessmentForm) {
    assessmentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = assessmentForm.querySelector('button[type="submit"]');
      const originalHTML = submitBtn.innerHTML;

      // Collect form field values
      const name     = document.getElementById('fullName').value.trim();
      const email    = document.getElementById('email').value.trim();
      const phone    = document.getElementById('phone').value.trim();
      const careType = document.getElementById('careType').value;
      const location = document.getElementById('location').value;
      const startDate = document.getElementById('startDate').value;
      const careNotes = document.getElementById('careNotes').value.trim();

      // Build a descriptive subject line
      const subject = `Care Assessment Request — ${careType || 'General Enquiry'}`;

      // Combine extra details into the message body
      const message = [
        careNotes || 'No additional notes provided.',
        `Phone/WhatsApp: ${phone || 'Not provided'}`,
        `Preferred Assessment Location: ${location}`,
        `Target Start Date: ${startDate || 'Not specified'}`,
      ].join('\n\n');

      // Loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
        Submitting Request...
      `;

      try {
        const res = await fetch('https://api.formsend.ezeroandone.io/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: '98f21045bf1f28e928479e96d5362a466466c2f166634490afce225a96ca1986',
            name,
            email,
            subject,
            message,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          // Success state
          submitBtn.innerHTML = `
            <span class="material-symbols-outlined">check_circle</span>
            Assessment Request Confirmed!
          `;
          submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';
          showFormToast('success', 'Thank you! Your Care Assessment Request has been sent to our Newcastle Clinical Coordination Team. We will be in touch within 24 business hours.');
          assessmentForm.reset();

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalHTML;
            submitBtn.style.background = '';
          }, 5000);
        } else {
          // API returned an error response
          throw new Error(data.message || 'Submission failed. Please try again.');
        }
      } catch (err) {
        // Error state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalHTML;
        showFormToast('error', err.message || 'Something went wrong. Please call us on 0191 234 5678 or email care@mvhcare.co.uk.');
      }
    });
  }

  /**
   * Displays a non-blocking toast notification below the form submit button.
   * @param {'success'|'error'} type
   * @param {string} message
   */
  function showFormToast(type, message) {
    // Remove any existing toast first
    const existing = document.getElementById('formToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'formToast';
    toast.style.cssText = `
      margin-top: 1rem;
      padding: 0.875rem 1.125rem;
      border-radius: 10px;
      font-size: 0.875rem;
      line-height: 1.5;
      display: flex;
      align-items: flex-start;
      gap: 0.625rem;
      background: ${type === 'success' ? '#ECFDF5' : '#FEF2F2'};
      color:      ${type === 'success' ? '#065F46' : '#991B1B'};
      border:     1px solid ${type === 'success' ? '#A7F3D0' : '#FECACA'};
    `;

    const icon = document.createElement('span');
    icon.className = 'material-symbols-outlined';
    icon.style.fontSize = '1.1rem';
    icon.textContent = type === 'success' ? 'check_circle' : 'error';

    const text = document.createElement('span');
    text.textContent = message;

    toast.appendChild(icon);
    toast.appendChild(text);

    // Insert after the submit button's parent form-group
    const submitGroup = document.querySelector('#assessmentForm .form-group.full-width:last-child');
    if (submitGroup) {
      submitGroup.insertAdjacentElement('afterend', toast);
    } else {
      document.getElementById('assessmentForm').appendChild(toast);
    }

    // Auto-dismiss after 8 seconds on success
    if (type === 'success') {
      setTimeout(() => toast.remove(), 8000);
    }
  }
});
