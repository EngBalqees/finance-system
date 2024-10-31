import exress from 'express';
import {initApp} from './src/initApp.js';

import 'dotenv/config';
const app = exress();
initApp(app,exress);
const port = 3000;
app.get('/', (req, res) => {
    res.send('Hello, World!');
  });
  
  // Another sample route
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });
  
app.listen(port, ()=>console.log(`Listen on port ${port}`));