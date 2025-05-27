import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { useGetList } from 'react-admin';


export const Dashboard = () => {
  const { data: loyaltyPrograms, isLoading } = useGetList('loyalty-programs');

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Merchant Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Loyalty Programs
              </Typography>
              <Typography variant="h3" color="primary">
                {isLoading ? '...' : loyaltyPrograms?.length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active programs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                QR Scanner
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                Scan customer QR codes to add punches or redeem rewards
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="div">
                Quick Actions
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Scan QR codes
                • Manage loyalty programs
                • View analytics
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 