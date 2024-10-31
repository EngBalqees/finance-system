import exress from 'express';
import {initApp} from './src/initApp.js';

import 'dotenv/config';
const app = exress();
initApp(app,exress);
const port = 3000;
app.get('/', (req, res) => {
    console.log("Root route accessed");
    res.send('Welcome to the Finance System');
  });
  
  app.get('/test', (req, res) => {
    console.log("Test route accessed");
    res.send('Test route is working');
  });
  
app.listen(port, ()=>console.log(`Listen on port ${port}`));