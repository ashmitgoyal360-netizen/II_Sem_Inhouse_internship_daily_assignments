/* ==========================================================================
   MarkKeep — Main JavaScript Engine
   ========================================================================== */

// --- Default Seed Data ---
const DEFAULT_COLLECTIONS = ["Work", "Entertainment", "Resources", "Reading"];

const SEED_BOOKMARKS = [
  {
    id: "seed-1",
    title: "GitHub",
    url: "https://github.com",
    description: "The world's leading developer platform. Host and review code, manage projects, and build software alongside millions of developers.",
    collection: "Work",
    tags: ["development", "git", "collaboration"],
    favorite: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString() // 3 days ago
  },
  {
    id: "seed-2",
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org",
    description: "The MDN Web Docs site provides information about Open Web technologies including HTML, CSS, and APIs for both Web sites and progressive web apps.",
    collection: "Resources",
    tags: ["web", "docs", "javascript", "html"],
    favorite: true,
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString() // 2 days ago
  },
  {
    id: "seed-3",
    title: "CSS-Tricks",
    url: "https://css-tricks.com",
    description: "Daily articles about CSS, HTML, JavaScript, and all things web design and development. A goldmine for frontend devs.",
    collection: "Reading",
    tags: ["css", "frontend", "design"],
    favorite: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
  },
  {
    id: "seed-4",
    title: "Dribbble",
    url: "https://dribbble.com",
    description: "Discover the world’s top designers and creative professionals. The leading destination to find and showcase creative work.",
    collection: "Entertainment",
    tags: ["design", "inspiration", "portfolio"],
    favorite: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
  {
    id: "seed-5",
    title: "Dev.to",
    url: "https://dev.to",
    description: "A constructive and inclusive social network for software developers. Share stories, learn, and grow your career.",
    collection: "Reading",
    tags: ["community", "blog", "news"],
    favorite: false,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString() // 1 hour ago
  }
];

// --- State Variables ---
let bookmarks = [];
let collections = [];
let activeFilter = { type: 'all', value: null };
let searchQuery = '';
let layoutMode = 'grid';
let sortBy = 'newest';
let isDarkTheme = true;
let currentTagsInput = [];

// --- Gradients for Icon Fallbacks ---
const GRADIENTS = [
  'linear-gradient(135deg, #4f46e5, #06b6d4)', // Indigo -> Cyan
  'linear-gradient(135deg, #a855f7, #ec4899)', // Purple -> Pink
  'linear-gradient(135deg, #10b981, #06b6d4)', // Emerald -> Cyan
  'linear-gradient(135deg, #f59e0b, #ef4444)', // Amber -> Red
  'linear-gradient(135deg, #3b82f6, #8b5cf6)', // Blue -> Purple
  'linear-gradient(135deg, #ec4899, #f43f5e)'  // Pink -> Rose
];

// --- DOM Cache ---
const elements = {
  // Lists & Containers
  bookmarksContainer: document.getElementById('bookmarks-container'),
  collectionsList: document.getElementById('collections-list'),
  tagsList: document.getElementById('tags-list'),
  emptyState: document.getElementById('empty-state'),
  emptyStateMessage: document.getElementById('empty-state-message'),
  emptyStateAddBtn: document.getElementById('empty-state-add-btn'),
  
  // Modals
  bookmarkModal: document.getElementById('bookmark-modal'),
  collectionModal: document.getElementById('collection-modal'),
  importExportModal: document.getElementById('import-export-modal'),
  
  // Forms
  bookmarkForm: document.getElementById('bookmark-form'),
  collectionForm: document.getElementById('collection-form'),
  
  // Form Inputs
  bookmarkId: document.getElementById('bookmark-id'),
  bookmarkUrl: document.getElementById('bookmark-url'),
  bookmarkTitle: document.getElementById('bookmark-title'),
  bookmarkDesc: document.getElementById('bookmark-desc'),
  bookmarkCollection: document.getElementById('bookmark-collection'),
  bookmarkNewCollection: document.getElementById('bookmark-new-collection'),
  bookmarkTags: document.getElementById('bookmark-tags'),
  bookmarkFavorite: document.getElementById('bookmark-favorite'),
  newCollectionName: document.getElementById('new-collection-name'),
  tagsPreviewContainer: document.getElementById('tags-preview-container'),
  importFileInput: document.getElementById('import-file-input'),
  importFileStatus: document.getElementById('import-file-status'),
  
  // Controls & Action Buttons
  btnAddBookmark: document.getElementById('btn-add-bookmark'),
  btnAddCollection: document.getElementById('btn-add-collection'),
  btnImportExport: document.getElementById('btn-import-export'),
  btnExportAction: document.getElementById('btn-export-action'),
  btnClearAll: document.getElementById('btn-clear-all'),
  themeToggle: document.getElementById('theme-toggle'),
  layoutGrid: document.getElementById('layout-grid'),
  layoutList: document.getElementById('layout-list'),
  sortSelect: document.getElementById('sort-select'),
  searchInput: document.getElementById('search-input'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  sidebar: document.getElementById('sidebar'),
  mobileSidebarToggle: document.getElementById('mobile-sidebar-toggle'),
  mobileSidebarClose: document.getElementById('mobile-sidebar-close'),
  toastContainer: document.getElementById('toast-container'),
  
  // Heading & Stat Counters
  viewTitle: document.getElementById('view-title'),
  viewCount: document.getElementById('view-count'),
  statTotal: document.getElementById('stat-total'),
  statFavorites: document.getElementById('stat-favorites'),
  statCollections: document.getElementById('stat-collections'),
  statTags: document.getElementById('stat-tags'),
  countAll: document.getElementById('count-all'),
  countFavorites: document.getElementById('count-favorites')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  setupEventListeners();
  renderApp();
  lucide.createIcons();
});

// --- LocalStorage Operations ---
function loadData() {
  // Load Theme
  isDarkTheme = localStorage.getItem('theme') !== 'light';
  document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
  elements.themeToggle.checked = isDarkTheme;

  // Load Layout
  layoutMode = localStorage.getItem('layoutMode') || 'grid';
  if (layoutMode === 'list') {
    elements.layoutGrid.classList.remove('active');
    elements.layoutList.classList.add('active');
    elements.bookmarksContainer.classList.add('list-layout');
  }

  // Load Collections
  const storedCollections = localStorage.getItem('collections');
  if (storedCollections) {
    collections = JSON.parse(storedCollections);
  } else {
    collections = [...DEFAULT_COLLECTIONS];
    localStorage.setItem('collections', JSON.stringify(collections));
  }

  // Load Bookmarks
  const storedBookmarks = localStorage.getItem('bookmarks');
  if (storedBookmarks) {
    bookmarks = JSON.parse(storedBookmarks);
  } else {
    // First load seeding
    bookmarks = [...SEED_BOOKMARKS];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    showToast("Welcome to MarkKeep! Seeded template bookmarks.", "info");
  }
}

function saveData() {
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  localStorage.setItem('collections', JSON.stringify(collections));
}

// --- Render Operations ---
function renderApp() {
  renderSidebar();
  renderBookmarks();
  renderStats();
  lucide.createIcons();
}

function renderSidebar() {
  // Render Collections List
  elements.collectionsList.innerHTML = '';
  
  // Unassigned collections items count helper
  const getCollectionCount = (colName) => bookmarks.filter(b => b.collection === colName).length;
  
  // Add "Unassigned" collection explicitly in list if elements exist
  const unassignedCount = getCollectionCount('Unassigned');
  
  collections.forEach(col => {
    const count = getCollectionCount(col);
    const li = document.createElement('li');
    li.className = `nav-item ${activeFilter.type === 'collection' && activeFilter.value === col ? 'active' : ''}`;
    li.setAttribute('data-filter', 'collection');
    li.setAttribute('data-value', col);
    
    li.innerHTML = `
      <i data-lucide="folder"></i>
      <span class="nav-item-text">${col}</span>
      <span class="badge">${count}</span>
    `;
    
    // Add context delete button for collections
    if (!DEFAULT_COLLECTIONS.includes(col)) {
      const delBtn = document.createElement('button');
      delBtn.className = 'btn-icon-sm collection-delete-btn';
      delBtn.innerHTML = '<i data-lucide="trash-2" style="width:12px;height:12px;"></i>';
      delBtn.style.marginLeft = '4px';
      delBtn.style.opacity = '0.5';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        deleteCollection(col);
      });
      li.appendChild(delBtn);
    }
    
    li.addEventListener('click', () => setFilter('collection', col));
    elements.collectionsList.appendChild(li);
  });

  if (unassignedCount > 0) {
    const li = document.createElement('li');
    li.className = `nav-item ${activeFilter.type === 'collection' && activeFilter.value === 'Unassigned' ? 'active' : ''}`;
    li.setAttribute('data-filter', 'collection');
    li.setAttribute('data-value', 'Unassigned');
    li.innerHTML = `
      <i data-lucide="folder-minus"></i>
      <span class="nav-item-text">Unassigned</span>
      <span class="badge">${unassignedCount}</span>
    `;
    li.addEventListener('click', () => setFilter('collection', 'Unassigned'));
    elements.collectionsList.appendChild(li);
  }

  // Render Tags Cloud
  elements.tagsList.innerHTML = '';
  const tagCounts = {};
  bookmarks.forEach(b => {
    b.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

  if (sortedTags.length === 0) {
    elements.tagsList.innerHTML = '<span class="text-muted" style="font-size:12px;padding: 4px 8px;">No tags yet</span>';
  } else {
    sortedTags.slice(0, 15).forEach(tag => {
      const isActive = activeFilter.type === 'tag' && activeFilter.value === tag;
      const span = document.createElement('span');
      span.className = `tag-pill ${isActive ? 'active' : ''}`;
      span.innerHTML = `#${tag} <span style="opacity:0.6;font-size:10px;">(${tagCounts[tag]})</span>`;
      span.addEventListener('click', () => {
        if (isActive) {
          setFilter('all');
        } else {
          setFilter('tag', tag);
        }
      });
      elements.tagsList.appendChild(span);
    });
  }

  // Update Overview Counts
  elements.countAll.textContent = bookmarks.length;
  elements.countFavorites.textContent = bookmarks.filter(b => b.favorite).length;

  // Sync Overview nav active class
  document.querySelectorAll('.nav-section:first-child .nav-item').forEach(item => {
    const filterType = item.getAttribute('data-filter');
    if (activeFilter.type === filterType) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

function renderStats() {
  elements.statTotal.textContent = bookmarks.length;
  elements.statFavorites.textContent = bookmarks.filter(b => b.favorite).length;
  elements.statCollections.textContent = collections.length;
  
  // Unique Tags Count
  const allTags = new Set();
  bookmarks.forEach(b => b.tags.forEach(t => allTags.add(t)));
  elements.statTags.textContent = allTags.size;
}

function getFilteredBookmarks() {
  let list = [...bookmarks];

  // 1. Sidebar Category/Tag/Favorite Filters
  if (activeFilter.type === 'favorites') {
    list = list.filter(b => b.favorite);
  } else if (activeFilter.type === 'recent') {
    // Sort by date added, take the first 10
    list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10);
  } else if (activeFilter.type === 'collection') {
    list = list.filter(b => b.collection === activeFilter.value);
  } else if (activeFilter.type === 'tag') {
    list = list.filter(b => b.tags.includes(activeFilter.value));
  }

  // 2. Search Query Filter
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    list = list.filter(b => 
      b.title.toLowerCase().includes(query) ||
      b.url.toLowerCase().includes(query) ||
      (b.description && b.description.toLowerCase().includes(query)) ||
      b.tags.some(t => t.toLowerCase().includes(query)) ||
      b.collection.toLowerCase().includes(query)
    );
  }

  // 3. Sorting
  if (activeFilter.type !== 'recent') { // Skip custom sort for "Recent" overview
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }
  }

  return list;
}

function renderBookmarks() {
  const filtered = getFilteredBookmarks();
  elements.bookmarksContainer.innerHTML = '';
  
  // Set View Heading
  if (activeFilter.type === 'all') {
    elements.viewTitle.textContent = 'All Bookmarks';
  } else if (activeFilter.type === 'favorites') {
    elements.viewTitle.textContent = 'Favorites';
  } else if (activeFilter.type === 'recent') {
    elements.viewTitle.textContent = 'Recently Added';
  } else if (activeFilter.type === 'collection') {
    elements.viewTitle.textContent = `Collection: ${activeFilter.value}`;
  } else if (activeFilter.type === 'tag') {
    elements.viewTitle.textContent = `Tag: #${activeFilter.value}`;
  }
  
  if (searchQuery.trim() !== '') {
    elements.viewTitle.textContent = `Search Results: "${searchQuery}"`;
  }

  elements.viewCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'}`;

  // Handle Empty State
  if (filtered.length === 0) {
    elements.bookmarksContainer.style.display = 'none';
    elements.emptyState.style.display = 'flex';
    if (searchQuery.trim() !== '') {
      elements.emptyStateMessage.textContent = "We couldn't find any bookmarks matching your search query.";
    } else if (activeFilter.type === 'favorites') {
      elements.emptyStateMessage.textContent = "You haven't favorited any bookmarks yet. Click the heart icon on any bookmark card.";
    } else if (activeFilter.type === 'collection') {
      elements.emptyStateMessage.textContent = `There are no bookmarks in the "${activeFilter.value}" collection yet.`;
    } else {
      elements.emptyStateMessage.textContent = "Start building your dashboard by adding a website bookmark.";
    }
  } else {
    elements.bookmarksContainer.style.display = layoutMode === 'grid' ? 'grid' : 'block';
    elements.emptyState.style.display = 'none';

    filtered.forEach(b => {
      const card = createBookmarkCard(b);
      elements.bookmarksContainer.appendChild(card);
    });
  }
}

function createBookmarkCard(b) {
  const card = document.createElement('div');
  card.className = `bookmark-card ${b.favorite ? 'favorite-glow' : ''}`;
  card.setAttribute('data-id', b.id);

  // Favicon setup
  let domain = '';
  try {
    const urlObj = new URL(b.url);
    domain = urlObj.hostname.replace('www.', '');
  } catch (e) {
    domain = b.url;
  }

  const faviconUrl = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  
  // Draw fallback styled letter avatar using domain hash
  const initial = domain ? domain.charAt(0).toUpperCase() : 'B';
  const gradientIndex = Math.abs(hashCode(domain)) % GRADIENTS.length;
  const fallbackBg = GRADIENTS[gradientIndex];

  const formattedDate = formatDate(b.createdAt);

  const tagsHTML = b.tags.map(t => `<span class="card-tag">#${t}</span>`).join('');
  const collectionHTML = b.collection !== 'Unassigned' 
    ? `<span class="card-collection"><i data-lucide="folder"></i> ${b.collection}</span>` 
    : '';

  card.innerHTML = `
    <div class="card-header">
      <div class="favicon-container">
        <img src="${faviconUrl}" alt="${b.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <div class="fallback-favicon" style="background: ${fallbackBg}; display: none;">${initial}</div>
      </div>
      <div class="card-title-area">
        <div class="card-title-row">
          <a href="${b.url}" target="_blank" rel="noopener noreferrer" class="card-title" title="${b.title}">${b.title}</a>
        </div>
        <span class="card-domain">${domain}</span>
      </div>
    </div>
    <p class="card-desc" title="${b.description || ''}">${b.description || 'No description provided.'}</p>
    <div class="card-meta">
      ${collectionHTML}
      <div class="card-tags">
        ${tagsHTML}
      </div>
    </div>
    <div class="card-actions">
      <span class="card-date">${formattedDate}</span>
      <div class="action-buttons">
        <button class="btn-icon btn-fav ${b.favorite ? 'active' : ''}" title="Favorite">
          <i data-lucide="heart"></i>
        </button>
        <button class="btn-icon btn-edit" title="Edit">
          <i data-lucide="edit"></i>
        </button>
        <button class="btn-icon btn-delete" title="Delete">
          <i data-lucide="trash-2" style="color: var(--accent-danger)"></i>
        </button>
      </div>
    </div>
  `;

  // Attach card specific event listeners
  const btnFav = card.querySelector('.btn-fav');
  btnFav.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(b.id);
  });

  const btnEdit = card.querySelector('.btn-edit');
  btnEdit.addEventListener('click', (e) => {
    e.stopPropagation();
    openBookmarkModal(b);
  });

  const btnDelete = card.querySelector('.btn-delete');
  btnDelete.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteBookmark(b.id);
  });

  return card;
}

