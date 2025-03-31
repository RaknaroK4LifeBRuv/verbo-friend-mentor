
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    nativeLanguage: user?.nativeLanguage || "English",
    learningLanguage: user?.learningLanguage || "Spanish",
    proficiencyLevel: user?.proficiencyLevel || "Beginner",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateUser(formData);
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">
          Manage your account and language learning preferences
        </p>
      </div>

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="preferences">Learning Preferences</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile picture
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex flex-col items-center space-y-3">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name || ""} />
                      <AvatarFallback className="text-lg">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Upload className="h-4 w-4" />
                      <span>Change</span>
                    </Button>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Account Status</Label>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                          Active
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Free plan - Upgrade for premium features
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button 
                        type="submit" 
                        className="bg-verbo-600 hover:bg-verbo-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and security settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <Button variant="outline" className="mt-2">Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Language Learning Settings</CardTitle>
              <CardDescription>
                Customize your language learning experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nativeLanguage">Native Language</Label>
                    <Select 
                      name="nativeLanguage"
                      defaultValue={formData.nativeLanguage}
                      onValueChange={(value) => setFormData({...formData, nativeLanguage: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learningLanguage">Learning Language</Label>
                    <Select 
                      name="learningLanguage"
                      defaultValue={formData.learningLanguage}
                      onValueChange={(value) => setFormData({...formData, learningLanguage: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="proficiencyLevel">Proficiency Level</Label>
                    <Select 
                      name="proficiencyLevel"
                      defaultValue={formData.proficiencyLevel}
                      onValueChange={(value) => setFormData({...formData, proficiencyLevel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner (A1)</SelectItem>
                        <SelectItem value="Elementary">Elementary (A2)</SelectItem>
                        <SelectItem value="Intermediate">Intermediate (B1)</SelectItem>
                        <SelectItem value="Upper Intermediate">Upper Intermediate (B2)</SelectItem>
                        <SelectItem value="Advanced">Advanced (C1)</SelectItem>
                        <SelectItem value="Proficient">Proficient (C2)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="learningGoal">Daily Learning Goal</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button 
                    type="submit" 
                    className="bg-verbo-600 hover:bg-verbo-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Preferences"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Achievements</CardTitle>
              <CardDescription>
                Badges and milestones you've earned on your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  { name: "7-Day Streak", description: "Practice for 7 consecutive days", unlocked: true },
                  { name: "Conversation Starter", description: "Complete 5 conversation exercises", unlocked: true },
                  { name: "Perfect Pronunciation", description: "Score 100% on pronunciation", unlocked: true },
                  { name: "Vocabulary Master", description: "Learn 100 new words", unlocked: false },
                  { name: "Grammar Guru", description: "Master 5 grammar topics", unlocked: false },
                  { name: "30-Day Streak", description: "Practice for 30 consecutive days", unlocked: false },
                  { name: "Fluent Speaker", description: "Reach B1 proficiency level", unlocked: false },
                  { name: "Cultural Explorer", description: "Complete all cultural lessons", unlocked: false },
                ].map((achievement, i) => (
                  <div 
                    key={i} 
                    className={`border rounded-lg p-4 text-center ${
                      achievement.unlocked ? "bg-white" : "bg-gray-100 opacity-60"
                    }`}
                  >
                    <div className={`h-16 w-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
                      achievement.unlocked ? "bg-verbo-100 text-verbo-600" : "bg-gray-200 text-gray-400"
                    }`}>
                      <span className="text-xl font-bold">{i + 1}</span>
                    </div>
                    <h3 className="font-medium">{achievement.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                    <Badge 
                      variant="outline" 
                      className={`mt-2 ${
                        achievement.unlocked ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {achievement.unlocked ? "Unlocked" : "Locked"}
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

export default Profile;
