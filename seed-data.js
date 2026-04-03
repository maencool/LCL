#!/usr/bin/node
/**
 * Seed Script - Populates Supabase database with sample data
 * 
 * Run: node seed-data.js
 * 
 * This adds:
 * - Sample users
 * - Approved levels (with leaderboard data)
 * - Pending levels (awaiting approval)
 * - Settings
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sampleUsers = [
    {
        id: 'user_admin_1',
        email: 'admin@lcl.com',
        displayname: 'Admin',
        password: 'admin123',
        isadmin: true,
        createdat: new Date().toISOString()
    },
    {
        id: 'user_leaderboard_1',
        email: 'player1@lcl.com',
        displayname: 'SpeedRunner',
        password: 'password123',
        isadmin: false,
        createdat: new Date(Date.now() - 30*24*60*60*1000).toISOString()
    },
    {
        id: 'user_leaderboard_2',
        email: 'player2@lcl.com',
        displayname: 'ProGamer',
        password: 'password123',
        isadmin: false,
        createdat: new Date(Date.now() - 20*24*60*60*1000).toISOString()
    },
    {
        id: 'user_leaderboard_3',
        email: 'player3@lcl.com',
        displayname: 'CasualPlayer',
        password: 'password123',
        isadmin: false,
        createdat: new Date(Date.now() - 10*24*60*60*1000).toISOString()
    }
];

const sampleLevels = [
    {
        id: 'level_1',
        name: 'Stereo Madness',
        levelid: 1,
        url: 'https://example.com/stereo-madness',
        youtubeurl: 'https://youtube.com/watch?v=example1',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%224a90e2%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22%3EStereo Madness%3C/text%3E%3C/svg%3E',
        difficulty: 'Easy',
        submittedby: 'Admin',
        submitteddate: new Date(Date.now() - 90*24*60*60*1000).toISOString(),
        status: 'approved',
        leaderboard_positions: 3
    },
    {
        id: 'level_2',
        name: 'Back on Track',
        levelid: 2,
        url: 'https://example.com/back-on-track',
        youtubeurl: 'https://youtube.com/watch?v=example2',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%2350c878%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22%3EBack on Track%3C/text%3E%3C/svg%3E',
        difficulty: 'Easy',
        submittedby: 'Admin',
        submitteddate: new Date(Date.now() - 80*24*60*60*1000).toISOString(),
        status: 'approved',
        leaderboard_positions: 2
    },
    {
        id: 'level_3',
        name: 'Cant Let It Go',
        levelid: 3,
        url: 'https://example.com/cant-let-it-go',
        youtubeurl: 'https://youtube.com/watch?v=example3',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%22ff6b6b%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2218%22%3ECant Let It Go%3C/text%3E%3C/svg%3E',
        difficulty: 'Normal',
        submittedby: 'SpeedRunner',
        submitteddate: new Date(Date.now() - 70*24*60*60*1000).toISOString(),
        status: 'approved',
        leaderboard_positions: 1
    },
    {
        id: 'level_4',
        name: 'Jumper',
        levelid: 4,
        url: 'https://example.com/jumper',
        youtubeurl: 'https://youtube.com/watch?v=example4',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%23ffd93d%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23333%22 font-size=%2220%22%3EJumper%3C/text%3E%3C/svg%3E',
        difficulty: 'Normal',
        submittedby: 'ProGamer',
        submitteddate: new Date(Date.now() - 60*24*60*60*1000).toISOString(),
        status: 'approved',
        leaderboard_positions: 2
    },
    {
        id: 'level_5',
        name: 'Time Machine',
        levelid: 5,
        url: 'https://example.com/time-machine',
        youtubeurl: 'https://youtube.com/watch?v=example5',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%239d4edd%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2218%22%3ETime Machine%3C/text%3E%3C/svg%3E',
        difficulty: 'Hard',
        submittedby: 'CasualPlayer',
        submitteddate: new Date(Date.now() - 45*24*60*60*1000).toISOString(),
        status: 'approved',
        leaderboard_positions: 1
    }
];

const samplePendingLevels = [
    {
        id: 'pending_1',
        name: 'Cycles',
        levelid: 6,
        url: 'https://example.com/cycles',
        youtubeurl: 'https://youtube.com/watch?v=example6',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%231a535c%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22%3ECycles%3C/text%3E%3C/svg%3E',
        difficulty: 'Hard',
        submittedby: 'SpeedRunner',
        submitteddate: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
        status: 'pending'
    },
    {
        id: 'pending_2',
        name: 'xStep',
        levelid: 7,
        url: 'https://example.com/xstep',
        youtubeurl: 'https://youtube.com/watch?v=example7',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%234ecdc4%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22white%22 font-size=%2220%22%3ExStep%3C/text%3E%3C/svg%3E',
        difficulty: 'Harder',
        submittedby: 'ProGamer',
        submitteddate: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
        status: 'pending'
    },
    {
        id: 'pending_3',
        name: 'Clubstep',
        levelid: 8,
        url: 'https://example.com/clubstep',
        youtubeurl: 'https://youtube.com/watch?v=example8',
        thumbnail: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22200%22%3E%3Crect fill=%2366d9ef%22 width=%22300%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23333%22 font-size=%2218%22%3EClubstep%3C/text%3E%3C/svg%3E',
        difficulty: 'Insane',
        submittedby: 'CasualPlayer',
        submitteddate: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
        status: 'pending'
    }
];

const defaultSettings = {
    id: 'default',
    theme: 'dark',
    language: 'en',
    darkbackground: true
};

async function seedDatabase() {
    console.log('🌱 Seeding Supabase database with sample data...\n');

    try {
        // Seed Users
        console.log('👥 Adding users...');
        for (const user of sampleUsers) {
            const { error } = await supabase
                .from('users')
                .insert([user])
                .select();
            
            if (error && !error.message.includes('duplicate')) {
                console.error(`   ❌ Error adding user ${user.displayname}:`, error.message);
            } else {
                console.log(`   ✅ ${user.displayname}`);
            }
        }

        // Seed Approved Levels
        console.log('\n📊 Adding approved levels...');
        for (const level of sampleLevels) {
            const { error } = await supabase
                .from('levels')
                .insert([level])
                .select();
            
            if (error && !error.message.includes('duplicate')) {
                console.error(`   ❌ Error adding level ${level.name}:`, error.message);
            } else {
                console.log(`   ✅ ${level.name}`);
            }
        }

        // Seed Pending Levels
        console.log('\n⏳ Adding pending levels...');
        for (const pending of samplePendingLevels) {
            const { error } = await supabase
                .from('pending_levels')
                .insert([pending])
                .select();
            
            if (error && !error.message.includes('duplicate')) {
                console.error(`   ❌ Error adding pending level ${pending.name}:`, error.message);
            } else {
                console.log(`   ✅ ${pending.name} (pending)`);
            }
        }

        // Seed Settings
        console.log('\n⚙️  Adding settings...');
        const { error: settingsError } = await supabase
            .from('settings')
            .upsert([defaultSettings])
            .select();
        
        if (settingsError) {
            console.error('   ❌ Error adding settings:', settingsError.message);
        } else {
            console.log('   ✅ Default settings');
        }

        console.log('\n' + '='.repeat(50));
        console.log('\n✅ Database seeding complete!\n');
        console.log('📊 Data added:');
        console.log(`   - ${sampleUsers.length} users (including 1 admin)`);
        console.log(`   - ${sampleLevels.length} approved levels (with leaderboard data)`);
        console.log(`   - ${samplePendingLevels.length} pending levels (awaiting approval)`);
        console.log(`   - 1 settings configuration\n`);
        console.log('🚀 You can now start the server and see the data!\n');

    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
}

seedDatabase();
