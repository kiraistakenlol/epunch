import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Fab,
} from '@mui/material';
import {
  Print as PrintIcon,
  Close as CloseIcon,
  Star as StarIcon,
  LocalOffer as GiftIcon,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import { MerchantDto } from 'e-punch-common-core';

interface PrintableQRCodeProps {
  merchant: MerchantDto;
  onClose?: () => void;
}

export const PrintableQRCode: React.FC<PrintableQRCodeProps> = ({ merchant, onClose }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const handlePopState = () => {
      if (onClose) {
        onClose();
      } else {
        navigate(`/merchants/${merchant.id}`);
      }
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [onClose, navigate, merchant.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(`/merchants/${merchant.id}`);
    }
  };

  const qrCodeUrl = `https://narrow-ai-epunch.vercel.app?merchant=${merchant.slug}`;

  return (
    <Box>
      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            
            #printable-qr-content, #printable-qr-content * {
              visibility: visible;
            }
            
            #printable-qr-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              height: 100% !important;
              background: white !important;
              margin: 0 !important;
              padding: 0 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            .print-container {
              width: 8.5in !important;
              height: 11in !important;
              background: white !important;
              padding: 1in !important;
              box-sizing: border-box !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
            }
            
            .no-print {
              display: none !important;
            }
            
            @page {
              margin: 0;
              size: letter;
            }
          }
          
          @media screen {
            .print-container {
              min-height: 100vh;
              width: 100%;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              margin: 0;
              box-shadow: none;
            }
          }
        `
      }} />

      {/* Mobile Close Button */}
      <Fab
        className="no-print"
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          backgroundColor: '#fff',
          color: '#333',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          zIndex: 1000,
          '&:hover': {
            backgroundColor: '#f5f5f5',
          },
        }}
        onClick={handleClose}
      >
        <CloseIcon />
      </Fab>

      {/* Screen Controls */}
      <Box 
        className="no-print"
        sx={{ 
          position: 'fixed',
          top: 20,
          left: 20,
          display: 'flex',
          gap: 1,
          zIndex: 1000,
          '@media print': { display: 'none' }
        }}
      >
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            backgroundColor: '#fff',
            color: '#333',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            '&:hover': { backgroundColor: '#f5f5f5' },
          }}
        >
          Print
        </Button>
      </Box>

      {/* Printable Content */}
      <Box id="printable-qr-content">
        <Paper className="print-container" sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          
          {/* Fun Header */}
          <Box mb={4} textAlign="center">
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#fff',
                mb: 1,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                '@media print': { color: '#2c2c2c', textShadow: 'none' }
              }}
            >
              🎉 FREE REWARDS! 🎉
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                color: '#fff',
                fontWeight: 600,
                fontSize: { xs: '1.5rem', md: '2rem' },
                '@media print': { color: '#666' }
              }}
            >
              at {merchant.name}
            </Typography>
          </Box>

          {/* Benefits Section */}
          <Box mb={4} textAlign="center">
            <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={3}>
              <GiftIcon sx={{ fontSize: 40, color: '#FFD700' }} />
              <Typography 
                variant="h4" 
                sx={{ 
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: { xs: '1.8rem', md: '2.2rem' },
                  '@media print': { color: '#2c2c2c' }
                }}
              >
                Get FREE Stuff!
              </Typography>
              <GiftIcon sx={{ fontSize: 40, color: '#FFD700' }} />
            </Box>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                mb: 3,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                fontWeight: 500,
                '@media print': { color: '#495057' }
              }}
            >
              Scan once → Get loyalty cards → Earn rewards automatically! 
            </Typography>
          </Box>

          {/* QR Code */}
          <Box 
            sx={{ 
              mb: 4,
              p: 3,
              backgroundColor: '#fff',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              border: '4px solid #FFD700',
            }}
          >
            <QRCodeSVG 
              value={qrCodeUrl}
              size={220}
              level="H"
              includeMargin={true}
              fgColor="#000000"
              bgColor="#ffffff"
            />
          </Box>

          {/* Simple Instructions */}
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#fff',
                fontWeight: 'bold',
                mb: 2,
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                '@media print': { color: '#2c2c2c' }
              }}
            >
              📱 Just point your phone camera here!
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                fontSize: { xs: '1rem', md: '1.2rem' },
                fontStyle: 'italic',
                '@media print': { color: '#666' }
              }}
            >
              No app downloads. No sign-ups. Just instant rewards! ✨
            </Typography>
          </Box>

          {/* Footer */}
          <Box display="flex" alignItems="center" justifyContent="center" gap={1} flexWrap="wrap">
            {[1,2,3].map((star) => (
              <StarIcon key={star} sx={{ color: '#FFD700', fontSize: 30 }} />
            ))}
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#fff',
                fontWeight: 'bold',
                mx: 2,
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                '@media print': { color: '#5d4037' }
              }}
            >
              Start collecting today!
            </Typography>
            {[1,2,3].map((star) => (
              <StarIcon key={star + 3} sx={{ color: '#FFD700', fontSize: 30 }} />
            ))}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}; 