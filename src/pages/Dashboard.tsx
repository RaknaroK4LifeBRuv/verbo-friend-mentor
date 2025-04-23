import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Calendar, Clock, Flame, MessageCircle, Mic, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getUserProgress, getUserAchievements } from "@/services/gamificationService";

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      getUserProgress(user.id).then(setProgress);
      getUserAchievements(user.id).then(setAchievements);
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Track your progress and continue your language learning journey.
        </p>
      </div>

      {/* Streak and Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.streak_days ?? 0} days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">XP Earned</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.xp_points ?? 0} XP</div>
            <p className="text-xs text-muted-foreground mt-1">Level {progress?.level ?? 1}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Words</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Minutes Today</CardTitle>
            <Clock className="h-4 w-4 text-verbo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 min</div>
            <p className="text-xs text-muted-foreground mt-1">Goal: 30 min</p>
          </CardContent>
        </Card>
      </div>

      {/* Learning Progress */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Learning Progress</CardTitle>
            <CardDescription>
              {user?.learningLanguage || "Spanish"} - {user?.proficiencyLevel || "Beginner"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Vocabulary</div>
                <div className="text-sm text-muted-foreground">45%</div>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Grammar</div>
                <div className="text-sm text-muted-foreground">30%</div>
              </div>
              <Progress value={30} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Pronunciation</div>
                <div className="text-sm text-muted-foreground">65%</div>
              </div>
              <Progress value={65} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Conversation</div>
                <div className="text-sm text-muted-foreground">40%</div>
              </div>
              <Progress value={40} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Your latest language learning milestones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {achievements.slice(0, 3).map((a, i) => (
                <div className="flex items-start space-x-3" key={a.id}>
                  <Award className="h-6 w-6 text-yellow-500 mt-0.5" />
                  <div>
                    <div className="font-medium">{a.achievement?.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {a.achievement?.description}
                    </div>
                    <Badge variant="outline" className="mt-1 text-xs">
                      {new Date(a.unlocked_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Activities</CardTitle>
          <CardDescription>Personalized recommendations based on your progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-verbo-100 p-2 rounded-full">
                    <MessageCircle className="h-5 w-5 text-verbo-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Practice Conversation</h3>
                    <p className="text-sm text-muted-foreground">Ordering food at a restaurant</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Mic className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Pronunciation Drill</h3>
                    <p className="text-sm text-muted-foreground">R sounds in Spanish</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Daily Challenge</h3>
                    <p className="text-sm text-muted-foreground">Present tense verbs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
