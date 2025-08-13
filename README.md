
# Chatroom App

A simple, real-time chatroom web application built with **React**, **TypeScript**, **Socket.IO**, and **Tailwind CSS**, designed for extensibility and showcasing modern frontend development practices.

## 🚀 Live Demo

[https://my-chatroom-app-client.onrender.com](https://my-chatroom-app-client.onrender.com)


## 🌐 Features

- Real-time messaging via WebSockets
- Persistent username using `localStorage`
- Typing indicators
- GIF search and sharing powered by Giphy
- Responsive and styled with Tailwind CSS
- Built with performance and modularity in mind

## 🛠️ Tech Stack

- **Frontend Framework:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Build Tool:** Vite
- **WebSocket:** socket.io-client
- **GIF Search:** Giphy API

## 📁 Project Structure

```
my-chatroom-app/
├── public/
├── server/
│   ├── server.js
├── src/
│   ├── components/
│   │   └── Chatroom.tsx
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
```

## 🚀 Getting Started

These instructions will get the development environment running locally.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (v9+)

### Installation

1. **Clone the repository** (or place this README in your working directory):

   ```bash
   git clone https://github.com/tbzeff/my-chatroom-app.git
   cd my-chatroom-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:5173`

### Optional: Lint the code

```bash
npm run lint
```

## 🎬 GIF Search & Giphy API Usage

This project integrates GIF search and sharing using the [Giphy API](https://developers.giphy.com/). All GIFs are subject to Giphy's [Terms of Service](https://support.giphy.com/hc/en-us/articles/360020027752-GIPHY-API-Terms-of-Service) and branding requirements.

- **Rate Limit:** The default Giphy API key included for development is limited to **100 API calls per hour** (shared across all users of the deployed app).
- If you plan to deploy this app publicly or expect heavy usage, [register your own Giphy API key](https://developers.giphy.com/dashboard/) and update the key in the codebase.
- If the rate limit is exceeded, GIF search will temporarily stop working until the next hour.
- For security, **do not commit your personal or production Giphy API key to a public repository**.

## 🧪 Backend Setup (for testing)

Ensure you have a basic Socket.IO server running on port **3002**, as the client is configured to connect to `http://localhost:3002`. Here is a minimal example of a `server.js` (although there is a 'server.js' included in the repository):

```js
// server.js
import { createServer } from 'http';
import { Server } from 'socket.io';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing');
  });
});

httpServer.listen(3002, () => {
  console.log('Socket.IO server running on http://localhost:3002');
});
```

Run it with:

```bash
node server.js
```

## 👤 Author

Taylor Bleizeffer
- **https://www.taylorbleizeffer.com**
- **https://github.com/tbzeff**

##
- [Disclaimer](./DISCLAIMER.md)
- [Privacy Policy](./PRIVACY.md)
