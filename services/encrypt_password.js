const bcrypt = require('bcrypt');

const salt = 10;

async function hashPassword(password) {

    return await bcrypt.hash(password, salt);

}

async function checkPassword(password, hashedPassword) {
    console.log(hashedPassword);

    return  await bcrypt.compare(password, hashedPassword);
    // console.log(newHashedPassword);
    // if(newHashedPassword == hashedPassword) {
    //     return true;
    // } else {
    //     return false;
    // }
}

module.exports = {
    hashPassword,
    checkPassword,
};