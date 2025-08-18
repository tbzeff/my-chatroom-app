import Chatroom from "./components/Chatroom";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white px-4">
      <div className="flex-1 flex items-center justify-center">
        <Chatroom />
      </div>
      <div className="bg-yellow-200 text-black p-2 text-center text-sm space-y-1">
        <div><strong>This is a portfolio demo.</strong> Do not share personal information.</div>
        <div><strong>Username is only saved for your current browser session.</strong> You'll need to set it again if you close or reload your browser.</div>
        <div><strong>Server wake-up delay:</strong> The chat server is hosted on Render's free tier. If it has been inactive, it may take up to 50 seconds to respond when you first connect.</div>
        <div>No guarantee of message delivery or uptime.</div>
        <div>Messages are not moderated or filtered. Please use responsibly.</div>
        <div>Do not share passwords, financial, or sensitive data.</div>
        <div>GIF search is subject to Giphy API rate limits and may be temporarily unavailable.</div>
        <div>This project is open source and under active development. Features and data handling may change at any time.</div>
      </div>
      <a
        href="https://github.com/tbzeff"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline text-center block mt-2 mb-2"
      >
        View my GitHub repository for more information
      </a>
    </div>
  );
}

export default App;
