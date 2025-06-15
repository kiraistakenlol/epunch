import React from 'react';
import {
  Box,
  Typography,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import { IconLibrary, SVGProperties } from './types';

interface SVGPropertyEditorProps {
  properties: SVGProperties;
  onPropertiesChange: (properties: SVGProperties) => void;
  selectedLibrary: IconLibrary;
}

export const SVGPropertyEditor: React.FC<SVGPropertyEditorProps> = ({
  properties,
  onPropertiesChange,
  selectedLibrary,
}) => {
  const updateProperty = (key: keyof SVGProperties, value: any) => {
    onPropertiesChange({
      ...properties,
      [key]: value,
    });
  };

  const PropertySection: React.FC<{ title: string; children: React.ReactNode }> = ({
    title,
    children,
  }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" sx={{ color: '#3e2723', fontWeight: 'bold', mb: 2 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );

  const SliderControl: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (value: number) => void;
  }> = ({ label, value, min, max, step = 1, unit = '', onChange }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="caption" sx={{ color: '#5d4037', fontWeight: 'bold' }}>
          {label}
        </Typography>
        <Typography variant="caption" sx={{ color: '#888' }}>
          {value}{unit}
        </Typography>
      </Box>
      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(_, newValue) => onChange(newValue as number)}
        size="small"
        sx={{
          color: '#3e2723',
          '& .MuiSlider-thumb': {
            backgroundColor: '#3e2723',
          },
          '& .MuiSlider-track': {
            backgroundColor: '#5d4037',
          },
        }}
      />
    </Box>
  );

  const ColorControl: React.FC<{
    label: string;
    value: string;
    onChange: (value: string) => void;
  }> = ({ label, value, onChange }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: '#5d4037', fontWeight: 'bold', mb: 1, display: 'block' }}>
        {label}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          sx={{ width: 60 }}
          inputProps={{ style: { height: 30, padding: 0 } }}
        />
        <TextField
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Color value"
          size="small"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#d7ccc8',
              },
            },
          }}
        />
      </Box>
    </Box>
  );

  const TextControl: React.FC<{
    label: string;
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
  }> = ({ label, value, placeholder, onChange }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" sx={{ color: '#5d4037', fontWeight: 'bold', mb: 1, display: 'block' }}>
        {label}
      </Typography>
      <TextField
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        size="small"
        fullWidth
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#d7ccc8',
            },
          },
        }}
      />
    </Box>
  );

  const SelectControl: React.FC<{
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
  }> = ({ label, value, options, onChange }) => (
    <Box sx={{ mb: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel>{label}</InputLabel>
        <Select
          value={value}
          label={label}
          onChange={(e) => onChange(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#d7ccc8',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );

  return (
    <Box sx={{ maxHeight: '500px', overflowY: 'auto' }}>
      <PropertySection title="Basic Properties">
        <SliderControl
          label="Size"
          value={properties.size}
          min={16}
          max={128}
          unit="px"
          onChange={(value) => updateProperty('size', value)}
        />
        
        <ColorControl
          label="Color"
          value={properties.color}
          onChange={(value) => updateProperty('color', value)}
        />
        
        <SliderControl
          label="Opacity"
          value={properties.opacity}
          min={0}
          max={1}
          step={0.1}
          unit="%"
          onChange={(value) => updateProperty('opacity', value)}
        />
      </PropertySection>

      {(selectedLibrary === 'lucide' || selectedLibrary === 'react') && (
        <>
          <Divider sx={{ my: 2 }} />
          <PropertySection title="SVG Properties">
            <TextControl
              label="Fill"
              value={properties.fill}
              placeholder="currentColor, none, #ff0000"
              onChange={(value) => updateProperty('fill', value)}
            />
            
            <TextControl
              label="Stroke"
              value={properties.stroke}
              placeholder="currentColor, none, #ff0000"
              onChange={(value) => updateProperty('stroke', value)}
            />
            
            <SliderControl
              label="Stroke Width"
              value={properties.strokeWidth}
              min={0}
              max={8}
              step={0.5}
              onChange={(value) => updateProperty('strokeWidth', value)}
            />
            
            {selectedLibrary === 'lucide' && (
              <>
                <SelectControl
                  label="Stroke Linecap"
                  value={properties.strokeLinecap}
                  options={[
                    { value: 'round', label: 'Round' },
                    { value: 'square', label: 'Square' },
                    { value: 'butt', label: 'Butt' },
                  ]}
                  onChange={(value) => updateProperty('strokeLinecap', value as any)}
                />
                
                <SelectControl
                  label="Stroke Linejoin"
                  value={properties.strokeLinejoin}
                  options={[
                    { value: 'round', label: 'Round' },
                    { value: 'miter', label: 'Miter' },
                    { value: 'bevel', label: 'Bevel' },
                  ]}
                  onChange={(value) => updateProperty('strokeLinejoin', value as any)}
                />
                
                <TextControl
                  label="Stroke Dasharray"
                  value={properties.strokeDasharray}
                  placeholder="5 5, 10 2 5 2"
                  onChange={(value) => updateProperty('strokeDasharray', value)}
                />
              </>
            )}
          </PropertySection>
        </>
      )}

      <Divider sx={{ my: 2 }} />
      <PropertySection title="Transform">
        <SliderControl
          label="Rotation"
          value={properties.rotation}
          min={0}
          max={360}
          unit="°"
          onChange={(value) => updateProperty('rotation', value)}
        />
        
        <SliderControl
          label="Scale X"
          value={properties.scaleX}
          min={0.1}
          max={3}
          step={0.1}
          onChange={(value) => updateProperty('scaleX', value)}
        />
        
        <SliderControl
          label="Scale Y"
          value={properties.scaleY}
          min={0.1}
          max={3}
          step={0.1}
          onChange={(value) => updateProperty('scaleY', value)}
        />
      </PropertySection>
    </Box>
  );
}; 