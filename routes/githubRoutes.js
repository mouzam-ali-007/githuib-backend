// routes/githubRoutes.js
import express from 'express';
import axios from 'axios';
import integrationController from '../controllers/integrationController.js';
const router = express.Router();


// Step 1: Redirect user to GitHub for authentication
 
router.get("/connect", integrationController.redirectUrl  );



// Step 2: GitHub redirects back with "code"


router.get('/callback/:code',  integrationController.gitHubCallback);

// Step 3: Check connection status
router.get("/status/:userId", integrationController.gitHubConnectionStatus);


// Step 3: Check connection status
router.get("/access_token", integrationController.getAccessToken);

export default router;



