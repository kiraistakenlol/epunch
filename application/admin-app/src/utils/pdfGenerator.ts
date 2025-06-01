import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { MerchantDto } from 'e-punch-common-core';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { CupHot, CupHotFill } from 'react-bootstrap-icons';

// Function to extract SVG markup from a React Bootstrap Icon component
const getIconSvg = async (IconComponent: React.ComponentType<any>, size: number = 28): Promise<string> => {
  return new Promise((resolve) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    document.body.appendChild(tempDiv);

    const root = createRoot(tempDiv);
    root.render(React.createElement(IconComponent, { size }));

    // Give React time to render
    setTimeout(() => {
      const svgElement = tempDiv.querySelector('svg');
      if (svgElement) {
        const svgMarkup = svgElement.outerHTML;
        root.unmount();
        document.body.removeChild(tempDiv);
        resolve(svgMarkup);
      } else {
        root.unmount();
        document.body.removeChild(tempDiv);
        resolve('');
      }
    }, 10);
  });
};

export const generateMerchantQRPDF = async (merchant: MerchantDto): Promise<void> => {
  const qrCodeUrl = `https://narrow-ai-epunch.vercel.app?merchant=${merchant.slug}`;
  
  // Generate QR code as data URL
  const qrCodeDataURL = await QRCode.toDataURL(qrCodeUrl, {
    width: 200,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });

  // Get the exact SVG markup from react-bootstrap-icons
  const emptyCupSvg = await getIconSvg(CupHot, 28);
  const filledCupSvg = await getIconSvg(CupHotFill, 28);
  
  const tempContainer = document.createElement('div');
  tempContainer.style.position = 'absolute';
  tempContainer.style.left = '-9999px';
  tempContainer.style.top = '-9999px';
  tempContainer.style.width = '800px';
  tempContainer.style.height = '600px';
  tempContainer.style.backgroundColor = '#424242';
  tempContainer.style.padding = '40px';
  tempContainer.style.fontFamily = 'Arial, sans-serif';
  
  tempContainer.innerHTML = `
    <div style="
      width: 100%;
      height: 100%;
      background: #424242;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 30px;
      box-sizing: border-box;
    ">
      <!-- Header -->
      <div style="margin-bottom: 20px;">
        <h1 style="
          font-weight: bold;
          color: #f5f5dc;
          margin: 0;
          font-size: 4rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        ">${merchant.name}</h1>
      </div>

      <!-- QR Code and Punch Card Container -->
      <div style="
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 40px;
      ">
        <!-- QR Code -->
        <div style="
          padding: 20px;
          background-color: #f5f5dc;
          border-radius: 12px;
          border: 3px solid #5d4037;
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img src="${qrCodeDataURL}" style="width: 200px; height: 200px;" alt="QR Code" />
        </div>

        <!-- Arrow -->
        <div style="
          color: #f5f5dc;
          font-size: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
        ">→</div>

        <!-- Mock Punch Card -->
        <div style="
          width: 280px;
          height: 180px;
          background-color: #8d6e63;
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(93, 64, 55, 0.3);
        ">
          <!-- Header -->
          <div style="
            background-color: #5d4037;
            color: #f5f5dc;
            padding: 12px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          ">
            <span style="font-weight: bold; font-size: 1.1rem;">${merchant.name}</span>
          </div>

          <!-- Body -->
          <div style="
            padding: 15px;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
          ">
            <!-- Punch circles -->
            <div style="
              display: grid;
              grid-template-columns: repeat(5, 1fr);
              gap: 6px;
              width: 100%;
              justify-items: center;
            ">
              ${[...Array(10)].map((_, index) => {
                const isFilled = index < 3;
                const cupSvg = isFilled ? filledCupSvg : emptyCupSvg;
                const color = isFilled ? '#3e2723' : 'rgba(250, 250, 232, 0.78)';
                
                // Modify the SVG to use our desired color
                const coloredSvg = cupSvg.replace(/fill="[^"]*"/g, `fill="${color}"`);
                
                return `<div style="
                  width: 28px;
                  height: 28px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                ">${coloredSvg}</div>`;
              }).join('')}
            </div>

            <!-- Program name -->
            <div style="
              color: #f5f5dc;
              font-size: 0.9rem;
              font-weight: 500;
              text-align: center;
            ">
              Buy 10, Get 1 Free
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(tempContainer);

  try {
    // Wait for the image to load
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(tempContainer, {
      backgroundColor: '#424242',
      width: 800,
      height: 600,
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });

    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    
    const y = (pdfHeight - imgHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', 0, y, imgWidth, imgHeight);
    
    const fileName = `${merchant.name.replace(/[^a-zA-Z0-9]/g, '_')}_QR_Code.pdf`;
    pdf.save(fileName);

  } finally {
    document.body.removeChild(tempContainer);
  }
}; 