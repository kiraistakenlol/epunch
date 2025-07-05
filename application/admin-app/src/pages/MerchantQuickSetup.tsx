import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Business as BusinessIcon,
  LocalCafe as CoffeeIcon,
  Cake as DessertIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { apiClient } from 'e-punch-common-ui';
import { CreateMerchantDto, CreateLoyaltyProgramDto, CreateMerchantUserDto, ROLES, Role } from 'e-punch-common-core';

interface MerchantFormData {
  name: string;
  address: string;
  slug: string;
}

interface MerchantFormErrors {
  name?: string;
  slug?: string;
}

interface LoyaltyProgramTemplate {
  id: string;
  name: string;
  description: string;
  requiredPunches: number;
  rewardDescription: string;
  icon: React.ReactNode;
}

interface LoyaltyProgramFormData {
  name: string;
  description: string;
  requiredPunches: number;
  rewardDescription: string;
}

interface UserTemplate {
  id: string;
  login: string;
  password: string;
  role: Role;
}

interface UserFormData {
  login: string;
  password: string;
  role: Role;
}

const defaultTemplates: LoyaltyProgramTemplate[] = [
  {
    id: '1',
    name: '11th Coffee Free',
    description: 'Buy 10 coffees and get the 11th one free!',
    requiredPunches: 10,
    rewardDescription: 'Free Coffee',
    icon: <CoffeeIcon sx={{ color: '#5d4037' }} />,
  },
  {
    id: '2',
    name: 'Free Dessert of your choice',
    description: 'Enjoy any dessert on the house after 8 purchases',
    requiredPunches: 8,
    rewardDescription: 'Free dessert',
    icon: <DessertIcon sx={{ color: '#5d4037' }} />,
  },
];

const defaultUsers: UserTemplate[] = [
  {
    id: '1',
    login: 'admin',
    password: 'admin',
    role: ROLES.ADMIN,
  },
  {
    id: '2',
    login: 'staff',
    password: 'password',
    role: ROLES.STAFF,
  },
];

