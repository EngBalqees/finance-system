import exress from 'express';
import {initApp} from './src/initApp.js';

import 'dotenv/config';
const app = exress();
initApp(app,exress);
const port = 3000;
app.listen(port, ()=>console.log(`Listen on port ${port}`));