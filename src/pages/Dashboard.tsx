
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Award, BookOpen, Calendar, Clock, Flame, MessageCircle, Mic, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { user } = useAuth();

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
            <div className="text-2xl font-bold">7 days</div>
            <p className="text-xs text-muted-foreground mt-1">Keep it going!</p>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">XP Earned</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250 XP</div>
            <p className="text-xs text-muted-foreground mt-1">Level 3</p>
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
              <div className="flex items-start space-x-3">
                <Award className="h-6 w-6 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium">Perfect Pronunciation</div>
                  <div className="text-sm text-muted-foreground">
                    Scored 100% on the basic greeting pronunciation
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">5 days ago</Badge>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Flame className="h-6 w-6 text-orange-500 mt-0.5" />
                <div>
                  <div className="font-medium">7-Day Streak</div>
                  <div className="text-sm text-muted-foreground">
                    Practiced for 7 consecutive days
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">Today</Badge>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MessageCircle className="h-6 w-6 text-verbo-500 mt-0.5" />
                <div>
                  <div className="font-medium">Conversation Starter</div>
                  <div className="text-sm text-muted-foreground">
                    Completed 5 conversation practice sessions
                  </div>
                  <Badge variant="outline" className="mt-1 text-xs">2 days ago</Badge>
                </div>
              </div>
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
