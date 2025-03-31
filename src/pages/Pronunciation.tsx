
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Mic, Volume2, PlayCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PronunciationExercise = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [phonemeScores, setPhonemeScores] = useState<{[key: string]: number}>({});

  // Mock recording functionality
  const startRecording = () => {
    setIsRecording(true);
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      
      // Generate random score
      const newScore = Math.floor(Math.random() * 30) + 70;
      setScore(newScore);
      
      // Generate random phoneme scores
      setPhonemeScores({
        'r': Math.floor(Math.random() * 40) + 60,
        'rr': Math.floor(Math.random() * 30) + 60,
        'ñ': Math.floor(Math.random() * 20) + 75,
        'll': Math.floor(Math.random() * 25) + 70,
        'j': Math.floor(Math.random() * 30) + 65,
      });
    }, 3000);
  };

  // Mock audio playback
  const playAudio = () => {
    setIsPlaying(true);
    // Simulate audio playing for 2 seconds
    setTimeout(() => {
      setIsPlaying(false);
    }, 2000);
  };

  // Reset exercise
  const resetExercise = () => {
    setHasRecorded(false);
    setScore(null);
    setPhonemeScores({});
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreText = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Very Good";
    if (score >= 60) return "Good";
    return "Needs Practice";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Pronunciation Practice</h1>
        <p className="text-muted-foreground">
          Improve your accent with targeted pronunciation exercises
        </p>
      </div>

      <Tabs defaultValue="exercise">
        <TabsList>
          <TabsTrigger value="exercise">Exercises</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="exercise" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Practice Sentence</CardTitle>
                <CardDescription>
                  Listen to the example and try to repeat it
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg p-6 bg-gray-50">
                  <p className="text-xl font-medium text-center">
                    "El perro corre rápido por el parque"
                  </p>
                  <p className="text-sm text-center text-muted-foreground mt-2">
                    (The dog runs fast through the park)
                  </p>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex items-center space-x-2"
                    onClick={playAudio}
                    disabled={isPlaying}
                  >
                    {isPlaying ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Playing...</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-4 w-4" />
                        <span>Listen</span>
                      </>
                    )}
                  </Button>

                  <Button 
                    variant={isRecording ? "destructive" : "default"}
                    className="flex items-center space-x-2 bg-verbo-600 hover:bg-verbo-700"
                    onClick={startRecording}
                    disabled={isRecording}
                  >
                    {isRecording ? (
                      <>
                        <Mic className="h-4 w-4 animate-pulse" />
                        <span>Recording...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4" />
                        <span>Record</span>
                      </>
                    )}
                  </Button>
                </div>

                {hasRecorded && score !== null && (
                  <div className="mt-6 space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1 flex justify-center items-center">
                        Your Score: 
                        <span className={getScoreColor(score)}> {score}%</span>
                      </div>
                      <Badge variant="outline" className={getScoreColor(score)}>
                        {getScoreText(score)}
                      </Badge>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={resetExercise}
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {hasRecorded && score !== null && (
              <Card>
                <CardHeader>
                  <CardTitle>Detailed Feedback</CardTitle>
                  <CardDescription>
                    Analysis of your pronunciation by phoneme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {Object.entries(phonemeScores).map(([phoneme, phoneScore]) => (
                      <div key={phoneme} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-lg">"{phoneme}"</span>
                            <span className="text-sm text-muted-foreground">sound</span>
                          </div>
                          <span className={getScoreColor(phoneScore)}>{phoneScore}%</span>
                        </div>
                        <Progress 
                          value={phoneScore}
                          className="h-2"
                        />
                        <p className="text-sm text-muted-foreground">
                          {phoneScore >= 75 
                            ? "Excellent pronunciation of this sound." 
                            : phoneScore >= 60 
                              ? "Good, but needs more practice." 
                              : "Focus on this sound in your practice."}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-2">Suggestions:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Practice the rolling "rr" sound more deliberately</li>
                      <li>Try to emphasize the stress on "rá" in "rápido"</li>
                      <li>Slow down your speech to improve clarity</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Pronunciation Analysis</CardTitle>
              <CardDescription>
                Overall assessment of your Spanish pronunciation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="font-medium text-sm text-muted-foreground">Overall Score</div>
                  <div className="text-3xl font-bold text-verbo-600 mt-1">78%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="font-medium text-sm text-muted-foreground">Fluency</div>
                  <div className="text-3xl font-bold text-verbo-600 mt-1">65%</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="font-medium text-sm text-muted-foreground">Accuracy</div>
                  <div className="text-3xl font-bold text-verbo-600 mt-1">82%</div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Challenging Sounds</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Rolling "R" (rr)</span>
                      <span className="text-sm text-yellow-600">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">J sound (like in "Jardín")</span>
                      <span className="text-sm text-yellow-600">62%</span>
                    </div>
                    <Progress value={62} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Ñ sound (like in "Niño")</span>
                      <span className="text-sm text-green-600">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium mb-2">AI Recommendations:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <PlayCircle className="h-5 w-5 text-verbo-600 mt-0.5 flex-shrink-0" />
                    <span>Practice "rr" sounds with tongue trill exercises daily</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <PlayCircle className="h-5 w-5 text-verbo-600 mt-0.5 flex-shrink-0" />
                    <span>Work on the "j" sound which is closer to English "h" but more guttural</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <PlayCircle className="h-5 w-5 text-verbo-600 mt-0.5 flex-shrink-0" />
                    <span>Focus on sentence intonation patterns typical in Spanish</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Practice History</CardTitle>
              <CardDescription>
                Your recent pronunciation practice sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { date: "Today", exercise: "Basic Greetings", score: 92 },
                  { date: "Yesterday", exercise: "Restaurant Conversations", score: 78 },
                  { date: "3 days ago", exercise: "Weather Vocabulary", score: 85 },
                  { date: "1 week ago", exercise: "Past Tense Verbs", score: 65 },
                  { date: "2 weeks ago", exercise: "Common Phrases", score: 73 },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{session.exercise}</div>
                      <div className="text-sm text-muted-foreground">{session.date}</div>
                    </div>
                    <Badge className={session.score >= 80 ? "bg-green-500" : session.score >= 70 ? "bg-yellow-500" : "bg-orange-500"}>
                      {session.score}%
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PronunciationExercise;
