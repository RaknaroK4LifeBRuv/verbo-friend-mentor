
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { LockIcon, Progress } from "lucide-react";
import React from "react";

const LockedAdvancedCard = () => (
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
        <div className="w-full max-w-xs">
          <Progress value={0} className="h-2" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">0% Progress on prerequisites</p>
      </div>
    </CardContent>
  </Card>
);
export default LockedAdvancedCard;
