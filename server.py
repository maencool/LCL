#!/usr/bin/env python3
"""
Simple Python server for LCL - Syncs data across browsers
No npm or Node.js required!
"""

import json
import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import threading
import time

DATA_FILE = 'lcl_data.json'
PORT = 3000

def load_data():
    """Load data from file or create default"""
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    
    return {
        "users": [
            {
                "id": "admin1",
                "email": "maencopra@gmail.com",
                "displayName": "Admin",
                "password": "maenissocool12345gGs",
                "isAdmin": True
            }
        ],
        "levels": [
            {
                "id": 1,
                "name": "Stereo Madness",
                "levelId": 1,
                "url": "https://example.com/level1",
                "youtubeUrl": "https://youtube.com/watch?v=example1",
                "thumbnail": "https://via.placeholder.com/300x200?text=Stereo+Madness",
                "difficulty": "Easy",
                "submittedBy": "Admin",
                "submittedDate": time.strftime('%Y-%m-%dT%H:%M:%S'),
                "status": "approved"
            }
        ],
        "pendingLevels": [],
        "settings": {
            "theme": "dark",
            "language": "en",
            "darkBackground": True
        }
    }

def save_data(data):
    """Save data to file"""
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

# Load initial data
current_data = load_data()
save_data(current_data)

class LCLHandler(SimpleHTTPRequestHandler):
    """HTTP Request Handler with API support"""
    
    def do_GET(self):
        """Handle GET requests"""
        if self.path == '/api/data':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            global current_data
            self.wfile.write(json.dumps(current_data).encode())
        else:
            # Serve static files
            super().do_GET()
    
    def do_POST(self):
        """Handle POST requests"""
        if self.path == '/api/data':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            
            try:
                global current_data
                current_data = json.loads(body.decode())
                save_data(current_data)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"success": True}).encode())
                print(f"✅ Data saved at {time.strftime('%H:%M:%S')}")
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_response(404)
            self.end_headers()
    
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def log_message(self, format, *args):
        """Suppress default logging"""
        return

def run_server():
    """Start the server"""
    server_address = ('', PORT)
    httpd = HTTPServer(server_address, LCLHandler)
    
    print("╔════════════════════════════════════════╗")
    print("║  LCL - Level Challenge List Server     ║")
    print("║  (Python Edition - No npm needed!)     ║")
    print("╠════════════════════════════════════════╣")
    print(f"║  🚀 Server running on:                 ║")
    print(f"║  http://localhost:{PORT}                       ║")
    print("║                                        ║")
    print("║  📍 Open in all browsers:              ║")
    print(f"║  Edge: http://localhost:{PORT}         ║")
    print(f"║  Brave: http://localhost:{PORT}        ║")
    print(f"║  Chrome: http://localhost:{PORT}       ║")
    print("║                                        ║")
    print("║  💾 Data file:                         ║")
    print(f"║  {os.path.abspath(DATA_FILE)}")
    print("║                                        ║")
    print("║  ✅ All data is shared across browsers! ║")
    print("║  Press Ctrl+C to stop server           ║")
    print("╚════════════════════════════════════════╝\n")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\n🛑 Server stopped")
        print(f"✅ All data saved to: {os.path.abspath(DATA_FILE)}")
        print("👋 Goodbye!")

if __name__ == '__main__':
    run_server()
