// Node.js server with Supabase backend
require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const app = express();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;
const DEFAULT_ADMIN_EMAIL = process.env.DEFAULT_ADMIN_EMAIL;
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD;
const PORT = process.env.PORT || 3000;

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Verify Supabase connection
console.log('🔗 Supabase URL:', SUPABASE_URL);
console.log('✅ Supabase client initialized');

// Initialize Supabase tables with default data
async function initializeDatabase() {
    try {
        // Check if users table exists by trying to fetch
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('*')
            .limit(1);

        if (usersError) {
            console.log('📝 Creating tables...');
            // Tables don't exist, log instructions
            console.log('⚠️  Please create tables in Supabase dashboard:');
            console.log('   1. Go to: https://bbvfpwcppnvdmoqzdapk.supabase.co/project/_/editor');
            console.log('   2. Create tables OR run SQL from SUPABASE_SETUP.sql');
            return;
        }

        console.log('✅ Database tables ready');

        // Check if default data exists
        if (users && users.length === 0) {
            console.log('📥 Inserting default data...');
            console.log('⚠️ No default admin credentials defined in environment, skipping admin user creation.');

            // Insert default level
            await supabase.from('levels').insert({
                id: 1,
                name: 'Stereo Madness',
                level_id: 1,
                url: 'https://example.com/level1',
                youtube_url: 'https://youtube.com/watch?v=example1',
                thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22%234a90e2%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22%3EStereo Madness%3C/text%3E%3C/svg%3E',
                difficulty: 'Easy',
                submitted_by: 'Admin',
                submitted_date: new Date().toISOString(),
                status: 'approved'
            });

            // Insert default settings
            await supabase.from('settings').insert({
                id: 1,
                theme: 'dark',
                language: 'en',
                dark_background: true
            });

            console.log('✅ Default data inserted');
        } else {
            console.log(`✅ Database has ${users.length} users`);
        }
    } catch (error) {
        console.error('❌ Database error:', error.message);
    }
}

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// API Routes

// GET all data
app.get(['/api/data', '/api/public-data'], async (req, res) => {
    try {
        const [users, levels, pending, settings] = await Promise.all([
            supabase.from('users').select('*'),
            supabase.from('levels').select('*').eq('status', 'approved').order('id'),
            supabase.from('levels').select('*').eq('status', 'pending').order('submitted_date'),
            supabase.from('settings').select('*').limit(1).single()
        ]);

        const data = {
            users: users.data || [],
            levels: levels.data || [],
            pendingLevels: pending.data || [],
            settings: settings.data || { theme: 'dark', language: 'en', dark_background: true }
        };

        res.json(data);
    } catch (error) {
        console.error('❌ Error reading data:', error);
        res.status(500).json({ error: 'Failed to read data', details: error.message });
    }
});

// POST/UPDATE all data (bulk update)
app.post(['/api/data', '/api/public-data'], async (req, res) => {
    try {
        const { users, levels, pendingLevels, settings } = req.body;

        // Update users
        if (users && Array.isArray(users)) {
            for (const user of users) {
                await supabase.from('users').upsert(user, { onConflict: 'id' });
            }
        }

        // Update approved levels
        if (levels && Array.isArray(levels)) {
            for (const level of levels) {
                await supabase.from('levels').upsert({ ...level, status: 'approved' }, { onConflict: 'id' });
            }
        }

        // Update pending levels
        if (pendingLevels && Array.isArray(pendingLevels)) {
            for (const level of pendingLevels) {
                await supabase.from('levels').upsert({ ...level, status: 'pending' }, { onConflict: 'id' });
            }
        }

        // Update settings
        if (settings) {
            await supabase.from('settings').upsert(settings, { onConflict: 'id' });
        }

        console.log('✅ Data saved at:', new Date().toLocaleTimeString());
        res.json({ success: true, message: 'Data saved to Supabase' });
    } catch (error) {
        console.error('❌ Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data', details: error.message });
    }
});

// GET location info (for Railway/production)
app.get('/api/data-file-location', async (req, res) => {
    res.json({ 
        location: SUPABASE_URL,
        type: 'Supabase Cloud Database',
        database: 'Production' 
    });
});

// Start server immediately, initialize database in background
app.listen(PORT, () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  LCL - Level Challenge List Server     ║');
    console.log('║  ☁️  POWERED BY SUPABASE              ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  🚀 Server running on:                 ║`);
    console.log(`║  http://localhost:${PORT}                       ║`);
    console.log('║                                        ║');
    console.log('║  📍 Open in all browsers:              ║');
    console.log(`║  Edge: http://localhost:${PORT}         ║`);
    console.log(`║  Brave: http://localhost:${PORT}        ║`);
    console.log(`║  Chrome: http://localhost:${PORT}       ║`);
    console.log('║                                        ║');
    console.log('║  ☁️  Database:                         ║');
    console.log('║  Supabase Cloud (Production Ready)     ║');
    console.log('║                                        ║');
    console.log('║  ✅ All data synced to cloud!         ║');
    console.log('║  Press Ctrl+C to stop server           ║');
    console.log('╚════════════════════════════════════════╝');
});

// Initialize database in background (non-blocking)
initializeDatabase().catch(err => {
    console.error('⚠️ Database init error (server still running):', err.message);
});
