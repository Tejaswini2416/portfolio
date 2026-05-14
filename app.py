# pyrefly: ignore [missing-import]
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import sqlite3
import datetime
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import threading
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

DB_NAME = 'messages.db'

def send_email_async(name, email, message_body):
    """Sends an email notification in the background."""
    receiver_email = "tejaswinikummari17@gmail.com"
    sender_email = os.environ.get('MAIL_USERNAME', receiver_email)
    sender_password = os.environ.get('MAIL_PASSWORD')
    
    if not sender_password:
        print("Warning: MAIL_PASSWORD environment variable not set. Email notification skipped.")
        return
        
    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = receiver_email
    msg['Subject'] = f"New Portfolio Contact from {name}"
    msg.add_header('reply-to', email)
    
    body = f"Name: {name}\nEmail: {email}\n\nMessage:\n{message_body}"
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        server.send_message(msg)
        server.quit()
        print("Email notification sent successfully.")
    except Exception as e:
        print(f"Failed to send email notification: {e}")

def init_db():
    """Initialize the SQLite database and create the messages table if it doesn't exist."""
    conn = sqlite3.connect(DB_NAME)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            message TEXT NOT NULL,
            timestamp TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
    
    # Also initialize projects database
    import seed_projects
    seed_projects.seed()

# Initialize DB on startup
init_db()

@app.route('/')
def index():
    """Serve the main portfolio page."""
    is_admin = request.args.get('dev') == 'true'
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    projects = conn.execute("SELECT * FROM projects ORDER BY id ASC").fetchall()
    conn.close()
    return render_template('index.html', projects=projects, is_admin=is_admin)

@app.route('/admin', methods=['GET', 'POST'])
def admin():
    """Admin panel to add new projects."""
    if request.method == 'POST':
        title = request.form.get('title')
        description = request.form.get('description')
        tags = request.form.get('tags')
        code_link = request.form.get('code_link')
        demo_link = request.form.get('demo_link')
        
        if title and description:
            conn = sqlite3.connect(DB_NAME)
            conn.execute("INSERT INTO projects (title, description, tags, code_link, demo_link) VALUES (?, ?, ?, ?, ?)",
                         (title, description, tags, code_link, demo_link))
            conn.commit()
            conn.close()
            return "<script>alert('Project added successfully!'); window.location.href='/';</script>"
            
    return render_template('admin.html')

@app.route('/contact', methods=['POST'])
def contact():
    """Handle contact form submissions."""
    data = request.get_json()
    
    if not data:
        return jsonify({'status': 'error', 'message': 'No data provided'}), 400
    
    name = data.get('name')
    email = data.get('email')
    message = data.get('message')
    
    # Basic validation
    if not name or not email or not message:
        return jsonify({'status': 'error', 'message': 'All fields are required'}), 400
        
    try:
        conn = sqlite3.connect(DB_NAME)
        cursor = conn.cursor()
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        cursor.execute(
            'INSERT INTO messages (name, email, message, timestamp) VALUES (?, ?, ?, ?)',
            (name, email, message, timestamp)
        )
        conn.commit()
        conn.close()
        
        # Send email notification asynchronously
        threading.Thread(target=send_email_async, args=(name, email, message)).start()
        
        return jsonify({'status': 'success', 'message': 'Message sent successfully!'}), 200
        
    except Exception as e:
        print(f"Error saving message: {e}")
        return jsonify({'status': 'error', 'message': 'Internal server error'}), 500

if __name__ == '__main__':
    # Run the Flask app on localhost:5000
    app.run(host='127.0.0.1', port=5000, debug=True)
