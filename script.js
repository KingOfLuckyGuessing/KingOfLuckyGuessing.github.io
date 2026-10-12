/* Project data + modal dialog logic (no frameworks, no build step). */

const PV_LOOP_SVG = `
<figure class="modal-figure">
  <svg viewBox="0 0 420 300" role="img" aria-label="Illustrative pressure-volume loop diagram">
    <defs>
      <linearGradient id="pvgrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#5eead4"/>
        <stop offset="1" stop-color="#a78bfa"/>
      </linearGradient>
    </defs>
    <line x1="50" y1="20" x2="50" y2="265" stroke="#3b4a63" stroke-width="1.5"/>
    <polygon points="50,20 44,32 56,32" fill="#3b4a63"/>
    <line x1="50" y1="255" x2="395" y2="255" stroke="#3b4a63" stroke-width="1.5"/>
    <polygon points="395,255 383,249 383,261" fill="#3b4a63"/>
    <text x="30" y="140" fill="#9aa7bd" font-size="13" transform="rotate(-90 30 140)" text-anchor="middle">Pressure</text>
    <text x="225" y="282" fill="#9aa7bd" font-size="13" text-anchor="middle">Volume</text>
    <path class="pv-loop" d="M 110 215 C 110 130, 145 100, 200 95 L 285 95 C 335 95, 355 130, 355 175 C 355 220, 325 240, 270 245 L 165 245 C 130 245, 110 235, 110 215 Z"
      fill="rgba(94,234,212,0.07)" stroke="url(#pvgrad)" stroke-width="3.5" stroke-linecap="round"/>
    <circle cx="110" cy="215" r="6" fill="#5eead4"/>
    <circle cx="355" cy="175" r="6" fill="#a78bfa"/>
    <text x="110" y="245" fill="#5eead4" font-size="12" text-anchor="middle">filling</text>
    <text x="355" y="205" fill="#a78bfa" font-size="12" text-anchor="middle">ejection</text>
  </svg>
  <figcaption>Illustrative pressure–volume loop — the signal CardialSync aligns</figcaption>
</figure>`;

const PROJECTS = {
  news: {
    title: "Personalized Topic-Specific News Feed",
    tagline: "A news feed that learns the topics you follow — and only shows you what's new.",
    tags: ["Python", "Neo4j", "LangChain", "BERTopic", "RAG"],
    images: [
      {
        src: "https://raw.githubusercontent.com/Jonathan-Serrano/historical-news/main/full_graph.png",
        caption: "The full Neo4j knowledge graph — articles, topics, channels, and users"
      },
      {
        src: "https://raw.githubusercontent.com/Jonathan-Serrano/historical-news/main/relation.png",
        caption: "A user's subscriptions and topic relationships, up close"
      }
    ],
    highlights: [
      "Topic modeling with BERTopic, tuned with UMAP dimensionality reduction, HDBSCAN clustering, and LLM keyword mapping",
      "Hybrid retrieval pipeline: Neo4j graph traversal for topic-grounded exploration plus embedding similarity (nomic-embed-text) for semantic relevance",
      "Smart topic suggestions powered by Jaccard similarity and CELF influence maximization",
      "Summarization with Ollama (Mistral) and role-based prompting — history-aware via Max-Min greedy selection, so returning users only see novel information",
      "Intent detection with LangChain and Pydantic-structured output; RAG pipeline joining knowledge graphs with unstructured text"
    ],
    links: [
      { label: "View on GitHub", url: "https://github.com/Jonathan-Serrano/historical-news", primary: true },
      { label: "Watch demo", url: "https://youtu.be/LII_kS8-diM", primary: false }
    ]
  },
  cardial: {
    title: "CardialSync — Cardiac MRI Time Synchronization",
    tagline: "Aligning cardiac pressure and volume data for children with congenital heart disease.",
    tags: ["Nuxt", "TypeScript", "MATLAB", "Docker"],
    customMedia: PV_LOOP_SVG,
    highlights: [
      "Built with UT Southwestern Medical Center clinicians and researchers to support novel clinical research workflows",
      "Uses the CircAdapt cardiovascular model with a time-synchronization algorithm to align pressure and volume data for accurate PV-loop analysis",
      "MATLAB computational core compiled with MATLAB Compiler SDK into a versioned micro-cardial Docker microservice",
      "Nuxt 3 + TypeScript frontend with Docker Compose setups for both development and production",
      "Documented end-to-end for reproducibility, handoff, and future clinical use"
    ],
    links: [],
    note: "Private repository — built with UT Southwestern Medical Center"
  }
};

