
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Send, Volume2, Pause } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  audioUrl?: string;
  timestamp: Date;
  pronunciation?: {
    score: number;
    feedback?: string;
  };
}

// Mock AI responses for demo
const mockResponses = [
  "¡Hola! ¿Cómo estás hoy?",
  "¿Cuál es tu comida favorita?",
  "Me gusta mucho hablar contigo. Estás mejorando muy rápido.",
  "¿Qué hiciste el fin de semana pasado?",
  "Excelente pronunciación. Sigamos practicando.",
  "Vamos a hablar sobre tus pasatiempos. ¿Qué te gusta hacer en tu tiempo libre?",
];

const Conversations = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "¡Hola! Soy tu tutor de español. ¿Cómo estás hoy?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mock speech recognition
  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate recording for 3 seconds
      setTimeout(() => {
        const randomText = ["Hola, ¿cómo estás?", "Me gusta aprender español", "Buenos días", "Gracias por ayudarme"][
          Math.floor(Math.random() * 4)
        ];
        setInputText(randomText);
        setIsRecording(false);
      }, 3000);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
  
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputText,
      timestamp: new Date(),
      pronunciation: {
        score: Math.floor(Math.random() * 40) + 60, // Random score between 60-100
      },
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
  
    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // Simulate text-to-speech for AI messages
  const playMessage = (message: Message) => {
    if (isPlaying) {
      setIsPlaying(false);
      return;
    }
    
    setIsPlaying(true);
    
    // Simulate audio playing for 3 seconds
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Conversations</h1>
          <p className="text-muted-foreground">Practice your Spanish with AI conversation</p>
        </div>
        <Tabs defaultValue="free">
          <TabsList>
            <TabsTrigger value="free">Free Conversation</TabsTrigger>
            <TabsTrigger value="guided">Guided Topics</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 p-0 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn("flex", {
                    "justify-end": message.sender === "user",
                  })}
                >
                  <div
                    className={cn("max-w-[80%] rounded-lg p-4", {
                      "bg-verbo-600 text-white": message.sender === "user",
                      "bg-gray-100": message.sender === "ai",
                    })}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">
                        {message.sender === "user" ? "You" : "VerboAI"}
                      </span>
                      {message.sender === "ai" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 rounded-full"
                          onClick={() => playMessage(message)}
                        >
                          {isPlaying ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Volume2 className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                    <p className="mt-1">{message.text}</p>
                    {message.sender === "user" && message.pronunciation && (
                      <div className="mt-2 pt-2 border-t border-white/20">
                        <div className="flex items-center justify-between text-xs">
                          <span>Pronunciation: {message.pronunciation.score}%</span>
                          <span className={cn({
                            "text-green-200": message.pronunciation.score >= 80,
                            "text-yellow-200": message.pronunciation.score >= 60 && message.pronunciation.score < 80,
                            "text-red-200": message.pronunciation.score < 60,
                          })}>
                            {message.pronunciation.score >= 80 ? "Excellent" : 
                             message.pronunciation.score >= 60 ? "Good" : "Needs Practice"}
                          </span>
                        </div>
                        <Progress 
                          value={message.pronunciation.score} 
                          className="h-1 mt-1"
                          indicatorClassName={cn({
                            "bg-green-400": message.pronunciation.score >= 80,
                            "bg-yellow-400": message.pronunciation.score >= 60 && message.pronunciation.score < 80,
                            "bg-red-400": message.pronunciation.score < 60,
                          })}
                        />
                      </div>
                    )}
                    <div className="mt-1 text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t p-4 flex gap-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={toggleRecording}
              className={cn("flex-shrink-0", {
                "animate-pulse": isRecording,
              })}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Type or speak your message..."
              className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-verbo-500 focus:border-transparent"
            />
            <Button onClick={handleSendMessage} className="flex-shrink-0 bg-verbo-600 hover:bg-verbo-700">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Conversations;
