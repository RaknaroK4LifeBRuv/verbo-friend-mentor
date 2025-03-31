
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageCircle, Mic, Play, ThumbsUp, ThumbsDown, Star, User, Bot, Volume2, Clock } from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
  completed: boolean;
  image?: string;
}

const RolePlay = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);

  const scenarios: Scenario[] = [
    {
      id: "1",
      title: "Ordering at a Restaurant",
      description: "Practice ordering food and drinks at a Spanish restaurant",
      difficulty: "beginner",
      tags: ["Food", "Service"],
      completed: true,
    },
    {
      id: "2",
      title: "Checking in at a Hotel",
      description: "Learn how to check in, ask about amenities, and handle issues",
      difficulty: "beginner",
      tags: ["Travel", "Service"],
      completed: false,
    },
    {
      id: "3",
      title: "Shopping for Clothes",
      description: "Practice shopping vocabulary, asking for sizes, and opinions",
      difficulty: "beginner",
      tags: ["Shopping", "Casual"],
      completed: false,
    },
    {
      id: "4",
      title: "Job Interview",
      description: "Prepare for a job interview in Spanish",
      difficulty: "intermediate",
      tags: ["Professional", "Formal"],
      completed: false,
    },
    {
      id: "5",
      title: "Medical Appointment",
      description: "Learn medical vocabulary and how to describe symptoms",
      difficulty: "intermediate",
      tags: ["Health", "Formal"],
      completed: false,
    },
    {
      id: "6",
      title: "Making New Friends",
      description: "Practice casual conversation and making social connections",
      difficulty: "beginner",
      tags: ["Social", "Casual"],
      completed: false,
    },
  ];

  const openScenario = (scenario: Scenario) => {
    setSelectedScenario(scenario);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  const mockDialogue = [
    { speaker: "AI", role: "Waiter", text: "¡Hola! Bienvenido a nuestro restaurante. ¿Tiene una reserva?" },
    { speaker: "User", role: "Customer", text: "Hola, no tengo reserva. ¿Hay una mesa disponible para dos personas?" },
    { speaker: "AI", role: "Waiter", text: "Sí, tenemos una mesa. Por favor, síganme. Aquí está el menú. ¿Qué les gustaría beber?" },
    { speaker: "User", role: "Customer", text: "Quisiera una agua mineral, por favor." },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Role-Play Scenarios</h1>
        <p className="text-muted-foreground">
          Practice real-life conversations with AI language partners
        </p>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Scenarios</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gray-100 h-32 flex items-center justify-center">
                    <MessageCircle className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{scenario.title}</h3>
                      {scenario.completed && (
                        <Badge className="bg-green-500">Completed</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {scenario.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge
                        variant="secondary"
                        className={getDifficultyColor(scenario.difficulty)}
                      >
                        {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                      </Badge>
                      {scenario.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      className="w-full bg-verbo-600 hover:bg-verbo-700"
                      onClick={() => openScenario(scenario)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {scenario.completed ? "Practice Again" : "Start Scenario"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {["beginner", "intermediate", "advanced", "completed"].map((filter) => (
          <TabsContent key={filter} value={filter} className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {scenarios
                .filter((s) => 
                  filter === "completed" 
                    ? s.completed 
                    : s.difficulty === filter
                )
                .map((scenario) => (
                  <Card key={scenario.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-gray-100 h-32 flex items-center justify-center">
                        <MessageCircle className="h-12 w-12 text-gray-400" />
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{scenario.title}</h3>
                          {scenario.completed && (
                            <Badge className="bg-green-500">Completed</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {scenario.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge
                            variant="secondary"
                            className={getDifficultyColor(scenario.difficulty)}
                          >
                            {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
                          </Badge>
                          {scenario.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          className="w-full bg-verbo-600 hover:bg-verbo-700"
                          onClick={() => openScenario(scenario)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {scenario.completed ? "Practice Again" : "Start Scenario"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog
        open={selectedScenario !== null}
        onOpenChange={(open) => !open && setSelectedScenario(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedScenario?.title}</DialogTitle>
            <DialogDescription>{selectedScenario?.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <Badge className={getDifficultyColor(selectedScenario?.difficulty || "beginner")}>
                  {selectedScenario?.difficulty}
                </Badge>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-gray-500" />
                <span className="text-muted-foreground">~10 minutes</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-500" />
                <span className="text-muted-foreground">Earn 50 XP</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Scenario Context:</h3>
              <p className="text-sm">
                You are at a restaurant in Madrid and need to order food. The AI will play the role
                of the waiter, and you'll practice ordering in Spanish. Try to use the vocabulary
                you've learned about food and dining.
              </p>
            </div>

            <div className="border rounded-lg">
              <div className="bg-gray-50 p-3 border-b">
                <h3 className="font-medium">Preview Dialogue</h3>
              </div>
              <div className="p-4 space-y-4 max-h-60 overflow-y-auto">
                {mockDialogue.map((message, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      message.speaker === "User" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.speaker === "User"
                          ? "bg-verbo-600 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs font-medium">
                          {message.role}
                          <span className="ml-1 opacity-70">({message.speaker})</span>
                        </div>
                        {message.speaker === "AI" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full -mr-1"
                          >
                            <Volume2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setSelectedScenario(null)}>
              Cancel
            </Button>
            <Button className="bg-verbo-600 hover:bg-verbo-700">
              <Play className="h-4 w-4 mr-2" />
              Begin Role-Play
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolePlay;
