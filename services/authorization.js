const jwt = require("jsonwebtoken");
const secret = "Sujan#12345";

function generateToken(user) {

    const payload = {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        description: user.description,
        fcm_token: user.fcm_token,
        open_id: user.open_id,
        type: user.type,
        token: user.token,
        phone: user.phone
    };

    return jwt.sign(payload, secret);

}

function getUser(token) {
    try {
        return jwt.verify(token, secret);
    // eslint-disable-next-line no-unused-vars
    } catch(e) {
        return null;
    }

}

module.exports = {
    generateToken,
    getUser,
};
