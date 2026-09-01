const projectPalettes = {
    pink: ['#E94393', '#2CC4F7', '#7C57F6'],
    cyan: ['#2CC4F7', '#00D6C3', '#7C57F6'],
    purple: ['#7C57F6', '#E94393', '#2CC4F7'],
    violet: ['#B16BFF', '#2CC4F7', '#E94393']
};

const sceneMap = {
    0: (colors) => `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 25%), linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 52%, ${colors[2]} 100%)`,
    1: (colors) => `radial-gradient(circle at 80% 18%, rgba(255,255,255,0.28), transparent 22%), linear-gradient(135deg, ${colors[1]} 0%, ${colors[2]} 48%, #0F1220 100%)`,
    2: (colors) => `radial-gradient(circle at 25% 68%, rgba(255,255,255,0.22), transparent 18%), linear-gradient(135deg, ${colors[2]} 0%, ${colors[0]} 45%, #14182A 100%)`
};

function getGalleryPalette(theme = 'pink') {
    return projectPalettes[theme] || projectPalettes.pink;
}

function getSceneBackground(theme, index) {
    const colors = getGalleryPalette(theme);
    return sceneMap[index % 3](colors);
}

//LOADER
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");

    // Mantiene el loader visible inicialmente
    setTimeout(() => {
        loader.classList.add("hide");

        // Lo elimina cuando terminan las transiciones
        setTimeout(() => {
            loader.classList.add("removed");
        }, 1700);
    }, 1200);
});

