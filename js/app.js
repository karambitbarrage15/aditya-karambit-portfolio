/**
 * Main Application Logic
 * Coordinates routing, tactile keyboard shortcuts, project inspection modals,
 * and peach-style interactive chapter flows.
 */

// Curated Project Showcase from GitHub (@karambitbarrage15)
// Ordered exactly per request: changeguard, syncEngine, Syntra, Planora, SkillForge, phoenix-ephemeral + top additional repos
const PROJECTS = [
  {
    id: "changeguard",
    index: "01",
    title: "ChangeGuard",
    tagline: "AI-Powered Change-Intelligence & Autonomous SRE Platform",
    category: "Autonomous Systems / SRE",
    description: "An enterprise-grade change risk intelligence platform that predicts pre-deploy outages, powers autonomous SRE workflows via MCP tools, generates grounded RAG incident playbooks, and executes automated GitOps rollbacks.",
    tech: ["Python", "FastAPI", "MCP Protocol", "GitOps", "Telemetry", "RAG Playbooks"],
    github: "https://github.com/karambitbarrage15/changeguard",
    demo: null,
    metrics: "Sub-second AST diff risk scoring, automated telemetry correlation"
  },
  {
    id: "syncengine",
    index: "02",
    title: "SyncEngine",
    tagline: "Workflow Automation Platform Inspired by n8n",
    category: "Distributed Automation / Pipelines",
    description: "Event-driven workflow orchestration engine with interactive drag-and-drop canvas, Gemini AI node configurations, webhook triggers, HTTP integrations, and scalable background worker queues.",
    tech: ["TypeScript", "Next.js", "Node.js", "Gemini AI", "BullMQ", "TailwindCSS"],
    github: "https://github.com/karambitbarrage15/syncEngine",
    demo: null,
    metrics: "High-throughput execution pipelines, visual canvas node graph"
  },
  {
    id: "syntra",
    index: "03",
    title: "Syntra",
    tagline: "Multi-Agent AI Orchestration & MCP Integration Engine",
    category: "AI Agents / Multi-Agent Systems",
    description: "Full-stack agent orchestration framework built with Mastra Core, Descope MCP protocol, Google AI SDK, and PostgreSQL memory persistence for scalable autonomous multi-agent pipelines.",
    tech: ["TypeScript", "Mastra Core", "Descope MCP", "AI SDK", "PostgreSQL", "LibSQL"],
    github: "https://github.com/karambitbarrage15/Syntra",
    demo: null,
    metrics: "Autonomous agent execution, persistent conversational memory"
  },
  {
    id: "planora",
    index: "04",
    title: "Planora",
    tagline: "Multi-Step Event Requirement & Match Platform",
    category: "Full-Stack Web Architecture",
    description: "End-to-end event requirement posting and matching platform featuring dynamic multi-step form state pipelines, Next.js App Router, modular Express REST APIs, and MongoDB persistence.",
    tech: ["JavaScript", "Next.js", "Express", "Node.js", "MongoDB", "TailwindCSS"],
    github: "https://github.com/karambitbarrage15/Planora",
    demo: null,
    metrics: "Streamlined multi-step form engine, atomic requirement records"
  },
  {
    id: "skillforge",
    index: "05",
    title: "SkillForge",
    tagline: "Concurrent Skill Pipeline & Worker Engine",
    category: "Backend / Concurrency",
    description: "A concurrent Go backend engine engineered for scalable workflow orchestration, automated developer skill evaluations, and event-driven worker pipelines with zero-overhead thread pooling.",
    tech: ["Go", "Goroutines", "PostgreSQL", "Channels", "REST API"],
    github: "https://github.com/karambitbarrage15/SkillForge",
    demo: null,
    metrics: "High-throughput concurrent worker queues, atomic pipeline transitions"
  },
  {
    id: "phoenix-ephemeral",
    index: "06",
    title: "Phoenix Ephemeral",
    tagline: "Real-Time Self-Destructing Encrypted Chat",
    category: "Distributed Systems / Realtime",
    description: "A real-time, privacy-first communication platform built on distributed memory stores. Automatically and permanently purges all room data, messages, and cryptographic keys the instant a room closes.",
    tech: ["Next.js", "TypeScript", "Upstash Redis", "Upstash Realtime", "SSE"],
    github: "https://github.com/karambitbarrage15/phoenix-ephemeral",
    demo: null,
    metrics: "<15ms socket message delivery, zero-persistence guarantee"
  },
  {
    id: "pied-piper",
    index: "07",
    title: "Pied-Piper",
    tagline: "Middle-Out File Compression Service",
    category: "Distributed Compression / Infra",
    description: "Distributed middle-out file compression service inspired by HBO's Silicon Valley. Features parallelized client-server chunk streaming, dockerized microservices, and lossless compression benchmarks.",
    tech: ["TypeScript", "Node.js", "Docker", "Microservices", "Turborepo"],
    github: "https://github.com/karambitbarrage15/Pied-Piper",
    demo: null,
    metrics: "Parallelized middle-out chunk processing, multi-container architecture"
  },
  {
    id: "satyanveshi",
    index: "08",
    title: "Satyanveshi",
    tagline: "Full-Stack Search Engine Built from Scratch",
    category: "Information Retrieval / Algorithms",
    description: "Seeker of Truth: A high-performance search engine built completely from first principles. Features an inverted index, BM25 statistical relevance ranking, prefix-tree Trie autocomplete, and Levenshtein fuzzy string distance matching.",
    tech: ["TypeScript", "Node.js", "BM25 Ranking", "Trie Data Structure", "Fuzzy Search"],
    github: "https://github.com/karambitbarrage15/satyanveshi",
    demo: null,
    metrics: "O(k) prefix lookups, instant BM25 document ranking"
  },
  {
    id: "takshaka",
    index: "09",
    title: "Takshaka",
    tagline: "Visual Low-Level Design (LLD) Studio & Arena",
    category: "Developer Tools / Visual Canvas",
    description: "An interactive visual design platform where engineers model complex class architectures, map behavioral design patterns, and receive rubric-based AI architectural critique with automated feedback loops.",
    tech: ["TypeScript", "React", "Canvas Engine", "LLM Evaluation", "TailwindCSS"],
    github: "https://github.com/karambitbarrage15/Takshaka",
    demo: null,
    metrics: "Real-time relationship validation, automated structural grading"
  },
  {
    id: "carepilot",
    index: "10",
    title: "CarePilot",
    tagline: "Autonomous Customer Support & Intent Classifier",
    category: "Applied AI / LLM Agents",
    description: "An LLM-driven autonomous customer service copilot with robust intent classification, deterministic guardrails, grounded retrieval-augmented generation, and intelligent tiered escalation triggers.",
    tech: ["Python", "LLM Orchestration", "RAG", "FastAPI", "Intent Routing"],
    github: "https://github.com/karambitbarrage15/CarePilot",
    demo: null,
    metrics: "High accuracy intent clustering, grounded knowledge synthesis"
  }
];

