// Supabase Integration Module
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env file if it exists
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://gaowpinqsvpbbbhcixho.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'sb_publishable_SPz0Dy5fsX83C3EaqHsXgA_oO5_Gze0';

// Validate Supabase credentials
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ CRITICAL: Missing Supabase credentials!');
    console.error('   Set SUPABASE_URL and SUPABASE_KEY environment variables');
    console.error('   Or create a .env file with these credentials');
}

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SupabaseDB = {
    client: supabase,

    // Initialize database tables (create if they don't exist)
    async init() {
        try {
            console.log('🔄 Initializing Supabase tables...');
            
            // Check if tables exist by trying to query them
            const { error: usersError } = await supabase
                .from('users')
                .select('count')
                .limit(1);
            
            const { error: levelsError } = await supabase
                .from('levels')
                .select('count')
                .limit(1);

            const { error: pendingError } = await supabase
                .from('pending_levels')
                .select('count')
                .limit(1);

            // If tables don't exist, they'll have errors
            if (usersError || levelsError || pendingError) {
                console.log('📊 Creating tables...');
                await this.createTables();
            }

            console.log('✅ Supabase initialized successfully');
        } catch (error) {
            console.error('❌ Supabase init error:', error.message);
        }
    },

    // Create tables via SQL
    async createTables() {
        // Note: In production, use SQL editor in Supabase dashboard to create tables
        // For now, we'll handle this through the Supabase UI
        console.log('📋 Tables should be created via Supabase SQL Editor');
        console.log('   See SUPABASE_SETUP.md for table schema');
    },

    // ===== USERS =====
    async getUsers() {
        const { data, error } = await supabase
            .from('users')
            .select('*');
        
        if (error) {
            console.error('Error fetching users:', error);
            return [];
        }
        
        // Normalize lowercase columns to camelCase
        if (data && Array.isArray(data)) {
            data = data.map(user => ({
                ...user,
                displayName: user.displayname || user.displayName,
                isAdmin: user.isadmin !== undefined ? user.isadmin : user.isAdmin,
                createdAt: user.createdat || user.createdAt
            }));
        }
        
        return data || [];
    },

    async getUserById(id) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) return null;
        
        // Normalize lowercase columns to camelCase
        if (data) {
            data.displayName = data.displayname || data.displayName;
            data.isAdmin = data.isadmin !== undefined ? data.isadmin : data.isAdmin;
            data.createdAt = data.createdat || data.createdAt;
        }
        
        return data;
    },

    async getUserByEmail(email) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error) return null;
        
        // Normalize lowercase columns to camelCase
        if (data) {
            data.displayName = data.displayname || data.displayName;
            data.isAdmin = data.isadmin !== undefined ? data.isadmin : data.isAdmin;
            data.createdAt = data.createdat || data.createdAt;
        }
        
        return data;
    },

    async addUser(email, displayName, password, isAdmin = false) {
        const id = 'user_' + Date.now();
        const { data, error } = await supabase
            .from('users')
            .insert([
                {
                    id,
                    email,
                    displayname: displayName,
                    password,
                    isadmin: isAdmin,
                    createdat: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error adding user:', error);
            return { success: false, message: error.message };
        }

        // Normalize the response to camelCase
        if (data) {
            data.displayName = data.displayname;
            data.isAdmin = data.isadmin;
            data.createdAt = data.createdat;
        }

        return { success: true, user: data };
    },

    async updateUser(id, updates) {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating user:', error);
            return { success: false, message: error.message };
        }

        return { success: true, user: data };
    },

    // ===== LEVELS =====
    async getLevels() {
        const { data, error } = await supabase
            .from('levels')
            .select('*')
            .eq('status', 'approved')
            .order('submitteddate', { ascending: false });

        if (error) {
            console.error('Error fetching levels:', error);
            return [];
        }
        return data || [];
    },

    async addLevel(levelData) {
        const id = 'level_' + Date.now();
        const { data, error } = await supabase
            .from('levels')
            .insert([
                {
                    id,
                    ...levelData,
                    submittedDate: new Date().toISOString(),
                    status: 'approved'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error adding level:', error);
            return { success: false, message: error.message };
        }

        return { success: true, level: data };
    },

    async updateLevel(id, updates) {
        const { data, error } = await supabase
            .from('levels')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating level:', error);
            return { success: false, message: error.message };
        }

        return { success: true, level: data };
    },

    async deleteLevel(id) {
        const { error } = await supabase
            .from('levels')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting level:', error);
            return { success: false, message: error.message };
        }

        return { success: true };
    },

    // ===== PENDING LEVELS =====
    async getPendingLevels() {
        const { data, error } = await supabase
            .from('pending_levels')
            .select('*')
            .order('submitteddate', { ascending: false });

        if (error) {
            console.error('Error fetching pending levels:', error);
            return [];
        }
        return data || [];
    },

    async addPendingLevel(levelData) {
        const id = 'pending_' + Date.now();
        const { data, error } = await supabase
            .from('pending_levels')
            .insert([
                {
                    id,
                    ...levelData,
                    submittedDate: new Date().toISOString(),
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (error) {
            console.error('Error adding pending level:', error);
            return { success: false, message: error.message };
        }

        return { success: true, level: data };
    },

    async approvePendingLevel(pendingId) {
        // Get pending level
        const { data: pending, error: fetchError } = await supabase
            .from('pending_levels')
            .select('*')
            .eq('id', pendingId)
            .single();

        if (fetchError || !pending) {
            return { success: false, message: 'Pending level not found' };
        }

        // Move to approved levels
        const { success: addSuccess } = await this.addLevel(pending);
        if (!addSuccess) {
            return { success: false, message: 'Failed to approve level' };
        }

        // Delete from pending
        const { error: deleteError } = await supabase
            .from('pending_levels')
            .delete()
            .eq('id', pendingId);

        if (deleteError) {
            return { success: false, message: 'Failed to remove from pending' };
        }

        return { success: true };
    },

    async rejectPendingLevel(pendingId) {
        const { error } = await supabase
            .from('pending_levels')
            .delete()
            .eq('id', pendingId);

        if (error) {
            return { success: false, message: 'Failed to reject level' };
        }

        return { success: true };
    },

    // ===== SETTINGS =====
    async getSettings() {
        const { data, error } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (error) {
            // Return default settings if table doesn't exist
            return {
                theme: 'dark',
                language: 'en',
                darkBackground: true
            };
        }
        return data;
    },

    async updateSettings(settings) {
        const { data, error } = await supabase
            .from('settings')
            .update(settings)
            .eq('id', 'default')
            .select()
            .single();

        if (error) {
            console.error('Error updating settings:', error);
            return { success: false };
        }

        return { success: true, data };
    }
};

module.exports = SupabaseDB;
