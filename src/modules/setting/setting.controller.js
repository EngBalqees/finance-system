import Setting from "../../../DB/model/setting.model.js";


// View System Settings User: Can view only their settings.Super Admin: Can view both global settings and settings for specific users.

export  const viewSystemSettings = async (req, res) => {
        try {
            const query = req.user.role === "superadmin" && req.query.userId
              ? { userId: req.query.userId }
              : { userId: req.user.userId };
        
            // Attempt to find settings
            let settings = await Setting.findOne(query);
        
            // If no settings found, create default settings
            if (!settings) {
              settings = new Setting({
                userId: req.user.role === "superadmin" && req.query.userId ? req.query.userId : req.user.userId,
                currency: "USD",
                language: "en",
                theme: "light",
                notifications: true,
                budgetAlerts: true
              });
              await settings.save();
            }
        
       return res.status(200).json(settings);
      } catch (error) {
       return res.status(500).json({ message: "Error fetching settings", error: error.message });
      }
}

//Update System Settings User: Can update their own settings.Super Admin: Can update global settings and user-specific settings
export const updateSettings = async (req, res) => {
    const { currency, language, theme, notifications, budgetAlerts } = req.body;
  
    try {
      const query = req.user.role === "superadmin" && req.query.userId
        ? { userId: req.query.userId }
        : { userId: req.user.userId };
  
      const updatedSettings = await Setting.findOneAndUpdate(
        query,
        { currency, language, theme, notifications, budgetAlerts, updatedAt: Date.now() },
        { new: true, upsert: true } // Create if doesn't exist
      );
  
      res.status(200).json({ message: "Settings updated successfully", updatedSettings });
    } catch (error) {
      res.status(500).json({ message: "Error updating settings", error: error.message });
    }
  };

  //Reset Settings to Default (Super Admin Only)
  export const resetSettings = async (req, res) => {
    try {
        const query = req.query.userId ? { userId: req.query.userId } : { userId: null }; // null for global settings
    
        const defaultSettings = {
          currency: "USD",
          language: "en",
          theme: "light",
          notifications: true,
          budgetAlerts: true,
          updatedAt: Date.now()
        };
    
        const resetSettings = await Setting.findOneAndUpdate(query, defaultSettings, { new: true });
    
        res.status(200).json({ message: "Settings reset to default", resetSettings });
      } catch (error) {
        res.status(500).json({ message: "Error resetting settings", error: error.message });
      }
  }