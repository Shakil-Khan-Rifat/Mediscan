import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Pill, Info } from "lucide-react";

interface MedicalReport {
  name: string;
  type: string;
  meaning_bn: string;
  next_steps_bn: string;
}

interface Medicine {
  name: string;
  work_bn: string;
  side_effects_bn: string;
}

interface AnalysisData {
  status: string;
  medical_reports?: MedicalReport[];
  medicines?: Medicine[];
  summary: {
    total_reports: number;
    total_medicines: number;
    note_bn: string;
  };
}

interface AnalysisResultsProps {
  data: AnalysisData;
}

export function AnalysisResults({ data }: AnalysisResultsProps) {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Summary Card */}
      <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-primary" />
            <CardTitle className="font-bangla">সারসংক্ষেপ</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="font-bangla space-y-2">
          <p className="text-lg">{data.summary.note_bn}</p>
          <div className="flex gap-2 mt-4">
            {data.summary.total_reports > 0 && (
              <Badge variant="secondary" className="font-bangla">
                {data.summary.total_reports} টি রিপোর্ট
              </Badge>
            )}
            {data.summary.total_medicines > 0 && (
              <Badge variant="secondary" className="font-bangla">
                {data.summary.total_medicines} টি ওষুধ
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical Reports */}
      {data.medical_reports && data.medical_reports.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-bangla flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            মেডিকেল রিপোর্ট
          </h2>
          {data.medical_reports.map((report, index) => (
            <Card
              key={index}
              className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="font-bangla flex items-center justify-between">
                  <span>{report.name}</span>
                  <Badge variant="outline">{report.type}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="font-bangla space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">ব্যাখ্যা:</h4>
                  <p className="text-muted-foreground leading-relaxed">{report.meaning_bn}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-secondary mb-2">পরবর্তী পদক্ষেপ:</h4>
                  <p className="text-muted-foreground leading-relaxed">{report.next_steps_bn}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Medicines */}
      {data.medicines && data.medicines.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-bangla flex items-center gap-2">
            <Pill className="h-6 w-6 text-secondary" />
            ওষুধের তথ্য
          </h2>
          {data.medicines.map((medicine, index) => (
            <Card
              key={index}
              className="border-l-4 border-l-secondary hover:shadow-lg transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="font-bangla">{medicine.name}</CardTitle>
              </CardHeader>
              <CardContent className="font-bangla space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">কাজ:</h4>
                  <p className="text-muted-foreground leading-relaxed">{medicine.work_bn}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-destructive mb-2">পার্শ্বপ্রতিক্রিয়া:</h4>
                  <p className="text-muted-foreground leading-relaxed">{medicine.side_effects_bn}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
