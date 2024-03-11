const Message = require('./../models/messages');


const chatService = {};

chatService.getChat = async (req, res, next) => {
    try {
        const chat = await Message.findById(req.params.id);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        res.json(chat);
    } catch (error) {
        next(error);
    }
};

chatService.saveChat = async (req, res, next) => {
    try {
        let chatObj = {
            buyer: req.body.currentUser._id,
            prodId: req.body.prodId,
            seller: req.body.seller,
            messages: [],
        }
        const chat = new Message(chatObj);
        const savedChat = await chat.save();
        res.json({data : savedChat, 
            message : "Chat created successfully"});
    } catch (error) {
        next(error);
    }
};

chatService.getChatId = async (req, res, next) => {
    try {
        // const chat = await Chat.findOne({ prodId: req.body.prodId, userId: req.body.userId});

        //mongo query to get _id of chat that has prodid == req.body.prodId and chatPartner == req.body.userId

    const chat = await Message.findOne({ buyer : req.body.currentUser._id, prodId: req.body.prodId }, '_id');

        if (!chat) {
            return res.json({ message: 'Chat not found' });
        }
        res.json(chat._id);
    } catch (error) {
        next(error);
    }
}

chatService.updateChat = async (req, res, next) => {
    try {
        const chat = await Message  
            .findById(req.body.chatid);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        chat.messages.push({ $each: req.body.messages });
        const updatedChat = await chat.save();
        res.json(updatedChat);
    }
    catch (error) {
        next(error);
    }
}


module.exports = chatService;