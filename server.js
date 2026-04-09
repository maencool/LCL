import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// API: Get all data
app.get(['/api/data', '/api/public-data'], async (req, res) => {
    try {
        const [users, levels, settings] = await Promise.all([
            supabase.from('users').select('*'),
            supabase.from('levels').select('*').order('id', { ascending: true }),
            supabase.from('settings').select('*').limit(1).single()
        ]);
        res.json({
            users: users.data || [],
            levels: levels.data?.filter(l => l.status === 'approved') || [],
            pendingLevels: levels.data?.filter(l => l.status === 'pending') || [],
            settings: settings.data || { theme: 'dark' }
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// API: Save data (Register / Admin updates)
app.post(['/api/data', '/api/public-data'], async (req, res) => {
    try {
        const { users, levels, settings } = req.body;
        if (users) await supabase.from('users').upsert(users);
        if (levels) await supabase.from('levels').upsert(levels);
        if (settings) await supabase.from('settings').upsert(settings);
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));