// --- Event Handlers & Core Logics ---
function setupEventListeners() {
  // Modal controllers
  elements.btnAddBookmark.addEventListener('click', () => openBookmarkModal());
  elements.emptyStateAddBtn.addEventListener('click', () => openBookmarkModal());
  elements.btnAddCollection.addEventListener('click', () => openModal(elements.collectionModal));
  elements.btnImportExport.addEventListener('click', () => openModal(elements.importExportModal));

  // Closing modals
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  // Clicking overlay closes modal
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Theme change
  elements.themeToggle.addEventListener('change', (e) => {
    isDarkTheme = e.target.checked;
    document.body.className = isDarkTheme ? 'dark-theme' : 'light-theme';
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
    showToast(`Switched to ${isDarkTheme ? 'Dark' : 'Light'} Mode`, 'info');
  });

  // Layout selection
  elements.layoutGrid.addEventListener('click', () => {
    layoutMode = 'grid';
    localStorage.setItem('layoutMode', 'grid');
    elements.layoutList.classList.remove('active');
    elements.layoutGrid.classList.add('active');
    elements.bookmarksContainer.classList.remove('list-layout');
    renderBookmarks();
  });

  elements.layoutList.addEventListener('click', () => {
    layoutMode = 'list';
    localStorage.setItem('layoutMode', 'list');
    elements.layoutGrid.classList.remove('active');
    elements.layoutList.classList.add('active');
    elements.bookmarksContainer.classList.add('list-layout');
    renderBookmarks();
  });

  // Sorting
  elements.sortSelect.addEventListener('change', (e) => {
    sortBy = e.target.value;
    renderBookmarks();
  });

  // Search input with dynamic clearing
  elements.searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    if (searchQuery.length > 0) {
      elements.clearSearchBtn.style.display = 'block';
    } else {
      elements.clearSearchBtn.style.display = 'none';
    }
    renderBookmarks();
  });

  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    searchQuery = '';
    elements.clearSearchBtn.style.display = 'none';
    renderBookmarks();
  });

  // Form Submissions
  elements.bookmarkForm.addEventListener('submit', handleBookmarkSubmit);
  elements.collectionForm.addEventListener('submit', handleCollectionSubmit);

  // Manage tags typing in Add Bookmark modal
  elements.bookmarkTags.addEventListener('keydown', handleTagsKeydown);

  // Storage wipe
  elements.btnClearAll.addEventListener('click', handleClearStorage);

  // Export Trigger
  elements.btnExportAction.addEventListener('click', exportBookmarksJSON);

  // Import Trigger
  elements.importFileInput.addEventListener('change', handleImportFileSelect);

  // Mobile Drawer Toggle
  elements.mobileSidebarToggle.addEventListener('click', () => {
    elements.sidebar.classList.add('active');
  });

  elements.mobileSidebarClose.addEventListener('click', () => {
    elements.sidebar.classList.remove('active');
  });
}

