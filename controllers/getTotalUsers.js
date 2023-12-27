const User=require('../models/user');

const getTotalUsers = async (req, res) => {
    try {
      const userCount = await User.countDocuments();
      res.status(200).json({ count: userCount });
    } catch (error) {
      console.error('Error getting user count:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = getTotalUsers