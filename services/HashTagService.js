const HashTag = require('../models/Hashtag');
const searchHashTag = async (req, res, next) => {
    let searchItem = req.params.hash;
    if (searchItem) searchItem = searchItem.trim();
    try {
        let searchResults = await HashTag.find({ tag: { $regex: `${searchItem}` } });
        searchResults = searchResults.sort((a, b) => b.items - a.items);
        res.send({
            message: "Success",
            data: searchResults,
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({
            message: "HashTag Not Found",
            data: null,
        });
    }
};
const createOrUpdateHashTags = async (hashtags) => {
    if (hashtags && hashtags.length > 0) {
        for (let i = 0; i < hashtags.length; i++) {
            let currentHashTag = hashtags[i];
            let hashTagData = await HashTag.findOne({ tag: `${currentHashTag}` });
            if (!hashTagData) {
                let newHashTag = new HashTag({
                    tag: currentHashTag, items: 1
                })
                newHashTag.save().then(result => console.log('added new hashtag', result));
            } else {
                hashTagData.items += 1;
                let updatedHashTagData = await hashTagData.save();
                console.log('udpated hashtag data', updatedHashTagData);
            }
        }
    }
}
module.exports = {
    searchHashTag,
    createOrUpdateHashTags,
}