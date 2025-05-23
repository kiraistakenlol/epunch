import './styles/global.css';
import ScannerPage from './features/scanner/ScannerPage';
import { configureApiClient } from 'e-punch-common-ui';

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
    <ScannerPage />
  );
}

export default App; 