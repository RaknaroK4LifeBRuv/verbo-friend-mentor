
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Radar } from "@/components/ui/charts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Performance = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance & Insights</h1>
          <p className="text-muted-foreground">
            Track your language learning progress and identify areas for improvement
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select defaultValue="week">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Past Week</SelectItem>
              <SelectItem value="month">Past Month</SelectItem>
              <SelectItem value="year">Past Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">Export Report</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skills">Skills Breakdown</TabsTrigger>
          <TabsTrigger value="progress">Learning Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Time Spent Learning</CardTitle>
                <CardDescription>Minutes per day over time</CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart 
                  data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                      label: 'Minutes',
                      data: [15, 25, 10, 30, 20, 35, 25],
                      borderColor: 'rgb(30, 171, 240)',
                      backgroundColor: 'rgba(30, 171, 240, 0.1)',
                      tension: 0.3,
                      fill: true
                    }]
                  }}
                  showLegend={false}
                  height={200}
                />
                <div className="mt-2 text-center text-sm text-muted-foreground">
                  <span className="font-medium text-verbo-700">160 minutes</span> total this week
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Skill Distribution</CardTitle>
                <CardDescription>Your learning focus areas</CardDescription>
              </CardHeader>
              <CardContent>
                <PieChart 
                  data={{
                    labels: ['Vocabulary', 'Grammar', 'Pronunciation', 'Listening', 'Conversation'],
                    datasets: [{
                      data: [25, 20, 30, 15, 10],
                      backgroundColor: [
                        'rgb(30, 171, 240)',
                        'rgb(14, 137, 227)',
                        'rgb(12, 110, 201)',
                        'rgb(18, 90, 164)',
                        'rgb(20, 75, 130)'
                      ]
                    }]
                  }}
                  height={200}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Weekly XP</CardTitle>
                <CardDescription>Experience points earned</CardDescription>
              </CardHeader>
              <CardContent>
                <BarChart 
                  data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                      label: 'XP',
                      data: [40, 60, 30, 70, 50, 80, 55],
                      backgroundColor: 'rgb(14, 137, 227)',
                    }]
                  }}
                  showLegend={false}
                  height={200}
                />
                <div className="mt-2 text-center text-sm text-muted-foreground">
                  <span className="font-medium text-verbo-700">385 XP</span> gained this week
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Skill Proficiency</CardTitle>
              <CardDescription>Your current Spanish language skills</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Radar 
                  data={{
                    labels: ['Vocabulary', 'Grammar', 'Pronunciation', 'Listening', 'Reading', 'Writing', 'Speaking'],
                    datasets: [{
                      label: 'Current Level',
                      data: [65, 59, 80, 71, 56, 55, 60],
                      backgroundColor: 'rgba(30, 171, 240, 0.2)',
                      borderColor: 'rgb(30, 171, 240)',
                      pointBackgroundColor: 'rgb(30, 171, 240)',
                    },
                    {
                      label: 'One Month Ago',
                      data: [55, 45, 65, 60, 50, 45, 40],
                      backgroundColor: 'rgba(18, 90, 164, 0.2)',
                      borderColor: 'rgb(18, 90, 164)',
                      pointBackgroundColor: 'rgb(18, 90, 164)',
                    }]
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vocabulary Growth</CardTitle>
                <CardDescription>Words learned over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <LineChart 
                    data={{
                      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                      datasets: [{
                        label: 'Words',
                        data: [50, 120, 180, 240],
                        borderColor: 'rgb(30, 171, 240)',
                        backgroundColor: 'rgba(30, 171, 240, 0.1)',
                        tension: 0.3,
                        fill: true
                      }]
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pronunciation Accuracy</CardTitle>
                <CardDescription>Performance in speech exercises</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart 
                    data={{
                      labels: ['R sound', 'Ñ sound', 'J sound', 'LL sound', 'Z sound'],
                      datasets: [{
                        label: 'Score (%)',
                        data: [65, 85, 60, 75, 70],
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.7)',
                          'rgba(75, 192, 192, 0.7)',
                          'rgba(255, 159, 64, 0.7)',
                          'rgba(54, 162, 235, 0.7)',
                          'rgba(153, 102, 255, 0.7)'
                        ]
                      }]
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Grammar Mastery</CardTitle>
                <CardDescription>Tenses and structures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart 
                    data={{
                      labels: ['Present', 'Past', 'Future', 'Subjunctive', 'Conditional'],
                      datasets: [{
                        label: 'Mastery (%)',
                        data: [85, 65, 55, 40, 50],
                        backgroundColor: 'rgba(14, 137, 227, 0.7)'
                      }]
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Common Errors</CardTitle>
                <CardDescription>Frequency of mistake types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart 
                    data={{
                      labels: ['Gender Agreement', 'Verb Conjugation', 'Preposition Use', 'Word Order', 'Accent Marks'],
                      datasets: [{
                        data: [35, 25, 20, 10, 10],
                        backgroundColor: [
                          'rgb(255, 99, 132)',
                          'rgb(255, 159, 64)',
                          'rgb(255, 205, 86)',
                          'rgb(75, 192, 192)',
                          'rgb(54, 162, 235)'
                        ]
                      }]
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Path Progress</CardTitle>
              <CardDescription>Your journey towards fluency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <LineChart 
                  data={{
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                      label: 'Overall Fluency',
                      data: [10, 25, 35, 50, 60, 65],
                      borderColor: 'rgb(30, 171, 240)',
                      tension: 0.3,
                      yAxisID: 'y'
                    },
                    {
                      label: 'Lessons Completed',
                      data: [5, 15, 25, 40, 55, 72],
                      borderColor: 'rgb(255, 159, 64)',
                      tension: 0.3,
                      yAxisID: 'y1'
                    }]
                  }}
                  options={{
                    scales: {
                      y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                          display: true,
                          text: 'Fluency (%)'
                        }
                      },
                      y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                          display: true,
                          text: 'Lessons'
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Activity Distribution</CardTitle>
                <CardDescription>Time spent on different activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart 
                    data={{
                      labels: ['Lessons', 'Conversations', 'Pronunciation', 'Role-play', 'Vocabulary Practice'],
                      datasets: [{
                        data: [30, 25, 20, 15, 10],
                        backgroundColor: [
                          'rgb(30, 171, 240)',
                          'rgb(255, 99, 132)',
                          'rgb(255, 205, 86)',
                          'rgb(75, 192, 192)',
                          'rgb(153, 102, 255)'
                        ]
                      }]
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Minutes spent each day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart 
                    data={{
                      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                      datasets: [
                        {
                          label: 'Lessons',
                          data: [10, 15, 5, 20, 10, 15, 10],
                          backgroundColor: 'rgba(30, 171, 240, 0.7)',
                        },
                        {
                          label: 'Conversations',
                          data: [5, 10, 5, 10, 5, 15, 10],
                          backgroundColor: 'rgba(255, 99, 132, 0.7)',
                        },
                        {
                          label: 'Pronunciation',
                          data: [0, 0, 0, 0, 5, 5, 5],
                          backgroundColor: 'rgba(255, 205, 86, 0.7)',
                        }
                      ]
                    }}
                    options={{
                      scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: true,
                          title: {
                            display: true,
                            text: 'Minutes'
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Performance;