export const MerchantQuickSetup: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<MerchantFormData>({
    name: '',
    address: '',
    slug: '',
  });
  
  const [loyaltyPrograms, setLoyaltyPrograms] = useState<LoyaltyProgramTemplate[]>(defaultTemplates);
  const [users, setUsers] = useState<UserTemplate[]>(defaultUsers);
  
  const [errors, setErrors] = useState<MerchantFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProgram, setEditingProgram] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<LoyaltyProgramFormData>({
    name: '',
    description: '',
    requiredPunches: 10,
    rewardDescription: '',
  });
  const [programFormErrors, setProgramFormErrors] = useState<Record<string, string>>({});
  
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [userFormData, setUserFormData] = useState<UserFormData>({
    login: '',
    password: '',
    role: ROLES.STAFF,
  });
  const [userFormErrors, setUserFormErrors] = useState<Record<string, string>>({});
  
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'error' | 'success' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

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

  const handleBack = () => {
    navigate('/');
  };

  const handleInputChange = (field: keyof MerchantFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field in errors && errors[field as keyof MerchantFormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    if (field === 'name' && !formData.slug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug: generatedSlug }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: MerchantFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Merchant name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditProgram = (program: LoyaltyProgramTemplate) => {
    setEditFormData({
      name: program.name,
      description: program.description,
      requiredPunches: program.requiredPunches,
      rewardDescription: program.rewardDescription,
    });
    setEditingProgram(program.id);
    setProgramFormErrors({});
  };

  const handleAddProgram = () => {
    setEditFormData({
      name: '',
      description: '',
      requiredPunches: 10,
      rewardDescription: '',
    });
    setEditingProgram('new');
    setProgramFormErrors({});
  };

  const handleDeleteProgram = (programId: string) => {
    if (loyaltyPrograms.length <= 1) {
      showSnackbar('You must have at least one loyalty program', 'warning');
      return;
    }
    
    setLoyaltyPrograms(prev => prev.filter(p => p.id !== programId));
    showSnackbar('Loyalty program removed', 'success');
  };

  const validateProgramForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editFormData.name.trim()) {
      newErrors.name = 'Program name is required';
    }

    if (!editFormData.rewardDescription.trim()) {
      newErrors.rewardDescription = 'Reward description is required';
    }

    if (editFormData.requiredPunches < 1 || editFormData.requiredPunches > 10) {
      newErrors.requiredPunches = 'Required punches must be between 1 and 10';
    }

    setProgramFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProgram = () => {
    if (!validateProgramForm()) return;

    if (editingProgram === 'new') {
      const newProgram: LoyaltyProgramTemplate = {
        id: Date.now().toString(),
        name: editFormData.name.trim(),
        description: editFormData.description.trim(),
        requiredPunches: editFormData.requiredPunches,
        rewardDescription: editFormData.rewardDescription.trim(),
        icon: <StarIcon sx={{ color: '#5d4037' }} />,
      };
      setLoyaltyPrograms(prev => [...prev, newProgram]);
      showSnackbar('Loyalty program added', 'success');
    } else {
      setLoyaltyPrograms(prev =>
        prev.map(p =>
          p.id === editingProgram
            ? {
                ...p,
                name: editFormData.name.trim(),
                description: editFormData.description.trim(),
                requiredPunches: editFormData.requiredPunches,
                rewardDescription: editFormData.rewardDescription.trim(),
              }
            : p
        )
      );
      showSnackbar('Loyalty program updated', 'success');
    }
    
    setEditingProgram(null);
  };

  const handleCancelEdit = () => {
    setEditingProgram(null);
    setProgramFormErrors({});
  };

  const handleEditUser = (user: UserTemplate) => {
    setUserFormData({
      login: user.login,
      password: user.password,
      role: user.role,
    });
    setEditingUser(user.id);
    setUserFormErrors({});
  };

  const handleAddUser = () => {
    setUserFormData({
      login: '',
      password: '0000',
      role: ROLES.STAFF,
    });
    setEditingUser('new');
    setUserFormErrors({});
  };

  const handleDeleteUser = (userId: string) => {
    if (users.length <= 1) {
      showSnackbar('You must have at least one user', 'warning');
      return;
    }
    
    setUsers(prev => prev.filter(u => u.id !== userId));
    showSnackbar('User removed', 'success');
  };

  const validateUserForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!userFormData.login.trim()) {
      newErrors.login = 'Login is required';
    }

    if (!userFormData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (userFormData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    if (!userFormData.role) {
      newErrors.role = 'Role is required';
    }

    setUserFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveUser = () => {
    if (!validateUserForm()) return;

    if (editingUser === 'new') {
      const newUser: UserTemplate = {
        id: Date.now().toString(),
        login: userFormData.login.trim(),
        password: userFormData.password,
        role: userFormData.role,
      };
      setUsers(prev => [...prev, newUser]);
      showSnackbar('User added', 'success');
    } else {
      setUsers(prev =>
        prev.map(u =>
          u.id === editingUser
            ? {
                ...u,
                login: userFormData.login.trim(),
                password: userFormData.password,
                role: userFormData.role,
              }
            : u
        )
      );
      showSnackbar('User updated', 'success');
    }
    
    setEditingUser(null);
  };

  const handleCancelUserEdit = () => {
    setEditingUser(null);
    setUserFormErrors({});
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (loyaltyPrograms.length === 0) {
      showSnackbar('You must have at least one loyalty program', 'warning');
      return;
    }

    if (users.length === 0) {
      showSnackbar('You must have at least one user', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const createMerchantData: CreateMerchantDto = {
        name: formData.name.trim(),
        address: formData.address.trim() || undefined,
        slug: formData.slug.trim(),
      };

      const newMerchant = await apiClient.createMerchant(createMerchantData);
      
      for (const template of loyaltyPrograms) {
        const loyaltyProgramData: CreateLoyaltyProgramDto = {
          name: template.name,
          description: template.description,
          requiredPunches: template.requiredPunches,
          rewardDescription: template.rewardDescription,
          isActive: true,
        };
        
        await apiClient.createLoyaltyProgram(newMerchant.id, loyaltyProgramData);
      }

      // Create configured users
      for (const userTemplate of users) {
        const userData: CreateMerchantUserDto = {
          login: userTemplate.login,
          password: userTemplate.password,
          role: userTemplate.role,
        };
        
        await apiClient.createMerchantUser(newMerchant.id, userData);
      }
      
      showSnackbar('Merchant setup completed successfully!', 'success');
      
      setTimeout(() => {
        navigate(`/merchants/${newMerchant.id}`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Failed to setup merchant:', err);
      showSnackbar(err.message || 'Failed to setup merchant', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h4"
          sx={{
            color: '#f5f5dc',
            fontWeight: 'bold',
            textShadow: '1px 1px 1px #3e2723',
          }}
        >
          Merchant Quick Setup
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{
            borderColor: '#f5f5dc',
            color: '#f5f5dc',
            '&:hover': {
              borderColor: '#fff',
              backgroundColor: 'rgba(245, 245, 220, 0.1)',
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      <Box maxWidth={800} mx="auto">
        <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <BusinessIcon sx={{ fontSize: 32, color: '#5d4037', mr: 2 }} />
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                Merchant Information
              </Typography>
            </Box>

            <form onSubmit={handleSubmit}>
              <Box display="flex" flexDirection="column" gap={3}>
                <TextField
                  label="Business Name *"
                  variant="outlined"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  error={!!errors.name}
                  helperText={errors.name}
                  disabled={isSubmitting}
                  placeholder="e.g., Joe's Coffee House"
                />

                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={2}
                  value={formData.address}
                  onChange={handleInputChange('address')}
                  disabled={isSubmitting}
                  placeholder="123 Main St, City, State (optional)"
                />

                <TextField
                  label="Slug *"
                  variant="outlined"
                  fullWidth
                  value={formData.slug}
                  onChange={handleInputChange('slug')}
                  error={!!errors.slug}
                  helperText={errors.slug || 'Used in URLs and must be unique'}
                  disabled={isSubmitting}
                  inputProps={{ style: { fontFamily: 'monospace' } }}
                  placeholder="joes-coffee-house"
                />


              </Box>
            </form>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                Loyalty Programs ({loyaltyPrograms.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddProgram}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#5d4037',
                  color: '#f5f5dc',
                  '&:hover': { backgroundColor: '#6d4c41' },
                }}
              >
                Add Program
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" mb={3}>
              Configure the loyalty programs that will be created for this merchant:
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              {loyaltyPrograms.map((template) => (
                <Card
                  key={template.id}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(93, 64, 55, 0.2)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      {template.icon}
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                            {template.name}
                          </Typography>
                          <Chip
                            label={`${template.requiredPunches} punches`}
                            size="small"
                            sx={{
                              backgroundColor: '#e8f5e8',
                              color: '#2e7d32',
                              fontWeight: 'bold',
                            }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" mb={1}>
                          {template.description}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#5d4037' }}>
                          Reward: {template.rewardDescription}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditProgram(template)}
                          disabled={isSubmitting}
                          sx={{
                            backgroundColor: 'rgba(93, 64, 55, 0.1)',
                            color: '#5d4037',
                            '&:hover': { backgroundColor: 'rgba(93, 64, 55, 0.2)' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteProgram(template.id)}
                          disabled={isSubmitting || loyaltyPrograms.length <= 1}
                          sx={{
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                            color: '#d32f2f',
                            '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.2)' },
                            '&:disabled': { 
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              color: 'rgba(0, 0, 0, 0.26)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)', mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                Merchant Users ({users.length})
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddUser}
                disabled={isSubmitting}
                sx={{
                  backgroundColor: '#5d4037',
                  color: '#f5f5dc',
                  '&:hover': { backgroundColor: '#6d4c41' },
                }}
              >
                Add User
              </Button>
            </Box>
            
            <Typography variant="body2" color="text.secondary" mb={3}>
              Configure the users that will be created for this merchant:
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
              {users.map((user) => (
                <Card
                  key={user.id}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(93, 64, 55, 0.2)',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      <BusinessIcon sx={{ color: '#5d4037' }} />
                      <Box flex={1}>
                        <Box display="flex" alignItems="center" gap={2} mb={1}>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3e2723' }}>
                            {user.login}
                          </Typography>
                          <Chip
                            label={user.role}
                            size="small"
                            color={user.role === ROLES.ADMIN ? 'primary' : 'default'}
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </Box>
                                                 <Typography variant="body2" color="text.secondary" mb={1}>
                           Login: {user.login}
                         </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', color: '#5d4037' }}>
                          Password: {user.password}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user)}
                          disabled={isSubmitting}
                          sx={{
                            backgroundColor: 'rgba(93, 64, 55, 0.1)',
                            color: '#5d4037',
                            '&:hover': { backgroundColor: 'rgba(93, 64, 55, 0.2)' },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={isSubmitting || users.length <= 1}
                          sx={{
                            backgroundColor: 'rgba(211, 47, 47, 0.1)',
                            color: '#d32f2f',
                            '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.2)' },
                            '&:disabled': { 
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                              color: 'rgba(0, 0, 0, 0.26)',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ backgroundColor: '#f5f5dc', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}>
          <CardContent sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" mb={3}>
              This will create a new merchant,
              set up the {loyaltyPrograms.length} loyalty program{loyaltyPrograms.length !== 1 ? 's' : ''} above,
              and create {users.length} user{users.length !== 1 ? 's' : ''}: {users.map(u => `${u.login} (${u.role})`).join(', ')}.
            </Typography>

            <Box display="flex" justifyContent="center" gap={2}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleBack}
                disabled={isSubmitting}
                sx={{
                  borderColor: '#5d4037',
                  color: '#5d4037',
                  '&:hover': {
                    borderColor: '#3e2723',
                    backgroundColor: 'rgba(93, 64, 55, 0.1)',
                  },
                }}
              >
                Cancel
              </Button>
              
              <Button
                onClick={handleSubmit}
                variant="contained"
                startIcon={isSubmitting ? <CircularProgress size={16} /> : <SaveIcon />}
                disabled={isSubmitting || !formData.name.trim() || !formData.slug.trim() || loyaltyPrograms.length === 0 || users.length === 0}
                sx={{
                  backgroundColor: '#5d4037',
                  color: '#f5f5dc',
                  '&:hover': { backgroundColor: '#6d4c41' },
                  '&:disabled': {
                    backgroundColor: 'rgba(93, 64, 55, 0.5)',
                    color: 'rgba(245, 245, 220, 0.5)',
                  },
                  px: 4,
                }}
              >
                {isSubmitting ? 'Setting up...' : 'Create Merchant'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Edit/Add Program Dialog */}
      <Dialog 
        open={editingProgram !== null} 
        onClose={handleCancelEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#f5f5dc', color: '#3e2723', fontWeight: 'bold' }}>
          {editingProgram === 'new' ? 'Add Loyalty Program' : 'Edit Loyalty Program'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f5f5dc', pt: 2 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Program Name *"
              variant="outlined"
              fullWidth
              value={editFormData.name}
              onChange={(e) => {
                setEditFormData(prev => ({ ...prev, name: e.target.value }));
                if (programFormErrors.name) {
                  setProgramFormErrors(prev => ({ ...prev, name: '' }));
                }
              }}
              error={!!programFormErrors.name}
              helperText={programFormErrors.name}
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={2}
              value={editFormData.description}
              onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
            />

            <TextField
              label="Required Punches *"
              variant="outlined"
              fullWidth
              type="number"
              inputProps={{ min: 1, max: 10 }}
              value={editFormData.requiredPunches}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setEditFormData(prev => ({ ...prev, requiredPunches: value }));
                if (programFormErrors.requiredPunches) {
                  setProgramFormErrors(prev => ({ ...prev, requiredPunches: '' }));
                }
              }}
              error={!!programFormErrors.requiredPunches}
              helperText={programFormErrors.requiredPunches || 'Between 1 and 10 punches'}
            />

            <TextField
              label="Reward Description *"
              variant="outlined"
              fullWidth
              value={editFormData.rewardDescription}
              onChange={(e) => {
                setEditFormData(prev => ({ ...prev, rewardDescription: e.target.value }));
                if (programFormErrors.rewardDescription) {
                  setProgramFormErrors(prev => ({ ...prev, rewardDescription: '' }));
                }
              }}
              error={!!programFormErrors.rewardDescription}
              helperText={programFormErrors.rewardDescription}
              placeholder="e.g., Free coffee, 20% discount"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f5f5dc', p: 2 }}>
          <Button onClick={handleCancelEdit} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveProgram} 
            variant="contained"
            sx={{
              backgroundColor: '#5d4037',
              color: '#f5f5dc',
              '&:hover': { backgroundColor: '#6d4c41' },
            }}
          >
            {editingProgram === 'new' ? 'Add Program' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit/Add User Dialog */}
      <Dialog 
        open={editingUser !== null} 
        onClose={handleCancelUserEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#f5f5dc', color: '#3e2723', fontWeight: 'bold' }}>
          {editingUser === 'new' ? 'Add User' : 'Edit User'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f5f5dc', pt: 2 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Login *"
              variant="outlined"
              fullWidth
              value={userFormData.login}
              onChange={(e) => {
                setUserFormData(prev => ({ ...prev, login: e.target.value }));
                if (userFormErrors.login) {
                  setUserFormErrors(prev => ({ ...prev, login: '' }));
                }
              }}
              error={!!userFormErrors.login}
              helperText={userFormErrors.login}
            />

            <TextField
              label="Password *"
              variant="outlined"
              fullWidth
              type="password"
              value={userFormData.password}
              onChange={(e) => {
                setUserFormData(prev => ({ ...prev, password: e.target.value }));
                if (userFormErrors.password) {
                  setUserFormErrors(prev => ({ ...prev, password: '' }));
                }
              }}
              error={!!userFormErrors.password}
              helperText={userFormErrors.password || 'Minimum 4 characters'}
            />

            <FormControl fullWidth error={!!userFormErrors.role}>
              <InputLabel>Role *</InputLabel>
              <Select
                value={userFormData.role}
                onChange={(e) => {
                  setUserFormData(prev => ({ ...prev, role: e.target.value as Role }));
                  if (userFormErrors.role) {
                    setUserFormErrors(prev => ({ ...prev, role: '' }));
                  }
                }}
                label="Role *"
              >
                <MenuItem value={ROLES.ADMIN}>Admin</MenuItem>
                <MenuItem value={ROLES.STAFF}>Staff</MenuItem>
              </Select>
              {userFormErrors.role && (
                <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                  {userFormErrors.role}
                </Typography>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f5f5dc', p: 2 }}>
          <Button onClick={handleCancelUserEdit} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveUser} 
            variant="contained"
            sx={{
              backgroundColor: '#5d4037',
              color: '#f5f5dc',
              '&:hover': { backgroundColor: '#6d4c41' },
            }}
          >
            {editingUser === 'new' ? 'Add User' : 'Save Changes'}
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
    </Box>
  );
}; 