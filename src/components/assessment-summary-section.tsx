import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";
import { Status } from "@prisma/client";
import db from "@/lib/db";

type AssessmentCounts = {
  totalAssessments: number;
  completedAssessments: number;
};

async function getAssessmentCounts(): Promise<AssessmentCounts> {
  const totalAssessments = await db.assessment.count();
  const completedAssessments = await db.assessment.count({
    where: { status: Status.COMPLETED },
  });

  return { totalAssessments, completedAssessments };
}

export async function AssessmentSummarySection() {
  const { totalAssessments, completedAssessments } =
    await getAssessmentCounts();
  const completionRate =
    totalAssessments > 0 ? (completedAssessments / totalAssessments) * 100 : 0;

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAssessments}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Completed Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedAssessments}</div>
        </CardContent>
      </Card>
      <Card className="col-span-2">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">
            {completionRate.toFixed(1)}%
          </div>
          <Progress value={completionRate} className="w-full" />
        </CardContent>
      </Card>
    </section>
  );
}
