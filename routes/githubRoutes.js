// routes/githubRoutes.js
import express from 'express';
import axios from 'axios';
import integrationController from '../controllers/integrationController.js';
const router = express.Router();


// Step 1: Redirect user to GitHub for authentication
router.get("/connect", (req, res) => {
  console.log("process, ", process.env.GITHUB_CLIENT_ID)
  const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=repo,user`;
  res.redirect(redirectUrl);
});



// Step 2: GitHub redirects back with "code"


router.get('/callback',  integrationController.gitHubCallback);

// Step 3: Check connection status
router.get("/status/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const integration = await GithubIntegration.findOne({ userId });

    if (!integration) {
      return res.json({ connected: false });
    }

    res.json({
      connected: true,
      connectedAt: integration.connectedAt,
      githubUser: integration.githubUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching integration status" });
  }
});

export default router;