document.addEventListener('DOMContentLoaded', () => {

    /* ==============================================
       1. TYPEWRITER EFFECT
    ============================================== */
    const roles = [
        "Frontend Developer",
        "Graphic Designer",
        "Creative Coder",
        "UI Enthusiast"
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const pauseTime = 2000;

    const typeElement = document.getElementById('typewriter-text');

    function typeWriter() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typeElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typeElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deleteSpeed : typeSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            delay = pauseTime;
            isDeleting = true;
        }
        else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 500;
        }

        setTimeout(typeWriter, delay);
    }

    setTimeout(typeWriter, 1000);


    /* ==============================================
       2. SCROLL REVEAL CON INTERSECTION OBSERVER
    ============================================== */
    const sections = document.querySelectorAll('.section');
    const scrollContainer = document.getElementById('scroll-container');

    const observerOptions = {
        root: scrollContainer,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(sec => revealObserver.observe(sec));


    /* ==============================================
       3. PROJECT EXPANSION & GALLERY LOGIC
    ============================================== */
    const projectCards = document.querySelectorAll('.project-card');
    const lightbox = document.getElementById('project-lightbox');
    const lightboxMedia = document.getElementById('lightbox-media');
    const lightboxDots = document.getElementById('lightbox-dots');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-nav.prev');
    const lightboxNext = document.querySelector('.lightbox-nav.next');

    let activeGallery = null;
    let activeSlide = 0;
    const imageUrlCache = new Map();

    function getGalleryImages(gallery) {
        const images = gallery.dataset.images;
        if (!images) return [];
        return images.split(',').map(item => item.trim()).filter(Boolean);
    }

    function getFallbackBackground(theme, index) {
        return getSceneBackground(theme, index);
    }

    function sniffMimeType(bytes) {
        if (bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
            return 'image/png';
        }
        if (bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
            return 'image/jpeg';
        }
        if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
            return 'image/gif';
        }
        if (bytes.length >= 12 && bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
            return 'image/webp';
        }
        return 'image/png';
    }

    async function prepareImageUrl(imagePath) {
        if (!imagePath) return null;

        if (imageUrlCache.has(imagePath)) {
            return imageUrlCache.get(imagePath);
        }

        const response = await fetch(imagePath);
        if (!response.ok) {
            throw new Error(`La imagen no pudo cargarse: ${imagePath}`);
        }

        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const mimeType = blob.type && blob.type !== 'application/octet-stream' ? blob.type : sniffMimeType(bytes);
        const fixedBlob = new Blob([bytes], { type: mimeType });
        const objectUrl = URL.createObjectURL(fixedBlob);
        imageUrlCache.set(imagePath, objectUrl);
        return objectUrl;
    }

    function applyFallbackBackground(element, theme, index) {
        element.style.background = getFallbackBackground(theme, index);
        element.style.backgroundSize = '';
        element.style.backgroundPosition = '';
        element.style.backgroundRepeat = '';
    }

    function applyGalleryBackground(element, gallery, index) {
        const theme = gallery.dataset.theme || 'pink';
        const images = getGalleryImages(gallery);

        if (images.length > 0) {
            const imagePath = images[index];

            prepareImageUrl(imagePath)
                .then((url) => {
                    if (!url) {
                        applyFallbackBackground(element, theme, index);
                        return;
                    }

                    element.style.backgroundImage = `url("${url}")`;
                    element.style.backgroundSize = 'cover';
                    element.style.backgroundPosition = 'center';
                    element.style.backgroundRepeat = 'no-repeat';
                })
                .catch(() => {
                    applyFallbackBackground(element, theme, index);
                });
            return;
        }

        applyFallbackBackground(element, theme, index);
    }

    function renderProjectGallery(gallery) {
        const mainMedia = gallery.querySelector('.project-main-media');
        const thumbs = gallery.querySelectorAll('.thumb');
        const images = getGalleryImages(gallery);
        const currentIndex = Number(mainMedia.dataset.index || 0);
        const safeIndex = currentIndex >= 0 ? currentIndex : 0;
        const name = images[safeIndex] ? images[safeIndex].split('/').pop() : `IMG_${String(safeIndex + 1).padStart(3, '0')}.png`;

        applyGalleryBackground(mainMedia, gallery, safeIndex);
        mainMedia.querySelector('.media-label').textContent = name;

        thumbs.forEach((thumb, index) => {
            thumb.classList.toggle('is-active', index === safeIndex);
            if (images[index]) {
                applyGalleryBackground(thumb, gallery, index);
            } else {
                thumb.style.background = getSceneBackground(gallery.dataset.theme || 'pink', index);
            }
        });
    }

    function renderLightbox() {
        if (!activeGallery) return;

        const theme = activeGallery.dataset.theme || 'pink';
        const images = getGalleryImages(activeGallery);
        const totalSlides = Math.max(images.length, 1);

        if (images.length > 0) {
            const imagePath = images[activeSlide];

            prepareImageUrl(imagePath)
                .then((url) => {
                    if (!url) {
                        lightboxMedia.style.background = getFallbackBackground(theme, activeSlide);
                        lightboxMedia.style.backgroundSize = '';
                        lightboxMedia.style.backgroundPosition = '';
                        lightboxMedia.style.backgroundRepeat = '';
                        return;
                    }

                    lightboxMedia.style.backgroundImage = `url("${url}")`;
                    lightboxMedia.style.backgroundSize = 'cover';
                    lightboxMedia.style.backgroundPosition = 'center';
                    lightboxMedia.style.backgroundRepeat = 'no-repeat';
                })
                .catch(() => {
                    lightboxMedia.style.background = getFallbackBackground(theme, activeSlide);
                    lightboxMedia.style.backgroundSize = '';
                    lightboxMedia.style.backgroundPosition = '';
                    lightboxMedia.style.backgroundRepeat = '';
                });
        } else {
            lightboxMedia.style.background = getFallbackBackground(theme, activeSlide);
            lightboxMedia.style.backgroundSize = '';
            lightboxMedia.style.backgroundPosition = '';
            lightboxMedia.style.backgroundRepeat = '';
        }

        lightboxMedia.dataset.index = String(activeSlide);

        lightboxDots.innerHTML = '';
        Array.from({ length: totalSlides }).forEach((_, index) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = `lightbox-dot${index === activeSlide ? ' is-active' : ''}`;
            dot.setAttribute('aria-label', `Ver imagen ${index + 1}`);
            dot.addEventListener('click', () => {
                activeSlide = index;
                renderLightbox();
            });
            lightboxDots.appendChild(dot);
        });
    }

    function openLightbox(gallery, slideIndex) {
        activeGallery = gallery;
        activeSlide = slideIndex;
        renderLightbox();
        lightbox.classList.add('visible');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
    }

    function closeLightbox() {
        lightbox.classList.remove('visible');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
    }

    const galleryObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const gallery = entry.target;
                renderProjectGallery(gallery); // Se descargan solo cuando la tarjeta es visible
                observer.unobserve(gallery);
            }
        });
    }, { rootMargin: '100px' });

    document.querySelectorAll('.project-gallery').forEach(gallery => {
        const mainMedia = gallery.querySelector('.project-main-media');
        const thumbs = gallery.querySelectorAll('.thumb');

    // Observamos la galería para no cargar imágenes antes de tiempo
        galleryObserver.observe(gallery);

        mainMedia.addEventListener('click', (event) => {
            event.stopPropagation();
            openLightbox(gallery, Number(mainMedia.dataset.index || 0));
        });

        thumbs.forEach((thumb) => {
            thumb.addEventListener('click', (event) => {
                event.stopPropagation();
                const index = Number(thumb.dataset.index || 0);
                mainMedia.dataset.index = index;
                renderProjectGallery(gallery);
            });
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => {
        if (!activeGallery) return;
        const totalSlides = Math.max(getGalleryImages(activeGallery).length, 1);
        activeSlide = (activeSlide - 1 + totalSlides) % totalSlides;
        renderLightbox();
    });
    lightboxNext.addEventListener('click', () => {
        if (!activeGallery) return;
        const totalSlides = Math.max(getGalleryImages(activeGallery).length, 1);
        activeSlide = (activeSlide + 1) % totalSlides;
        renderLightbox();
    });

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (event) => {
        if (!lightbox.classList.contains('visible')) return;
        if (event.key === 'Escape') closeLightbox();
        if (event.key === 'ArrowLeft') {
            const totalSlides = Math.max(getGalleryImages(activeGallery).length, 1);
            activeSlide = (activeSlide - 1 + totalSlides) % totalSlides;
            renderLightbox();
        }
        if (event.key === 'ArrowRight') {
            const totalSlides = Math.max(getGalleryImages(activeGallery).length, 1);
            activeSlide = (activeSlide + 1) % totalSlides;
            renderLightbox();
        }
    });

    projectCards.forEach(card => {
        const header = card.querySelector('.project-header');
        header.addEventListener('click', () => {
            const isExpanded = card.classList.contains('expanded');
            projectCards.forEach(c => c.classList.remove('expanded'));

            if (!isExpanded) {
                card.classList.add('expanded');
            }
        });
    });


    /* ==============================================
       4. DYNAMIC FILTERING & COUNTER
    ============================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCountEl = document.getElementById('project-count');

    function updateCounter() {
        const visibleProjects = document.querySelectorAll('.project-card:not(.hidden)');

        let start = 0;
        const target = visibleProjects.length;
        const speed = 50;

        const countInt = setInterval(() => {
            if (start >= target) {
                projectCountEl.textContent = target;
                clearInterval(countInt);
            } else {
                start++;
                projectCountEl.textContent = start;
            }
        }, speed);

        if (target === 0) projectCountEl.textContent = 0;
    }

    updateCounter();

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            const filterValue = e.target.getAttribute('data-filter');

            projectCards.forEach(card => {
                card.classList.remove('expanded');

                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            setTimeout(updateCounter, 100);
        });
    });

    /* ==============================================
       5. FAKE TERMINAL CONTROLS
    ============================================== */
    const closeBtn = document.querySelector('.ctrl.close');

    closeBtn.addEventListener('click', () => {
        document.body.innerHTML = `
        <div style="
          display:flex;
          justify-content:center;
          align-items:center;
          width:100vw;
          height:100vh;
          padding:10px;
          box-sizing:border-box;
          overflow:hidden;
        ">
          <pre style="
            color: var(--c-pink);
            opacity: 0.5;
            font-family: monospace;
            line-height: 1.1;
            text-align: center;
            margin: 0;
            white-space: pre;
            font-size: clamp(8px, 1.5vw, 12px);
            transform: scale(min(1, 90vw / 600));
          ">
       .                .       .         .      ..  .   
               .               =)}[>:             .      
          .            .     .   :%@@(    .   ..         
 .        .           .         ..-@@@@-          .      
            .                      {@@@@[~.              
                    .              (@@@@@@^   .          
.          .       .   .    .   .  )@@@@@                
   .                  .     .   .  )@@@@#        .       
         .        .       -{@*    .)@@@@{     .          
     .(@@@@@@@@@@@@@@@@@@@@@@@@@@@@}@@@@%}@@@@@@@#~      
        +@@@@@@@@@@@@@@@@@@@@@@@@@#[@@@@#]@@@@@<         
         ~(=       .     ^@@@@[. . )@@@@{  .:)*    .     
     . .  )>    ..       ^@@@@[.   )@@@@{   =]. .  .     
.  .      <<.       =<+  ^@@@@[.   )@@@@{   =]  ..       
.        .<<    . >@@=   ^@@@@[.   )@@@@{   =]        .  
.    .    <<     ^@@<    ^@@@@[.   )@@@@{   =]       .   
  .       <> .  .@@@=    ^@@@@[.   )@@@@{   =]           
.     ..  <>    >@@@+    ^@@@@[. . )@@@@{   =] .     .   
   .      <>.   }@@@>    >@@@@}:   )@@@@{   =]         ..
     .    <>    @@@@[   .]@@@@%~   )@@@@{   =]           
     .    <<  ..@@@@#  .<@@@@@@}:  )@@@@{   =]  .     .. 
          ><   ~@@@@@  (@@@@@@@@{- )@@@@{   +[           
  .       ~]=  ^@@@@@   -@@@@@@*   )@@@@{  .(>           
           :<- }@@@@@    )@@@@{-   )@@@@@ .>= .         .
   .     .   ~{@@@@@@    >@@@@[:   )@@@@@@+.  .     ..   
       .    *#@@@@@@@    ^@@@@[. . )@@@@@@@)             
      ..      =@@@@@@    ^@@@@[.   )@@@@@)   .           
    .          [@@@@@  . ^@@@@[.   )@@@@@     .    .  .  
       .       <@@@@@    ^@@@@[.  .)@@@@{ .     .        
.   .          <@@@@@    ^@@@@[. ..)@@@@{   ..     .     
       .     . )@@@@@    ^@@@@[.   }@@@@{.               
          .    #@@@@@%.  ^@@@@[.  ]@@@@@@.       .       
              ]@@@@@:    >@@@@[:    [@@@@@             . 
 .   .      +@@@@>. ... :%@@@@@*.     =@@@@)             
        =(%@@@@@%%%%%%%%@@@@@@@@%%%%%%%%@@@@@@]+.        
  .  :]##########################################}+     .
  ..          .     .   =%@@@@@>      ..                 
         .    .          :}@@@+         .       .        
       .          .       -#@*       .             .     
 .    .    .      .        >(      .                     
© 
 ╦┌─┐┌─┐┌─┐  ╔╦╗┌─┐┬ ┬┌─┐
 ║│ │└─┐├┤    ║ │ │└┬┘│ │
╚╝└─┘└─┘└─┘   ╩ └─┘ ┴ └─┘
2026
          </pre>
        </div>
        `;
    });
});