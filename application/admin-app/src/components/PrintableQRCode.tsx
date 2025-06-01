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
  ArrowForward as ArrowForwardIcon,
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

  // Mock punch card component
  const MockPunchCard = () => (
    <Box
      sx={{
        width: '280px',
        height: '180px',
        backgroundColor: '#8d6e63',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(93, 64, 55, 0.3)',
        '@media print': {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#5d4037',
          color: '#f5f5dc',
          padding: '12px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
          {merchant.name}
        </Typography>
      </Box>

      {/* Body */}
      <Box
        sx={{
          padding: '15px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        {/* Punch circles */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '6px',
            width: '100%',
            justifyItems: 'center',
          }}
        >
          {[...Array(10)].map((_, index) => (
            <Box
              key={index}
              sx={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                border: '2px solid #5d4037',
                backgroundColor: index < 3 ? '#5d4037' : 'transparent',
              }}
            />
          ))}
        </Box>

        {/* Program name */}
        <Typography
          variant="body2"
          sx={{
            color: '#f5f5dc',
            fontSize: '0.9rem',
            fontWeight: 'medium',
            textAlign: 'center',
          }}
        >
          Buy 10, Get 1 Free
        </Typography>
      </Box>
    </Box>
  );

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
              background: #424242;
              margin: 0;
              box-shadow: none;
            }
          }
        `
      }} />

      {/* Close Button */}
      <Fab
        className="no-print"
        sx={{
          position: 'fixed',
          top: 20,
          right: 20,
          backgroundColor: '#8d6e63',
          color: '#f5f5dc',
          zIndex: 1000,
          '&:hover': {
            backgroundColor: '#795548',
          },
        }}
        onClick={handleClose}
      >
        <CloseIcon />
      </Fab>

      {/* Print Button */}
      <Box 
        className="no-print"
        sx={{ 
          position: 'fixed',
          top: 20,
          left: 20,
          zIndex: 1000,
        }}
      >
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          sx={{
            backgroundColor: '#8d6e63',
            color: '#f5f5dc',
            '&:hover': { 
              backgroundColor: '#795548',
            },
          }}
        >
          Print
        </Button>
      </Box>

      {/* Printable Content */}
      <Box id="printable-qr-content">
        <Paper className="print-container" sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
          
          {/* Header */}
          <Box mb={4} textAlign="center">
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 'bold', 
                color: '#f5f5dc',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '4rem' },
                '@media print': { color: '#424242' }
              }}
            >
              {merchant.name}
            </Typography>
          </Box>

          {/* QR Code and Punch Card Side by Side */}
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              mb: 3,
              flexDirection: { xs: 'column', md: 'row' },
            }}
          >
            {/* QR Code */}
            <Box 
              sx={{ 
                p: 3,
                backgroundColor: '#f5f5dc',
                borderRadius: '12px',
                border: '3px solid #5d4037',
              }}
            >
              <QRCodeSVG 
                value={qrCodeUrl}
                size={200}
                level="H"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </Box>

            {/* Arrow */}
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowForwardIcon 
                sx={{ 
                  fontSize: 48,
                  color: '#f5f5dc',
                  '@media print': { color: '#5d4037' }
                }} 
              />
            </Box>

            {/* Mock Punch Card */}
            <Box>
              <MockPunchCard />
            </Box>
          </Box>

        </Paper>
      </Box>
    </Box>
  );
}; 