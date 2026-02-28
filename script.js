/* ===== ELITEFORM COACHING - script.js ===== */

(function () {
    'use strict';

    /* ─── Sticky Header ─── */
    const header = document.getElementById('site-header');
    function handleHeaderScroll() {
        if (window.scrollY > 60) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* ─── Mobile Navigation ─── */
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileNav.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
    });
    // Close mobile nav on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileNav.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileNav.setAttribute('aria-hidden', 'true');
        });
    });

    /* ─── Scroll Reveal ─── */
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    // Stagger children inside the same parent slightly
                    setTimeout(() => entry.target.classList.add('visible'), 0);
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { rootMargin: '0px 0px -60px 0px', threshold: 0.12 }
    );
    revealEls.forEach(el => revealObserver.observe(el));

    /* ─── Animated Stat Counter ─── */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10);
        if (isNaN(target) || target === 0) return; // "CPT" stays as text
        const duration = 1800;
        const step = target / (duration / 16);
        let current = 0;
        const suffix = el.dataset.suffix || (el.parentElement.querySelector('.stat-label')?.textContent.includes('%') ? '%' : '+');

        const interval = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(interval);
            }
            el.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    const counterObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target, 10);
                    if (!isNaN(target) && target > 0) {
                        animateCounter(el);
                        counterObserver.unobserve(el);
                    }
                }
            });
        },
        { threshold: 0.5 }
    );
    statNumbers.forEach(el => counterObserver.observe(el));

    /* ─── FAQ Accordion ─── */
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        btn.addEventListener('click', () => {
            const isOpen = btn.getAttribute('aria-expanded') === 'true';

            // Close all others
            faqItems.forEach(other => {
                const otherBtn = other.querySelector('.faq-question');
                const otherAnswer = other.querySelector('.faq-answer');
                otherBtn.setAttribute('aria-expanded', 'false');
                otherAnswer.setAttribute('hidden', '');
                otherAnswer.style.maxHeight = null;
            });

            if (!isOpen) {
                btn.setAttribute('aria-expanded', 'true');
                answer.removeAttribute('hidden');
                // Trigger transition
                requestAnimationFrame(() => {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                });
            }
        });
    });

    /* ─── Testimonial Carousel ─── */
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    let currentSlide = 0;
    let autoplayTimer;

    function goToSlide(idx) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].setAttribute('aria-selected', 'false');
        currentSlide = (idx + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
    }

    function startAutoplay() {
        autoplayTimer = setInterval(() => goToSlide(currentSlide + 1), 5000);
    }
    function resetAutoplay() {
        clearInterval(autoplayTimer);
        startAutoplay();
    }

    nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoplay(); });
    prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoplay(); });
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => { goToSlide(i); resetAutoplay(); });
    });

    startAutoplay();

    // Pause autoplay when page not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearInterval(autoplayTimer);
        else startAutoplay();
    });

    /* ─── CTA Form Submission ─── */
    const ctaForm = document.getElementById('cta-form');
    ctaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = ctaForm.name.value.trim();
        const email = ctaForm.email.value.trim();
        const goal = ctaForm.goal.value;
        const btn = document.getElementById('form-submit');

        if (!name || !email || !goal) {
            showFormFeedback('Please fill in all fields.', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            showFormFeedback('Please enter a valid email address.', 'error');
            return;
        }

        btn.textContent = 'Booking your call...';
        btn.disabled = true;
        btn.style.opacity = '0.7';

        // Simulate API call
        setTimeout(() => {
            ctaForm.innerHTML = `
        <div class="form-success">
          <div class="success-icon">✓</div>
          <h3>You're booked in!</h3>
          <p>Thank you, <strong>${name}</strong>! Check your inbox at <strong>${email}</strong> for your confirmation and calendar link.</p>
          <p class="form-note" style="margin-top:12px">We look forward to speaking with you.</p>
        </div>`;
        }, 1200);
    });

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFormFeedback(msg, type) {
        const existing = ctaForm.querySelector('.form-feedback');
        if (existing) existing.remove();
        const el = document.createElement('p');
        el.className = 'form-feedback';
        el.textContent = msg;
        el.style.cssText = `
      color: ${type === 'error' ? '#ff5c5c' : 'var(--accent)'};
      font-size: 0.85rem;
      text-align: center;
      margin-top: 4px;`;
        ctaForm.appendChild(el);
        setTimeout(() => el.remove(), 4000);
    }

    /* ─── Floating CTA visibility ─── */
    const floatingCta = document.getElementById('floating-cta');
    const heroHeight = document.getElementById('hero').offsetHeight;
    const finalCta = document.getElementById('contact-cta');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const finalCtaTop = finalCta.getBoundingClientRect().top + window.scrollY;
        if (scrollY > heroHeight && scrollY < finalCtaTop - 200) {
            floatingCta.style.opacity = '1';
            floatingCta.style.pointerEvents = 'auto';
        } else {
            floatingCta.style.opacity = '0';
            floatingCta.style.pointerEvents = 'none';
        }
    }, { passive: true });

    // Initially hidden
    floatingCta.style.opacity = '0';
    floatingCta.style.transition = 'opacity 0.4s ease';
    floatingCta.style.pointerEvents = 'none';

    /* ─── Smooth scroll for all anchor links ─── */
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = header.offsetHeight;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // Add form success styles dynamically
    const styleEl = document.createElement('style');
    styleEl.textContent = `
    .form-success {
      text-align: center;
      padding: 40px 20px;
    }
    .success-icon {
      width: 72px; height: 72px;
      border-radius: 50%;
      background: var(--accent);
      color: var(--black);
      font-size: 2rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      box-shadow: 0 0 48px var(--accent-glow);
      animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    @keyframes successPop {
      from { transform: scale(0); opacity: 0; }
      to   { transform: scale(1); opacity: 1; }
    }
    .form-success h3 {
      font-family: 'Syne', sans-serif;
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 12px;
      color: var(--accent);
    }
    .form-success p {
      font-size: 0.95rem;
      color: rgba(255,255,255,0.7);
      line-height: 1.7;
    }
  `;
    document.head.appendChild(styleEl);

})();
