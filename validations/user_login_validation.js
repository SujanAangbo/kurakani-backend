
const userLoginValidationSchema = {

    name: {
        notEmpty: {
            errorMessage: "name is required!"
        },
    }, 
    // email: {
    //     optional: true,
    //     isEmail: {
    //         errorMessage: "invalid email!"
    //     }
    // },
    password: {
        optional: true,
        isLength: {
            options: {
                min: 6
            },
            errorMessage: "password should be at least 6 characters"
        }
    }, 
    token: {
        notEmpty: {
            errorMessage: "token is required!"
        },
    }


};

module.exports = userLoginValidationSchema;