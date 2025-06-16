import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Snackbar,
  Alert,
  Chip,
} from '@mui/material';
import {
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { UserDto } from 'e-punch-common-core';
import { Table, TableColumn } from '../components/Table';

export const Users: React.FC = () => {
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<UserDto[]>([]);
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
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const usersList = await apiClient.getAllUsers();
      setUsers(usersList);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      showSnackbar(err.message || 'Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (user: UserDto) => {
    navigate(`/users/${user.id}`);
  };

  const columns: TableColumn<UserDto>[] = [
    {
      key: 'userId',
      label: 'User ID',
      width: '40%',
      minWidth: '200px',
      accessor: 'id',
      render: (id: string) => (
        <Box sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
          {id.substring(0, 8)}...
        </Box>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      width: '40%',
      minWidth: '200px',
      accessor: 'email',
      render: (email: string, user: UserDto) => (
        <Box>
          <Box component="span" sx={{ fontWeight: 'medium' }}>
            {email || ''}
          </Box>
          {user.superAdmin && (
            <Chip
              size="small"
              icon={<AdminIcon />}
              label="Super Admin"
              sx={{ 
                ml: 1, 
                backgroundColor: '#fff3e0', 
                color: '#f57c00',
                fontWeight: 'bold'
              }}
            />
          )}
        </Box>
      ),
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '20%',
      minWidth: '120px',
      accessor: (user: UserDto) => user.createdAt,
      render: (createdAt: string) => createdAt ? new Date(createdAt).toLocaleDateString() : '—',
      mobileHidden: true,
    },
  ];

  return (
    <Box>
      <Table
        data={users}
        columns={columns}
        isLoading={isLoading}
        title="Users"
        onRowClick={handleView}
        emptyState={{
          title: 'No users yet',
          description: 'Users will appear here as they register or use the modal',
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