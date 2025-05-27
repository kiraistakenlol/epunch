import './styles/global.css';
import { Admin, Resource } from 'react-admin';
import { configureApiClient } from 'e-punch-common-ui';
import { dataProvider } from './dataProvider';
import { authProvider } from './authProvider';
import { LoyaltyProgramList, LoyaltyProgramShow, LoyaltyProgramEdit, LoyaltyProgramCreate } from './resources/loyaltyPrograms';
import { Scanner } from './resources/scanner';
import { Dashboard } from './components/Dashboard';
import { Layout } from './components/Layout';

// Configure API client once when the app module loads
const API_BASE_URL = import.meta.env.VITE_API_URL;
if (API_BASE_URL) {
  console.log('(MerchantApp) API_BASE_URL configured:', API_BASE_URL);
  configureApiClient(API_BASE_URL);
} else {
  console.error('(MerchantApp) VITE_API_URL is not set. API calls will fail.');
  // Potentially show a global error message or prevent app rendering
}

function App() {
  return (
    <Admin 
      dataProvider={dataProvider} 
      authProvider={authProvider}
      title="E-PUNCH Merchant"
      dashboard={Dashboard}
      layout={Layout}
    >
      <Resource
        name="loyalty-programs"
        list={LoyaltyProgramList}
        show={LoyaltyProgramShow}
        edit={LoyaltyProgramEdit}
        create={LoyaltyProgramCreate}
        options={{ label: 'Loyalty Programs' }}
      />
      <Resource
        name="scanner"
        list={Scanner}
        options={{ label: 'QR Scanner' }}
      />
    </Admin>
  );
}

export default App; 