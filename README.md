# Crypto News Farsi Publisher

This is an automated tool to fetch the latest crypto news, process it using the Gemini AI for humanization, Farsi translation, and viral titling, and then publish it to a Telegram channel. The automation can be configured to run periodically (e.g., every 30 minutes) or can be triggered manually through a web interface.

This project is packaged with Docker, making it easy to deploy on any VPS or server that supports Docker.

## Features

- **Automated News Pipeline**: Fetches, processes, and publishes news without manual intervention.
- **Gemini AI Integration**: Leverages Google's Gemini Pro to:
    - Rewrite news content in a more human, conversational tone.
    - Translate articles into fluent Farsi.
    - Generate catchy, viral titles.
- **Telegram Integration**: Publishes formatted news directly to a specified Telegram channel.
- **Web-based Control Panel**: A simple UI to start/stop the automation, trigger manual runs, and view activity logs and news previews in real-time.
- **Deploy-Ready**: Comes with a `Dockerfile` for easy, one-command deployment on a VPS.

## Prerequisites

- **Docker**: You must have Docker installed on your local machine and on your deployment server/VPS. [Install Docker](https://docs.docker.com/engine/install/)
- **Node.js**: (Optional, for local development without Docker) Node.js v18 or later.
- **Gemini API Key**: You need a valid API key for the Gemini API. [Get an API Key](https://ai.google.dev/gemini-api/docs/api-key)

---

## 🚀 Deployment Guide (VPS with Docker)

This is the recommended way to deploy the application.

### Step 1: Clone the Repository on Your VPS

Connect to your VPS and clone your GitHub repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### Step 2: Create the Environment File

The application is configured using environment variables. Create a `.env` file in the root of the project:

```bash
nano .env
```

Add your Gemini API key to this file:

```
# .env file
GEMINI_API_KEY=your_gemini_api_key_here
```

Save the file (Ctrl+O, Enter, then Ctrl+X in `nano`).

### Step 3: Build and Run the Docker Container

Build the Docker image:

```bash
docker build -t crypto-news-publisher .
```

Run the container in detached mode (`-d`), map port 80 to the container's port 3000 (`-p 80:3000`), pass the environment file (`--env-file .env`), and ensure it restarts automatically (`--restart always`):

```bash
docker run -d -p 80:3000 --env-file .env --restart always --name crypto-publisher crypto-news-publisher
```

Your application is now running! You can access the control panel by visiting your VPS's IP address or domain name in a web browser.

### Step 4: Viewing Logs (Optional)

To see the live logs from your running container:

```bash
docker logs -f crypto-publisher
```

---

## 💻 Local Development

### Using Docker (Recommended)

1.  **Clone the repository.**
2.  **Create `.env` file:** Create the `.env` file as described in Step 2 above.
3.  **Build and Run:**
    ```bash
    docker build -t crypto-news-publisher .
    docker run -p 3000:3000 --env-file .env --name crypto-publisher-dev crypto-news-publisher
    ```
4.  Access the app at `http://localhost:3000`.

### Without Docker

1.  **Clone the repository.**
2.  **Install dependencies:** `npm install`
3.  **Create `.env` file** as described above.
4.  **Build the frontend:** `npm run build`
5.  **Start the server:** `npm start`
6.  Access the app at `http://localhost:3000`.

---

### Project Structure Notes

-   **`public/`**: Contains the built frontend assets.
-   **`server/`**: Contains the backend Express server and service logic.
-   **`components/`**: React components for the frontend.
-   **`Dockerfile`**: Defines the container for deployment.
-   The client-side `services/` directory has been removed as all API interactions are now handled by the backend server for security and reliability.
