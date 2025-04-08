
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera, X, RefreshCw } from "lucide-react";

interface CameraCaptureProps {
  onCapture: (imageBlobUrl: string) => void;
  onCancel: () => void;
}

const CameraCapture = ({ onCapture, onCancel }: CameraCaptureProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [hasCapture, setHasCapture] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      setError(null);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please ensure camera permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw the current video frame to the canvas
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to image URL
        const imageUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageUrl);
        setHasCapture(true);
        
        // Stop the camera since we have our photo
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setHasCapture(false);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex items-center justify-center">
        {error ? (
          <div className="text-white text-center p-4">
            <p>{error}</p>
          </div>
        ) : hasCapture && capturedImage ? (
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="max-h-full max-w-full object-contain" 
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="max-h-full max-w-full object-contain"
          />
        )}
        
        {/* Hidden canvas for capturing images */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex justify-center gap-4">
        {hasCapture ? (
          <>
            <Button variant="outline" onClick={retakePhoto}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>
            <Button onClick={confirmPhoto}>
              Use Photo
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={capturePhoto} disabled={!stream || !!error}>
              <Camera className="mr-2 h-4 w-4" />
              Capture
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
