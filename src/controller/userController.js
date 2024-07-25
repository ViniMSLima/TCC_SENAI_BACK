const { User } = require("../models/user");

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

    static async test(req, res) {
        try {
            return res.status(200).send({message: "testing" });
        } catch (error) {
            return res.status(404).send({ error: 'Users not found!' });
        }
    }

    static async getUserByBoschID(req, res) {
        try {
            const { boschID } = req.body;
    
            const user = await User.findOne({ boschID: boschID });
    
            if (!user) {
                return res.status(404).send({ error: 'User not found!' });
            }
    
            return res.status(200).send({ user });
        } catch (error) {
            return res.status(500).send({ error: 'Internal server error' });
        }
    }
    
    static async postUser(req, res) {
        const { name, birthdate, adm, sex, BoschID, email, cep } = req.body;

        if (!name || !birthdate || !adm || !sex || !BoschID || !email || !cep)
            return res.status(400).send({ message: 'Field\'s can\'t be empty' });

        const user = new User({
            name,
            birthdate,
            adm,
            sex,
            BoschID,
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
