"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export function StartNewAssessmentDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Start New Assessment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Start New Assessment</DialogTitle>
          <DialogDescription>
            You&apos;re about to start a new assessment. Good luck!
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p>
            This is where you would typically see instructions or a list of
            available assessments to start.
          </p>
        </div>
        <Button onClick={() => setIsOpen(false)}>Close</Button>
      </DialogContent>
    </Dialog>
  );
}
