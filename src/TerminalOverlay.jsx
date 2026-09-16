import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

const asciiLogo = String.raw`
      __     ______     ______     ______      
     /\ \   /\  __ \   /\  ___\   /\  ___\     
    _\_\ \  \ \ \/\ \  \ \___  \  \ \  __\     
   /\_____\  \ \_____\  \/\_____\  \ \_____\   
   \/_____/   \/_____/   \/_____/   \/_____/   
                                               
    ______   ______     __  __     ______      
   /\__  _\ /\  __ \   /\ \_\ \   /\  __ \     
   \/_/\ \/ \ \ \/\ \  \ \____ \  \ \ \/\ \    
      \ \_\  \ \_____\  \/\_____\  \ \_____\   
       \/_/   \/_____/   \/_____/   \/_____/   
`;

export function TerminalOverlay({ isZoomed, onClose }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxData, setLightboxData] = useState({ open: false, images: [], currentIndex: 0 });
  const [projectThumbs, setProjectThumbs] = useState({
    p1: 0, p2: 0, p3: 0, p4: 0
  });
  const [typedText, setTypedText] = useState('');

  // Sincronización con la animación de cámara 3D
  useEffect(() => {
    let timer;
    if (isZoomed) {
      timer = setTimeout(() => {
        setShouldRender(true);
      }, 1300);
    } else {
      setShouldRender(false);
    }
    return () => clearTimeout(timer);
  }, [isZoomed]);

  // Efecto Typewriter gestionado con Estado de React (evita manipular directamente el DOM)
  useEffect(() => {
    if (!shouldRender) return;

    const roles = ["Frontend Developer", "Graphic Designer", "UI/UX Designer"];
    let roleIdx = 0, charIdx = 0, isDeleting = false;
    let timer;

    const type = () => {
      const current = roles[roleIdx];
      setTypedText(
        isDeleting 
          ? current.substring(0, charIdx - 1) 
          : current.substring(0, charIdx + 1)
      );

      charIdx += isDeleting ? -1 : 1;
      let delay = isDeleting ? 40 : 80;

      if (!isDeleting && charIdx === current.length) {
        delay = 2000;
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        delay = 400;
      }

      timer = setTimeout(type, delay);
    };

    timer = setTimeout(type, 300);
    return () => clearTimeout(timer);
  }, [shouldRender]);

  // Manejo del Lightbox
  const openLightbox = (imagesArray, index = 0) => {
    setLightboxData({ open: true, images: imagesArray, currentIndex: index });
  };

  const closeLightbox = useCallback(() => {
    setLightboxData({ open: false, images: [], currentIndex: 0 });
  }, []);

  const navigateLightbox = useCallback((direction) => {
    setLightboxData((prev) => {
      let newIdx = prev.currentIndex + direction;
      if (newIdx < 0) newIdx = prev.images.length - 1;
      if (newIdx >= prev.images.length) newIdx = 0;
      return { ...prev, currentIndex: newIdx };
    });
  }, []);

  // Control por teclado para accesibilidad (Escape, flechas)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxData.open) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxData.open, closeLightbox, navigateLightbox]);

  // Cambiar thumbnail activo de la tarjeta
  const handleThumbClick = (e, projectId, index) => {
    e.stopPropagation();
    setProjectThumbs((prev) => ({ ...prev, [projectId]: index }));
  };

  if (!shouldRender) return null;

  const projects = [
    {
      id: 'p1',
      category: 'web',
      theme: 'pink',
      filename: 'landing_page/',
      images: ['assets/hero.png', 'assets/toggle.png', 'assets/form.png'],
      labels: ['/', 'toggle', 'form'],
      desc: '"Responsive landing page for a tattoo artist built with React."',
      tech: 'Tech: ["React", "CSS"]',
      year: '- 2025',
      links: [
        { label: '> Demo', url: 'https://toyooart.github.io/' },
        { label: '> GitHub', url: 'https://github.com/jtoyoo/web-tattooer' }
      ]
    },
    {
      id: 'p2',
      category: 'design',
      theme: 'cyan',
      filename: 'packaging/',
      images: ['assets/packaging.png', 'assets/merch.png', 'assets/pattern.png'],
      labels: ['packaging', 'merch', 'pattern'],
      desc: '"Packaging design project focused on visual communication and product presentation."',
      tech: 'Tech: [Illustrator, Photoshop]',
      year: '-- 2021',
      links: []
    },
    {
      id: 'p3',
      category: 'design',
      theme: 'purple',
      filename: 'visual_identity/',
      images: ['assets/lettermark.png', 'assets/isologo.png', 'assets/custom.png'],
      labels: ['lettermark', 'isologo', 'custom'],
      desc: 'Visual identity focused on defining the brand\'s personality.',
      tech: 'Tech: Photoshop, Procreate',
      year: '-- 2025',
      links: [
        { label: '> devianArt', url: 'https://www.deviantart.com/toyo1' }
      ]
    },
    {
      id: 'p4',
      category: 'web',
      theme: 'violet',
      filename: 'portfolio/',
      images: ['assets/terminal.png', 'assets/gallery.png', 'assets/details.png'],
      labels: ['gallery', 'terminal', 'details'],
      desc: '"Interactive portfolio built with React Three Fiber."',
      tech: 'Tech:["CSS","React","Three.js"]',
      year: '-- 2026',
      links: [
        { label: '> GitHub', url: 'https://github.com/jtoyoo' }
      ]
    }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === activeFilter);

  return (
    <div className="terminal-overlay-layer">
      <div className="crt-overlay" aria-hidden="true"></div>

      <div className="window-container">
        {/* Barra superior de la ventana */}
        <header className="window-bar">
          <span className="window-title">root@portfolio:~$</span>
          <div className="window-controls">
            <span className="ctrl min">_</span>
            <span className="ctrl max">□</span>
            <span className="ctrl close" onClick={onClose}>X</span>
          </div>
        </header>

        <main className="terminal-body" id="scroll-container">
          {/* HERO SECTION */}
          <section id="hero" className="section reveal">
            <pre className="ascii-art" aria-hidden="true">
              {asciiLogo}
            </pre>

            <div className="cmd-line">
              <span className="prompt">$ whoami --</span>
            </div>
            <div className="typewriter-container">
              <span className="prompt-arrow">&gt;</span>
              <span>{typedText}</span><span className="cursor">_</span>
            </div>

            <div className="cmd-line mt-2">
              <span className="prompt user-prompt">@portfolio:~$</span>
            </div>

            <div className="action-buttons">
              <a href="#projects" className="term-btn">[ Projects ]</a>
              <a href="#contact" className="term-btn">[ Contact ]</a>
            </div>
          </section>

          {/* ABOUT SECTION */}
          <section id="about" className="section reveal">
            <div className="cmd-line">
              <h2 className="prompt">$ about --</h2>
            </div>
            <div className="window-box output-block">
              <p><span className="highlight-purple">Hi, I'm</span> José Toyo</p>
              <p><span className="highlight-purple">I work at</span> the intersection of graphic design, UI, and frontend development.</p>
              <p><span className="highlight-purple">Crafting</span> visual identities and digital experiences through experimentation and creative thinking.</p>
            </div>
          </section>

          {/* PROJECTS SECTION */}
          <section id="projects" className="section reveal">
            <div className="cmd-line">
              <h2 className="prompt">$ ls projects/</h2>
              <span className="counter-text ml-auto">- - - <span id="project-count">{filteredProjects.length}</span> archives</span>
            </div>

            <div className="filters mt-1">
              <button 
                type="button" 
                className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActiveFilter('all')}
              >[all]</button>
              <button 
                type="button" 
                className={`filter-btn ${activeFilter === 'web' ? 'active' : ''}`}
                onClick={() => setActiveFilter('web')}
              >[frontend]</button>
              <button 
                type="button" 
                className={`filter-btn ${activeFilter === 'design' ? 'active' : ''}`}
                onClick={() => setActiveFilter('design')}
              >[graphic-design]</button>
            </div>

            <div className="project-grid mt-2">
              {filteredProjects.map((p) => {
                const currentThumb = projectThumbs[p.id] || 0;
                return (
                  <article key={p.id} className="project-card stagger-item" data-category={p.category} data-theme={p.theme}>
                    <div className="project-header">
                      <span className="icon">&#x1F5C2;</span>
                      <h3 className="filename">{p.filename}</h3>
                    </div>
                    <div className="project-details">
                      <div className="project-gallery" data-theme={p.theme}>
                        <div 
                          className="project-main-media" 
                          role="button" 
                          tabIndex="0" 
                          onClick={() => openLightbox(p.images, currentThumb)}
                        >
                          <img 
                            src={`/${p.images[currentThumb]}`} 
                            alt={p.labels[currentThumb]} 
                            className="project-img"
                          />
                          <span className="media-label">{p.labels[currentThumb]}</span>
                        </div>
                        <div className="project-thumbs">
                          {p.images.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              className={`thumb ${currentThumb === idx ? 'is-active' : ''}`}
                              onClick={(e) => handleThumbClick(e, p.id, idx)}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="project-desc">{p.desc}</p>
                      <p className="project-tech">{p.tech}</p>
                      <p className="project-year">{p.year}</p>
                      <div className="project-links">
                        {p.links.map((link, lIdx) => (
                          <a key={lIdx} href={link.url} target="_blank" rel="noopener noreferrer" className="link-btn">
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* EXPERIENCE SECTION */}
          <section id="experience" className="section reveal">
            <div className="cmd-line">
              <h2 className="prompt">$ history --</h2>
            </div>
            <div className="history-list output-block">
              <div className="history-item stagger-item">
                <span className="year">2025</span>
                <span className="role">Freelance Frontend Developer</span>
              </div>
              <div className="history-item stagger-item">
                <span className="year">2023</span>
                <span className="role">UI Designer</span>
              </div>
              <div className="history-item stagger-item">
                <span className="year">2015</span>
                <span className="role">Graphic Designer</span>
              </div>
              <div className="history-item stagger-item">
                <span className="year">2012</span>
                <span className="role">IT Support</span>
              </div>
            </div>
          </section>

          {/* SERVICES SECTION */}
          <section id="services" className="section reveal">
            <div className="cmd-line">
              <h2 className="prompt">$ ps -a</h2>
            </div>
            <div className="services-list output-block">
              <div className="service-header">
                <span className="pid">PID</span>
                <span className="srv">SERVICE</span>
              </div>
              <div className="service-item stagger-item">
                <span className="pid highlight-blue">001</span>
                <span className="srv">Frontend Development</span>
              </div>
              <div className="service-item stagger-item">
                <span className="pid highlight-blue">002</span>
                <span className="srv">Web Design</span>
              </div>
              <div className="service-item stagger-item">
                <span className="pid highlight-blue">003</span>
                <span className="srv">Branding & Identity</span>
              </div>
              <div className="service-item stagger-item">
                <span className="pid highlight-blue">004</span>
                <span className="srv">Illustration</span>
              </div>
            </div>
            
            <div className="cmd-line mt-2">
              <h2 className="prompt">$ skills --</h2>
            </div>
            <ul className="skills-list output-block">
              <li className="stagger-item"><span className="bullet">▪</span> HTML5/ CSS3/ JavaScript/ React/ Three.js/</li>
              <li className="stagger-item"><span className="bullet">▪</span> Figma/PS/AI</li>
              <li className="stagger-item"><span className="bullet">▪</span> Git/GitHub</li>
            </ul>
          </section>

          {/* FOOTER SECTION */}
          <section id="contact" className="section reveal mt-3">
            <div className="cmd-line">
              <h2 className="prompt">$ cd contact/</h2>
            </div>
            <div className="cmd-line">
              <span className="highlight-purple">$ links --</span>
            </div>
            <div className="output-block link-list">
              <a href="mailto:jtoyo013@gmail.com" target="_blank" rel="noopener noreferrer" className="stagger-item">&gt; --email.</a>
              <a href="https://github.com/jtoyoo/" target="_blank" rel="noopener noreferrer" className="stagger-item">&gt; --github.</a>
              <a href="https://www.linkedin.com/in/jtoyo/" target="_blank" rel="noopener noreferrer" className="stagger-item">&gt; --linkedin.</a>
            </div>
          </section> 

          <footer>
            <div className="footer">
              <span className="prompt highlight-pink">$ exit</span>
            </div>
            <div className="output-block muted-text">
              <p>Connection closed.</p>
              <p>©<time>2026</time> Jose Toyo</p>
            </div>
          </footer>
        </main>
      </div>

      {/* Lightbox Modal */}
      {lightboxData.open && (
        <div className="project-lightbox is-active">
          <div className="lightbox-bubble">
            <button className="lightbox-close" type="button" onClick={closeLightbox}>×</button>
            <div className="lightbox-stage">
              <button className="lightbox-nav prev" type="button" onClick={() => navigateLightbox(-1)}>‹</button>
              <div className="lightbox-media">
                <img 
                  src={`/${lightboxData.images[lightboxData.currentIndex]}`} 
                  alt="Preview" 
                  className="lightbox-img"
                />
              </div>
              <button className="lightbox-nav next" type="button" onClick={() => navigateLightbox(1)}>›</button>
            </div>
            <div className="lightbox-dots">
              {lightboxData.images.map((_, i) => (
                <span key={i} className={`dot ${lightboxData.currentIndex === i ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}