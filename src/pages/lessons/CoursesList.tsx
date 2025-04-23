
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LockIcon, CheckCircle2, Clock, PlayCircle, MessageCircle, Book } from "lucide-react";
import React from "react";

interface Lesson {
  id: string;
  title: string;
  description: string;
  language: string;
  level: string;
  duration: number;
  type: string;
}

interface UserLesson {
  lessonId: string;
  progress: number;
  completed: boolean;
}

type CoursesByLevel = Record<string, Lesson[]>;

interface Props {
  loading: boolean;
  coursesByLevel: CoursesByLevel;
  getCourseProgress: (key: string) => number;
  getLessonProgress: (id: string) => number;
  isLessonCompleted: (id: string) => boolean;
  isLessonLocked: (lesson: Lesson, i: number, key: string) => boolean;
  handleStartLesson: (lesson: Lesson) => void;
  getButtonText: (id: string) => string;
}

const CoursesSkeletonLoader = () => (
  <Card>
    <CardHeader>
      <div className="h-8 w-1/3 mb-2 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 w-1/2 mb-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-2 w-full bg-gray-200 rounded animate-pulse"></div>
    </CardHeader>
    <CardContent>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-6 w-3/4 mb-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full mb-2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full mb-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex justify-between items-center">
                <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

const EmptyLessonsState = () => (
  <Card className="border-dashed">
    <CardContent className="py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <Book className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No lessons available yet</h3>
        <p className="text-muted-foreground mb-4 max-w-md">
          We're currently preparing personalized lessons based on your level.
          Please check back soon!
        </p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    </CardContent>
  </Card>
);

const CoursesList: React.FC<Props> = ({
  loading,
  coursesByLevel,
  getCourseProgress,
  getLessonProgress,
  isLessonCompleted,
  isLessonLocked,
  handleStartLesson,
  getButtonText,
}) => {
  return (
    <>
      {loading ? (
        <CoursesSkeletonLoader />
      ) : Object.keys(coursesByLevel).length > 0 ? (
        Object.keys(coursesByLevel).map((courseKey, idx) => {
          const [language, level] = courseKey.split("-");
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
                  {idx === 0 && (
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
              <Button className="w-full bg-verbo-600 hover:bg-verbo-700" disabled>Coming Soon</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CoursesList;
