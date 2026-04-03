const UserRepository = require("../repository/user-repository");
const jwt = require('jsonwebtoken');
const { JWT_KEY } = require('../config/serverConfig');
const bcrypt = require('bcrypt');

class UserService{
    constructor(){
        this.userRepository = new UserRepository();
    }

    async create(data){
        try {
            const user = await this.userRepository.create(data);
            return user;
        } catch (error) {
            console.log("Something went wrong in the service layer");
            throw error;
        }
    }

    async signin(email, plainPassword){
        try {
            // step1 -> fetch the user using email
            const user = await this.userRepository.getByEmail(email);
            // step2 -> compare incoming plain password with stored encrypted password
            const passwordMatch = this.checkPassword(plainPassword, user.password);
            if(!passwordMatch){
                console.log("password doesn't match");
                throw {error: 'Incorrect Password'};
            }
            // step3 -> if passwordmatch then create a token and send it to the user
            const newJWT = this.createToken({email: user.email, id: user.id});
            return newJWT;
        } catch (error) {
            console.log("Something went wrong in the sign in process");
            throw error;
        }
    }

    async isAuthenticated(token){
        try {
            const response = this.veryfyToken(token);
            if(!response){
                throw {error: 'Invalid Token'};
            }
            const user = await this.userRepository.getById(response.id);
            if(!user){
                throw {error: 'No user with the corresposnding token exists'}
            }
            // console.log(user)
            return user.id;
        } catch (error) {
            console.log("Something went wrong in the auht proccess");
            throw error;
        }
    }

    createToken(user){
        try {
            const response = jwt.sign(user, JWT_KEY, {expiresIn: '1d'});
            return response;
        } catch (error) {
            console.log('Something went wrong in token creation');
            throw error;
        }
    }

    veryfyToken(token){
        try {
            const response = jwt.verify(token, JWT_KEY);
            return response;
        } catch (error) {
            console.log("Something went wrong in token validation");
            throw error;
        }
    }

    checkPassword(userInoutPlainPassword, encryptedPassword){
        try {
            return bcrypt.compareSync(userInoutPlainPassword, encryptedPassword);
        } catch (error) {
            console.log("Something went wrong in password comparison");
            throw error;            
        }
    }

}

module.exports = UserService;