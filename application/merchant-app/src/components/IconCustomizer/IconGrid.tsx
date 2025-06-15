import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Paper,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { IconDto } from 'e-punch-common-core';
import SvgIcon from './SvgIcon';

interface IconGridProps {
  icons: IconDto[];
  totalIcons: number;
  searchTerm: string;
  selectedIconId: string | null;
  onSearchChange: (term: string) => void;
  onIconSelect: (icon: IconDto) => void;
}

export const IconGrid: React.FC<IconGridProps> = ({
  icons,
  totalIcons,
  searchTerm,
  selectedIconId,
  onSearchChange,
  onIconSelect,
}) => {
  return (
    <Card sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#3e2723', fontWeight: 'bold' }}>
            Available Icons
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#5d4037',
              fontSize: '0.875rem'
            }}
          >
            {totalIcons.toLocaleString()} icons
          </Typography>
        </Box>

        <TextField
          fullWidth
          size="small"
          placeholder="Search icons... (try: coffee, heart, settings)"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: '#5d4037', fontSize: '1.2rem' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#f9f9f9',
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: '#5d4037',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3e2723',
              },
            },
          }}
        />
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 1, 
            maxHeight: '400px', 
            overflow: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f1f1f1',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#a8a8a8',
              },
            },
          }}
        >
          {icons.map((icon) => (
            <Box key={icon.id} sx={{ width: { xs: '22%', sm: '15%', md: '15%' } }}>
              <Paper
                sx={{
                  p: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: selectedIconId === icon.id ? '2px solid #5d4037' : '1px solid #ddd',
                  backgroundColor: selectedIconId === icon.id ? '#f5f5dc' : 'white',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: selectedIconId === icon.id ? '#f5f5dc' : '#f9f9f9',
                    transform: 'scale(1.02)',
                  },
                }}
                onClick={() => onIconSelect(icon)}
              >
                <Box
                  sx={{
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1,
                  }}
                >
                  <SvgIcon 
                    icon={icon}
                    size={32}
                    color="#666"
                  />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '10px',
                    color: '#666',
                    display: 'block',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {icon.name}
                </Typography>
              </Paper>
            </Box>
          ))}
          
          {icons.length === 0 && (
            <Box
              sx={{
                width: '100%',
                height: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
              }}
            >
              <Typography variant="body2">
                No icons found. Try a different search term.
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}; 