class App {
  constructor() {
    this.currentChapter = 'home';
    this.history = ['home'];
    this.init();
  }

  init() {
    this.renderProjectsGrid();
    this.bindNavigation();
    this.bindKeyboardShortcuts();
    this.bindModal();
    this.bindStoryTimeline();
    this.bindContactForm();
    this.bindAudioToggle();

    // Initial decipher scramble
    if (window.decipher) {
      window.decipher.scrambleAll();
    }
  }

  // Render the 3-column project cards (.kachel)
  renderProjectsGrid() {
    const gridEl = document.getElementById('work-grid');
    if (!gridEl) return;

    gridEl.innerHTML = '';
    PROJECTS.forEach((proj) => {
      const card = document.createElement('div');
      card.className = 'kachel';
      card.setAttribute('data-id', proj.id);

      card.innerHTML = `
        <div class="kachel-top">
          <span class="kachel-index">${proj.index}</span>
          <span class="kachel-badge">${proj.category.split('/')[0].trim()}</span>
        </div>
        <div class="kachel-body">
          <h3>${proj.title}</h3>
          <p>${proj.tagline}</p>
        </div>
        <div class="kachel-footer">
          <span class="kachel-tech">${proj.tech[0]} · ${proj.tech[1]}</span>
          <span class="kachel-inspect">
            Inspect
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </span>
        </div>
      `;

      card.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playKeyClick(900);
        this.openProjectModal(proj);
      });

      gridEl.appendChild(card);
    });
  }

  // Chapter Navigation (Home, Story, Work, Contact)
  goToChapter(chapterName, warp = false) {
    if (this.currentChapter === chapterName) return;

    if (window.soundEngine) {
      if (warp) {
        window.soundEngine.playEnterThud();
      } else {
        window.soundEngine.playKeyClick(1100);
      }
    }

    const switchDom = () => {
      // Deactivate all
      document.querySelectorAll('section.chapter').forEach(s => s.classList.remove('active'));
      document.querySelectorAll('#leiste button, #leiste a, #dock button, #dock a').forEach(b => b.classList.remove('active'));

      // Activate target
      const targetSec = document.getElementById(`chapter-${chapterName}`);
      if (targetSec) targetSec.classList.add('active');

      const targetBtn = document.querySelector(`[data-nav="${chapterName}"]`);
      if (targetBtn) targetBtn.classList.add('active');

      // Update background Renaissance art (100% unhidden in Home and Story)
      const artHome = document.getElementById('bg-art-home');
      const artStory = document.getElementById('bg-art-story');
      if (artHome && artStory) {
        artHome.classList.toggle('active', chapterName === 'home');
        artStory.classList.toggle('active', chapterName === 'story');
      }

      // Update telemetry top
      const chapterLabel = document.getElementById('chapter-indicator');
      if (chapterLabel) {
        const labels = {
          home: 'Chapter 01 / Home',
          story: 'Chapter 02 / Who is talking',
          work: 'Chapter 03 / Work',
          contact: 'Chapter 04 / Transmission'
        };
        chapterLabel.setAttribute('data-s', labels[chapterName] || 'Chapter');
        if (window.decipher) window.decipher.scramble(chapterLabel);
      }

      // Re-trigger text decipher for this section
      if (window.decipher && targetSec) {
        window.decipher.scrambleAll(targetSec);
      }

      this.currentChapter = chapterName;
      this.history.push(chapterName);
    };

    if (warp && window.visualCanvas) {
      window.visualCanvas.triggerTunnel(switchDom);
    } else {
      switchDom();
    }
  }

  bindNavigation() {
    // Dock Nav Links
    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const nav = btn.getAttribute('data-nav');
        this.goToChapter(nav);
      });
    });

    // 3D Isometric Enter Keycap (#taste or #btn-enter-key)
    const enterKey = document.getElementById('taste') || document.getElementById('btn-enter-key');
    if (enterKey) {
      enterKey.addEventListener('click', () => {
        enterKey.classList.add('unten');
        setTimeout(() => enterKey.classList.remove('unten'), 180);
        this.goToChapter('work', true);
      });
    }

    // Top Right Mechanical Delete / ESC Key (#zurueck or #btn-esc)
    const escBtn = document.getElementById('zurueck') || document.getElementById('btn-esc');
    if (escBtn) {
      escBtn.addEventListener('click', () => {
        escBtn.classList.add('unten');
        setTimeout(() => escBtn.classList.remove('unten'), 140);
        if (window.soundEngine) window.soundEngine.playKeyClick(600);
        this.goToChapter('home');
      });
    }

    // Turbo Tunnel Button
    const turboBtn = document.getElementById('btn-turbo-tunnel');
    if (turboBtn) {
      turboBtn.addEventListener('click', () => {
        if (window.visualCanvas) {
          window.visualCanvas.triggerTunnel();
        }
      });
    }

    // Scroll Down Button in Chapter 02 (Who is talking)
    const scrollStoryBtn = document.getElementById('btn-scroll-story');
    if (scrollStoryBtn) {
      scrollStoryBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playKeyClick(800);
        const target = document.getElementById('story-content-anchor');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Mode Switcher on Right (#wahl)
    document.querySelectorAll('#wahl button').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = parseInt(btn.getAttribute('data-r') || btn.getAttribute('data-mode'), 10);
        this.setVisualMode(mode);
      });
    });
  }

  setVisualMode(mode) {
    if (window.visualCanvas) {
      window.visualCanvas.setMode(mode);
    }
    if (window.soundEngine) {
      window.soundEngine.playModeBeep(500 + mode * 120);
    }
    document.querySelectorAll('#wahl button').forEach(b => {
      const bMode = parseInt(b.getAttribute('data-r') || b.getAttribute('data-mode'), 10);
      const isMatch = bMode === mode;
      b.classList.toggle('active', isMatch);
      b.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
    });
  }

  // Keyboard Shortcuts (Enter, Esc/Backspace, 1-5 for Shaders)
  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if user is typing in form inputs
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        return;
      }

      // Enter -> Launch to Work with warp
      if (e.key === 'Enter') {
        const enterKey = document.getElementById('taste') || document.getElementById('btn-enter-key');
        if (enterKey) {
          enterKey.classList.add('unten');
          setTimeout(() => enterKey.classList.remove('unten'), 180);
        }
        this.goToChapter('work', true);
      }

      // Escape or Backspace -> Go back to Home
      if (e.key === 'Escape' || e.key === 'Backspace') {
        const modal = document.getElementById('project-modal');
        if (modal && modal.classList.contains('active')) {
          this.closeProjectModal();
          return;
        }
        const escBtn = document.getElementById('zurueck') || document.getElementById('btn-esc');
        if (escBtn) {
          escBtn.classList.add('unten');
          setTimeout(() => escBtn.classList.remove('unten'), 140);
        }
        if (window.soundEngine) window.soundEngine.playKeyClick(600);
        this.goToChapter('home');
      }

      // 1 to 5 -> Change Visual Raster Mode
      if (e.key >= '1' && e.key <= '5') {
        this.setVisualMode(parseInt(e.key, 10));
      }
    });
  }

  // Project Modal Logic (status.exe window)
  openProjectModal(proj) {
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    document.getElementById('modal-title').textContent = proj.title;
    document.getElementById('modal-category').textContent = `${proj.index} // ${proj.category}`;
    document.getElementById('modal-desc').textContent = proj.description;

    const techContainer = document.getElementById('modal-tech');
    techContainer.innerHTML = '';
    proj.tech.forEach(t => {
      const pill = document.createElement('span');
      pill.className = 'modal-tech-pill';
      pill.textContent = t;
      techContainer.appendChild(pill);
    });

    const githubLink = document.getElementById('modal-github-link');
    githubLink.href = proj.github;

    modal.classList.add('active');
  }

  closeProjectModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
      if (window.soundEngine) window.soundEngine.playKeyClick(700);
      modal.classList.remove('active');
    }
  }

  bindModal() {
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeProjectModal());
    }

    const modal = document.getElementById('project-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeProjectModal();
      });
    }
  }

  // Chapter 02: Big Bang Timeline
  bindStoryTimeline() {
    const bangBtn = document.getElementById('btn-big-bang');
    const timeline = document.getElementById('epoch-timeline');

    if (bangBtn && timeline) {
      bangBtn.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playModeBeep(880);
        timeline.classList.toggle('visible');
        if (timeline.classList.contains('visible')) {
          bangBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 15l-6-6-6 6"/>
            </svg>
            COLLAPSE TIMELINE
          `;
          if (window.decipher) {
            window.decipher.scrambleAll(timeline);
          }
        } else {
          bangBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 6v6l4 2"/>
            </svg>
            SWITCH ON THE UNIVERSE
          `;
        }
      });
    }
  }

  // Chapter 04: Contact Form Chips & Submit Simulation
  bindContactForm() {
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        if (window.soundEngine) window.soundEngine.playKeyClick(1000);
        chip.classList.toggle('selected');
      });
    });

    const form = document.getElementById('transmission-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (window.soundEngine) window.soundEngine.playEnterThud();
        
        const btn = form.querySelector('.btn-send');
        const orig = btn.innerHTML;
        btn.innerHTML = `<span>TRANSMITTING...</span>`;
        btn.disabled = true;

        setTimeout(() => {
          btn.innerHTML = `<span>TRANSMISSION CONFIRMED ✓</span>`;
          btn.style.background = '#3dff8a';
          btn.style.color = '#05070b';
          
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.style.background = '';
            btn.style.color = '';
            btn.disabled = false;
            form.reset();
            document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('selected'));
          }, 3500);
        }, 1200);
      });
    }
  }

  // Sound toggle button
  bindAudioToggle() {
    const soundBtn = document.getElementById('btn-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isOn = window.soundEngine.toggle();
        soundBtn.textContent = `SFX: ${isOn ? 'ON' : 'OFF'}`;
        soundBtn.style.color = isOn ? '#3dff8a' : 'rgba(10, 11, 14, 0.4)';
      });
    }
  }
}

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});

