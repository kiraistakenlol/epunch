import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { MerchantUserDto, CreateMerchantUserDto, UpdateMerchantUserDto, ROLES, Role } from 'e-punch-common-core';

interface MerchantUsersManagerProps {
  merchantId: string;
  collapsed?: boolean;
}

interface UserFormData {
  login: string;
  password: string;
  role: Role;
}

interface FormErrors {
  login?: string;
  password?: string;
  role?: string;
}

export const MerchantUsersManager: React.FC<MerchantUsersManagerProps> = ({
  merchantId,
  collapsed = false,
}) => {
  const [users, setUsers] = useState<MerchantUserDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<MerchantUserDto | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    login: '',
    password: '',
    role: ROLES.STAFF,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (merchantId) {
      fetchUsers();
    }
  }, [merchantId]);

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
      const usersData = await apiClient.getMerchantUsers(merchantId);
      setUsers(usersData);
    } catch (err: any) {
      console.error('Failed to fetch users:', err);
      showSnackbar(err.message || 'Failed to load users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (user?: MerchantUserDto) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        login: user.login,
        password: '',
        role: user.role,
      });
    } else {
      setEditingUser(null);
      setFormData({
        login: '',
        password: '',
        role: ROLES.STAFF,
      });
    }
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setErrors({});
  };

  const handleInputChange = (field: keyof UserFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleRoleChange = (event: any) => {
    const value = event.target.value as Role;
    setFormData(prev => ({ ...prev, role: value }));
    
    if (errors.role) {
      setErrors(prev => ({ ...prev, role: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.login.trim()) {
      newErrors.login = 'Login is required';
    }

    if (!editingUser && !formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password && formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    if (!formData.role) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);

      if (editingUser) {
        const updateData: UpdateMerchantUserDto = {
          login: formData.login.trim(),
          role: formData.role,
        };
        
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        await apiClient.updateMerchantUser(merchantId, editingUser.id, updateData);
        showSnackbar('User updated successfully', 'success');
      } else {
        const createData: CreateMerchantUserDto = {
          login: formData.login.trim(),
          password: formData.password,
          role: formData.role,
        };

        await apiClient.createMerchantUser(merchantId, createData);
        showSnackbar('User created successfully', 'success');
      }

      handleCloseDialog();
      await fetchUsers();
    } catch (err: any) {
      console.error('Failed to save user:', err);
      showSnackbar(err.message || 'Failed to save user', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await apiClient.deleteMerchantUser(merchantId, userId);
      showSnackbar('User deleted successfully', 'success');
      await fetchUsers();
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      showSnackbar(err.message || 'Failed to delete user', 'error');
    }
  };

  const getRoleChip = (role: Role) => {
    const color = role === ROLES.ADMIN ? 'primary' : 'default';
    return (
      <Chip
        label={role}
        size="small"
        color={color}
        sx={{ textTransform: 'capitalize' }}
      />
    );
  };

  if (collapsed) {
    return (
      <Card sx={{ backgroundColor: '#f5f5dc', mb: 2 }}>
        <CardContent sx={{ py: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center" gap={1}>
              <PersonIcon sx={{ color: '#5d4037' }} />
              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                Users ({users.length})
              </Typography>
            </Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderColor: '#5d4037',
                color: '#5d4037',
                '&:hover': {
                  borderColor: '#3e2723',
                  backgroundColor: 'rgba(93, 64, 55, 0.1)',
                },
              }}
            >
              Add User
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card sx={{ backgroundColor: '#f5f5dc', mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={2}>
              <PersonIcon sx={{ fontSize: 32, color: '#5d4037' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                Merchant Users ({users.length})
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: '#5d4037',
                color: '#f5f5dc',
                '&:hover': { backgroundColor: '#6d4c41' },
              }}
            >
              Add User
            </Button>
          </Box>

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
              <CircularProgress />
            </Box>
          ) : users.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="body1" color="text.secondary">
                No users found. Click "Add User" to create the first user.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ backgroundColor: '#fff' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold' }}>Login</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.login}</TableCell>
                      <TableCell>{getRoleChip(user.role)}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(user)}
                          sx={{
                            color: '#5d4037',
                            '&:hover': { backgroundColor: 'rgba(93, 64, 55, 0.1)' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(user.id)}
                          sx={{
                            color: '#d32f2f',
                            '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.1)' },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#f5f5dc', color: '#3e2723', fontWeight: 'bold' }}>
          {editingUser ? 'Edit User' : 'Add User'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f5f5dc', pt: 2 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Login *"
              variant="outlined"
              fullWidth
              value={formData.login}
              onChange={handleInputChange('login')}
              error={!!errors.login}
              helperText={errors.login}
              disabled={isSubmitting}
            />

            <TextField
              label={editingUser ? 'Password (leave blank to keep current)' : 'Password *'}
              type="password"
              variant="outlined"
              fullWidth
              value={formData.password}
              onChange={handleInputChange('password')}
              error={!!errors.password}
              helperText={errors.password}
              disabled={isSubmitting}
            />

            <FormControl fullWidth error={!!errors.role} disabled={isSubmitting}>
              <InputLabel>Role *</InputLabel>
              <Select
                value={formData.role}
                onChange={handleRoleChange}
                label="Role *"
              >
                <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
                <MenuItem value={ROLES.STAFF}>Staff</MenuItem>
              </Select>
              {errors.role && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {errors.role}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f5f5dc', p: 2 }}>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            sx={{
              backgroundColor: '#5d4037',
              color: '#f5f5dc',
              '&:hover': { backgroundColor: '#6d4c41' },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={16} />
            ) : (
              editingUser ? 'Update User' : 'Create User'
            )}
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
}; 