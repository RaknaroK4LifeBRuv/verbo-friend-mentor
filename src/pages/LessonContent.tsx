
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, ArrowLeft, CheckCircle, Book, Trophy, Mic } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { lessonService } from '@/services/lessonService';
import { logUserActivity, unlockAchievement } from '@/services/gamificationService';
import { Lesson, LessonPerformance } from '@/types/backend';
import { speakWithAI } from '@/utils/ttsApi';
import { sendAIChat } from '@/utils/aiChat';

const LessonContent = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [userLesson, setUserLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [aiResponse, setAiResponse] = useState("");
  const [userInput, setUserInput] = useState("");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!lessonId) {
      navigate('/lessons');
      return;
    }

    const loadLesson = async () => {
      try {
        setLoading(true);
        // Fetch the lesson
        const lessonData = await lessonService.getLesson(lessonId);
        setLesson(lessonData);
        
        // Start or continue user lesson
        const userLessonData = await lessonService.startLesson(lessonId);
        setUserLesson(userLessonData);
        setProgress(userLessonData.progress);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading lesson:", error);
        toast({
          title: "Error loading lesson",
          description: "Unable to load the lesson content",
          variant: "destructive",
        });
        navigate('/lessons');
      }
    };

    loadLesson();
  }, [lessonId, navigate, toast]);

  // Handle section completion
  const completeSection = async () => {
    if (!lesson || !userLesson) return;
    
    // Calculate new progress
    const sections = lesson.content?.sections || [];
    const newProgress = Math.min(Math.round(((activeSection + 1) / sections.length) * 100), 100);
    
    // Update progress in DB
    try {
      const isCompleted = newProgress === 100;
      const updatedUserLesson = await lessonService.updateLessonProgress(
        userLesson.id,
        newProgress,
        isCompleted
      );
      
      setUserLesson(updatedUserLesson);
      setProgress(newProgress);
      
      // Log activity for gamification
      await logUserActivity(
        userLesson.userId,
        "section_completed",
        10,
        { lessonId, sectionIndex: activeSection }
      );
      
      // Move to next section or complete lesson
      if (activeSection < sections.length - 1) {
        setActiveSection(activeSection + 1);
        toast({
          title: "Section completed",
          description: "Moving to the next section",
        });
      } else {
        // Lesson completed
        toast({
          title: "Lesson completed!",
          description: "Great job! You've completed this lesson.",
        });
        
        // Add XP for completing the lesson
        await logUserActivity(
          userLesson.userId,
          "lesson_completed",
          50,
          { lessonId, lessonTitle: lesson.title }
        );
        
        // Check for first lesson completion achievement
        await unlockAchievement(userLesson.userId, "conversation");
        
        // Record performance
        await lessonService.recordLessonPerformance(
          userLesson.id,
          95, // Score - this would normally be calculated based on user's answers
          Math.floor((new Date().getTime() - new Date(userLesson.startedAt).getTime()) / 60000), // Duration in minutes
          { accuracy: 0.95, fluency: 0.9 }
        );
      }
    } catch (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error updating progress",
        description: "Unable to save your progress",
        variant: "destructive",
      });
    }
  };

  // Handle AI interaction
  const askAI = async (question: string) => {
    if (!question.trim()) return;
    
    try {
      const response = await sendAIChat([
        { role: "system", content: "You are a helpful language tutor. Respond briefly and helpfully." },
        { role: "user", content: question }
      ]);
      
      setAiResponse(response);
      
      // Play audio response
      const audio = await speakWithAI(response);
      setAudioUrl(audio);
      
      // Log activity
      await logUserActivity(
        userLesson?.userId,
        "ai_interaction",
        5,
        { question, lessonId }
      );
    } catch (error) {
      console.error("Error with AI chat:", error);
      toast({
        title: "Communication Error",
        description: "Unable to connect with the AI tutor",
        variant: "destructive",
      });
    }
  };

  // Play TTS audio
  const playAudio = () => {
    if (!audioUrl) return;
    
    const audio = new Audio(audioUrl);
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.play();
  };

  if (loading || !lesson) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/lessons')} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Loading lesson...</h1>
        </div>
        <Card>
          <CardContent className="p-8 flex justify-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="h-32 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get current section content
  const sections = lesson.content?.sections || [];
  const currentSection = sections[activeSection] || { title: "No content", content: "This section has no content." };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => navigate('/lessons')} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{lesson.title}</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          Progress: {progress}%
        </div>
      </div>

      <Progress value={progress} className="mb-6" />

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>
                Section {activeSection + 1}: {currentSection.title}
              </CardTitle>
              <CardDescription>
                {lesson.type === "conversation" ? "Practice this dialogue" : 
                 lesson.type === "grammar" ? "Learn this grammar rule" : 
                 "Study these vocabulary items"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: currentSection.content }} />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (activeSection > 0) {
                    setActiveSection(activeSection - 1);
                  }
                }}
                disabled={activeSection === 0}
              >
                Previous
              </Button>
              <Button onClick={completeSection}>
                {activeSection < sections.length - 1 ? "Complete & Continue" : "Complete Lesson"}
              </Button>
            </CardFooter>
          </Card>

          <Tabs defaultValue="practice">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="practice">Practice</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="help">Help</TabsTrigger>
            </TabsList>
            <TabsContent value="practice" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mic className="mr-2 h-5 w-5" />
                    Practice Speaking
                  </CardTitle>
                  <CardDescription>
                    Practice pronunciation with our AI tutor
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Try saying these phrases:</p>
                    <div className="space-y-2">
                      {["Hello, how are you?", "I would like to learn more", "Can you help me practice?"].map((phrase, i) => (
                        <div key={i} className="bg-muted p-2 rounded text-sm cursor-pointer hover:bg-muted/80" onClick={() => askAI(phrase)}>
                          {phrase}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type a question or phrase to practice..."
                      className="border rounded p-2 w-full"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          askAI(userInput);
                          setUserInput("");
                        }
                      }}
                    />
                    <Button onClick={() => { askAI(userInput); setUserInput(""); }}>
                      Submit
                    </Button>
                  </div>
                  {aiResponse && (
                    <div className="mt-4 p-4 bg-muted rounded">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">AI Response:</h4>
                        {audioUrl && (
                          <Button variant="ghost" size="sm" onClick={playAudio} disabled={isPlaying}>
                            {isPlaying ? "Playing..." : "Play Audio"}
                          </Button>
                        )}
                      </div>
                      <p>{aiResponse}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notes" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Book className="mr-2 h-5 w-5" />
                    Your Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="w-full min-h-[200px] p-2 border rounded"
                    placeholder="Take notes here while learning..."
                  ></textarea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline">Save Notes</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="help" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">If you're having trouble with this lesson, you can:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Ask our AI tutor for clarification</li>
                    <li>Review previous sections</li>
                    <li>Check the glossary for unfamiliar terms</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => askAI("I need help understanding this lesson. Can you explain it in simpler terms?")}
                  >
                    Ask for Help
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="mr-2 h-5 w-5" />
                Your Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Lesson Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>XP Earned</span>
                    <span>{Math.floor(progress / 2)}</span>
                  </div>
                  <Progress value={progress / 2} className="h-2" />
                </div>
                <div className="pt-2">
                  <h4 className="text-sm font-medium mb-2">Achievements:</h4>
                  <div className="space-y-2">
                    {[
                      { name: "First Step", complete: progress > 0, xp: 5 },
                      { name: "Halfway There", complete: progress >= 50, xp: 15 },
                      { name: "Lesson Complete", complete: progress === 100, xp: 30 }
                    ].map((achievement, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className={`p-1 rounded-full ${achievement.complete ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <CheckCircle className={`h-4 w-4 ${achievement.complete ? 'text-green-600' : 'text-gray-300'}`} />
                        </div>
                        <span className={`text-sm ${achievement.complete ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                          {achievement.name} (+{achievement.xp} XP)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Lesson Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span>{lesson.type.charAt(0).toUpperCase() + lesson.type.slice(1)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Level:</span>
                <span>{lesson.level}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span>{lesson.duration} mins</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sections:</span>
                <span>{sections.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;
