
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React from "react";

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
export default CoursesSkeletonLoader;
