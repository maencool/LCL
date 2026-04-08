// Authentication Management
const Auth = {
    currentUser: null,

    async hashPassword(password) {
        if (!password) return '';
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hashBuffer))
            .map(byte => byte.toString(16).padStart(2, '0'))
            .join('');
    },

    init() {
        const userId = sessionStorage.getItem('lcl_user_id');
        if (userId) {
            this.currentUser = Storage.getUserById(userId);
            if (this.currentUser) {
                console.log(`✅ Auto-logged in: ${this.currentUser.displayName}`);
            }
        }
    },

    async register(email, displayName, password) {
        console.log(`📝 Registering: ${email}`);
        const passwordHash = await this.hashPassword(password);
        const result = Storage.addUser(email, displayName, passwordHash);
        if (result.success) {
            console.log(`✅ Registered successfully`);
            return { success: true, message: 'Registration successful! Please log in.' };
        }
        console.log(`❌ Registration failed: ${result.message}`);
        return result;
    },

    async login(email, password) {
        console.log(`🔐 Login attempt for: ${email}`);
        const user = Storage.getUserByEmail(email);
        
        if (!user) {
            console.log(`❌ User not found`);
            return { success: false, message: 'User not found' };
        }

        const passwordHash = await this.hashPassword(password);
        if (user.password !== passwordHash) {
            console.log(`❌ Invalid password`);
            return { success: false, message: 'Invalid password' };
        }

        this.currentUser = user;
        sessionStorage.setItem('lcl_user_id', user.id);
        console.log(`✅ Login successful: ${user.displayName}`);
        return { success: true, user };
    },

    logout() {
        const name = this.currentUser ? this.currentUser.displayName : 'User';
        this.currentUser = null;
        sessionStorage.removeItem('lcl_user_id');
        console.log(`👋 Logged out: ${name}`);
        return { success: true };
    },

    isLoggedIn() {
        return this.currentUser !== null;
    },

    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    },

    getCurrentUser() {
        return this.currentUser;
    }
};

// Initialize auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
