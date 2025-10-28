import Integration from "../models/integration.js";
import axios from "axios";


const BASE_URL = "https://github.com/login/oauth"
class IntegrationController {
  

  /* 
    Redriect URL Function
  */

  async redirectUrl  (req, res) {
    try {
      const redirectUrl = `${BASE_URL}/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=repo,user`;
      res.redirect(redirectUrl);
        
    } catch (error) {
      res.send('Some thing went wrong');
 
    }
  }



  /* 
  
    Redriect URL Function
  
    */


  async gitHubCallback  (req, res) {
    console.log("gitHubCallback", req);
    const code = req.params.code|| '9e51089d4a8b9316dcad' 
    const userId = req.query.userId || "53119538"; // replace with real logged-in user id
  
    try {
      // Exchange code for access token
      const tokenResponse = await axios.post(
        `${BASE_URL}/oauth/access_token`,
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
        connectedAt: new Date(),
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
  async gitHubConnectionStatus(req, res) {
    try {
     
      const userId =  '53119538' ||  req.query.userId ;
      const integration = await Integration.find({userId : userId});
  
      console.log("integration ", integration)
      if (!integration) {
        return res.json({ message: 'No Connection',  connected: false });
      }
     
// Implementation for creating integration

      res.status(200).json({ message: 'Connected', data: integration , connected: true});

    } catch (error) {
      console.error("Error creating integration:", error);
      res.status(500).json({ message: 'ERROR_INTERNAL_SERVER' });
    }
  }


  async getAccessToken (req, res) {
   // const { code } = req.body;
    
    
      const response = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: process.env.GITHUB_CLIENT_ID ,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code : '1c7bc188d4e5b0da641c'
      }, {
        headers: { 'Accept': 'application/json' }
      });
    
      const { access_token } = response.data;
      if (access_token) {
        res.json({  status: true ,  access_token  });
      }else{
        res.json({ status: false,  });
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