# InvestLens - Automated Investment Thesis Generator

An advanced full-stack application designed to automate the initial screening of startup pitch decks. This platform accepts a PowerPoint presentation, uses AI to analyze its content against nine key investment criteria, and generates a detailed, structured investment thesis in PDF format.

## Live Demo & Video


## Key Features

*   **Full User Authentication:** Secure user registration and login with both email/password and Google OAuth 2.0.
*   **Dynamic File Processing:** Accepts `.pptx` uploads, extracting text from both standard slides and images using a Python backend with Tesseract OCR.
*   **AI-Powered Analysis:** Leverages the Google Gemini API with sophisticated prompt engineering to evaluate the pitch deck across 9 categories, assigning scores and generating qualitative feedback.
*   **Automated PDF Reporting:** Dynamically generates a professional, multi-page PDF report from the AI analysis results.
*   **Cloud Integration:**
    *   **AWS S3:** All generated reports are securely stored in an AWS S3 bucket for scalable, persistent access.
    *   **SendGrid:** Users receive an email notification with a direct download link to their report upon completion.
*   **Containerized & Production-Ready:** The entire application stack (React Frontend, Node.js Backend, PostgreSQL Database) is fully containerized using Docker and Docker Compose for consistency and easy deployment.

## Technologies Used

| Category      | Technology                                    |
|---------------|-----------------------------------------------|
| **Frontend**  | React.js, Material-UI (MUI), Axios            |
| **Backend**   | Node.js, Express.js, Sequelize, Passport.js   |
| **Database**  | PostgreSQL                                    |
| **AI & ML**   | Google Gemini API, Tesseract (via `pytesseract`) |
| **Cloud**     | AWS S3, SendGrid                              |
| **DevOps**    | Docker, Docker Compose, Nginx                 |
| **Python**    | `python-pptx`, `Pillow`                         |

## Local Setup & Installation

To run this project on your local machine, please follow these steps:

**1. Prerequisites:**
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
*   [Git](https://git-scm.com/) installed.

**2. Clone the Repository:**
```bash
git clone [Your-GitHub-Repo-URL]
cd [your-project-folder]
