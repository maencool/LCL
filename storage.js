// Storage Management - Server + localStorage backup
const Storage = {
    DATA_KEY: 'lcl_data',
    API_URL: '/api/data',
    cachedData: null,
    
    getDefaultData() {
        return {
            users: [],
            levels: [{ id: 1, name: 'Stereo Madness', levelId: 1, url: '', youtubeUrl: '', difficulty: 'Easy', status: 'approved' }],
            pendingLevels: [],
            settings: { theme: 'dark', language: 'en', darkBackground: true }
        };
    },

    async init() {
        console.log('🔧 Initializing Storage system...');
        const timestamp = new Date().getTime();
        try {
            const res = await fetch(`${this.API_URL}?t=${timestamp}`);
            const data = await res.json();
            this.cachedData = data;
            localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
            console.log('✅ Loaded data from server');
            return data;
        } catch (err) {
            console.warn('⚠️ Server unavailable, using localStorage');
            const localData = localStorage.getItem(this.DATA_KEY);
            this.cachedData = localData ? JSON.parse(localData) : this.getDefaultData();
            return this.cachedData;
        }
    },

    getData() {
        if (this.cachedData) return this.cachedData;
        const localData = localStorage.getItem(this.DATA_KEY);
        return localData ? JSON.parse(localData) : this.getDefaultData();
    },

    saveData(data) {
        this.cachedData = data;
        localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
        fetch(this.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).catch(err => console.warn('⚠️ Server save failed:', err.message));
    },

    getUserByEmail(email) {
        const data = this.getData();
        return data.users?.find(u => u.email === email) || null;
    },

    getUserById(id) {
        const data = this.getData();
        return data.users?.find(u => u.id === id) || null;
    },

    addUser(email, displayName, password) {
        const data = this.getData();
        if (data.users.some(u => u.email === email)) return { success: false, message: 'Exists' };
        const newUser = { id: 'user_' + Date.now(), email, displayName, password, isAdmin: false };
        data.users.push(newUser);
        this.saveData(data);
        return { success: true, user: newUser };
    },

    getAllLevels() { return this.getData().levels || []; },
    getPendingLevels() { return this.getData().pendingLevels || []; },
    
    addPendingLevel(levelData, submittedBy) {
        const data = this.getData();
        data.pendingLevels.push({ id: 'p' + Date.now(), ...levelData, submittedBy, status: 'pending' });
        this.saveData(data);
    },

    approvePendingLevel(id) {
        const data = this.getData();
        const p = data.pendingLevels.find(x => x.id === id);
        if (!p) return false;
        data.levels.push({ ...p, id: data.levels.length + 1, status: 'approved' });
        data.pendingLevels = data.pendingLevels.filter(x => x.id !== id);
        this.saveData(data);
        return true;
    },

    getSettings() { return this.getData().settings || { theme: 'dark' }; },
    setTheme(theme) { 
        const s = this.getSettings(); s.theme = theme; 
        const d = this.getData(); d.settings = s; this.saveData(d); 
    },
    getTheme() { return this.getSettings().theme; },
    getLanguage() { return this.getSettings().language || 'en'; },
    getDarkBackground() { return this.getSettings().darkBackground; },
    setDarkBackground(v) { 
        const s = this.getSettings(); s.darkBackground = v; 
        const d = this.getData(); d.settings = s; this.saveData(d); 
    }
};

Storage.init();
export default Storage;