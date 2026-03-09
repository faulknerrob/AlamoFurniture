/* ==========================================================================
   Lone Star Live Edge — Main JavaScript
   Handles: Navigation, FAQ Accordions, Form Validation, Scroll Animations,
            Shop Filters, Smooth Scrolling, Cookie Notice
   ========================================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollHeader();
    initScrollAnimations();
    initFAQAccordions();
    initFormValidation();
    initShopFilters();
    initSmoothScroll();
    initCookieNotice();
  });

  /* --------------------------------------------------------------------------
     Navigation — Mobile Toggle
     -------------------------------------------------------------------------- */
  function initNavigation() {
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.querySelector('.nav__menu');
    var overlay = document.querySelector('.nav__overlay');

    if (!toggle || !menu) return;

    function openMenu() {
      toggle.setAttribute('aria-expanded', 'true');
      menu.classList.add('nav__menu--open');
      if (overlay) overlay.classList.add('nav__overlay--visible');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('nav__menu--open');
      if (overlay) overlay.classList.remove('nav__overlay--visible');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      var isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    var navLinks = menu.querySelectorAll('.nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        toggle.focus();
      }
    });
  }

  /* --------------------------------------------------------------------------
     Scroll — Header Shadow
     -------------------------------------------------------------------------- */
  function initScrollHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var scrollThreshold = 50;

    function onScroll() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('site-header--scrolled');
      } else {
        header.classList.remove('site-header--scrolled');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* --------------------------------------------------------------------------
     Scroll Animations — Fade In on Scroll
     -------------------------------------------------------------------------- */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');
    if (!elements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              var el = entry.target;
              var delay = el.getAttribute('data-delay');
              if (delay) {
                setTimeout(function () {
                  el.classList.add(getVisibleClass(el));
                }, parseInt(delay, 10));
              } else {
                el.classList.add(getVisibleClass(el));
              }
              observer.unobserve(el);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      elements.forEach(function (el) {
        el.classList.add(getVisibleClass(el));
      });
    }

    function getVisibleClass(el) {
      if (el.classList.contains('fade-in-left')) return 'fade-in-left--visible';
      if (el.classList.contains('fade-in-right')) return 'fade-in-right--visible';
      return 'fade-in--visible';
    }
  }

  /* --------------------------------------------------------------------------
     FAQ Accordions
     -------------------------------------------------------------------------- */
  function initFAQAccordions() {
    var faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-item__question');
      var answer = item.querySelector('.faq-item__answer');

      if (!question || !answer) return;

      question.addEventListener('click', function () {
        var isExpanded = item.getAttribute('aria-expanded') === 'true';

        var parentSection = item.closest('.faq-section');
        if (parentSection) {
          parentSection.querySelectorAll('.faq-item').forEach(function (otherItem) {
            if (otherItem !== item) {
              otherItem.setAttribute('aria-expanded', 'false');
            }
          });
        }

        item.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      });

      question.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          question.click();
        }
      });
    });
  }

  /* --------------------------------------------------------------------------
     Form Validation
     -------------------------------------------------------------------------- */
  function initFormValidation() {
    var forms = document.querySelectorAll('[data-validate]');
    if (!forms.length) return;

    forms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var isValid = validateForm(form);

        if (isValid) {
          var successMsg = form.closest('section') ? form.closest('section').querySelector('.form-success') : form.parentElement.querySelector('.form-success');
          if (successMsg) {
            form.style.display = 'none';
            successMsg.classList.add('form-success--visible');
          }

          console.log('Form submitted:', getFormData(form));
        }
      });

      var inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
      inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
          validateField(input);
        });

        input.addEventListener('input', function () {
          var group = input.closest('.form-group');
          if (group && group.classList.contains('form-group--error')) {
            group.classList.remove('form-group--error');
          }
        });
      });
    });

    function validateForm(form) {
      var isValid = true;
      var requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function (field) {
        if (!validateField(field)) {
          isValid = false;
        }
      });

      if (!isValid) {
        var firstError = form.querySelector('.form-group--error .form-input, .form-group--error .form-select, .form-group--error .form-textarea');
        if (firstError) firstError.focus();
      }

      return isValid;
    }

    function validateField(field) {
      var group = field.closest('.form-group');
      if (!group) return true;

      var errorEl = group.querySelector('.form-error');
      var value = field.value.trim();
      var isValid = true;
      var errorMessage = '';

      if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
      }

      if (isValid && field.type === 'email' && value) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address.';
        }
      }

      if (isValid && field.type === 'tel' && value) {
        var phoneRegex = /^[\d\s\-\(\)\+]{7,}$/;
        if (!phoneRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number.';
        }
      }

      if (!isValid) {
        group.classList.add('form-group--error');
        if (errorEl) errorEl.textContent = errorMessage;
      } else {
        group.classList.remove('form-group--error');
      }

      return isValid;
    }

    function getFormData(form) {
      var data = {};
      var formData = new FormData(form);
      formData.forEach(function (value, key) {
        data[key] = value;
      });
      return data;
    }
  }

  /* --------------------------------------------------------------------------
     Shop Filters
     -------------------------------------------------------------------------- */
  function initShopFilters() {
    var filterContainers = document.querySelectorAll('.shop-filters');
    if (!filterContainers.length) return;

    var productCards = document.querySelectorAll('.product-card[data-category]');

    filterContainers.forEach(function (container) {
      var filterBtns = container.querySelectorAll('.shop-filter-btn[data-filter]');

      filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var category = btn.getAttribute('data-filter');

          // Update active state across all filter containers
          document.querySelectorAll('.shop-filter-btn[data-filter]').forEach(function (b) {
            b.classList.remove('shop-filter-btn--active');
          });
          document.querySelectorAll('.shop-filter-btn[data-filter="' + category + '"]').forEach(function (b) {
            b.classList.add('shop-filter-btn--active');
          });

          // Filter cards
          productCards.forEach(function (card) {
            if (category === 'all' || card.getAttribute('data-category') === category) {
              card.style.display = '';
              card.classList.remove('fade-in--visible');
              void card.offsetWidth;
              card.classList.add('fade-in--visible');
            } else {
              card.style.display = 'none';
            }
          });
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     Smooth Scroll — for anchor links
     -------------------------------------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var header = document.querySelector('.site-header');
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     Cookie Notice
     -------------------------------------------------------------------------- */
  function initCookieNotice() {
    var notice = document.getElementById('cookie-notice');
    if (!notice) return;

    // Check if already accepted
    if (localStorage.getItem('cookies-accepted')) return;

    // Show after a short delay
    setTimeout(function () {
      notice.classList.add('cookie-notice--visible');
    }, 2000);

    var acceptBtn = document.getElementById('cookie-accept');
    var declineBtn = document.getElementById('cookie-decline');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        localStorage.setItem('cookies-accepted', 'true');
        notice.classList.remove('cookie-notice--visible');
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', function () {
        localStorage.setItem('cookies-accepted', 'declined');
        notice.classList.remove('cookie-notice--visible');
      });
    }
  }
})();
