
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Book, BookOpen, Clock, CheckCircle2, LockIcon, PlayCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { lessonService } from "@/services/lessonService";
import { logUserActivity } from "@/services/gamificationService";
import { Lesson, UserLesson } from "@/types/backend";
import { Skeleton } from "@/components/ui/skeleton";

const Lessons = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userLessons, setUserLessons] = useState<UserLesson[]>([]);
  const [activeTab, setActiveTab] = useState("courses");

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        // Fetch all available lessons
        const allLessons = await lessonService.getLessons();
        setLessons(allLessons);
        
        // Fetch user's progress on lessons
        const userLessonsData = await lessonService.getUserLessons();
        setUserLessons(userLessonsData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading lessons:", error);
        toast({
          title: "Error loading lessons",
          description: "Please try again later",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchLessons();
  }, [toast]);

  // Group lessons by language and level to organize into courses
  const coursesByLevel = lessons.reduce((acc: Record<string, Lesson[]>, lesson) => {
    const key = `${lesson.language}-${lesson.level}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(lesson);
    return acc;
  }, {});

  // Get user progress for a specific lesson
  const getLessonProgress = (lessonId: string): number => {
    const userLesson = userLessons.find(ul => ul.lessonId === lessonId);
    return userLesson ? userLesson.progress : 0;
  };
  
  // Check if user has completed a lesson
  const isLessonCompleted = (lessonId: string): boolean => {
    const userLesson = userLessons.find(ul => ul.lessonId === lessonId);
    return userLesson ? userLesson.completed : false;
  };

  // Check if a lesson is locked (user must complete previous lessons)
  const isLessonLocked = (lesson: Lesson, index: number, courseKey: string): boolean => {
    // First lesson is always unlocked
    if (index === 0) return false;
    
    // Check if previous lesson is completed
    const previousLesson = coursesByLevel[courseKey][index - 1];
    if (!previousLesson) return false;
    
    return !isLessonCompleted(previousLesson.id);
  };

  // Calculate overall course progress
  const getCourseProgress = (courseKey: string): number => {
    const courseLessons = coursesByLevel[courseKey] || [];
    if (courseLessons.length === 0) return 0;
    
    const totalProgress = courseLessons.reduce((sum, lesson) => {
      return sum + getLessonProgress(lesson.id);
    }, 0);
    
    return Math.round(totalProgress / courseLessons.length);
  };

  // Start or continue a lesson
  const handleStartLesson = async (lesson: Lesson) => {
    try {
      const userLesson = await lessonService.startLesson(lesson.id);
      
      // Log activity for gamification
      await logUserActivity(
        userLesson.userId,
        "lesson_started",
        5,
        { lessonId: lesson.id, lessonTitle: lesson.title }
      );
      
      toast({
        title: "Lesson started",
        description: `Starting "${lesson.title}"`,
      });
      
      // Navigate to lesson content
      navigate(`/lesson/${lesson.id}`);
    } catch (error) {
      console.error("Error starting lesson:", error);
      toast({
        title: "Error starting lesson",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  // Get appropriate button text based on lesson progress
  const getButtonText = (lessonId: string): string => {
    const progress = getLessonProgress(lessonId);
    if (progress === 0) return "Start";
    if (progress === 100) return "Review";
    return "Continue";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Lessons & Practice</h1>
        <p className="text-muted-foreground">
          Interactive AI-driven lessons to improve your language skills
        </p>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="quick">Quick Practice</TabsTrigger>
          <TabsTrigger value="grammar">Grammar</TabsTrigger>
          <TabsTrigger value="vocab">Vocabulary</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="mt-6 space-y-6">
          {loading ? (
            <CoursesSkeletonLoader />
          ) : (
            Object.keys(coursesByLevel).length > 0 ? (
              Object.keys(coursesByLevel).map((courseKey) => {
                const [language, level] = courseKey.split('-');
                const progress = getCourseProgress(courseKey);
                const courseLessons = coursesByLevel[courseKey];
                
                return (
                  <Card key={courseKey}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>{language} {level}</CardTitle>
                          <CardDescription>{level} level course - {progress}% complete</CardDescription>
                        </div>
                        {courseKey === Object.keys(coursesByLevel)[0] && (
                          <Badge className="bg-verbo-500">Current</Badge>
                        )}
                      </div>
                      <Progress value={progress} className="h-2" />
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {courseLessons.map((lesson, i) => {
                          const lessonProgress = getLessonProgress(lesson.id);
                          const completed = isLessonCompleted(lesson.id);
                          const locked = isLessonLocked(lesson, i, courseKey);
                          
                          return (
                            <Card key={lesson.id} className="overflow-hidden">
                              <CardContent className="p-0">
                                <div className={`p-4 ${locked ? "opacity-60" : ""}`}>
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium">{lesson.title}</h3>
                                    {locked ? (
                                      <LockIcon className="h-4 w-4 text-gray-400" />
                                    ) : completed ? (
                                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    ) : (
                                      <span className="text-sm text-muted-foreground">{lessonProgress}%</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-3">{lesson.description}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Clock className="h-3 w-3 mr-1" /> 
                                      <span>{lesson.duration} mins</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-verbo-600 hover:text-verbo-700 hover:bg-verbo-50"
                                      disabled={locked}
                                      onClick={() => handleStartLesson(lesson)}
                                    >
                                      <PlayCircle className="h-4 w-4 mr-1" />
                                      <span>{getButtonText(lesson.id)}</span>
                                    </Button>
                                  </div>
                                </div>
                                <Progress 
                                  value={lessonProgress} 
                                  className="h-1 rounded-none"
                                  indicatorClassName={completed ? "bg-green-500" : ""}
                                />
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <EmptyLessonsState />
            )
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Conversations</CardTitle>
                <CardDescription>Advanced level course - Locked</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="bg-gray-100 p-3 rounded-full mb-4">
                    <LockIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <h3 className="font-medium mb-2">Complete Intermediate Course First</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    You need to complete the Intermediate course before unlocking this content.
                  </p>
                  <Progress value={0} className="h-2 w-full max-w-xs" />
                  <p className="text-xs text-muted-foreground mt-2">0% Progress on prerequisites</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Travel Conversations</CardTitle>
                <CardDescription>Themed course - Coming soon</CardDescription>
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
                  <Button className="w-full bg-verbo-600 hover:bg-verbo-700" disabled>
                    Coming Soon
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
                    <Button 
                      className="w-full bg-verbo-600 hover:bg-verbo-700"
                      onClick={async () => {
                        toast({
                          title: "Starting practice session",
                          description: `${practice.title} session is beginning`
                        });
                        // Log gamification activity
                        await logUserActivity(
                          "user123", // This should be the actual user ID
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
        </TabsContent>

        <TabsContent value="grammar" className="mt-6">
          <GrammarLessons />
        </TabsContent>

        <TabsContent value="vocab" className="mt-6">
          <VocabularyLists />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Loading skeleton component
const CoursesSkeletonLoader = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-8 w-1/3 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-2 w-full" />
    </CardHeader>
    <CardContent>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-4" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

// Empty state component
const EmptyLessonsState = () => (
  <Card className="border-dashed">
    <CardContent className="py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No lessons available yet</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          We're currently preparing personalized lessons based on your level.
          Please check back soon!
        </p>
        <Button
          onClick={() => {
            window.location.reload();
          }}
        >
          Refresh
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Grammar lessons component
const GrammarLessons = () => {
  const grammarLessons = [
    { title: "Present Tense", description: "Regular verb conjugation", completed: true },
    { title: "Articles & Gender", description: "Definite and indefinite articles", completed: true },
    { title: "Adjective Agreement", description: "Matching adjectives with nouns", completed: false },
    { title: "Past Tense (Preterite)", description: "Regular verbs in the past", completed: false },
    { title: "Past Tense (Imperfect)", description: "Describing past conditions", completed: false },
  ];

  return (
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
};

// Vocabulary lists component
const VocabularyLists = () => {
  const vocabLists = [
    { title: "Everyday Objects", count: 50, progress: 80 },
    { title: "Food & Cooking", count: 75, progress: 65 },
    { title: "Travel & Transportation", count: 60, progress: 30 },
    { title: "Family & Relationships", count: 40, progress: 100 },
    { title: "Work & Professions", count: 55, progress: 20 },
    { title: "Hobbies & Activities", count: 45, progress: 0 },
  ];

  return (
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
};

export default Lessons;
