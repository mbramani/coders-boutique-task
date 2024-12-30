import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { AssessmentSummarySection } from "@/components/assessment-summary-section";
import { AssessmentsOverviewSection } from "@/components/assessments-overview-section";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Suspense fallback={<AssessmentSummarySkeleton />}>
        <AssessmentSummarySection />
      </Suspense>
      <AssessmentsOverviewSection />
    </div>
  );
}

function AssessmentSummarySkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {["Total Assessments", "Completed Assessments", "Completion Rate"].map(
        (title) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-20" />
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
