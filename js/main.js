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

  // --- 3. Assessment Form Submission & Interactive Toast ---
  const assessmentForm = document.getElementById('assessmentForm');
  if (assessmentForm) {
    assessmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = assessmentForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
        Submitting Request...
      `;

      // Simulate healthcare team coordination dispatch
      setTimeout(() => {
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined">check_circle</span>
          Assessment Request Confirmed!
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

        // Show friendly alert message
        alert("Thank you! Your Care Assessment Request has been securely dispatched to our Newcastle Clinical Coordination Team. We will contact you within 24 business hours.");
        assessmentForm.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
        }, 5000);
      }, 1200);
    });
  }
});
