/* ==========================================================================
   Alamo Live Edge Furniture Co. — Main JavaScript
   Handles: Navigation, FAQ Accordions, Form Validation, Scroll Animations,
            Shop Filters, Smooth Scrolling
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     DOM Ready
     -------------------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollHeader();
    initScrollAnimations();
    initFAQAccordions();
    initFormValidation();
    initShopFilters();
    initSmoothScroll();
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

    // Close menu on link click
    var navLinks = menu.querySelectorAll('.nav__link');
    navLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
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

    // Use IntersectionObserver if available
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
      // Fallback: show all elements immediately
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

        // Close all other items in the same section
        var parentSection = item.closest('.faq-section');
        if (parentSection) {
          parentSection.querySelectorAll('.faq-item').forEach(function (otherItem) {
            if (otherItem !== item) {
              otherItem.setAttribute('aria-expanded', 'false');
            }
          });
        }

        // Toggle current item
        item.setAttribute('aria-expanded', isExpanded ? 'false' : 'true');
      });

      // Keyboard support
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
          // Show success message
          var successMsg = form.closest('section').querySelector('.form-success');
          if (successMsg) {
            form.style.display = 'none';
            successMsg.classList.add('form-success--visible');
          }

          // In production, this would submit to a server
          console.log('Form submitted:', getFormData(form));
        }
      });

      // Real-time validation on blur
      var inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
      inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
          validateField(input);
        });

        // Clear error on input
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

      // Focus the first invalid field
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

      // Required check
      if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
      }

      // Email validation
      if (isValid && field.type === 'email' && value) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address.';
        }
      }

      // Phone validation
      if (isValid && field.type === 'tel' && value) {
        var phoneRegex = /^[\d\s\-\(\)\+]{7,}$/;
        if (!phoneRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid phone number.';
        }
      }

      // Update UI
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
    var filterContainer = document.querySelector('.shop-filters');
    if (!filterContainer) return;

    var filterBtns = filterContainer.querySelectorAll('.shop-filter-btn');
    var galleryCards = document.querySelectorAll('.gallery-card[data-category]');

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.getAttribute('data-filter');

        // Update active button
        filterBtns.forEach(function (b) {
          b.classList.remove('shop-filter-btn--active');
        });
        btn.classList.add('shop-filter-btn--active');

        // Filter cards
        galleryCards.forEach(function (card) {
          if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
            // Trigger re-animation
            card.classList.remove('fade-in--visible');
            void card.offsetWidth; // force reflow
            card.classList.add('fade-in--visible');
          } else {
            card.style.display = 'none';
          }
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

        var headerHeight = document.querySelector('.site-header').offsetHeight;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }
})();
