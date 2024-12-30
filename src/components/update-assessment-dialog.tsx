"use client";

import { Assessment, Status } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApi } from "@/hooks/use-api";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type UpdateAssessmentDialogProps = {
  assessment: Assessment;
  onUpdate: () => void;
};

export function UpdateAssessmentDialog({
  assessment,
  onUpdate,
}: UpdateAssessmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(assessment.status);
  const [score, setScore] = useState(assessment.score || 0);
  const { toast } = useToast();

  const [{ loading, error }, updateAssessment] = useApi<
    Pick<Assessment, "status" | "score">
  >(`/api/assessments/${assessment.id}`);

  const handleUpdate = async () => {
    await updateAssessment({
      method: "PUT",
      body: {
        status,
        score: score ? score : null,
      },
    });

    if (!error) {
      toast({
        title: "Success",
        description: "Assessment updated successfully",
      });
      onUpdate();
      setIsOpen(false);
    } else {
      toast({
        title: "Error",
        description: error || "Failed to update assessment",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Assessment</DialogTitle>
          <DialogDescription>
            Make changes to the assessment here. Click save when you&apos;re
            done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => setStatus(value as Status)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="score" className="text-right">
              Score
            </Label>
            <Input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value, 10))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