// --- Navigation Filters ---
function setFilter(type, value = null) {
  activeFilter = { type, value };
  
  // Clear search on filter changes to prevent confusing UI
  elements.searchInput.value = '';
  searchQuery = '';
  elements.clearSearchBtn.style.display = 'none';

  renderApp();
  
  // Close mobile drawer if open
  elements.sidebar.classList.remove('active');
}

// --- Modals Logic ---
function openModal(modal) {
  modal.classList.add('active');
}

function closeModal(modal) {
  modal.classList.remove('active');
  
  // If closing bookmark form, reset values and tag array
  if (modal === elements.bookmarkModal) {
    elements.bookmarkForm.reset();
    elements.bookmarkId.value = '';
    currentTagsInput = [];
    renderTagChipsPreview();
    clearValidationErrors();
  }
}

// Open bookmark modal for add or edit
function openBookmarkModal(bookmark = null) {
  // Populate category options
  elements.bookmarkCollection.innerHTML = '<option value="Unassigned">Unassigned</option>';
  collections.forEach(col => {
    const opt = document.createElement('option');
    opt.value = col;
    opt.textContent = col;
    elements.bookmarkCollection.appendChild(opt);
  });

  if (bookmark) {
    // Edit Mode
    elements.modalTitle.textContent = "Edit Bookmark";
    elements.bookmarkId.value = bookmark.id;
    elements.bookmarkUrl.value = bookmark.url;
    elements.bookmarkTitle.value = bookmark.title;
    elements.bookmarkDesc.value = bookmark.description || '';
    elements.bookmarkCollection.value = bookmark.collection;
    elements.bookmarkNewCollection.value = '';
    elements.bookmarkFavorite.checked = bookmark.favorite;
    currentTagsInput = [...bookmark.tags];
  } else {
    // Add Mode
    elements.modalTitle.textContent = "Add Bookmark";
    elements.bookmarkId.value = '';
    elements.bookmarkUrl.value = '';
    elements.bookmarkTitle.value = '';
    elements.bookmarkDesc.value = '';
    elements.bookmarkCollection.value = 'Unassigned';
    elements.bookmarkNewCollection.value = '';
    elements.bookmarkFavorite.checked = false;
    currentTagsInput = [];

    // Pre-populate collection filter selection if active
    if (activeFilter.type === 'collection') {
      elements.bookmarkCollection.value = activeFilter.value;
    }
  }

  elements.bookmarkTags.value = '';
  renderTagChipsPreview();
  clearValidationErrors();
  openModal(elements.bookmarkModal);
  
  // Auto-focus URL
  setTimeout(() => {
    elements.bookmarkUrl.focus();
  }, 100);
}

