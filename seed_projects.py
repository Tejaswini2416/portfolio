import sqlite3

def seed():
    conn = sqlite3.connect('messages.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        tags TEXT NOT NULL,
        code_link TEXT NOT NULL,
        demo_link TEXT NOT NULL
    )''')
    
    # Check if empty
    c.execute("SELECT COUNT(*) FROM projects")
    if c.fetchone()[0] == 0:
        projects = [
            ("Early Glaucoma Diagnosis Using Quantum AI", "ML-based glaucoma risk prediction using image preprocessing, feature extraction, and quantum-inspired optimization on retinal datasets.", "Python,Machine Learning,Quantum AI", "https://github.com/Tejaswini2416/quantumeye", "https://quantumeye-x9rm.vercel.app/"),
            ("Smart Aadhaar Data Analysis", "Anomaly detection and duplicate identification on structured datasets. Achieved a 25% reduction in data processing time.", "Python,SQL,Data Analysis", "https://github.com/Tejaswini2416/Smart-Aadhaar-Analytics-Platform", "https://smart-aadhaar-analytics-platform-ms7xn6ryqfapoxe9vnaz9d.streamlit.app/"),
            ("AI Chatbot", "NLP-based chatbot with similarity retrieval and Flask backend for intelligent, responsive conversational workflows.", "Python,NLP,Flask", "https://github.com/Tejaswini2416/ai-chatbot-project", "https://visionary-praline-4a944e.netlify.app/")
        ]
        c.executemany("INSERT INTO projects (title, description, tags, code_link, demo_link) VALUES (?, ?, ?, ?, ?)", projects)
        conn.commit()
    conn.close()

if __name__ == "__main__":
    seed()
