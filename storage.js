const Storage = {
    DATA_KEY: 'lcl_data',
    API_URL: '/api/data',
    cachedData: null,

    async init() {
        try {
            const res = await fetch(`${this.API_URL}?t=${Date.now()}`);
            this.cachedData = await res.json();
            localStorage.setItem(this.DATA_KEY, JSON.stringify(this.cachedData));
            return this.cachedData;
        } catch (err) {
            const local = localStorage.getItem(this.DATA_KEY);
            this.cachedData = local ? JSON.parse(local) : { users: [], levels: [], settings: {} };
            return this.cachedData;
        }
    },

    getData() { return this.cachedData || JSON.parse(localStorage.getItem(this.DATA_KEY) || '{"users":[]}'); },

    saveData(data) {
        this.cachedData = data;
        localStorage.setItem(this.DATA_KEY, JSON.stringify(data));
        fetch(this.API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    getUserByEmail(email) { return this.getData().users?.find(u => u.email === email); },
    getUserById(id) { return this.getData().users?.find(u => u.id === id); },
    addUser(email, displayName, password) {
        const data = this.getData();
        const newUser = { id: 'u' + Date.now(), email, displayName, password, isAdmin: false };
        data.users.push(newUser);
        this.saveData(data);
        return { success: true, user: newUser };
    },
    getAllLevels() { return this.getData().levels || []; },
    getPendingLevels() { return this.getData().pendingLevels || []; },
    addPendingLevel(level, user) {
        const data = this.getData();
        data.pendingLevels.push({ ...level, id: 'p' + Date.now(), submittedBy: user, status: 'pending' });
        this.saveData(data);
    },
    getSettings() { return this.getData().settings || { theme: 'dark' }; },
    setTheme(t) { const d = this.getData(); d.settings.theme = t; this.saveData(d); },
    getTheme() { return this.getSettings().theme; },
    getLanguage() { return this.getSettings().language || 'en'; },
    getDarkBackground() { return this.getSettings().darkBackground; },
    setDarkBackground(v) { const d = this.getData(); d.settings.darkBackground = v; this.saveData(d); }
};

Storage.init();
export default Storage;