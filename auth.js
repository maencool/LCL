// Authentication Management
const Auth = {
    currentUser: null,

    // Initialize auth from sessionStorage or localStorage
    init() {
        const userId = sessionStorage.getItem('lcl_user_id');
        if (userId) {
            this.currentUser = Storage.getUserById(userId);
            if (this.currentUser) {
                console.log(`✅ Auto-logged in: ${this.currentUser.displayName}`);
            }
        }
    },

    // Register user
    register(email, displayName, password) {
        console.log(`📝 Registering: ${email}`);
        const result = Storage.addUser(email, displayName, password);
        if (result.success) {
            console.log(`✅ Registered successfully`);
            return { success: true, message: 'Registration successful! Please log in.' };
        }
        console.log(`❌ Registration failed: ${result.message}`);
        return result;
    },

    // Login user
    login(email, password) {
        console.log(`🔐 Login attempt for: ${email}`);
        const user = Storage.getUserByEmail(email);
        
        if (!user) {
            console.log(`❌ User not found`);
            return { success: false, message: 'User not found' };
        }

        if (user.password !== password) {
            console.log(`❌ Invalid password`);
            return { success: false, message: 'Invalid password' };
        }

        this.currentUser = user;
        sessionStorage.setItem('lcl_user_id', user.id);
        console.log(`✅ Login successful: ${user.displayName}`);
        return { success: true, user };
    },

    // Logout user
    logout() {
        const name = this.currentUser ? this.currentUser.displayName : 'User';
        this.currentUser = null;
        sessionStorage.removeItem('lcl_user_id');
        console.log(`👋 Logged out: ${name}`);
        return { success: true };
    },

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null;
    },

    // Check if user is admin
    isAdmin() {
        return this.currentUser && this.currentUser.isAdmin;
    },

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }
};

// Initialize auth when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Auth.init();
});
