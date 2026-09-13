(() => {

  /* =========================================
     MOBILE NAVIGATION
     ========================================= */

  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const moreBtn = document.querySelector('.nav-more-btn');
  const moreMenu = document.querySelector('.nav-more-menu');

  if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');

      menuBtn.setAttribute(
        'aria-expanded',
        String(open)
      );
    });

    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');

        menuBtn.setAttribute(
          'aria-expanded',
          'false'
        );
      });
    });
  }


  /* =========================================
     "MORE" MENU
     ========================================= */

  if (moreBtn && moreMenu) {

    moreBtn.addEventListener('click', (e) => {

      e.stopPropagation();

      const open = moreMenu.classList.toggle('open');

      moreBtn.setAttribute(
        'aria-expanded',
        String(open)
      );

    });

    document.addEventListener('click', e => {

      if (
        !moreMenu.contains(e.target) &&
        e.target !== moreBtn
      ) {

        moreMenu.classList.remove('open');

        moreBtn.setAttribute(
          'aria-expanded',
          'false'
        );

      }

    });

  }


  /* =========================================
     CURRENT PAGE HIGHLIGHT
     ========================================= */

  const current =
    location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a').forEach(a => {

    const href = a.getAttribute('href');

    if (href === current) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }

  });


  /* =========================================
     READING PROGRESS BAR
     ========================================= */

  const progress = document.createElement('div');

  progress.className = 'scroll-progress';

  document.body.appendChild(progress);

  const updateProgress = () => {

    const max =
      document.documentElement.scrollHeight -
      window.innerHeight;

    progress.style.width =
      `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;

  };

  window.addEventListener(
    'scroll',
    updateProgress,
    { passive: true }
  );

  updateProgress();


  /* =========================================
     GENTLE REVEAL MOTION
     ========================================= */

  const revealTargets = document.querySelectorAll(
    '.section,' +
    '.page-hero,' +
    '.hero-copy,' +
    '.portrait,' +
    '.quote,' +
    '.cta,' +
    '.story,' +
    '.work,' +
    '.panel,' +
    '.experience-card,' +
    '.visit-feature'
  );

  revealTargets.forEach(el => {
    el.setAttribute('data-reveal', '');
  });


  if (
    'IntersectionObserver' in window &&
    !window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
  ) {

    const observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (entry.isIntersecting) {

              entry.target.classList.add(
                'revealed'
              );

              observer.unobserve(
                entry.target
              );

            }

          });

        },
        {
          threshold: 0.08,
          rootMargin: '0px 0px -35px 0px'
        }
      );

    revealTargets.forEach(el => {
      observer.observe(el);
    });

  } else {

    revealTargets.forEach(el => {
      el.classList.add('revealed');
    });

  }


  /* =========================================
     GALLERY
     
     Automatically supports:
     
     Gallery-01.jpg
     Gallery-01.png
     Gallery-01.jpeg
     Gallery-01.JPG
     Gallery-01.PNG
     Gallery-01.JPEG
     
     Also supports lowercase filenames
     just in case.
     ========================================= */

  const galleryItems =
    document.querySelectorAll('.gallery-item');

  const lightbox =
    document.querySelector('.lightbox');


  if (galleryItems.length > 0) {

    galleryItems.forEach(item => {

      /*
        Get the image number.

        New gallery HTML:
        data-image="01"

        Older gallery HTML:
        data-src="images/gallery-01.png"
      */

      const number =
        item.dataset.image;


      /*
        Find the image inside the gallery card.
      */

      const cardImage =
        item.querySelector(
          '[data-gallery-image]'
        ) ||
        item.querySelector('img');


      /*
        If this gallery item has a number,
        automatically locate the correct image.
      */

      if (number && cardImage) {

        const cleanNumber =
          String(number).padStart(2, '0');


        /*
          All possible filename variations.

          The first ones match your actual
          naming system:
          
          Gallery-01.jpg
          Gallery-01.png
        */

        const possibleImages = [

          `images/Gallery-${cleanNumber}.jpg`,
          `images/Gallery-${cleanNumber}.png`,
          `images/Gallery-${cleanNumber}.jpeg`,

          `images/Gallery-${cleanNumber}.JPG`,
          `images/Gallery-${cleanNumber}.PNG`,
          `images/Gallery-${cleanNumber}.JPEG`,

          `images/gallery-${cleanNumber}.jpg`,
          `images/gallery-${cleanNumber}.png`,
          `images/gallery-${cleanNumber}.jpeg`,

          `images/gallery-${cleanNumber}.JPG`,
          `images/gallery-${cleanNumber}.PNG`,
          `images/gallery-${cleanNumber}.JPEG`,

          /*
            Also support filenames with spaces
            around the hyphen, just in case.
          */

          `images/Gallery - ${cleanNumber}.jpg`,
          `images/Gallery - ${cleanNumber}.png`,
          `images/Gallery - ${cleanNumber}.jpeg`,

          `images/Gallery - ${cleanNumber}.JPG`,
          `images/Gallery - ${cleanNumber}.PNG`,
          `images/Gallery - ${cleanNumber}.JPEG`

        ];


        let imageIndex = 0;


        /*
          Try each possible filename until
          one actually exists.
        */

        const tryNextImage = () => {

          if (
            imageIndex >=
            possibleImages.length
          ) {

            console.warn(
              `Gallery image ${cleanNumber} could not be found.`
            );

            return;
          }


          const imagePath =
            possibleImages[imageIndex];

          imageIndex++;

          cardImage.src = imagePath;


          /*
            If this image doesn't exist,
            try the next extension/name.
          */

          cardImage.onerror = () => {

            cardImage.onerror = null;

            tryNextImage();

          };

        };


        tryNextImage();

      }


      /* =========================================
         OPEN GALLERY LIGHTBOX
         ========================================= */

      item.addEventListener('click', () => {

        if (!lightbox) return;


        const lightboxImage =
          lightbox.querySelector(
            '.lightbox-image'
          );

        const lightboxTitle =
          lightbox.querySelector(
            '.lightbox-title'
          );

        const lightboxText =
          lightbox.querySelector(
            '.lightbox-text'
          );


        /*
          Use the actual loaded image.

          If the card image exists,
          this works for both JPG and PNG.
        */

        if (lightboxImage && cardImage) {

          lightboxImage.src =
            cardImage.currentSrc ||
            cardImage.src;

          lightboxImage.alt =
            item.dataset.title ||
            cardImage.alt ||
            'Gallery image';

        }


        /*
          Title from data-title.
        */

        if (lightboxTitle) {

          lightboxTitle.textContent =
            item.dataset.title ||
            'Gallery';

        }


        /*
          Description from data-caption.
        */

        if (lightboxText) {

          lightboxText.textContent =
            item.dataset.caption ||
            '';

        }


        /*
          Open lightbox.
        */

        lightbox.classList.add('open');

        document.body.style.overflow =
          'hidden';


        /*
          Focus close button for accessibility.
        */

        const closeBtn =
          lightbox.querySelector(
            '.lightbox-close'
          );

        if (closeBtn) {
          closeBtn.focus();
        }

      });

    });

  }


  /* =========================================
     GALLERY LIGHTBOX
     ========================================= */

  if (lightbox) {

    const lightboxImage =
      lightbox.querySelector(
        '.lightbox-image'
      );

    const closeBtn =
      lightbox.querySelector(
        '.lightbox-close'
      );

    let lastFocused = null;


    /*
      Close function.
    */

    const closeLightbox = () => {

      lightbox.classList.remove('open');

      document.body.style.overflow = '';

      if (lastFocused) {
        lastFocused.focus();
      }

    };


    /*
      Remember which gallery item was opened.
    */

    galleryItems.forEach(item => {

      item.addEventListener('click', () => {

        lastFocused = item;

      });

    });


    /*
      Close button.
    */

    if (closeBtn) {

      closeBtn.addEventListener(
        'click',
        closeLightbox
      );

    }


    /*
      Clicking outside the image closes it.
    */

    lightbox.addEventListener(
      'click',
      e => {

        if (e.target === lightbox) {

          closeLightbox();

        }

      }
    );


    /*
      Escape key closes it.
    */

    document.addEventListener(
      'keydown',
      e => {

        if (
          e.key === 'Escape' &&
          lightbox.classList.contains('open')
        ) {

          closeLightbox();

        }

      }
    );

  }


  /* =========================================
     FILE-SLOT SYSTEM
     ========================================= */

  const slots =
    [...document.querySelectorAll(
      '[data-slot]'
    )];


  for (const el of slots) {

    const file =
      el.dataset.slot;

    const type =
      el.dataset.type || 'file';

    const label =
      el.dataset.label || 'Open file';

    const status =
      el.querySelector('.slot-status');

    const link =
      el.querySelector('.slot-link');


    /*
      Activate file links.
    */

    if (link) {

      link.href = file;

      link.target = '_blank';

      link.rel =
        'noopener noreferrer';

      link.textContent = label;

      link.classList.remove(
        'disabled'
      );

      link.removeAttribute(
        'aria-disabled'
      );

    }


    if (status) {

      status.textContent =
        'READY FOR YOUR FILE';

    }


    /*
      File preview.
    */

    const target =
      el.querySelector(
        '.slot-preview'
      );


    if (!target) continue;


    /* =========================================
       IMAGE FILE SLOT
       ========================================= */

    if (type === 'image') {

      const img =
        document.createElement('img');

      img.src = file;

      img.alt =
        el.dataset.alt || label;

      img.loading = 'lazy';


      img.onerror = () => {

        target.innerHTML =
          '<span class="slot-empty">' +
          'Add your image to the matching assets folder.' +
          '</span>';

      };


      target.replaceChildren(img);

    }


    /* =========================================
       AUDIO FILE SLOT
       ========================================= */

    else if (type === 'audio') {

      const audio =
        document.createElement('audio');

      audio.controls = true;

      audio.preload = 'metadata';

      audio.src = file;


      audio.onerror = () => {

        target.innerHTML =
          '<span class="slot-empty">' +
          'Add your audio file to the matching assets folder.' +
          '</span>';

      };


      target.replaceChildren(audio);

    }


    /* =========================================
       VIDEO FILE SLOT
       ========================================= */

    else if (type === 'video') {

      const video =
        document.createElement('video');

      video.controls = true;

      video.preload = 'metadata';

      video.src = file;


      video.onerror = () => {

        target.innerHTML =
          '<span class="slot-empty">' +
          'Add your video file to the matching assets folder.' +
          '</span>';

      };


      target.replaceChildren(video);

    }

  }

})();