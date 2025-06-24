import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  Download as DownloadIcon,
} from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { generateOnboardingImage, downloadImage } from '../../utils/onboardingImageUtil';
import { showSuccessToast, showErrorToast } from '../../utils/toast';

export const WelcomeQRPage: React.FC = () => {
  const { merchant, loading: merchantLoading, error: merchantError } = useAppSelector((state) => state.merchant);
  const [onboardingImageUrl, setOnboardingImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [loyaltyProgramName, setLoyaltyProgramName] = useState<string>('');
  const [title, setTitle] = useState<string>();
  const [backgroundColor, setBackgroundColor] = useState<string>('#424242');
  const [qrCodeBackgroundColor, setQrCodeBackgroundColor] = useState<string>('#ffffff');
  const [titleColor, setTitleColor] = useState<string>('#f5f5dc');

  useEffect(() => {
    if (merchant && !title) {
      setTitle(merchant.name);
      if (!loyaltyProgramName) {
        setLoyaltyProgramName(`${merchant.name} Rewards`);
      }
    }
  }, [merchant, title, loyaltyProgramName]);

  useEffect(() => {
    if (merchant && !onboardingImageUrl && !isGeneratingImage && title) {
      generateOnboardingImagePreview();
    }
  }, [merchant, title]);

  const generateOnboardingImagePreview = async () => {
    if (!merchant || !title) return;

    try {
      setIsGeneratingImage(true);
      const imageDataUrl = await generateOnboardingImage(
        merchant,
        backgroundColor,
        qrCodeBackgroundColor,
        titleColor,
        title,
        loyaltyProgramName
      );
      setOnboardingImageUrl(imageDataUrl);
    } catch (error: any) {
      console.error('Failed to generate onboarding image:', error);
      showErrorToast('Failed to generate image preview');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!merchant || !onboardingImageUrl) return;

    try {
      const filename = `${merchant.name.replace(/[^a-zA-Z0-9]/g, '_')}_Welcome_QR.png`;
      downloadImage(onboardingImageUrl, filename);
      showSuccessToast('Image downloaded successfully!');
    } catch (error: any) {
      console.error('Failed to download image:', error);
      showErrorToast('Failed to download image');
    }
  };

  const handleRegenerateImage = () => {
    setOnboardingImageUrl(null);
    if (merchant) {
      generateOnboardingImagePreview();
    }
  };

  if (merchantLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  };

  if (merchantError) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading merchant data: {merchantError}
        </Typography>
      </Box>
    );
  }

  if (!merchant) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="error" gutterBottom>
          Unable to load merchant data
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: '#f5f5dc',
          fontWeight: 'bold',
          textShadow: '1px 1px 1px #3e2723',
          mb: 3,
        }}
      >
        Welcome QR Code
      </Typography>

      <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            display="flex"
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={4}
          >
            {/* Controls Block */}
            <Box sx={{
              flex: { xs: '1', md: '0 0 400px' },
              order: { xs: 2, md: 1 }
            }}>
              {/* Controls */}
              <TextField
                fullWidth
                label="Title"
                placeholder="Your business name or title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    fontSize: '1.1rem',
                    '& fieldset': { borderColor: '#8d6e63' },
                    '&:hover fieldset': { borderColor: '#5d4037' },
                    '&.Mui-focused fieldset': { borderColor: '#5d4037' },
                  },
                  '& .MuiInputLabel-root': { color: '#5d4037', fontSize: '1.1rem' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#5d4037' },
                }}
                helperText="This will be displayed as the main title on your QR code"
              />

              <TextField
                fullWidth
                label="Loyalty Program Name"
                placeholder="e.g., Coffee Rewards, VIP Program"
                value={loyaltyProgramName}
                onChange={(e) => setLoyaltyProgramName(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    fontSize: '1.1rem',
                    '& fieldset': { borderColor: '#8d6e63' },
                    '&:hover fieldset': { borderColor: '#5d4037' },
                    '&.Mui-focused fieldset': { borderColor: '#5d4037' },
                  },
                  '& .MuiInputLabel-root': { color: '#5d4037', fontSize: '1.1rem' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#5d4037' },
                }}
                helperText="Name of your loyalty program for the punch card"
              />

              <TextField
                fullWidth
                label="Background Color"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    fontSize: '1.1rem',
                    '& fieldset': { borderColor: '#8d6e63' },
                    '&:hover fieldset': { borderColor: '#5d4037' },
                    '&.Mui-focused fieldset': { borderColor: '#5d4037' },
                  },
                  '& .MuiInputLabel-root': { color: '#5d4037', fontSize: '1.1rem' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#5d4037' },
                }}
                helperText="Choose the background color for your QR code image"
              />

              <TextField
                fullWidth
                label="QR Code Background Color"
                type="color"
                value={qrCodeBackgroundColor}
                onChange={(e) => setQrCodeBackgroundColor(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    fontSize: '1.1rem',
                    '& fieldset': { borderColor: '#8d6e63' },
                    '&:hover fieldset': { borderColor: '#5d4037' },
                    '&.Mui-focused fieldset': { borderColor: '#5d4037' },
                  },
                  '& .MuiInputLabel-root': { color: '#5d4037', fontSize: '1.1rem' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#5d4037' },
                }}
                helperText="Choose the QR code background color"
              />

              <TextField
                fullWidth
                label="Title Color"
                type="color"
                value={titleColor}
                onChange={(e) => setTitleColor(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#fff',
                    fontSize: '1.1rem',
                    '& fieldset': { borderColor: '#8d6e63' },
                    '&:hover fieldset': { borderColor: '#5d4037' },
                    '&.Mui-focused fieldset': { borderColor: '#5d4037' },
                  },
                  '& .MuiInputLabel-root': { color: '#5d4037', fontSize: '1.1rem' },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#5d4037' },
                }}
                helperText="Choose the color for title and text elements"
              />

              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  onClick={handleRegenerateImage}
                  disabled={isGeneratingImage}
                  sx={{
                    backgroundColor: '#5d4037',
                    color: '#f5f5dc',
                    '&:hover': { backgroundColor: '#6d4c41' },
                    '&:disabled': { backgroundColor: '#8d6e63' },
                    py: 1,
                    px: 2,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    minWidth: '160px',
                  }}
                >
                  Apply
                </Button>
              </Box>
            </Box>

            {/* Preview Block */}
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              order: { xs: 1, md: 2 }
            }}>
              {/* Image Preview */}
              {isGeneratingImage ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <CircularProgress sx={{ color: '#5d4037' }} />
                  <Typography variant="body1" sx={{ ml: 2, color: '#5d4037' }}>
                    Generating your QR code...
                  </Typography>
                </Box>
              ) : onboardingImageUrl ? (
                <>
                  <Box display="flex" justifyContent="center" mb={3}>
                    <Box
                      sx={{
                        border: '2px solid #5d4037',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                        maxWidth: '100%',
                      }}
                    >
                      <img
                        src={onboardingImageUrl}
                        alt="QR Code Image Preview"
                        style={{
                          width: '100%',
                          height: 'auto',
                          display: 'block',
                          maxWidth: 'min(1200px, 90vw)'
                        }}
                      />
                    </Box>
                  </Box>

                  <Box display="flex" justifyContent="center">
                    <Button
                      variant="contained"
                      startIcon={<DownloadIcon />}
                      onClick={handleDownloadImage}
                      disabled={!onboardingImageUrl}
                      sx={{
                        backgroundColor: '#5d4037',
                        color: '#f5f5dc',
                        '&:hover': { backgroundColor: '#6d4c41' },
                        '&:disabled': { backgroundColor: '#8d6e63' },
                        py: 1,
                        px: 2,
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        minWidth: '160px',
                      }}
                    >
                      Download
                    </Button>
                  </Box>
                </>
              ) : (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                  <Typography variant="body1" sx={{ color: '#8d6e63' }}>
                    Preview will appear here
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}; 