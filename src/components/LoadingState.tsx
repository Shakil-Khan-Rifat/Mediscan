import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export function LoadingState() {
  return (
    <Card className="p-12 animate-fade-in-up">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative">
          <div className="absolute inset-0 animate-pulse-glow rounded-full bg-primary/20" />
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
        <div className="text-center font-bangla space-y-2">
          <h3 className="text-xl font-semibold">বিশ্লেষণ করা হচ্ছে...</h3>
          <p className="text-muted-foreground">আপনার রিপোর্ট প্রসেস করা হচ্ছে</p>
          <p className="text-sm text-primary font-semibold">৩০ সেকেন্ড ওয়েট করুন</p>
        </div>
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </Card>
  );
}
