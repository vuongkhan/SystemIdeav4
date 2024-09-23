const Notification = require('../models/Notification');

const getNotifications = async (req, res) => {
    try {
        const userId = req.params.userId;
        const notifications = await Notification
                    .find({user_id: userId})
                    .sort({ createdAt: -1 })
                    .populate('user_id', 'fullname')
                    .populate('other_user_id', 'fullname')
                    .populate('idea_id', 'title');
                
        
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const createNotification = async (req, res) => {
    try {
        const {user_id, other_user_id, type} = req.body;
        const idea_id = req.params.ideaId;

        const newNotification = new Notification({
            user_id: user_id,
            other_user_id: other_user_id,
            idea_id: idea_id,
            type: type,
        });

        await newNotification.save();
        res.status(200).json(newNotification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports={
    getNotifications: getNotifications,
    createNotification: createNotification,
}