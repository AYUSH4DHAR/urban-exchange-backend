const Chat = require("./../models/Chat");

const chatService = {};

chatService.getChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById({ _id: req.params.id });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        res.json(chat);
    } catch (error) {
        next(error);
    }
};

chatService.getChatsForUser = async (req, res, next) => {
    try {
        console.log(req.body);
        const chats = await Chat.find({
            $or: [{ buyer: req.body.sender }, { seller: req.body.sender }],
        });
        res.json(chats);
    } catch (error) {
        next(error);
    }
};

//getChatsForProduct
chatService.getChatsForProduct = async (req, res, next) => {
    try {
        // Message.find where prodId == req.params.id
        console.log(req.body);

        const chats = await Chat.find({
            prodId: req.body.prodId,
        });
        res.json(chats);
    } catch (error) {
        next(error);
    }
};

chatService.saveChat = async (req, res, next) => {
    try {
        let chatObj = {
            buyer: req.body.currentUser._id,
            buyerName: req.body.currentUser.firstName,
            prodId: req.body.prodId,
            seller: req.body.seller,
            messages: [],
        };
        const chat = new Chat(chatObj);
        const savedChat = await chat.save();
        res.json({
            data: savedChat,
            message: "Chat created successfully",
        });
    } catch (error) {
        next(error);
    }
};

chatService.getChatId = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({
            buyer: req.body.currentUser._id,
            prodId: req.body.prodId,
        });

        if (!chat) {
            return res.json({ message: "Chat not found" });
        }
        res.json({ message: chat });
    } catch (error) {
        next(error);
    }
};

chatService.updateChat = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.body.chatid);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        chat.messages = req.body.messages;
        const updatedChat = await chat.save();
        res.json(updatedChat);
    } catch (error) {
        next(error);
    }
};

module.exports = chatService;
