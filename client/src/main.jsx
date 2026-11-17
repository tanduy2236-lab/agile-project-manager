import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { applyTheme, getSavedTheme } from "./utils/theme";
import { initializeLanguage } from "./utils/language";

applyTheme(getSavedTheme());
initializeLanguage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
