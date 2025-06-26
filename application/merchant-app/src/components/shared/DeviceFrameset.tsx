import React from 'react';
import { DeviceFrameset as ReactDeviceFrameset } from 'react-device-frameset';
import 'react-device-frameset/styles/marvel-devices.min.css';

interface DeviceFramesetProps {
  children: React.ReactNode;
  device?: 'iPhone X' | 'iPhone 8' | 'iPhone 8 Plus' | 'iPhone 5s' | 'iPhone 5c' | 'iPhone 4s' | 'Galaxy Note 8' | 'Nexus 5' | 'Lumia 920' | 'Samsung Galaxy S5' | 'HTC One' | 'iPad Mini' | 'MacBook Pro';
  color?: 'black' | 'silver' | 'gold' | 'white' | 'red' | 'yellow' | 'green' | 'blue';
  landscape?: boolean;
  width?: number;
  height?: number;
  zoom?: number;
  className?: string;
}

export const DeviceFrameset: React.FC<DeviceFramesetProps> = ({
  children,
  device = 'iPhone X',
  color,
  landscape = false,
  width,
  height,
  zoom,
  className
}) => {
  const deviceProps: any = {
    device,
    landscape,
    ...(width && { width }),
    ...(height && { height }),
    ...(zoom && { zoom })
  };

  // Add color prop only for devices that support it
  if (color && ['iPhone 8', 'iPhone 8 Plus', 'iPhone 5s', 'iPhone 5c', 'iPhone 4s', 'Lumia 920', 'Samsung Galaxy S5', 'iPad Mini'].includes(device)) {
    deviceProps.color = color;
  }

  return (
    <div className={className}>
      <ReactDeviceFrameset {...deviceProps}>
        {children}
      </ReactDeviceFrameset>
    </div>
  );
}; 