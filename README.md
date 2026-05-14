# Tejaswini Kummari - Data Science Engineer Portfolio

A modern, responsive, and dynamic personal portfolio website built with Python (Flask) and SQLite. Designed with a sleek dark theme, purple accents, and smooth scroll animations.

![Portfolio Preview](static/images/WhatsApp%20Image%202026-05-14%20at%202.05.24%20PM.jpeg)

## 🚀 Features

*   **Dynamic Projects Database:** A custom SQLite database backend that renders projects dynamically on the homepage.
*   **Hidden Admin Panel:** A secret `/admin` route allows the developer to add new projects via a sleek UI without touching the HTML code.
*   **Modern UI/UX:** Features a dynamic typing animation, smooth IntersectionObserver scroll animations, glowing gradients, and customized percentage skill bars.
*   **Seamless Contact Form:** Integrated with FormSubmit.co for direct email delivery to the inbox—completely bypassing the need for complex backend SMTP setups.
*   **Responsive Design:** Fully optimized for mobile, tablet, and desktop viewing.

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3 (Vanilla CSS, custom variables, animations), JavaScript (ES6)
*   **Backend:** Python, Flask
*   **Database:** SQLite3
*   **Email Delivery:** FormSubmit.co API

## 📋 Installation & Local Setup

To run this project locally on your machine, follow these steps:

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Tejaswini2416/portfolio.git
    cd portfolio
    ```

2.  **Install Dependencies**
    Ensure you have Python installed. Then, run:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Initialize the Database**
    Run the seed script to create the SQLite database and populate it with the default projects.
    ```bash
    python seed_projects.py
    ```

4.  **Start the Server**
    Launch the Flask application:
    ```bash
    python app.py
    ```
    The website will be live at `http://127.0.0.1:5000`.

## 🔐 How to Use the Admin Panel

To keep the "Add New Project" button hidden from normal visitors, it requires a secret URL parameter.

1.  Ensure your local server is running.
2.  Navigate to exactly: `http://127.0.0.1:5000/?dev=true`
3.  Scroll down to the **Featured Projects** section.
4.  You will now see a purple **Add New Project** button. Clicking it takes you to the `/admin` form where you can save new projects directly to the database!

## 📬 Contact Form Setup (FormSubmit)

The contact form is pre-configured to send emails to `tejaswinikummari17@gmail.com`.
**Important Note:** The very first time the form is submitted on a new domain/localhost, FormSubmit will send an activation email to that address. You must click **"Activate"** in that email before it will start forwarding messages.

## 📄 License

This project is open-source and available under the MIT License.
