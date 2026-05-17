"use client";

import { Header } from "@/components/Header";
import { BottomNav } from "@/components/BottomNav";
import { ChatInterface } from "@/components/ChatInterface";
import { DebugPanel } from "@/components/DebugPanel";

export default function ChatPage() {
  return (
    <>
      <Header />
      <div style={{ padding: "0 20px 20px" }}>
        <ChatInterface />
      </div>
      <DebugPanel />
      <BottomNav />
    </>
  );
}
