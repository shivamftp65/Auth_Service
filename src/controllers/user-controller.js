const UserService = require("../services/user-service");

const userService = new UserService();

const create = async (req , res) => {
    try {
        const user = await userService.create({
            email: req.body.email,
            password: req.body.password
        });

        return res.status(201).json({
            data: user,
            success: true,
            message: "SuccessFully created a new User",
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Something went wrong",
            err: error
        })
    }
}

const signIn = async (req, res) => {
    try {
        const response = await userService.signin(req.body.email, req.body.password);
        return res.status(201).json({
            data: response,
            success: true,
            message: "User sign in SuccessFully",
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Something went wrong",
            err: error
        });
    }
}

const isAuthenticated = async (req, res) => {
    try {
        const token = req.headers['x-access-token'];
        const response = await userService.isAuthenticated(token);
        return res.status(201).json({
            data: response,
            success: true,
            message: "User is Authenticated and token is valid",
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            data: {},
            success: false,
            message: "Something went wrong",
            err: error
        });
    }
}

module.exports = {
    create,
    signIn,
    isAuthenticated
}