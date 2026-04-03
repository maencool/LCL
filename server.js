// Node.js server with Supabase integration
const fs = require('fs');
const path = require('path');
const express = require('express');
const os = require('os');

// Load environment variables from .env file if it exists
require('dotenv').config();

const app = express();

// Import Supabase
const SupabaseDB = require('./supabase.js');

const DATA_FILE = path.join(__dirname, 'lcl_data.json');
const PORT = process.env.PORT || 3000;

// Get local IP address for network access
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Initialize data file if it doesn't exist
function initializeDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        const defaultData = {
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
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2));
        console.log('✅ Data file created at:', DATA_FILE);
    }
}

// Middleware
app.use(express.json());
app.use(express.static(__dirname));

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Add health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Check if Supabase is connected by trying a simple query
        const { data, error } = await SupabaseDB.client
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            return res.status(503).json({
                status: 'unhealthy',
                database: 'disconnected',
                error: error.message,
                warning: 'Check that Supabase credentials are valid and database tables exist'
            });
        }

        res.json({
            status: 'healthy',
            database: 'connected',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: {
                node_env: process.env.NODE_ENV || 'development',
                port: PORT
            }
        });
    } catch (error) {
        res.status(503).json({
            status: 'unhealthy',
            error: error.message,
            type: 'server_error'
        });
    }
});

// API Routes - Using Supabase as primary, file as backup
app.get('/api/data', async (req, res) => {
    try {
        // Try to get data from Supabase
        const users = await SupabaseDB.getUsers();
        const levels = await SupabaseDB.getLevels();
        const pendingLevels = await SupabaseDB.getPendingLevels();
        const settings = await SupabaseDB.getSettings();

        const combinedData = {
            users: users || [],
            levels: levels || [],
            pendingLevels: pendingLevels || [],
            settings: settings || {}
        };

        // Also save to local file as backup
        fs.writeFileSync(DATA_FILE, JSON.stringify(combinedData, null, 2));
        console.log('✅ Data synced from Supabase');
        
        res.json(combinedData);
    } catch (error) {
        console.error('⚠️ Supabase error, falling back to file:', error.message);
        try {
            // Fall back to local file
            const data = fs.readFileSync(DATA_FILE, 'utf8');
            res.json(JSON.parse(data));
        } catch (fileError) {
            res.status(500).json({ error: 'Failed to read data' });
        }
    }
});

app.post('/api/data', async (req, res) => {
    try {
        const { users, levels, pendingLevels, settings } = req.body;

        // Save to local file first
        fs.writeFileSync(DATA_FILE, JSON.stringify(req.body, null, 2));

        // Try to sync to Supabase
        console.log('📤 Syncing data to Supabase...');
        
        // Note: In production, you'd want to implement proper sync logic
        // For now, we'll just save to file and log the attempt
        console.log('✅ Data saved locally');
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Add user endpoint
app.post('/api/users', async (req, res) => {
    try {
        const { email, displayName, password } = req.body;
        const result = await SupabaseDB.addUser(email, displayName, password);
        
        if (result.success) {
            res.json({ success: true, user: result.user });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get user by email
app.get('/api/users/email/:email', async (req, res) => {
    try {
        const user = await SupabaseDB.getUserByEmail(req.params.email);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add level endpoint
app.post('/api/levels', async (req, res) => {
    try {
        const result = await SupabaseDB.addLevel(req.body);
        if (result.success) {
            res.json({ success: true, level: result.level });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add pending level endpoint
app.post('/api/pending', async (req, res) => {
    try {
        const result = await SupabaseDB.addPendingLevel(req.body);
        if (result.success) {
            res.json({ success: true, level: result.level });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve pending level
app.post('/api/pending/:id/approve', async (req, res) => {
    try {
        const result = await SupabaseDB.approvePendingLevel(req.params.id);
        if (result.success) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete level endpoint
app.delete('/api/levels/:id', async (req, res) => {
    try {
        const levelId = req.params.id;
        console.log(`🗑️ Deleting level: ${levelId}`);
        
        // Delete from Supabase
        const result = await SupabaseDB.deleteLevel(levelId);
        
        if (result.success) {
            // Also update local file
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            data.levels = data.levels.filter(l => String(l.id) !== String(levelId));
            fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            
            console.log(`✅ Level deleted successfully`);
            res.json({ success: true, message: 'Level deleted' });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error deleting level:', error);
        res.status(500).json({ error: error.message });
    }
});

// Update level position (for reordering)
app.put('/api/levels/:id/position', async (req, res) => {
    try {
        const levelId = req.params.id;
        const { position } = req.body;
        console.log(`📍 Updating level ${levelId} position to ${position}`);
        
        // Update in Supabase
        const result = await SupabaseDB.updateLevel(levelId, { position });
        
        if (result.success) {
            // Also update local file
            const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
            const level = data.levels.find(l => String(l.id) === String(levelId));
            if (level) {
                level.position = position;
                fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
            }
            
            console.log(`✅ Level position updated`);
            res.json({ success: true, message: 'Position updated' });
        } else {
            res.status(400).json({ success: false, message: result.message });
        }
    } catch (error) {
        console.error('Error updating position:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start server with Supabase initialization
initializeDataFile();

// Initialize Supabase connection
SupabaseDB.init().then(() => {
    console.log('🔗 Supabase connected');
}).catch(err => {
    console.warn('⚠️ Supabase connection issue:', err.message);
});

const LOCAL_IP = getLocalIP();
app.listen(PORT, '0.0.0.0', () => {
    console.log('╔════════════════════════════════════════╗');
    console.log('║  LCL - Level Challenge List Server     ║');
    console.log('║  (Supabase + Local File Backup)        ║');
    console.log('╠════════════════════════════════════════╣');
    console.log(`║  🚀 Server running on:                 ║`);
    console.log(`║  Local PC:                             ║`);
    console.log(`║  http://localhost:${PORT}                       ║`);
    console.log(`║                                        ║`);
    console.log(`║  🌐 Network Access (share with others): ║`);
    console.log(`║  http://${LOCAL_IP}:${PORT}${' '.repeat(40 - LOCAL_IP.length - String(PORT).length)}║`);
    console.log('║                                        ║');
    console.log('║  📍 How to connect from other devices: ║');
    console.log(`║  1. Make sure they're on same network   ║`);
    console.log(`║  2. Open browser                        ║`);
    console.log(`║  3. Type: http://${LOCAL_IP}:${PORT}${' '.repeat(40 - LOCAL_IP.length - String(PORT).length - 11)}║`);
    console.log('║                                        ║');
    console.log('║  ☁️  Database: Supabase                 ║');
    console.log('║  💾 Backup: Local file                 ║');
    console.log(`║  ${DATA_FILE}                          ║`);
    console.log('║                                        ║');
    console.log('╚════════════════════════════════════════╝');
});
