// Storage Management - Server + localStorage backup
const Storage = {
    DATA_KEY: 'lcl_data',
    // Dynamic API URL - uses current server (localhost or network IP)
    get API_URL() {
        return `${window.location.origin}/api/data`;
    },
    cachedData: null,
    
    // Default data structure
    getDefaultData() {
        return {
            users: [
                {
                    id: 'admin1',
                    email: 'maencopra@gmail.com',
                    displayName: 'Admin',
                    password: 'maenissocool12345gGs',
                    isAdmin: true
                }
            ],
            levels: [
                {
                    id: 1,
                    name: 'Stereo Madness',
                    levelId: 1,
                    url: 'https://example.com/level1',
                    youtubeUrl: 'https://youtube.com/watch?v=example1',
                    thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%234a90e2%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22%3EStereo Madness%3C/text%3E%3C/svg%3E',
                    difficulty: 'Easy',
                    submittedBy: 'Admin',
                    submittedDate: new Date().toISOString(),
                    status: 'approved'
                }
            ],
            pendingLevels: [],
            settings: {
                theme: 'dark',
                language: 'en',
                darkBackground: true
            }
        };
    },

    // Initialize - Load from server (only if localhost), otherwise use localStorage
    init() {
        console.log('🔧 Initializing Storage system...');
        
        // Check if running on local network (localhost, local IP, or 127.0.0.1)
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname.startsWith('192.168.');
        
        if (!isLocal) {
            console.log('📍 Running on GitHub Pages - using localStorage only');
            const localData = localStorage.getItem(this.DATA_KEY);
            if (localData) {
                this.cachedData = JSON.parse(localData);
                console.log('✅ Using localStorage (offline mode)');
            } else {
                this.cachedData = this.getDefaultData();
                localStorage.setItem(this.DATA_KEY, JSON.stringify(this.cachedData));
                console.log('📝 Created new localStorage data');
            }
            return;
        }
        
        // Try server sync only on localhost
        const timestamp = new Date().getTime();
        fetch(`${this.API_URL}?t=${timestamp}`, { method: 'GET' })
            .then(res => res.json())
            .then(data => {
                this.cachedData = data;
                localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
                console.log('✅ Loaded data from server');
                if (data.users && Array.isArray(data.users)) {
                    console.log(`📋 Users: ${data.users.length}`);
                    data.users.forEach(u => {
                        console.log(`   ├─ ${u.email}${u.isAdmin ? ' 🔑 ADMIN' : ''}`);
                    });
                }
            })
            .catch(err => {
                console.warn('⚠️ Server unavailable, using localStorage');
                const localData = localStorage.getItem(this.DATA_KEY);
                if (localData) {
                    this.cachedData = JSON.parse(localData);
                    console.log('✅ Using localStorage (offline mode)');
                } else {
                    this.cachedData = this.getDefaultData();
                    localStorage.setItem(this.DATA_KEY, JSON.stringify(this.cachedData));
                    console.log('📝 Created new localStorage data');
                }
            });
    },

    // Get all data - returns cached or localStorage
    getData() {
        if (this.cachedData) {
            return this.cachedData;
        }

        const localData = localStorage.getItem(this.DATA_KEY);
        if (localData) {
            try {
                let data = JSON.parse(localData);
                // Normalize Supabase lowercase columns to camelCase
                data = this.normalizeData(data);
                this.cachedData = data;
                return this.cachedData;
            } catch (err) {
                console.error('❌ localStorage corrupted');
                this.cachedData = this.getDefaultData();
                return this.cachedData;
            }
        }

        this.cachedData = this.getDefaultData();
        return this.cachedData;
    },

    // Normalize data from Supabase (converts lowercase to camelCase)
    normalizeData(data) {
        if (!data) return data;
        
        // Normalize users
        if (data.users && Array.isArray(data.users)) {
            data.users = data.users.map(user => ({
                ...user,
                displayName: user.displayName || user.displayname,
                isAdmin: user.isAdmin !== undefined ? user.isAdmin : user.isadmin,
                createdAt: user.createdAt || user.createdat
            }));
        }
        
        // Normalize levels
        if (data.levels && Array.isArray(data.levels)) {
            data.levels = data.levels.map(level => ({
                ...level,
                submittedDate: level.submittedDate || level.submitteddate
            }));
        }
        
        // Normalize pending levels
        if (data.pendingLevels && Array.isArray(data.pendingLevels)) {
            data.pendingLevels = data.pendingLevels.map(level => ({
                ...level,
                submittedDate: level.submittedDate || level.submitteddate
            }));
        }
        
        // Normalize settings
        if (data.settings) {
            data.settings = {
                ...data.settings,
                darkBackground: data.settings.darkBackground !== undefined ? data.settings.darkBackground : data.settings.darkbackground
            };
        }
        
        return data;
    },

    // Save to localStorage (and server if on localhost)
    saveData(data) {
        this.cachedData = data;
        localStorage.setItem(this.DATA_KEY, JSON.stringify(data));

        // Try to save to server on local network
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname.startsWith('192.168.');
        if (!isLocal) {
            console.log('✅ Saved to localStorage (GitHub Pages mode)');
            return;
        }

        const timestamp = new Date().getTime();
        fetch(`${this.API_URL}?t=${timestamp}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(() => console.log('✅ Saved to server'))
            .catch(err => console.warn('⚠️ Server save failed:', err.message));
    },

    // User operations
    addUser(email, displayName, password) {
        const data = this.getData();
        const userExists = data.users.some(u => u.email === email);
        
        if (userExists) {
            return { success: false, message: 'Email already registered' };
        }

        const newUser = {
            id: 'user_' + Date.now(),
            email,
            displayName,
            password,
            isAdmin: false
        };

        data.users.push(newUser);
        this.saveData(data);
        
        // Try to register on server (Supabase)
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname.startsWith('192.168.');
        
        if (isLocal) {
            const timestamp = new Date().getTime();
            fetch(`${this.API_URL.replace('/api/data', '')}/api/users?t=${timestamp}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, displayName, password })
            })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    console.log(`👤 User registered in Supabase: ${email}`);
                } else {
                    console.warn(`⚠️ Supabase registration failed: ${result.message}`);
                }
            })
            .catch(err => console.warn('⚠️ Could not register on server:', err));
        }
        
        return { success: true, user: newUser };
    },

    getUserByEmail(email) {
        const data = this.getData();
        
        // Validate data structure
        if (!data.users || !Array.isArray(data.users)) {
            console.error('❌ CRITICAL: Users array is missing or corrupted!');
            console.log('Data structure:', data);
            // Try to fix it
            this.init();
            return this.getUserByEmail(email);
        }
        
        const user = data.users.find(u => u.email === email);
        
        if (!user) {
            console.error(`❌ User NOT found: ${email}`);
            console.log(`📋 Available users (${data.users.length}):`);
            data.users.forEach(u => {
                console.log(`   - ${u.email} (${u.displayName})${u.isAdmin ? ' 🔑' : ''}`);
            });
        } else {
            console.log(`✅ User FOUND: ${email}`);
        }
        
        return user || null;
    },

    getUserById(id) {
        const data = this.getData();
        return data.users.find(u => u.id === id) || null;
    },

    // Level operations
    addLevel(levelData) {
        const data = this.getData();
        const newLevel = {
            id: data.levels.length + 1,
            ...levelData,
            submittedDate: new Date().toISOString(),
            status: 'approved'
        };

        data.levels.push(newLevel);
        this.saveData(data);
        return newLevel;
    },

    addPendingLevel(levelData, submittedBy) {
        const data = this.getData();
        const newPending = {
            id: 'pending_' + Date.now(),
            ...levelData,
            submittedBy,
            submittedDate: new Date().toISOString(),
            status: 'pending'
        };

        data.pendingLevels.push(newPending);
        this.saveData(data);
        return newPending;
    },

    getAllLevels() {
        const data = this.getData();
        return data.levels || [];
    },

    getPendingLevels() {
        const data = this.getData();
        return data.pendingLevels || [];
    },

    approvePendingLevel(pendingId) {
        const data = this.getData();
        const pending = data.pendingLevels.find(p => p.id === pendingId);
        
        if (!pending) return false;

        const newLevel = {
            id: data.levels.length + 1,
            ...pending,
            status: 'approved'
        };

        data.levels.push(newLevel);
        data.pendingLevels = data.pendingLevels.filter(p => p.id !== pendingId);
        this.saveData(data);
        console.log(`✅ Level "${newLevel.name}" approved!`);
        return true;
    },

    deleteLevel(levelId) {
        const data = this.getData();
        const level = data.levels.find(l => l.id === levelId);
        
        if (!level) return false;

        // Convert to string for comparison
        data.levels = data.levels.filter(l => String(l.id) !== String(levelId));
        this.saveData(data);
        
        // Try to delete from server (Supabase)
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname.startsWith('192.168.');
        
        if (isLocal) {
            const timestamp = new Date().getTime();
            fetch(`${this.API_URL.replace('/api/data', '')}/api/levels/${levelId}?t=${timestamp}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })
            .then(res => res.json())
            .then(result => {
                console.log(`🗑️ Level deleted from server: ${result.success ? '✅' : '❌'}`);
            })
            .catch(err => console.warn('⚠️ Could not sync delete to server:', err));
        }
        
        console.log(`✅ Level "${level.name}" deleted`);
        return true;
    },

    replaceLevel(currentId, newPosition) {
        const data = this.getData();
        const levelIndex = data.levels.findIndex(l => l.id === currentId);
        
        if (levelIndex === -1) return false;

        const [level] = data.levels.splice(levelIndex, 1);
        data.levels.splice(newPosition - 1, 0, level);
        this.saveData(data);
        
        // Try to update position on server
        const isLocal = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' || 
                       window.location.hostname.startsWith('192.168.');
        
        if (isLocal) {
            const timestamp = new Date().getTime();
            fetch(`${this.API_URL.replace('/api/data', '')}/api/levels/${currentId}/position?t=${timestamp}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ position: newPosition })
            })
            .then(res => res.json())
            .then(result => {
                console.log(`📍 Level position synced: ${result.success ? '✅' : '❌'}`);
            })
            .catch(err => console.warn('⚠️ Could not sync position to server:', err));
        }
        
        console.log(`✅ "${level.name}" moved to position ${newPosition}`);
        return true;
    },

    updateLevel(levelId, updates) {
        const data = this.getData();
        const level = data.levels.find(l => l.id === levelId);
        
        if (!level) return false;

        Object.assign(level, updates);
        this.saveData(data);
        return true;
    },

    deletePendingLevel(pendingId) {
        const data = this.getData();
        const index = data.pendingLevels.findIndex(p => p.id === pendingId);
        
        if (index === -1) return false;

        const level = data.pendingLevels[index];
        data.pendingLevels.splice(index, 1);
        this.saveData(data);
        console.log(`✅ Level "${level.name}" rejected`);
        return true;
    },

    // Settings operations
    getSettings() {
        const data = this.getData();
        return data.settings || { theme: 'dark', language: 'en', darkBackground: true };
    },

    updateSettings(settings) {
        const data = this.getData();
        data.settings = { ...data.settings, ...settings };
        this.saveData(data);
    },

    getTheme() {
        return this.getSettings().theme;
    },

    setTheme(theme) {
        this.updateSettings({ theme });
    },

    getLanguage() {
        return this.getSettings().language;
    },

    setLanguage(language) {
        this.updateSettings({ language });
    },

    getDarkBackground() {
        return this.getSettings().darkBackground;
    },

    setDarkBackground(isDark) {
        this.updateSettings({ darkBackground: isDark });
    },

    // Debug methods
    getAllUsers() {
        const data = this.getData();
        return data.users;
    },

    printAllData() {
        console.log('=== LCL DATA ===');
        const data = this.getData();
        console.log('Users:', data.users.length);
        console.log('Levels:', data.levels.length);
        console.log('Pending:', data.pendingLevels.length);
        console.log('Settings:', data.settings);
    },

    resetToDefault() {
        const defaultData = this.getDefaultData();
        this.saveData(defaultData);
        console.log('✅ Data reset to defaults');
        setTimeout(() => window.location.reload(), 500);
    }
};

// === Initialize Storage ===
console.log('🔧 Starting Storage initialization...');
Storage.init();
