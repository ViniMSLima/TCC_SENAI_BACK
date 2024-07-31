const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
var CryptoJS = require("crypto-js");
require("dotenv").config();

class UserController {
    static async getUsers(req, res) {
        try {
            const users = await User.find();
            return res.status(200).send({ users });
        } catch (error) {
            return res.status(404).send({ error: 'Users not found!' });
        }
    }

    static async userLogin(req, res) {
        try {
            const { id, password } = req.body;
            
            const user = await User.findOne({ BoschID: id });
            if (!user) {
                return res.status(401).send({ error: 'User not found!' });
            }

            var decrypted = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            decrypted = decrypted.toString(CryptoJS.enc.Utf8);

            if (decrypted != password) {
                return res.status(401).send({ error: 'Invalid password!' });
            }

            return res.status(200).send({message: "RETORNA O JWT AQUI IRMAO" });
        } catch (error) {
            return res.status(404).send({ error: 'Users not found!' });
        }
    }

    static async getUserByBoschID(req, res) {
        try {
            const { boschID } = req.body;
    
            const user = await User.findOne({ BoschID: boschID });
    
            if (!user) {
                return res.status(404).send({ error: 'User not found!' });
            }
    
            return res.status(200).send({ user });
        } catch (error) {
            return res.status(500).send({ error: 'Internal server error' });
        }
    }
    
    static async postUser(req, res) {
        const { name, birthdate, adm, sex, BoschID, password, email, cep } = req.body;

        if (!name || !birthdate || !adm || !sex || !BoschID || !password || !email || !cep)
            return res.status(400).send({ message: 'Field\'s can\'t be empty' });
        
        const encrypted = CryptoJS.AES.encrypt(password, process.env.SECRET).toString();

        const user = new User({
            name,
            birthdate,
            adm,
            sex,
            BoschID,
            password: encrypted,
            email,
            cep,
            release: Date.now(),
            createdAt: Date.now(),
        });

        try {
            await user.save();
            res.status(201).send({ message: 'User registered successfully' });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Something failed while creating a User' });
        }

    }

    static async clearUsers(req, res) {
        try {
            await User.deleteMany({});
            return res.status(200).send({ message: 'All Users deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Something went wrong while clearing Users' });
        }
    }

    static async deleteById(req, res) {
        const { id } = req.params;
        
        try {
            const deletedUser = await User.findByIdAndDelete(id);
    
            if (!deletedUser) {
                return res.status(404).send({ message: 'User not found' });
            }
    
            return res.status(200).send({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Something went wrong while deleting the User' });
        }
    }
    

}

module.exports = UserController;