(function () {
  const overlay = document.getElementById("modal-overlay");
  const modalMedia = document.getElementById("modal-media");
  const modalTitle = document.getElementById("modal-title");
  const modalTagline = document.getElementById("modal-tagline");
  const modalHighlights = document.getElementById("modal-highlights");
  const modalTags = document.getElementById("modal-tags");
  const modalActions = document.getElementById("modal-actions");
  const closeBtn = document.getElementById("modal-close");
  let lastFocused = null;
  let activeImageIndex = 0;

  function renderMedia(project) {
    modalMedia.innerHTML = "";
    if (project.images) {
      activeImageIndex = 0;
      const figure = document.createElement("figure");
      figure.className = "modal-figure";
      const img = document.createElement("img");
      img.id = "modal-main-image";
      img.alt = project.images[0].caption;
      img.src = project.images[0].src;
      const caption = document.createElement("figcaption");
      caption.id = "modal-caption";
      caption.textContent = project.images[0].caption;
      figure.appendChild(img);
      figure.appendChild(caption);
      modalMedia.appendChild(figure);

      if (project.images.length > 1) {
        const thumbs = document.createElement("div");
        thumbs.className = "modal-thumbs";
        project.images.forEach((image, i) => {
          const thumb = document.createElement("button");
          thumb.type = "button";
          thumb.className = "modal-thumb" + (i === 0 ? " active" : "");
          thumb.setAttribute("aria-label", "Show image: " + image.caption);
          const thumbImg = document.createElement("img");
          thumbImg.src = image.src;
          thumbImg.alt = "";
          thumb.appendChild(thumbImg);
          thumb.addEventListener("click", () => selectImage(i));
          thumbs.appendChild(thumb);
        });
        modalMedia.appendChild(thumbs);
      }
    } else if (project.customMedia) {
      modalMedia.innerHTML = project.customMedia;
    }
  }

  function selectImage(i) {
    const project = PROJECTS[overlay.dataset.project];
    activeImageIndex = i;
    const img = document.getElementById("modal-main-image");
    const caption = document.getElementById("modal-caption");
    img.style.opacity = "0";
    setTimeout(() => {
      img.src = project.images[i].src;
      img.alt = project.images[i].caption;
      caption.textContent = project.images[i].caption;
      img.onload = () => { img.style.opacity = "1"; };
      setTimeout(() => { img.style.opacity = "1"; }, 350);
    }, 160);
    document.querySelectorAll(".modal-thumb").forEach((t, j) => {
      t.classList.toggle("active", j === i);
    });
  }

  function openModal(key, opener) {
    const project = PROJECTS[key];
    if (!project) return;
    lastFocused = opener || document.activeElement;
    overlay.dataset.project = key;

    modalTitle.textContent = project.title;
    modalTagline.textContent = project.tagline;
    renderMedia(project);

    modalHighlights.innerHTML = "";
    project.highlights.forEach((h) => {
      const li = document.createElement("li");
      li.textContent = h;
      modalHighlights.appendChild(li);
    });

    modalTags.innerHTML = "";
    project.tags.forEach((t) => {
      const span = document.createElement("span");
      span.textContent = t;
      modalTags.appendChild(span);
    });

    modalActions.innerHTML = "";
    project.links.forEach((link) => {
      const a = document.createElement("a");
      a.href = link.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = link.label;
      a.className = "btn " + (link.primary ? "btn-primary" : "btn-ghost");
      modalActions.appendChild(a);
    });
    if (project.note) {
      const note = document.createElement("p");
      note.className = "modal-note";
      note.textContent = project.note;
      modalActions.appendChild(note);
    }

    overlay.hidden = false;
    document.body.classList.add("modal-open");
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("open")));
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove("open");
    setTimeout(() => {
      overlay.hidden = true;
      document.body.classList.remove("modal-open");
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }, 260);
  }

  document.querySelectorAll(".card[data-project]").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.project, card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card.dataset.project, card);
      }
    });
  });

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeModal();
  });
})();
