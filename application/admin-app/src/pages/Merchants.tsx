import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Snackbar,
  Alert,
} from '@mui/material';
import { apiClient } from 'e-punch-common-ui';
import { MerchantDto } from 'e-punch-common-core';
import { Table, TableColumn } from '../components/Table';

export const Merchants: React.FC = () => {
  const navigate = useNavigate();
  
  const [merchants, setMerchants] = useState<MerchantDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    fetchMerchants();
  }, []);

  const showSnackbar = (message: string, severity: 'error' | 'success' | 'info' | 'warning' = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const fetchMerchants = async () => {
    try {
      setIsLoading(true);
      const merchantsList = await apiClient.getAllMerchants();
      setMerchants(merchantsList);
    } catch (err: any) {
      console.error('Failed to fetch merchants:', err);
      showSnackbar(err.message || 'Failed to load merchants', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = () => {
    navigate('/merchants/create');
  };

  const handleView = (merchant: MerchantDto) => {
    navigate(`/merchants/${merchant.id}`);
  };



  const columns: TableColumn<MerchantDto>[] = [
    {
      key: 'name',
      label: 'Name',
      width: '25%',
      minWidth: '180px',
      accessor: 'name',
      render: (name: string, merchant: MerchantDto) => (
        <Box>
          <Box component="span" sx={{ fontWeight: 'medium' }}>
            {name}
          </Box>
          <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary', ml: 1 }}>
            ({merchant.slug})
          </Box>
        </Box>
      ),
    },
    {
      key: 'address',
      label: 'Address',
      width: '25%',
      minWidth: '150px',
      accessor: 'address',
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '15%',
      minWidth: '100px',
      accessor: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
      mobileHidden: true,
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '10%',
      minWidth: '80px',
      accessor: () => null,
    },
  ];

  return (
    <Box>
      <Table
        data={merchants}
        columns={columns}
        isLoading={isLoading}
        title="Merchants"
        onRowClick={handleView}
        createButton={{
          label: 'Add Merchant',
          onClick: handleCreate,
          show: true,
        }}
        emptyState={{
          title: 'No merchants yet',
          description: 'Create your first merchant to get started',
        }}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 