import Storage from './storage.js';

const Auth = {
    currentUser: null,

    async hashPassword(password) {
        const msgUint8 = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    },

    init() {
        const id = localStorage.getItem('lcl_user_id');
        if (id) this.currentUser = Storage.getUserById(id);
    },

    async register(email, name, pass) {
        const hash = await this.hashPassword(pass);
        return Storage.addUser(email, name, hash);
    },

    async login(email, pass) {
        const user = Storage.getUserByEmail(email);
        if (!user) return { success: false, message: 'User not found' };
        const hash = await this.hashPassword(pass);
        if (user.password !== hash) return { success: false, message: 'Invalid password' };
        this.currentUser = user;
        localStorage.setItem('lcl_user_id', user.id);
        return { success: true, user };
    },

    logout() {
        this.currentUser = null;
        localStorage.removeItem('lcl_user_id');
    },

    isLoggedIn() { return this.currentUser !== null; },
    isAdmin() { return this.currentUser?.isAdmin === true; }
};

Auth.init();
export default Auth;