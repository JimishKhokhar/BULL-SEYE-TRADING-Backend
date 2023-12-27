const UserModel=require('../models/User');

const updateNetworthController= async (req, res) => {
    try {
        const { user_id, netWorth } = req.body;

        if (!user_id || !netWorth) {
            return res.status(400).json({ error: 'Invalid request body' });
        }
        

        // Find the user by _id and update netWorth
        const user = await UserModel.findByIdAndUpdate(user_id, { $set: { netWorth } }, { new: true });

        if (user) {
            return res.status(200).json({ message: 'Net worth updated successfully', user });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports=updateNetworthController;