
import { useState, useEffect } from "react";
import { RotateCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProcessingStatusProps {
  fileName: string;
  fileType: "image" | "document" | "spreadsheet";
  onComplete?: () => void;
}

const ProcessingStatus = ({ fileName, fileType, onComplete }: ProcessingStatusProps) => {
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("Initializing...");

  useEffect(() => {
    // Simulate processing stages
    const simulateProcessing = () => {
      const stages = {
        image: [
          { progress: 10, message: "Analyzing image..." },
          { progress: 30, message: "Performing OCR..." },
          { progress: 50, message: "Extracting text..." },
          { progress: 70, message: "Formatting data..." },
          { progress: 90, message: "Finalizing..." },
          { progress: 100, message: "Processing complete!" },
        ],
        document: [
          { progress: 10, message: "Parsing document..." },
          { progress: 30, message: "Extracting content..." },
          { progress: 50, message: "Analyzing structure..." },
          { progress: 70, message: "Formatting data..." },
          { progress: 90, message: "Finalizing..." },
          { progress: 100, message: "Processing complete!" },
        ],
        spreadsheet: [
          { progress: 10, message: "Parsing spreadsheet..." },
          { progress: 30, message: "Reading cells..." },
          { progress: 50, message: "Validating formulas..." },
          { progress: 70, message: "Analyzing data..." },
          { progress: 90, message: "Finalizing..." },
          { progress: 100, message: "Processing complete!" },
        ],
      };

      const currentStages = stages[fileType];
      let stageIndex = 0;

      const progressInterval = setInterval(() => {
        if (stageIndex < currentStages.length) {
          const { progress, message } = currentStages[stageIndex];
          setProgress(progress);
          setStatusMessage(message);
          stageIndex++;
        } else {
          clearInterval(progressInterval);
          setStatus("success");
          if (onComplete) {
            onComplete();
          }
        }
      }, 1000);

      // Simulate random error (uncomment to test)
      // if (Math.random() > 0.8) {
      //   clearInterval(progressInterval);
      //   setStatus("error");
      //   setStatusMessage("Error processing file. Please try again.");
      // }

      return () => clearInterval(progressInterval);
    };

    simulateProcessing();
  }, [fileType, onComplete]);

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium truncate">{fileName}</h3>
          <p className="text-sm text-muted-foreground">
            {status === "processing" ? "Processing..." : status === "success" ? "Completed" : "Failed"}
          </p>
        </div>
        <div>
          {status === "processing" ? (
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center animate-spin">
              <RotateCw className="h-4 w-4 text-primary" />
            </div>
          ) : status === "success" ? (
            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </div>
          ) : (
            <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 text-red-600" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{statusMessage}</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default ProcessingStatus;
