
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";
import React from "react";

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
export default EmptyLessonsState;