// --- Bookmark CRUD operations ---
function handleBookmarkSubmit(e) {
  e.preventDefault();
  
  const id = elements.bookmarkId.value;
  const url = elements.bookmarkUrl.value.trim();
  const title = elements.bookmarkTitle.value.trim();
  const desc = elements.bookmarkDesc.value.trim();
  const favorite = elements.bookmarkFavorite.checked;
  
  let collection = elements.bookmarkCollection.value;
  const newCol = elements.bookmarkNewCollection.value.trim();

  // Basic Validation
  let isValid = true;
  clearValidationErrors();

  if (!url || !isValidUrl(url)) {
    elements.bookmarkUrl.closest('.form-group').classList.add('has-error');
    isValid = false;
  }
  
  if (!title) {
    elements.bookmarkTitle.closest('.form-group').classList.add('has-error');
    isValid = false;
  }

  if (!isValid) return;

  // Process Custom Collection addition
  if (newCol) {
    const exists = collections.some(c => c.toLowerCase() === newCol.toLowerCase());
    if (!exists) {
      collections.push(newCol);
      collection = newCol;
    } else {
      // Use existing matching collection
      const matched = collections.find(c => c.toLowerCase() === newCol.toLowerCase());
      collection = matched;
    }
  }

  // Parse tags (add any remaining text in tags input field)
  const remainingTagVal = elements.bookmarkTags.value.trim();
  if (remainingTagVal) {
    const rawTags = remainingTagVal.split(',');
    rawTags.forEach(rt => {
      const cleanTag = cleanTagName(rt);
      if (cleanTag && !currentTagsInput.includes(cleanTag)) {
        currentTagsInput.push(cleanTag);
      }
    });
  }

  if (id) {
    // Edit existing
    const index = bookmarks.findIndex(b => b.id === id);
    if (index !== -1) {
      bookmarks[index] = {
        ...bookmarks[index],
        url,
        title,
        description: desc,
        collection,
        tags: [...currentTagsInput],
        favorite
      };
      showToast("Bookmark updated successfully!");
    }
  } else {
    // Create new
    const newBookmark = {
      id: 'bm-' + Date.now(),
      title,
      url,
      description: desc,
      collection,
      tags: [...currentTagsInput],
      favorite,
      createdAt: new Date().toISOString()
    };
    bookmarks.unshift(newBookmark);
    showToast("Bookmark added successfully!");
  }

  saveData();
  closeModal(elements.bookmarkModal);
  renderApp();
}

