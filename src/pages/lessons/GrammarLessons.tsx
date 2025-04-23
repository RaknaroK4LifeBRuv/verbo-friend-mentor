
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Book } from "lucide-react";
import React from "react";

const grammarLessons = [
  { title: "Present Tense", description: "Regular verb conjugation", completed: true },
  { title: "Articles & Gender", description: "Definite and indefinite articles", completed: true },
  { title: "Adjective Agreement", description: "Matching adjectives with nouns", completed: false },
  { title: "Past Tense (Preterite)", description: "Regular verbs in the past", completed: false },
  { title: "Past Tense (Imperfect)", description: "Describing past conditions", completed: false },
];

const GrammarLessons = () => (
  <Card>
    <CardHeader>
      <CardTitle>Grammar Lessons</CardTitle>
      <CardDescription>
        Focused lessons on grammar rules and structures
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {grammarLessons.map((lesson, i) => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${lesson.completed ? "bg-green-100" : "bg-gray-100"}`}>
                {lesson.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <Book className="h-5 w-5 text-gray-600" />
                )}
              </div>
              <div>
                <h3 className="font-medium">{lesson.title}</h3>
                <p className="text-sm text-muted-foreground">{lesson.description}</p>
              </div>
            </div>
            <Button 
              variant={lesson.completed ? "outline" : "default"}
              size="sm"
              className={lesson.completed ? "" : "bg-verbo-600 hover:bg-verbo-700"}
            >
              {lesson.completed ? "Review" : "Start"}
            </Button>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default GrammarLessons;
