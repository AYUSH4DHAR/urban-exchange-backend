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
chatService.setChatUpdateRead = async (req, res, next) => {
    const chatId = req.body.chatId;
    try {
        const chat = await Chat.findById({ _id: chatId });
        if (!chat) {
            return res.status(404).json({ message: "Chat not found", data: null });
        }
        chat.unread = 0;
        const updatedChat = await chat.save();
        res.json({ message: "success", data: updatedChat.unread });
    } catch (error) {
        next(error);
    }
};

chatService.getChatsForUser = async (req, res, next) => {
    try {
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
    const buyerInf = req.body.currentUser;
    const sellerInf = req.body.seller;
    console.log(req.body, 'here');
    try {
        let chatObj = {
            buyer: buyerInf._id,
            buyerInfo: {
                name: buyerInf.name,
                email: buyerInf.email,
                firstName: buyerInf.firstName,
                lastName: buyerInf.lastName,
                avatar: buyerInf.avatar,
                lastActive: buyerInf.lastActive,
            },
            sellerInfo: {
                name: sellerInf.name,
                email: sellerInf.email,
                firstName: sellerInf.firstName,
                lastName: sellerInf.lastName,
                avatar: sellerInf.avatar,
                lastActive: sellerInf.lastActive,
            },
            prodId: req.body.prodId,
            seller: sellerInf._id,
            messages: [],
            unread: 0,
            unreadBy: sellerInf._id,
        };
        const chat = new Chat(chatObj);
        const savedChat = await chat.save();
        res.json({
            data: savedChat,
            message: "Chat created successfully",
        });
    } catch (error) {
        console.log(error, 'handle');
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
        chat.unread = req.body.unread;
        chat.unreadBy = req.body.unreadBy;
        const updatedChat = await chat.save();
        res.json(updatedChat);
    } catch (error) {
        next(error);
    }
};
chatService.updateUnread = async (req, res, next) => {
    try {
        const chat = await Chat.findById(req.body._id);
        if (!chat) {
            return res.status(404).json({ message: "Chat not found" });
        }
        chat.unread = req.body.unread;
        chat.unreadBy = req.body.unreadBy;
        const updatedChat = await chat.save();
        res.json({ status: "success", unreadCount: updatedChat.unread });
    } catch (error) {
        next(error);
    }
};
chatService.getUnreadCount = async (req, res, next) => {
    try {
        const chats = await Chat.find({
            $or: [{ buyer: req.body.sender }, { seller: req.body.sender }],
        });
        let unreadCount = 0;
        chats.forEach(chat => {
            if (chat.unreadBy == req.body.sender) {
                unreadCount += Number(chat.unread) ? Number(chat.unread) : 0;
            }
        })
        res.json({ status: "success", unreadCount: unreadCount });
    } catch (error) {
        next(error);
    }
}
module.exports = chatService;