function toggleFavorite(id) {
  const index = bookmarks.findIndex(b => b.id === id);
  if (index !== -1) {
    bookmarks[index].favorite = !bookmarks[index].favorite;
    saveData();
    renderApp();
    showToast(bookmarks[index].favorite ? "Bookmark favorited!" : "Removed from favorites", "info");
  }
}

function deleteBookmark(id) {
  if (confirm("Are you sure you want to delete this bookmark?")) {
    bookmarks = bookmarks.filter(b => b.id !== id);
    saveData();
    renderApp();
    showToast("Bookmark deleted", "error");
  }
}

// --- Tag Input Preview Logic ---
function handleTagsKeydown(e) {
  // Add tag on Comma (,) or Enter key
  if (e.key === ',' || e.key === 'Enter') {
    e.preventDefault();
    const val = elements.bookmarkTags.value.trim();
    if (val) {
      const parts = val.split(',');
      parts.forEach(part => {
        const tag = cleanTagName(part);
        if (tag && !currentTagsInput.includes(tag)) {
          currentTagsInput.push(tag);
        }
      });
      elements.bookmarkTags.value = '';
      renderTagChipsPreview();
    }
  }
}

function renderTagChipsPreview() {
  elements.tagsPreviewContainer.innerHTML = '';
  currentTagsInput.forEach((tag, idx) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `
      #${tag}
      <button type="button" data-index="${idx}">
        <i data-lucide="x"></i>
      </button>
    `;
    chip.querySelector('button').addEventListener('click', () => {
      currentTagsInput.splice(idx, 1);
      renderTagChipsPreview();
    });
    elements.tagsPreviewContainer.appendChild(chip);
  });
  lucide.createIcons();
}

