import React from 'react';
import ReactDOM from 'react-dom/client';
// import { Provider } from 'react-redux'; // Commented out until store is set up
import App from './App'; // This App will be specific to merchant-app
// import store from './store/store'; // Assuming a similar store setup might be needed - Commented out
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <Provider store={store}> TODO: Setup merchant-app specific store */}
      <App />
    {/* </Provider> */}
  </React.StrictMode>
); 