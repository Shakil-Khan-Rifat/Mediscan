import { useState, useRef } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
}

export function ImageUpload({ onImageSelect, selectedImage, onClear }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClear = () => {
    setPreview(null);
    onClear();
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  return (
    <div className="w-full space-y-4">
      {!preview ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card
            className="p-8 border-2 border-dashed border-primary/30 hover:border-primary cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-card to-muted/20"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="p-4 rounded-full bg-primary/10 animate-pulse-glow">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="font-bangla">
                <h3 className="font-semibold text-lg">গ্যালারি থেকে আপলোড</h3>
                <p className="text-sm text-muted-foreground">রিপোর্ট বা ওষুধের ছবি নির্বাচন করুন</p>
              </div>
            </div>
          </Card>

          <Card
            className="p-8 border-2 border-dashed border-secondary/30 hover:border-secondary cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 bg-gradient-to-br from-card to-muted/20"
            onClick={() => cameraInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="p-4 rounded-full bg-secondary/10 animate-pulse-glow">
                <Camera className="h-8 w-8 text-secondary" />
              </div>
              <div className="font-bangla">
                <h3 className="font-semibold text-lg">ক্যামেরা দিয়ে তুলুন</h3>
                <p className="text-sm text-muted-foreground">সরাসরি ছবি তুলুন</p>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <Card className="relative p-4 animate-fade-in-up">
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 z-10 rounded-full"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </Card>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
      />
    </div>
  );
}
