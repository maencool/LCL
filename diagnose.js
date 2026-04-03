#!/usr/bin/node
/**
 * Diagnostic Script - Checks if your Supabase + Railway setup is correct
 * 
 * Run: node diagnose.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 LCL Database Setup Diagnostic Tool\n');
console.log('=' .repeat(50));

// Load environment
require('dotenv').config();

const checks = {
    passed: 0,
    failed: 0,
    warnings: 0
};

function pass(message) {
    console.log('✅ ' + message);
    checks.passed++;
}

function fail(message) {
    console.log('❌ ' + message);
    checks.failed++;
}

function warn(message) {
    console.log('⚠️  ' + message);
    checks.warnings++;
}

// Check 1: .env file exists
console.log('\n📋 Configuration Files:\n');
if (fs.existsSync(path.join(__dirname, '.env'))) {
    pass('.env file exists');
} else {
    fail('.env file not found - Create one with: cp .env.example .env');
}

if (fs.existsSync(path.join(__dirname, '.env.example'))) {
    pass('.env.example template exists');
} else {
    warn('.env.example not found');
}

// Check 2: Environment variables
console.log('\n🔑 Environment Variables:\n');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const PORT = process.env.PORT || 3000;

if (SUPABASE_URL) {
    pass(`SUPABASE_URL is set: ${SUPABASE_URL.substring(0, 20)}...`);
} else {
    fail('SUPABASE_URL is not set (required)');
}

if (SUPABASE_KEY) {
    pass(`SUPABASE_KEY is set: ${SUPABASE_KEY.substring(0, 20)}...`);
} else {
    fail('SUPABASE_KEY is not set (required)');
}

pass(`PORT is set to: ${PORT}`);

// Check 3: Dependencies
console.log('\n📦 Dependencies:\n');

const packageJson = require('./package.json');
const requiredDeps = ['express', '@supabase/supabase-js', 'dotenv'];

requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
        pass(`${dep} is in package.json`);
    } else {
        fail(`${dep} is not in package.json dependencies`);
    }
});

if (fs.existsSync(path.join(__dirname, 'node_modules'))) {
    pass('node_modules/ exists');
} else {
    warn('node_modules/ not found - Run: npm install');
}

// Check 4: Server files
console.log('\n📁 Project Files:\n');

const requiredFiles = ['server.js', 'supabase.js', 'app.js', 'auth.js', 'storage.js'];

requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
        pass(`${file} exists`);
    } else {
        fail(`${file} not found`);
    }
});

// Check 5: Connection test
console.log('\n🔗 Supabase Connection Test:\n');

if (SUPABASE_URL && SUPABASE_KEY) {
    try {
        const { createClient } = require('@supabase/supabase-js');
        const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
        
        pass('Supabase client initialized');
        
        // Try a simple query
        supabase
            .from('users')
            .select('count')
            .limit(1)
            .then(({ data, error }) => {
                if (error) {
                    fail(`Database query failed: ${error.message}`);
                    console.log('   This usually means:');
                    console.log('   1. Tables are not created in Supabase');
                    console.log('   2. API credentials are invalid');
                    console.log('   3. Supabase project is deleted or sleeping');
                } else {
                    pass('Database tables are accessible');
                }
                
                printSummary();
            })
            .catch(err => {
                fail(`Connection error: ${err.message}`);
                printSummary();
            });
    } catch (error) {
        fail(`Supabase client error: ${error.message}`);
        printSummary();
    }
} else {
    warn('Skipping connection test - Missing credentials');
    printSummary();
}

function printSummary() {
    console.log('\n' + '=' .repeat(50));
    console.log('\n📊 Summary:\n');
    console.log(`✅ Passed: ${checks.passed}`);
    console.log(`❌ Failed: ${checks.failed}`);
    console.log(`⚠️  Warnings: ${checks.warnings}`);
    
    console.log('\n' + '=' .repeat(50));
    
    if (checks.failed === 0) {
        console.log('\n🎉 All checks passed! Your setup looks good.\n');
        console.log('Next steps:');
        console.log('1. Run: npm install');
        console.log('2. Run: npm start');
        console.log('3. Visit: http://localhost:3000\n');
    } else {
        console.log('\n⚠️  Please fix the failed checks above.\n');
        console.log('📖 For help, see:');
        console.log('   - RAILWAY_DEPLOYMENT.md (for Railway deployment)');
        console.log('   - SUPABASE_SETUP.md (for Supabase setup)');
        console.log('   - .env.example (for configuration template)\n');
    }
}
