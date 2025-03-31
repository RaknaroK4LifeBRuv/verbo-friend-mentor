
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Book, BookOpen, Clock, CheckCircle2, LockIcon, PlayCircle } from "lucide-react";

const Lessons = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Lessons & Practice</h1>
        <p className="text-muted-foreground">
          Interactive AI-driven lessons to improve your language skills
        </p>
      </div>

      <Tabs defaultValue="courses">
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="quick">Quick Practice</TabsTrigger>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
          <TabsTrigger value="vocab">Vocabulary</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Spanish Fundamentals</CardTitle>
                  <CardDescription>Beginner level course - 45% complete</CardDescription>
                </div>
                <Badge className="bg-verbo-500">Current</Badge>
              </div>
              <Progress value={45} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Basic Greetings", description: "Learn essential greetings and introductions", progress: 100, locked: false },
                  { title: "Numbers & Counting", description: "Master numbers from 1-100", progress: 100, locked: false },
                  { title: "Common Phrases", description: "Everyday expressions and useful phrases", progress: 80, locked: false },
                  { title: "Present Tense Verbs", description: "Regular verb conjugation in present tense", progress: 20, locked: false },
                  { title: "Food & Dining", description: "Restaurant vocabulary and ordering food", progress: 0, locked: false },
                  { title: "Travel Vocabulary", description: "Essential words for getting around", progress: 0, locked: true },
                ].map((module, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className={`p-4 ${module.locked ? "opacity-60" : ""}`}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">{module.title}</h3>
                          {module.locked ? (
                            <LockIcon className="h-4 w-4 text-gray-400" />
                          ) : module.progress === 100 ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <span className="text-sm text-muted-foreground">{module.progress}%</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{module.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" /> 
                            <span>15 mins</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-verbo-600 hover:text-verbo-700 hover:bg-verbo-50"
                            disabled={module.locked}
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            <span>{module.progress > 0 && module.progress < 100 ? "Continue" : "Start"}</span>
                          </Button>
                        </div>
                      </div>
                      <Progress 
                        value={module.progress} 
                        className="h-1 rounded-none"
                        indicatorClassName={module.progress === 100 ? "bg-green-500" : ""}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Spanish Conversations</CardTitle>
                <CardDescription>Intermediate level course - Locked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-4">
                    <LockIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-2">Complete Beginner Course First</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You need to complete the Spanish Fundamentals course before unlocking this content.
                  </p>
                  <Progress value={45} className="h-2 w-full max-w-xs" />
                  <p className="text-xs text-muted-foreground mt-2">45% Progress on prerequisites</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Spanish for Travel</CardTitle>
                <CardDescription>Themed course - Unlocked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-verbo-100 p-2 rounded-full">
                      <MessageCircle className="h-5 w-5 text-verbo-600" />
                    </div>
                    <div>
                      <div className="font-medium">Travel-focused dialogues</div>
                      <div className="text-sm text-muted-foreground">
                        Learn how to navigate airports, hotels, and tourist destinations
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Book className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Practical vocabulary</div>
                      <div className="text-sm text-muted-foreground">
                        Essential words and phrases for travelers
                      </div>
                    </div>
                  </div>
                  <Button className="w-full bg-verbo-600 hover:bg-verbo-700">
                    <PlayCircle className="h-4 w-4 mr-2" /> Start Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="quick" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                title: "Daily Conversation", 
                description: "Short dialogue practice based on your level",
                icon: MessageCircle,
                color: "bg-verbo-100 text-verbo-600",
                time: "10 mins"
              },
              { 
                title: "Listening Exercise", 
                description: "Improve your listening comprehension",
                icon: BookOpen,
                color: "bg-purple-100 text-purple-600",
                time: "5 mins"
              },
              { 
                title: "Vocabulary Review", 
                description: "Practice words you've recently learned",
                icon: Book,
                color: "bg-yellow-100 text-yellow-600",
                time: "8 mins"
              },
              { 
                title: "Speaking Challenge", 
                description: "Test your speaking skills with the AI tutor",
                icon: MessageCircle,
                color: "bg-green-100 text-green-600",
                time: "12 mins"
              },
              { 
                title: "Grammar Practice", 
                description: "Focused exercises on grammar rules",
                icon: Book,
                color: "bg-orange-100 text-orange-600",
                time: "15 mins"
              },
              { 
                title: "Cultural Insights", 
                description: "Learn about Spanish-speaking cultures",
                icon: BookOpen,
                color: "bg-blue-100 text-blue-600",
                time: "7 mins"
              },
            ].map((practice, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`${practice.color} p-3 rounded-full mb-4`}>
                      <practice.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-medium mb-1">{practice.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {practice.description}
                    </p>
                    <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4 mr-1" /> 
                      <span>{practice.time}</span>
                    </div>
                    <Button className="w-full bg-verbo-600 hover:bg-verbo-700">
                      Start Practice
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="grammar" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Grammar Lessons</CardTitle>
              <CardDescription>
                Focused lessons on Spanish grammar rules and structures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: "Present Tense", description: "Regular verb conjugation", completed: true },
                  { title: "Articles & Gender", description: "Definite and indefinite articles", completed: true },
                  { title: "Adjective Agreement", description: "Matching adjectives with nouns", completed: false },
                  { title: "Past Tense (Preterite)", description: "Regular verbs in the past", completed: false },
                  { title: "Past Tense (Imperfect)", description: "Describing past conditions", completed: false },
                ].map((lesson, i) => (
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
        </TabsContent>

        <TabsContent value="vocab" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary Building</CardTitle>
              <CardDescription>
                Expand your Spanish vocabulary with themed word lists
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  { title: "Everyday Objects", count: 50, progress: 80 },
                  { title: "Food & Cooking", count: 75, progress: 65 },
                  { title: "Travel & Transportation", count: 60, progress: 30 },
                  { title: "Family & Relationships", count: 40, progress: 100 },
                  { title: "Work & Professions", count: 55, progress: 20 },
                  { title: "Hobbies & Activities", count: 45, progress: 0 },
                ].map((wordList, i) => (
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Lessons;
