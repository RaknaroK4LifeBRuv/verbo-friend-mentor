
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, BookOpen, Book, Clock } from "lucide-react";
import React from "react";

interface PracticeProps {
  toast: any;
  logUserActivity: (
    userId: string,
    type: string,
    points: number,
    meta: object
  ) => Promise<void>;
  userId: string;
}

const quickPracticeTypes = [
  { 
    title: "Daily Conversation", 
    description: "Short dialogue practice based on your level",
    icon: MessageCircle,
    color: "bg-verbo-100 text-verbo-600",
    time: "10 mins",
    type: "conversation"
  },
  { 
    title: "Listening Exercise", 
    description: "Improve your listening comprehension",
    icon: BookOpen,
    color: "bg-purple-100 text-purple-600",
    time: "5 mins",
    type: "listening"
  },
  { 
    title: "Vocabulary Review", 
    description: "Practice words you've recently learned",
    icon: Book,
    color: "bg-yellow-100 text-yellow-600",
    time: "8 mins",
    type: "vocabulary"
  },
  { 
    title: "Speaking Challenge", 
    description: "Test your speaking skills with the AI tutor",
    icon: MessageCircle,
    color: "bg-green-100 text-green-600",
    time: "12 mins",
    type: "speaking"
  },
  { 
    title: "Grammar Practice", 
    description: "Focused exercises on grammar rules",
    icon: Book,
    color: "bg-orange-100 text-orange-600",
    time: "15 mins",
    type: "grammar"
  },
  { 
    title: "Cultural Insights", 
    description: "Learn about language-speaking cultures",
    icon: BookOpen,
    color: "bg-blue-100 text-blue-600",
    time: "7 mins",
    type: "culture"
  },
];

const QuickPracticeList: React.FC<PracticeProps> = ({ toast, logUserActivity, userId }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {quickPracticeTypes.map((practice, i) => (
      <Card key={i}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <div className={`${practice.color} p-3 rounded-full mb-4`}>
              <practice.icon className="h-6 w-6" />
            </div>
            <h3 className="font-medium mb-1">{practice.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{practice.description}</p>
            <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
              <Clock className="h-4 w-4 mr-1" /> 
              <span>{practice.time}</span>
            </div>
            <Button 
              className="w-full bg-verbo-600 hover:bg-verbo-700"
              onClick={async () => {
                toast({
                  title: "Starting practice session",
                  description: `${practice.title} session is beginning`
                });
                await logUserActivity(
                  userId,
                  `practice_${practice.type}`,
                  10,
                  { practiceType: practice.type }
                );
              }}
            >
              Start Practice
            </Button>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default QuickPracticeList;
