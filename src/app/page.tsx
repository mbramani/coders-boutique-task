import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button asChild>
        <Link href="/dashboard">Go to the Dashboard</Link>
      </Button>
    </div>
  );
}
