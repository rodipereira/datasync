
import { createRoot } from 'react-dom/client'
import { createClient } from '@supabase/supabase-js'
import App from './App.tsx'
import './index.css'
import './config/firebase' // Initialize Firebase

createRoot(document.getElementById("root")!).render(<App />);
