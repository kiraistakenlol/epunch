import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export interface TableColumn<T> {
  key: string;
  label: string;
  width: string;
  minWidth: string;
  accessor: keyof T | ((item: T) => any);
  render?: (value: any, item: T) => React.ReactNode;
  mobileHidden?: boolean;
}

export interface TableAction<T> {
  label: string;
  onClick: (item: T) => void;
  variant?: 'edit' | 'delete' | 'custom';
  color?: string;
  icon?: React.ReactNode;
  show?: (item: T) => boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  isLoading?: boolean;
  title?: string;
  createButton?: {
    label: string;
    onClick: () => void;
    show?: boolean;
  };
  emptyState?: {
    title: string;
    description: string;
  };
  renderMobileCard?: (item: T, index: number) => React.ReactNode;
  onRowClick?: (item: T) => void;
}

export function Table<T extends { id: string }>({
  data,
  columns,
  actions = [],
  isLoading = false,
  title,
  createButton,
  emptyState,
  renderMobileCard,
  onRowClick,
}: TableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme as any).breakpoints.down('sm'));

  const getValue = (item: T, accessor: keyof T | ((item: T) => any)) => {
    if (typeof accessor === 'function') {
      return accessor(item);
    }
    return item[accessor];
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header with Title and Create Button */}
      {(title || createButton) && (
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
          flexDirection={isMobile ? 'column' : 'row'}
          gap={isMobile ? 2 : 0}
        >
          {title && (
            <Typography
              variant="h4"
              sx={{
                color: '#f5f5dc',
                fontWeight: 'bold',
                textShadow: '1px 1px 1px #3e2723',
                fontSize: isMobile ? '1.75rem' : '2.125rem',
              }}
            >
              {title}
            </Typography>
          )}
          
          {createButton?.show && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={createButton.onClick}
              sx={{
                backgroundColor: '#5d4037',
                color: '#f5f5dc',
                '&:hover': {
                  backgroundColor: '#6d4c41',
                },
                width: isMobile ? '100%' : 'auto',
              }}
            >
              {createButton.label}
            </Button>
          )}
        </Box>
      )}

      {/* Empty State */}
      {data.length === 0 ? (
        <Card sx={{ backgroundColor: '#f5f5dc', textAlign: 'center', py: 4 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {emptyState?.title || 'No data yet'}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              {emptyState?.description || 'Create your first item to get started'}
            </Typography>
            {createButton?.show && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={createButton.onClick}
                sx={{
                  backgroundColor: '#5d4037',
                  color: '#f5f5dc',
                  '&:hover': {
                    backgroundColor: '#6d4c41',
                  },
                }}
              >
                {createButton.label}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Box display="flex" flexDirection="column" gap={2}>
          {/* Desktop Table Header */}
          {!isMobile && (
            <Box
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '6px 6px 0 0',
                padding: '12px 14px',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Box display="flex" alignItems="center">
                {columns.map((column) => (
                  <Box
                    key={column.key}
                    sx={{
                      width: column.width,
                      minWidth: column.minWidth,
                      pr: 2,
                      ...(column.key === 'actions' && {
                        display: 'flex',
                        justifyContent: 'flex-end',
                        pr: 0,
                      }),
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: '#424242',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {column.label}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Data Rows Container */}
          <Card
            sx={{
              backgroundColor: '#ffffff',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              border: '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: !isMobile ? '0 0 6px 6px' : '6px',
              borderTop: !isMobile ? 'none' : '1px solid rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
            }}
          >
            {data.map((item, index) => (
              <Box key={item.id}>
                {isMobile && renderMobileCard ? (
                  <Box sx={{ p: 2, borderBottom: index < data.length - 1 ? '1px solid rgba(0, 0, 0, 0.06)' : 'none' }}>
                    {renderMobileCard(item, index)}
                  </Box>
                ) : (
                  <Box
                    sx={{
                      padding: '12px 14px',
                      borderBottom: index < data.length - 1 ? '1px solid rgba(0, 0, 0, 0.06)' : 'none',
                      cursor: onRowClick ? 'pointer' : 'default',
                      '&:hover': {
                        backgroundColor: onRowClick ? '#f8f9fa' : 'transparent',
                      },
                      transition: 'background-color 0.2s ease-in-out',
                    }}
                    onClick={() => onRowClick?.(item)}
                  >
                    {isMobile ? (
                      <Box display="flex" flexDirection="column" gap={1}>
                        {columns
                          .filter(col => !col.mobileHidden)
                          .map((column) => {
                            const value = getValue(item, column.accessor);
                            return (
                              <Box key={column.key} display="flex" justifyContent="space-between">
                                <Typography variant="caption" color="text.secondary" fontWeight="600">
                                  {column.label}:
                                </Typography>
                                <Typography variant="body2" component="div" sx={{ fontWeight: 600 }}>
                                  {column.render ? column.render(value, item) : value}
                                </Typography>
                              </Box>
                            );
                          })}
                        {actions.length > 0 && (
                          <Box display="flex" gap={1} mt={1} justifyContent="flex-end">
                            {actions
                              .filter(action => !action.show || action.show(item))
                              .map((action, actionIndex) => (
                                <Button
                                  key={actionIndex}
                                  size="small"
                                  variant={action.variant === 'delete' ? 'outlined' : 'contained'}
                                  color={action.variant === 'delete' ? 'error' : 'primary'}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick(item);
                                  }}
                                  startIcon={action.icon}
                                  sx={{
                                    fontSize: '0.75rem',
                                    minWidth: 'auto',
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                          </Box>
                        )}
                      </Box>
                    ) : (
                      <Box display="flex" alignItems="center">
                        {columns.map((column) => {
                          const value = getValue(item, column.accessor);
                          return (
                            <Box
                              key={column.key}
                              sx={{
                                width: column.width,
                                minWidth: column.minWidth,
                                pr: 2,
                                ...(column.key === 'actions' && {
                                  display: 'flex',
                                  justifyContent: 'flex-end',
                                  gap: 1,
                                  pr: 0,
                                }),
                              }}
                            >
                              {column.key === 'actions' ? (
                                actions
                                  .filter(action => !action.show || action.show(item))
                                  .map((action, actionIndex) => (
                                    <Button
                                      key={actionIndex}
                                      size="small"
                                      variant={action.variant === 'delete' ? 'outlined' : 'contained'}
                                      color={action.variant === 'delete' ? 'error' : 'primary'}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        action.onClick(item);
                                      }}
                                      startIcon={action.icon}
                                      sx={{
                                        fontSize: '0.75rem',
                                        minWidth: 'auto',
                                      }}
                                    >
                                      {action.label}
                                    </Button>
                                  ))
                              ) : (
                                <Typography
                                  variant="body2"
                                  component="div"
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontWeight: 600,
                                    color: '#2c2c2c',
                                  }}
                                >
                                  {column.render ? column.render(value, item) : (value || '—')}
                                </Typography>
                              )}
                            </Box>
                          );
                        })}
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ))}
          </Card>
        </Box>
      )}
    </Box>
  );
} 