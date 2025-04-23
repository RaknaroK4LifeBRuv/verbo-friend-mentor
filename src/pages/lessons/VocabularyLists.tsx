
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import React from "react";

const vocabLists = [
  { title: "Everyday Objects", count: 50, progress: 80 },
  { title: "Food & Cooking", count: 75, progress: 65 },
  { title: "Travel & Transportation", count: 60, progress: 30 },
  { title: "Family & Relationships", count: 40, progress: 100 },
  { title: "Work & Professions", count: 55, progress: 20 },
  { title: "Hobbies & Activities", count: 45, progress: 0 },
];

const VocabularyLists = () => (
  <Card>
    <CardHeader>
      <CardTitle>Vocabulary Building</CardTitle>
      <CardDescription>
        Expand your vocabulary with themed word lists
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {vocabLists.map((wordList, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{wordList.title}</h3>
                <Badge variant="outline">{wordList.count} words</Badge>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{wordList.progress}%</span>
                </div>
                <Progress 
                  value={wordList.progress} 
                  className="h-2"
                  indicatorClassName={wordList.progress === 100 ? "bg-green-500" : ""}
                />
              </div>
              <Button 
                className="w-full bg-verbo-600 hover:bg-verbo-700"
                variant={wordList.progress === 0 ? "default" : "outline"}
              >
                {wordList.progress === 0 ? "Start" : 
                wordList.progress === 100 ? "Review" : "Continue"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default VocabularyLists;
