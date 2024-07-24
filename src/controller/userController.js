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

    static async postUser(req, res) {
        const { nome, data, tempo, f1, f2, f3, f4, f5, tentativas, qtd_formas, acertos } = req.body;

        if (!nome || !data || !tempo || !f1 || !f2 || !f3 || !f4 || !f5)
            return res.status(400).send({ message: 'Field\'s can\'t be empty' });

        const user = new User({
            nome,
            data,
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

}

module.exports = UserController;
