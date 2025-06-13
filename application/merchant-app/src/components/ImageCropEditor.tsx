import { useRef } from 'react';
import { Cropper, CircleStencil } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';
import type { CropperRef as AdvancedCropperRef } from 'react-advanced-cropper';
import { TransparencyBackground } from './TransparencyBackground';

interface ImageCropEditorProps {
  imageSrc: string;
  cropShape?: 'circle' | 'square';
  originalFileType: string;
  targetImageDimensions: { width: number; height: number };
  onAPIReady: (getBlob: () => Promise<Blob>) => void;
}

export const ImageCropEditor: React.FC<ImageCropEditorProps> = ({
  imageSrc,
  cropShape = 'circle',
  originalFileType,
  targetImageDimensions,
  onAPIReady
}) => {
  const cropperRef = useRef<AdvancedCropperRef>(null);

  const getProcessedBlob = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const tryGetCanvas = (attempts = 0) => {
        const canvas = cropperRef.current?.getCanvas();
        
        if (!canvas) {
          if (attempts < 3) {
            setTimeout(() => tryGetCanvas(attempts + 1), 100);
            return;
          }
          return reject(new Error('Failed to get cropped canvas after multiple attempts'));
        }
        
        processCanvas(canvas);
      };
      
      const processCanvas = (canvas: HTMLCanvasElement) => {

      let processedCanvas = canvas;

      if (canvas.width !== targetImageDimensions.width || canvas.height !== targetImageDimensions.height) {
        const resizeCanvas = document.createElement('canvas');
        const ctx = resizeCanvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas error'));

        resizeCanvas.width = targetImageDimensions.width;
        resizeCanvas.height = targetImageDimensions.height;

        if (cropShape === 'circle') {
          ctx.save();
          ctx.beginPath();
          ctx.arc(resizeCanvas.width / 2, resizeCanvas.height / 2, Math.min(resizeCanvas.width, resizeCanvas.height) / 2, 0, Math.PI * 2);
          ctx.clip();
        }

        ctx.drawImage(canvas, 0, 0, resizeCanvas.width, resizeCanvas.height);

        if (cropShape === 'circle') {
          ctx.restore();
        }

        processedCanvas = resizeCanvas;
      }

      const ctx = processedCanvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context error'));
      
      const imageData = ctx.getImageData(0, 0, processedCanvas.width, processedCanvas.height);
      const hasTransparency = imageData.data.some((_, i) => i % 4 === 3 && imageData.data[i] < 255);

      let format = originalFileType;
      let quality: number | undefined = 0.9;

      if (hasTransparency && (originalFileType === 'image/jpeg' || originalFileType === 'image/jpg')) {
        format = 'image/png';
        quality = undefined;
      } else if (!hasTransparency && originalFileType === 'image/png') {
        format = 'image/webp';
        quality = 0.9;
      } else if (originalFileType === 'image/png') {
        quality = undefined;
      }

      processedCanvas.toBlob((blob) => {
        blob ? resolve(blob) : reject(new Error('Failed to create image blob'));
      }, format, quality);
      };
      
      tryGetCanvas();
    });
  };

  const handleCropperReady = () => {
    onAPIReady(getProcessedBlob);
  };

  return (
    <TransparencyBackground
      sx={{
        width: '100%',
        aspectRatio: '1',
        maxWidth: '600px',
        maxHeight: '600px',
        border: '2px solid #8d6e63',
        borderRadius: '8px',
        overflow: 'hidden',
        position: 'relative',
        '& .advanced-cropper': {
          background: 'transparent',
          width: '100%',
          height: '100%'
        },
        '& .advanced-cropper__background': {
          background: 'transparent !important'
        },
        '& .advanced-cropper__image': {
          maxWidth: '70%',
          maxHeight: '70%',
          objectFit: 'contain'
        }
      }}
    >
      <Cropper
        ref={cropperRef}
        src={imageSrc}
        className="advanced-cropper"
        stencilComponent={cropShape === 'circle' ? CircleStencil : undefined}
        stencilProps={{
          aspectRatio: cropShape === 'circle' ? 1 : undefined,
          resizable: true,
          movable: true,
          lines: cropShape === 'square',
          handlers: true
        }}
        backgroundWrapperProps={{
          scaleImage: false,
          moveImage: false
        }}
        onReady={handleCropperReady}
        imageRestriction={'none' as any}
        checkOrientation={false}
        canvas={true}
        transitions={true}
      />
    </TransparencyBackground>
  );
}; 