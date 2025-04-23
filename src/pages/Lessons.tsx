
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { lessonService } from "@/services/lessonService";
import { logUserActivity } from "@/services/gamificationService";
import { Lesson, UserLesson } from "@/types/backend";
import { Skeleton } from "@/components/ui/skeleton";
import { Book } from "lucide-react"; 
import CoursesList from "./lessons/CoursesList";
import QuickPracticeList from "./lessons/QuickPracticeList";
import GrammarLessons from "./lessons/GrammarLessons";
import VocabularyLists from "./lessons/VocabularyLists";

const Lessons = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userLessons, setUserLessons] = useState<UserLesson[]>([]);
  const [activeTab, setActiveTab] = useState("courses");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all available lessons
        const allLessons = await lessonService.getLessons();
        setLessons(allLessons);
        
        // Fetch user's progress on lessons
        const userLessonsData = await lessonService.getUserLessons();
        setUserLessons(userLessonsData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading lessons:", error);
        setError("Failed to load lessons. Please try again.");
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

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Lessons & Practice</h1>
          <p className="text-muted-foreground">
            Interactive AI-driven lessons to improve your language skills
          </p>
        </div>
        <Card className="border-red-200">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-red-500 rounded-full p-3 bg-red-50">
                <Book className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-medium">Error Loading Lessons</h3>
              <p>{error}</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          <CoursesList
            loading={loading}
            coursesByLevel={coursesByLevel}
            getCourseProgress={getCourseProgress}
            getLessonProgress={getLessonProgress}
            isLessonCompleted={isLessonCompleted}
            isLessonLocked={isLessonLocked}
            handleStartLesson={handleStartLesson}
            getButtonText={getButtonText}
          />
        </TabsContent>

        <TabsContent value="quick" className="mt-6">
          <QuickPracticeList
            toast={toast}
            logUserActivity={logUserActivity}
            userId={userLessons[0]?.userId || "user123"}
          />
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

export default Lessons;
