import Integration from "../models/integration.js";
import axios from "axios";


class IntegrationController {

  // Call back 

  async gitHubCallback  (req, res) {
    const code = req.query.code || 'abd63fe318bc55dffa43' 
    const userId = req.query.userId || "53119538"; // replace with real logged-in user id
  
    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        "https://github.com/login/oauth/access_token",
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: { Accept: "application/json" },
        }
      );
  
      const accessToken = tokenResponse.data.access_token;
  
      // Fetch user details from GitHub
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const githubUser = userResponse.data;
      console.log("github user", githubUser);

      const record = new Integration({
        userId,
        githubId: githubUser.id,
        username: githubUser.login,
        avatarUrl: githubUser.avatar_url,
        accessToken,
        githubUser,
       });
 
       console.log(record)
 
       await record.save();
  
      res.send(`<h2>✅ GitHub connected successfully!</h2>`);
    } catch (error) {
      console.error(error.response?.data || error.message);
      res.status(500).send(  error.response?.data);
    }
  
  }

 
  // create integration
  async createIntegration(req, res) {
    try {
      if (!req.body) {
        return res.status(400).json({ message: 'ERROR_MISSING_FIELDS' });
      }
     
      // Implementation for creating integration
      // res.status(200).json({ message: 'SUCCESS_CREATED', data: integrationData });

    } catch (error) {
      console.error("Error creating integration:", error);
      res.status(500).json({ message: 'ERROR_INTERNAL_SERVER' });
    }
  }

  // list integrations
  async listIntegrations(req, res) {
    try {
      const integrations = await Integration.find();
      res.status(200).json({ message: 'SUCCESS', data: integrations });
    } catch (error) {
      console.error("Error listing integrations:", error);
      res.status(500).json({ message: 'ERROR_INTERNAL_SERVER' });
    }
  }

  // remove integration
  async removeIntegration(req, res) {
    try {
      const { id } = req.params;
      const integration = await Integration.findByIdAndDelete(id);
      
      if (!integration) {
        return res.status(404).json({ message: 'Integration not found' });
      }
      
      res.status(200).json({ message: 'Integration removed successfully' });
    } catch (error) {
      console.error("Error removing integration:", error);
      res.status(500).json({ message: 'ERROR_INTERNAL_SERVER' });
    }
  }

  // resync integration
  async resync(req, res) {
    try {
      const { id } = req.params;
      const integration = await Integration.findById(id);
      
      if (!integration) {
        return res.status(404).json({ message: 'Integration not found' });
      }
      
      // Implementation for resyncing integration data
      res.status(200).json({ message: 'Integration resynced successfully' });
    } catch (error) {
      console.error("Error resyncing integration:", error);
      res.status(500).json({ message: 'ERROR_INTERNAL_SERVER' });
    }
  }
}

export default new IntegrationController();