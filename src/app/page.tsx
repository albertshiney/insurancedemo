import ChatInterface from '../components/chat-interface'; // Adjusted import path

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-6xl"> {/* Adjusted the width here */}
        <ChatInterface />
      </div>
    </div>
  );
}
