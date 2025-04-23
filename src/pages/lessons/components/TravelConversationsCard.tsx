
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { MessageCircle, Book, Button } from "@/components/ui/button";
import React from "react";

const TravelConversationsCard = () => (
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
);
export default TravelConversationsCard;
