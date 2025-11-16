import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { LoadingState } from "@/components/LoadingState";
import { Button } from "@/components/ui/button";
import { Sparkles, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const WEBHOOK_URL = "https://n8n.srv915514.hstgr.cloud/webhook/mediscan";

interface AnalysisData {
  status: string;
  medical_reports?: Array<{
    name: string;
    type: string;
    meaning_bn: string;
    next_steps_bn: string;
  }>;
  medicines?: Array<{
    name: string;
    work_bn: string;
    side_effects_bn: string;
  }>;
  summary: {
    total_reports: number;
    total_medicines: number;
    note_bn: string;
  };
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisData | null>(null);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (analysisResult) {
        setSelectedImage(null);
        setAnalysisResult(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [analysisResult]);

  // Push history state when showing results
  useEffect(() => {
    if (analysisResult) {
      window.history.pushState({ hasResults: true }, '', '');
    }
  }, [analysisResult]);

  // Compress image before upload for faster mobile performance
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // More aggressive compression for mobile devices
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          const maxSize = isMobile ? 800 : 1200; // Smaller size for mobile
          const quality = isMobile ? 0.7 : 0.85; // Lower quality for mobile
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(new File([blob], file.name, { type: 'image/jpeg' }));
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast.error("অনুগ্রহ করে একটি ছবি নির্বাচন করুন");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Compress image before uploading
      const compressedImage = await compressImage(selectedImage);
      
      const formData = new FormData();
      formData.append("file", compressedImage);

      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("বিশ্লেষণ ব্যর্থ হয়েছে");
      }

      const data = await response.json();
      
      // Parse the response - n8n might return the output in different formats
      let parsedData: AnalysisData;
      
      if (typeof data.output === 'string') {
        // If output is a string, try to parse it
        parsedData = JSON.parse(data.output);
      } else if (data.output) {
        // If output is already an object
        parsedData = data.output;
      } else {
        // If data itself contains the expected structure
        parsedData = data;
      }

      setAnalysisResult(parsedData);
      toast.success("বিশ্লেষণ সম্পন্ন হয়েছে!");
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("বিশ্লেষণে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    // Go back in history if we pushed a state
    if (window.history.state?.hasResults) {
      window.history.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <ThemeToggle />
      
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-4 mb-6 rounded-full bg-gradient-to-r from-primary to-secondary animate-float">
            <Sparkles className="h-12 w-12 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MediScan
          </h1>
          <p className="text-xl font-bangla text-muted-foreground">
            মেডিকেল রিপোর্ট ও ওষুধ বিশ্লেষক
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            AI-Powered Medical Analysis in Bangla
          </p>
        </div>

        {/* Info Banner */}
        <div className="mb-8 p-4 rounded-lg bg-primary/10 border border-primary/20 flex items-start gap-3 animate-fade-in-up">
          <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm font-bangla text-muted-foreground">
            মেডিকেল রিপোর্ট বা ওষুধের ছবি আপলোড করুন। AI আপনাকে বাংলায় বিশদ তথ্য প্রদান করবে।
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {!analysisResult ? (
            <>
              <ImageUpload
                onImageSelect={setSelectedImage}
                selectedImage={selectedImage}
                onClear={() => setSelectedImage(null)}
              />

              {selectedImage && !isAnalyzing && (
                <div className="flex justify-center animate-fade-in-up">
                  <Button
                    size="lg"
                    onClick={handleAnalyze}
                    className="font-bangla text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    বিশ্লেষণ শুরু করুন
                  </Button>
                </div>
              )}

              {isAnalyzing && <LoadingState />}
            </>
          ) : (
            <>
              <AnalysisResults data={analysisResult} />
              <div className="flex justify-center">
                <Button
                  size="lg"
                  onClick={handleReset}
                  variant="outline"
                  className="font-bangla text-lg px-8"
                >
                  নতুন বিশ্লেষণ
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p className="font-bangla">
            দ্রষ্টব্য: এই তথ্য শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে। পেশাদার চিকিৎসা পরামর্শের বিকল্প নয়।
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
