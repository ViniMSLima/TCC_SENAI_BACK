const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer")
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

            if (!id || !password) {
                return res.status(400).send({ error: 'Fill in all the fields!' });
            }

            const user = await User.findOne({ BoschID: id });
            if (!user) {
                return res.status(401).send({ error: 'User not found!' });
            }

            var decrypted = CryptoJS.AES.decrypt(password, process.env.SECRET)
            decrypted = decrypted.toString(CryptoJS.enc.Utf8);

            var userPassDecrypted = CryptoJS.AES.decrypt(user.password, process.env.SECRET);
            userPassDecrypted = userPassDecrypted.toString(CryptoJS.enc.Utf8);

            if (decrypted != userPassDecrypted) {
                return res.status(401).send({ error: 'Invalid password!' });
            }

            // https://www.freecodecamp.org/portuguese/news/como-usar-o-nodemailer-para-enviar-emails-do-seu-servidor-do-node-js/
            
            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  type: 'OAuth2',
                  user: process.env.EMAIL,
                  pass: process.env.PASSWORD,
                  clientId: process.env.CLIENTID,
                  clientSecret: process.env.CLIENTSECRET,
                  refreshToken: process.env.TOKEN
                }
            });
            
            let mailOptions = {
                from: process.env.EMAIL,
                to: user.email,
                subject: 'Authentication Code',
                html: `<h1>bom dia</h1>`
            };

            transporter.sendMail(mailOptions, function(err, data) {
                if (err) {
                  console.log("Error " + err);
                } else {
                  console.log("Email sent successfully");
                }
            });

            const token = jwt.sign(
                {
                    id: user.id,
                    adm: user.adm
                },
                    process.env.SECRET,
                {
                    expiresIn: "1 day",
                }
            );

            return res.status(200).send({message: "Logged in successfully!", jwt: token });
        } catch (error) {
            return res.status(404).send({ error: 'Something went wrong!' });
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

        if (!name || !birthdate || (adm != true && adm != false) || !sex || !BoschID || !password || !email || !cep)
            return res.status(400).send({ message: 'Field\'s can\'t be empty' });
        
        const encrypted = CryptoJS.AES.encrypt(password, process.env.SECRET).toString();

        var verify = await User.findOne({ BoschID: BoschID });
        if (verify) {
            return res.status(401).send({ error: 'An user with this ID already exists!' });
        }

        verify = await User.findOne({ email: email });
        if (verify) {
            return res.status(401).send({ error: 'An user with this email already exists!' });
        }

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
