// Main Application Logic
const App = {
    // Translation dictionary
    translations: {
        en: {
            'home': 'Home',
            'sendLevel': 'Send Level',
            'rules': 'Rules',
            'settings': 'Settings',
            'login': 'Log In',
            'register': 'Register',
            'logout': 'Log Out',
            'admin': 'Admin Panel',
            'leaderboard': 'Leaderboard',
            'submitLevel': 'Submit a Level',
            'menuTitle': 'Menu',
            'noLevels': 'No levels yet. Be the first to submit one!',
            'noImage': 'No Image'
        },
        es: {
            'home': 'Inicio',
            'sendLevel': 'Enviar Nivel',
            'rules': 'Reglas',
            'settings': 'Configuración',
            'login': 'Iniciar Sesión',
            'register': 'Registrarse',
            'logout': 'Cerrar Sesión',
            'admin': 'Panel de Admin',
            'leaderboard': 'Tabla de Clasificación',
            'submitLevel': 'Enviar un Nivel',
            'menuTitle': 'Menú',
            'noLevels': '¡Sin niveles aún. ¡Sé el primero en enviar uno!',
            'noImage': 'Sin Imagen'
        },
        fr: {
            'home': 'Accueil',
            'sendLevel': 'Envoyer un Niveau',
            'rules': 'Règles',
            'settings': 'Paramètres',
            'login': 'Connexion',
            'register': 'S\'inscrire',
            'logout': 'Déconnexion',
            'admin': 'Panneau Admin',
            'leaderboard': 'Classement',
            'submitLevel': 'Soumettre un Niveau',
            'menuTitle': 'Menu',
            'noLevels': 'Aucun niveau pour l\'instant. Soyez le premier à en envoyer un!',
            'noImage': 'Pas d\'Image'
        },
        de: {
            'home': 'Startseite',
            'sendLevel': 'Level Einreichen',
            'rules': 'Regeln',
            'settings': 'Einstellungen',
            'login': 'Anmelden',
            'register': 'Registrieren',
            'logout': 'Abmelden',
            'admin': 'Admin-Panel',
            'leaderboard': 'Bestenliste',
            'submitLevel': 'Level Einreichen',
            'menuTitle': 'Menü',
            'noLevels': 'Noch keine Level. Seien Sie der Erste, der einen einreicht!',
            'noImage': 'Kein Bild'
        },
        pt: {
            'home': 'Início',
            'sendLevel': 'Enviar Nível',
            'rules': 'Regras',
            'settings': 'Configurações',
            'login': 'Entrar',
            'register': 'Registrar',
            'logout': 'Sair',
            'admin': 'Painel Admin',
            'leaderboard': 'Placar',
            'submitLevel': 'Enviar um Nível',
            'menuTitle': 'Menu',
            'noLevels': 'Nenhum nível ainda. Seja o primeiro a enviar um!',
            'noImage': 'Sem Imagem'
        }
    },

    // Get translated text
    t(key) {
        const language = Storage.getLanguage() || 'en';
        return (this.translations[language] && this.translations[language][key]) || 
               (this.translations.en && this.translations.en[key]) || key;
    },

    // Utility function to extract YouTube video ID from URL
    getYouTubeVideoId(url) {
        if (!url) return null;
        
        // Handle different YouTube URL formats
        let videoId = null;
        
        if (url.includes('youtube.com/watch?v=')) {
            videoId = url.split('watch?v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
            videoId = url.split('embed/')[1].split('?')[0];
        }
        
        return videoId;
    },

    // Generate YouTube thumbnail URL from video URL
    getYouTubeThumbnail(youtubeUrl) {
        const videoId = this.getYouTubeVideoId(youtubeUrl);
        if (!videoId) {
            return 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%234a90e2%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22%3ENo Thumbnail%3C/text%3E%3C/svg%3E';
        }
        // Use maxresdefault for best quality, fallback to hqdefault
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    },

    // Initialize the app
    init() {
        console.log('🚀 App.init() starting...');
        this.setupEventListeners();
        this.updateUI();
        this.loadSettings();
        this.renderLeaderboard();
        
        // Auto-refresh data from server every 2 seconds
        this.startAutoRefresh();
        
        // Refresh when tab becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                console.log('📄 Tab became visible - refreshing data...');
                this.refreshDataFromServer();
            }
        });
        
        console.log('✅ App.init() complete!');
    },

    // Refresh data from server
    refreshDataFromServer() {
        // Add timestamp to bust cache
        const timestamp = new Date().getTime();
        fetch(`${Storage.API_URL}?t=${timestamp}`)
            .then(res => res.json())
            .then(data => {
                Storage.cachedData = data;
                localStorage.setItem(Storage.DATA_KEY, JSON.stringify(data));
                this.renderLeaderboard();
                this.renderPendingLevels();
                this.renderManageLevels();
                console.log('✅ Data refreshed from server');
            })
            .catch(err => console.warn('⚠️ Could not refresh from server'));
    },

    // Start auto-refresh interval
    startAutoRefresh() {
        setInterval(() => {
            this.refreshDataFromServer();
        }, 2000); // Refresh every 2 seconds
    },

    // Setup all event listeners
    setupEventListeners() {
        console.log('🎯 Setting up event listeners...');
        
        // Menu - with error handling
        const menuBtn = document.getElementById('menuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const overlay = document.getElementById('overlay');
        
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                console.log('🏡 Menu button clicked');
                this.toggleMenu();
            });
            console.log('✅ Menu button listener attached');
        } else {
            console.error('❌ menuBtn not found!');
        }
        
        if (closeMenuBtn) {
            closeMenuBtn.addEventListener('click', () => {
                console.log('✖️ Close menu button clicked');
                this.toggleMenu();
            });
            console.log('✅ Close menu listener attached');
        } else {
            console.error('❌ closeMenuBtn not found!');
        }
        
        if (overlay) {
            overlay.addEventListener('click', () => {
                console.log('📦 Overlay clicked');
                this.toggleMenu();
            });
            console.log('✅ Overlay listener attached');
        } else {
            console.error('❌ overlay not found!');
        }

        // Navigation
        document.querySelectorAll('[data-action]').forEach(element => {
            element.addEventListener('click', (e) => {
                // Don't prevent default for external links
                const href = element.getAttribute('href');
                if (href && href.startsWith('http')) {
                    return;
                }
                e.preventDefault();
                const action = element.getAttribute('data-action');
                console.log(`🔗 Navigation action: ${action}`);
                this.navigateTo(action);
            });
        });
        console.log(`✅ Navigation listeners attached (${document.querySelectorAll('[data-action]').length} elements)`);

        // Forms - with error handling
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const sendLevelForm = document.getElementById('sendLevelForm');
        
        if (loginForm) loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        if (registerForm) registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        if (sendLevelForm) sendLevelForm.addEventListener('submit', (e) => this.handleSendLevel(e));

        // Settings - with error handling
        const themeSelect = document.getElementById('themeSelect');
        const backgroundToggle = document.getElementById('backgroundToggle');
        
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                console.log(`🎨 Theme changed to: ${e.target.value}`);
                this.changeTheme(e.target.value);
            });
        }
        
        if (backgroundToggle) {
            backgroundToggle.addEventListener('change', (e) => {
                console.log(`🌙 Background toggled: ${e.target.checked}`);
                this.toggleDarkBackground(e.target.checked);
            });
        }

        // Modal close
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').classList.add('hidden');
            });
        });

        // Click outside modal to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
        
        console.log('✅ All event listeners setup complete!');
    },

    // Toggle menu
    toggleMenu() {
        const menu = document.getElementById('menu');
        const overlay = document.getElementById('overlay');
        
        console.log('🔄 toggleMenu() called');
        console.log('Menu state before:', menu?.classList.contains('hidden') ? 'hidden' : 'visible');
        
        menu.classList.toggle('hidden');
        overlay.classList.toggle('hidden');
        
        console.log('Menu state after:', menu?.classList.contains('hidden') ? 'hidden' : 'visible');
    },

    // Navigate to page
    navigateTo(page) {
        console.log(`📍 navigateTo("${page}") called`);
        
        // Close menu if it's open
        const menu = document.getElementById('menu');
        if (menu && !menu.classList.contains('hidden')) {
            console.log('📦 Menu is open, closing it...');
            this.toggleMenu();
        }

        // Hide all pages
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

        // Show specific page
        const pageMap = {
            'home': 'homePage',
            'sendLevel': 'sendLevelPage',
            'rules': 'rulesPage',
            'login': 'loginPage',
            'register': 'registerPage',
            'settings': 'settingsPage',
            'admin': 'adminPage',
            'logout': 'logout'
        };

        if (page === 'logout') {
            this.handleLogout();
            return;
        }

        const pageId = pageMap[page];
        if (pageId) {
            const pageElement = document.getElementById(pageId);
            if (pageElement) {
                pageElement.classList.add('active');
                
                // Load admin data if navigating to admin panel
                if (page === 'admin') {
                    this.loadAdminPanel();
                }
            }
        }
    },

    // Handle login
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const result = await Auth.login(email, password);
        
        if (result.success) {
            alert('Login successful!');
            document.getElementById('loginForm').reset();
            this.updateUI();
            this.navigateTo('home');
        } else {
            alert(result.message);
        }
    },

    // Handle register
    async handleRegister(e) {
        e.preventDefault();
        
        const email = document.getElementById('registerEmail').value;
        const displayName = document.getElementById('displayName').value;
        const password = document.getElementById('registerPassword').value;

        const result = await Auth.register(email, displayName, password);
        
        if (result.success) {
            alert(result.message);
            document.getElementById('registerForm').reset();
            this.navigateTo('login');
        } else {
            alert(result.message);
        }
    },

    // Handle send level
    handleSendLevel(e) {
        e.preventDefault();

        if (!Auth.isLoggedIn()) {
            alert('Please log in to submit a level');
            this.navigateTo('login');
            return;
        }

        const youtubeUrl = document.getElementById('youtubeUrl').value;
        
        const levelData = {
            name: document.getElementById('levelName').value,
            levelId: document.getElementById('levelId').value,
            url: youtubeUrl,
            youtubeUrl: youtubeUrl,
            thumbnail: youtubeUrl,
            difficulty: 'Unknown',
            submittedBy: Auth.currentUser.displayName
        };

        Storage.addPendingLevel(levelData, Auth.currentUser.displayName);
        alert('Level submitted to admin! Thank you for your submission.');
        document.getElementById('sendLevelForm').reset();
        this.navigateTo('home');
    },

    // Handle logout
    handleLogout() {
        Auth.logout();
        alert('You have been logged out');
        this.updateUI();
        this.navigateTo('home');
    },

    // Update UI based on login state
    updateUI() {
        const authItems = document.getElementById('authMenuItems');
        const loggedInItems = document.getElementById('loggedInItems');
        const userDisplay = document.getElementById('userDisplayName');

        if (Auth.isLoggedIn()) {
            authItems.classList.add('hidden');
            loggedInItems.classList.remove('hidden');
            userDisplay.textContent = `👤 ${Auth.currentUser.displayName}`;

            // Show admin link if user is admin
            if (Auth.isAdmin()) {
                document.querySelector('.admin-link').classList.remove('hidden');
            } else {
                document.querySelector('.admin-link').classList.add('hidden');
            }
        } else {
            authItems.classList.remove('hidden');
            loggedInItems.classList.add('hidden');
            document.querySelector('.admin-link').classList.add('hidden');
        }
    },

    // Render leaderboard
    renderLeaderboard() {
        const levels = Storage.getAllLevels();
        const levelsList = document.getElementById('levelsList');

        if (levels.length === 0) {
            levelsList.innerHTML = '<p class="empty-state">No levels yet. Be the first to submit one!</p>';
            return;
        }

        levelsList.innerHTML = levels.map((level, index) => {
            // Generate proper YouTube thumbnail
            const thumbnailUrl = level.youtubeUrl ? this.getYouTubeThumbnail(level.youtubeUrl) : (level.thumbnail || '');
            return `
            <div class="level-card" onclick="App.showLevelModal('${level.id}')">
                <div class="level-rank rank-${index + 1}">#${index + 1}</div>
                <div class="level-thumbnail">
                    <img src="${thumbnailUrl}" alt="${level.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%23333%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'">
                </div>
                <div class="level-info">
                    <div class="level-name">${level.name}</div>
                    <div class="level-id">Level ID: ${level.levelId}</div>
                </div>
            </div>
        `;
        }).join('');
    },

    // Show level modal
    showLevelModal(levelId) {
        // Convert string to number if it's numeric
        levelId = isNaN(levelId) ? levelId : parseInt(levelId);
        const level = Storage.getAllLevels().find(l => l.id === levelId);
        if (!level) return;

        document.getElementById('modalLevelName').textContent = level.name;
        document.getElementById('modalLevelId').textContent = level.levelId;
        document.getElementById('modalDifficulty').textContent = level.difficulty || 'Unknown';
        
        // Generate proper YouTube thumbnail
        const thumbnailUrl = level.youtubeUrl ? this.getYouTubeThumbnail(level.youtubeUrl) : (level.thumbnail || '');
        document.getElementById('modalThumbnail').src = thumbnailUrl;
        document.getElementById('modalYoutubeLink').href = level.youtubeUrl;

        document.getElementById('levelModal').classList.remove('hidden');
    },

    // Load admin panel
    loadAdminPanel() {
        if (!Auth.isAdmin()) {
            alert('Access denied. Admin only.');
            this.navigateTo('home');
            return;
        }

        this.renderPendingLevels();
        this.renderManageLevels();
    },

    // Render pending levels
    renderPendingLevels() {
        const pending = Storage.getPendingLevels();
        const list = document.getElementById('pendingLevelsList');

        if (pending.length === 0) {
            list.innerHTML = '<p class="empty-state">No pending submissions</p>';
            return;
        }

        list.innerHTML = pending.map(level => `
            <div class="admin-card">
                <div class="admin-card-info">
                    <strong>${level.name}</strong> (ID: ${level.levelId})
                    <p style="color: var(--text-secondary); font-size: 14px;">Submitted by: ${level.submittedBy}</p>
                </div>
                <div class="admin-card-actions">
                    <button class="btn btn-success btn-small" onclick="App.approvePendingLevel('${level.id}')">Approve</button>
                    <button class="btn btn-danger btn-small" onclick="App.rejectPendingLevel('${level.id}')">Reject</button>
                </div>
            </div>
        `).join('');
    },

    // Render manage levels
    renderManageLevels() {
        const levels = Storage.getAllLevels();
        const list = document.getElementById('manageLevelsList');

        if (levels.length === 0) {
            list.innerHTML = '<p class="empty-state">No levels to manage</p>';
            return;
        }

        list.innerHTML = levels.map(level => `
            <div class="admin-card">
                <div class="admin-card-info">
                    <strong>${level.name}</strong> (ID: ${level.levelId})
                </div>
                <div class="admin-card-actions">
                    <button class="btn btn-info btn-small" onclick="App.showReplaceModal('${level.id}')">Replace</button>
                    <button class="btn btn-danger btn-small" onclick="App.deleteLevel('${level.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    },

    // Approve pending level
    approvePendingLevel(pendingId) {
        if (Storage.approvePendingLevel(pendingId)) {
            alert('Level approved!');
            this.renderLeaderboard();
            this.renderPendingLevels();
        }
    },

    // Reject pending level
    rejectPendingLevel(pendingId) {
        if (Storage.deletePendingLevel(pendingId)) {
            alert('Level rejected!');
            this.renderPendingLevels();
        }
    },

    // Delete level
    deleteLevel(levelId) {
        // Convert string to number if it's numeric
        levelId = isNaN(levelId) ? levelId : parseInt(levelId);
        console.log(`🗑️ Delete button clicked for level ID: ${levelId}`);
        if (confirm('Are you sure you want to delete this level?')) {
            console.log(`🔄 Deleting level ${levelId}...`);
            if (Storage.deleteLevel(levelId)) {
                alert('✅ Level deleted!');
                this.renderLeaderboard();
                this.renderManageLevels();
                // Notify other browsers
                setTimeout(() => this.refreshDataFromServer(), 500);
            } else {
                alert('❌ Failed to delete level');
            }
        }
    },

    // Replace level
    replaceLevel(levelId, newPosition) {
        // Convert string to number if it's numeric
        levelId = isNaN(levelId) ? levelId : parseInt(levelId);
        console.log(`🔄 Replace called for level ${levelId} to position ${newPosition}`);
        if (Storage.replaceLevel(levelId, newPosition)) {
            alert('✅ Level position updated!');
            this.renderLeaderboard();
            this.renderManageLevels();
            document.getElementById('replaceModal').classList.add('hidden');
            // Notify other browsers
            setTimeout(() => this.refreshDataFromServer(), 500);
        } else {
            alert('❌ Failed to update level position');
        }
    },

    // Show replace modal
    showReplaceModal(levelId) {
        // Convert string to number if it's numeric
        levelId = isNaN(levelId) ? levelId : parseInt(levelId);
        console.log(`📋 Show replace modal for level ID: ${levelId}`);
        const levels = Storage.getAllLevels();
        const positionsList = document.getElementById('replacePositionsList');

        positionsList.innerHTML = levels.map((level, index) => `
            <label class="position-option">
                <input type="radio" name="position" value="${index + 1}" ${index === 0 ? 'checked' : ''}>
                <span class="position-label">Position #${index + 1}: ${level.name}</span>
            </label>
        `).join('');

        document.getElementById('confirmReplaceBtn').onclick = () => {
            const position = document.querySelector('input[name="position"]:checked').value;
            this.replaceLevel(levelId, parseInt(position));
        };

        document.getElementById('replaceModal').classList.remove('hidden');
    },

    // Change theme
    changeTheme(theme) {
        Storage.setTheme(theme);
        this.applyTheme();
    },

    // Apply theme
    applyTheme() {
        const theme = Storage.getTheme();
        const body = document.body;

        if (theme === 'light') {
            body.classList.add('light-theme');
        } else if (theme === 'dark') {
            body.classList.remove('light-theme');
        } else if (theme === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                body.classList.remove('light-theme');
            } else {
                body.classList.add('light-theme');
            }
        }
    },

    // Toggle dark background
    toggleDarkBackground(isDark) {
        Storage.setDarkBackground(isDark);
        const body = document.body;
        if (isDark) {
            body.style.backgroundColor = '#0a0a0a';
        } else {
            body.style.backgroundColor = '#1a1a1a';
        }
    },

    // Load settings
    loadSettings() {
        console.log('⚙️ Loading settings...');
        const settings = Storage.getSettings();
        console.log('Settings:', settings);

        const themeSelect = document.getElementById('themeSelect');
        const backgroundToggle = document.getElementById('backgroundToggle');
        
        if (themeSelect) themeSelect.value = settings.theme;
        if (backgroundToggle) backgroundToggle.checked = settings.darkBackground;

        this.applyTheme();
        this.toggleDarkBackground(settings.darkBackground);
        console.log('⚙️ Settings loaded complete!');
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Handle window resize for responsive design
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('overlay').classList.add('hidden');
    }
});
