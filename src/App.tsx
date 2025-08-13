import Chatroom from "./components/Chatroom";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white px-4">
      <div className="bg-yellow-200 text-black p-2 text-center text-sm">
        This is a portfolio demo. Do not share personal information.
      </div>
      <a
        href="https://github.com/tbzeff"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-400 underline text-center block mt-2 mb-2"
      >
        View my GitHub repository for more information
      </a>
      <div className="flex-1 flex items-center justify-center">
        <Chatroom />
      </div>
    </div>
  );
}

export default App;