// --- Collection CRUD ---
function handleCollectionSubmit(e) {
  e.preventDefault();
  const val = elements.newCollectionName.value.trim();
  const errorEl = document.getElementById('collection-error');

  if (!val) return;

  const exists = collections.some(c => c.toLowerCase() === val.toLowerCase());
  if (exists) {
    errorEl.style.display = 'block';
    elements.newCollectionName.closest('.form-group').classList.add('has-error');
    return;
  }

  collections.push(val);
  saveData();
  closeModal(elements.collectionModal);
  renderApp();
  showToast(`Collection "${val}" created!`);
}

function deleteCollection(colName) {
  if (confirm(`Delete collection "${colName}"? Bookmarks inside it will remain, but will be reset to Unassigned.`)) {
    // Delete collection
    collections = collections.filter(c => c !== colName);
    // Unassign associated bookmarks
    bookmarks = bookmarks.map(b => {
      if (b.collection === colName) {
        return { ...b, collection: 'Unassigned' };
      }
      return b;
    });
    
    // Clear filter if active on deleted collection
    if (activeFilter.type === 'collection' && activeFilter.value === colName) {
      activeFilter = { type: 'all', value: null };
    }
    
    saveData();
    renderApp();
    showToast(`Collection deleted`);
  }
}

// --- Import / Export Operations ---
function exportBookmarksJSON() {
  const exportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    collections,
    bookmarks
  };

  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `markkeep-backup-${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();

  showToast("JSON backup download initiated!", "success");
}

function handleImportFileSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  elements.importFileStatus.textContent = file.name;

  const reader = new FileReader();
  reader.onload = function(event) {
    try {
      const data = JSON.parse(event.target.result);
      
      // Simple schema checks
      if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
        throw new Error("Invalid schema: 'bookmarks' must be an array.");
      }

      // Merge and sanitize collections
      if (data.collections && Array.isArray(data.collections)) {
        data.collections.forEach(col => {
          if (typeof col === 'string' && !collections.includes(col)) {
            collections.push(col);
          }
        });
      }

      // Merge and sanitize bookmarks
      let importedCount = 0;
      data.bookmarks.forEach(newBm => {
        // Validate minimally
        if (newBm.title && newBm.url) {
          const exists = bookmarks.some(b => b.url === newBm.url);
          if (!exists) {
            bookmarks.unshift({
              id: 'bm-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
              title: newBm.title,
              url: newBm.url,
              description: newBm.description || '',
              collection: newBm.collection || 'Unassigned',
              tags: Array.isArray(newBm.tags) ? newBm.tags.map(cleanTagName).filter(Boolean) : [],
              favorite: !!newBm.favorite,
              createdAt: newBm.createdAt || new Date().toISOString()
            });
            importedCount++;
          }
        }
      });

      saveData();
      renderApp();
      closeModal(elements.importExportModal);
      showToast(`Imported ${importedCount} new bookmarks successfully!`);
      
      // Reset input
      elements.importFileInput.value = '';
      elements.importFileStatus.textContent = 'No file chosen';
    } catch (err) {
      showToast(`Import failed: ${err.message}`, "error");
      elements.importFileStatus.textContent = 'Error parsing file';
    }
  };
  reader.readAsText(file);
}

// --- Storage Wipe ---
function handleClearStorage() {
  if (confirm("WARNING: This will permanently delete all your custom bookmarks and collections. Are you sure you want to do this?")) {
    localStorage.clear();
    bookmarks = [];
    collections = [...DEFAULT_COLLECTIONS];
    saveData();
    renderApp();
    showToast("Local Storage wiped cleanly", "error");
  }
}

// --- Toasts helper ---
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconName = 'check-circle-2';
  if (type === 'error') iconName = 'alert-triangle';
  if (type === 'info') iconName = 'info';

  toast.innerHTML = `
    <div class="toast-icon">
      <i data-lucide="${iconName}"></i>
    </div>
    <span class="toast-message">${message}</span>
  `;

  elements.toastContainer.appendChild(toast);
  lucide.createIcons();

  // Play slide in, then schedule delete
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

// --- Utilities ---
function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

function cleanTagName(name) {
  return name.trim().toLowerCase().replace(/[^a-zA-Z0-9-_]/g, '');
}

function clearValidationErrors() {
  document.querySelectorAll('.form-group.has-error').forEach(fg => fg.classList.remove('has-error'));
  const colError = document.getElementById('collection-error');
  if (colError) colError.style.display = 'none';
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function formatDate(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'Recently';
  }
}
