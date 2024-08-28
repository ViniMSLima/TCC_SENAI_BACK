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
            
            const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;

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
                html: 
                `
                    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                    <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
                    <head>
                    <meta charset="UTF-8">
                    <meta content="width=device-width, initial-scale=1" name="viewport">
                    <meta name="x-apple-disable-message-reformatting">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta content="telephone=no" name="format-detection">
                    <title>Empty template</title><!--[if (mso 16)]>
                        <style type="text/css">
                        a {text-decoration: none;}
                        </style>
                        <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
                    <noscript>
                            <xml>
                            <o:OfficeDocumentSettings>
                            <o:AllowPNG></o:AllowPNG>
                            <o:PixelsPerInch>96</o:PixelsPerInch>
                            </o:OfficeDocumentSettings>
                            </xml>
                        </noscript>
                    <![endif]-->
                    <style type="text/css">
                    .rollover:hover .rollover-first {
                    max-height:0px!important;
                    display:none!important;
                    }
                    .rollover:hover .rollover-second {
                    max-height:none!important;
                    display:block!important;
                    }
                    .rollover span {
                    font-size:0px;
                    }
                    u + .body img ~ div div {
                    display:none;
                    }
                    #outlook a {
                    padding:0;
                    }
                    span.MsoHyperlink,
                    span.MsoHyperlinkFollowed {
                    color:inherit;
                    mso-style-priority:99;
                    }
                    a.es-button {
                    mso-style-priority:100!important;
                    text-decoration:none!important;
                    }
                    a[x-apple-data-detectors],
                    #MessageViewBody a {
                    color:inherit!important;
                    text-decoration:none!important;
                    font-size:inherit!important;
                    font-family:inherit!important;
                    font-weight:inherit!important;
                    line-height:inherit!important;
                    }
                    .es-desk-hidden {
                    display:none;
                    float:left;
                    overflow:hidden;
                    width:0;
                    max-height:0;
                    line-height:0;
                    mso-hide:all;
                    }
                    @media only screen and (max-width:600px) {.es-p-default { } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } .es-header-body p { } .es-content-body p { } .es-footer-body p { } .es-infoblock p { } h1 { font-size:30px!important; text-align:left } h2 { font-size:24px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important; display:block } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:18px!important; padding:10px 20px 10px 20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .h-auto { height:auto!important } .es-text-9274 .es-text-mobile-size-20, .es-text-9274 .es-text-mobile-size-20 * { font-size:20px!important; line-height:150%!important } .es-text-1098 .es-text-mobile-size-48, .es-text-1098 .es-text-mobile-size-48 * { font-size:48px!important; line-height:150%!important } }
                    @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
                    </style>
                    </head>
                    <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
                    <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#F6F6F6"><!--[if gte mso 9]>
                                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                                    <v:fill type="tile" color="#f6f6f6"></v:fill>
                                </v:background>
                            <![endif]-->
                    <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#F6F6F6">
                        <tr>
                        <td valign="top" style="padding:0;Margin:0">
                        <table cellspacing="0" cellpadding="0" align="center" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                            <tr>
                            <td align="center" style="padding:0;Margin:0">
                            <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-header-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                <td align="left" style="Margin:0;padding-top:30px;padding-right:20px;padding-bottom:10px;padding-left:20px">
                                <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                    <td align="left" style="padding:0;Margin:0;width:560px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                        <td align="center" style="padding:0;Margin:0;font-size:0"><img width="200" src="https://fouipuj.stripocdn.email/content/guids/CABINET_332077f77f127bf9c965e9df87673d9ded633be207f1a719d75f19f18f7a37a7/images/boschlogo.png" alt="" class="adapt-img" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                                        </tr>
                                    </table></td>
                                    </tr>
                                </table></td>
                                </tr>
                                <tr>
                                <td align="left" style="Margin:0;padding-right:20px;padding-bottom:10px;padding-left:20px;padding-top:10px">
                                <table cellspacing="0" width="100%" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                    <td align="left" style="padding:0;Margin:0;width:560px">
                                    <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                        <td align="center" class="es-text-9274" style="padding:0;Margin:0;padding-right:50px;padding-left:50px"><h6 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:30px !important;color:#929191">Please, insert this code on your login page to access your account, <span class="es-text-mobile-size-20" style="font-size:20px">​</span>this is a way for us to know that you are really you. &nbsp;</h6></td>
                                        </tr>
                                    </table></td>
                                    </tr>
                                </table></td>
                                </tr>
                            </table></td>
                            </tr>
                        </table>
                        <table cellspacing="0" cellpadding="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                            <tr>
                            <td align="center" style="padding:0;Margin:0">
                            <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                                <tr>
                                <td align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-top:5px;padding-bottom:5px">
                                <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                    <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                                    <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                        <td align="center" class="es-text-1098" style="padding:0;Margin:0"><h1 class="es-text-mobile-size-48" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:48px;font-style:normal;font-weight:500 !important;line-height:96px !important;color:#333333"><strong>${code}</strong></h1></td>
                                        </tr>
                                    </table></td>
                                    </tr>
                                </table></td>
                                </tr>
                                <tr>
                                <td align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-top:10px;padding-bottom:35px">
                                <table width="100%" cellpadding="0" cellspacing="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                    <tr>
                                    <td align="left" style="padding:0;Margin:0;width:560px">
                                    <table width="100%" role="presentation" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                        <tr>
                                        <td align="center" style="padding:0;Margin:0;padding-right:50px;padding-left:50px"><h6 style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:16px;font-style:normal;font-weight:normal;line-height:19px;color:#929191">This is an authentication code generated to access your account, if this access was not you, for your safety, change your password <a href="https://www.youtube.com/watch?v=dQw4w9WgXcQ">here</a></h6></td>
                                        </tr>
                                    </table></td>
                                    </tr>
                                </table></td>
                                </tr>
                            </table></td>
                            </tr>
                        </table>
                        <table cellspacing="0" cellpadding="0" align="center" class="es-footer" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                            <tr>
                            <td align="center" style="padding:0;Margin:0">
                            <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" class="es-footer-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                            </table></td>
                            </tr>
                        </table></td>
                        </tr>
                    </table>
                    </div>
                    </body>
                    </html>
                `
            };

            transporter.sendMail(mailOptions, function(err, data) {
                if (err) {
                  console.log("Error " + err);
                }
            });
            
            const encryptedcode = CryptoJS.AES.encrypt(code.toString(), process.env.SECRET).toString();

            const authtoken = jwt.sign(
                {
                    code: encryptedcode,
                    id: user.BoschID
                },
                    process.env.SECRET,
                {
                    expiresIn: "1 day",
                }
            );

            return res.status(200).send({ message: "Generated code successfully!", jwt: authtoken });
        } catch (error) {
            return res.status(404).send({ error: 'Something went wrong!' });
        }
    }

    static async getAuthUser(req, res) {
        try {
            const { boschID } = req.body;
            const user = await User.findOne({ BoschID: boschID });
            if (!user) {
                return res.status(401).send({ error: 'User not found!' });
            }
            
            const usertoken = jwt.sign(
                {
                    user
                },
                    process.env.SECRET,
                {
                    expiresIn: "1 day",
                }
            );

            return res.status(200).send({ message: "Logged in successfully!", jwt: usertoken })
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
            return res.status(500).send({ error: 'Internal server error.' });
        }
    }
    
    static async postUser(req, res) {
        const { name, birthdate, adm, sex, BoschID, password, email, cep } = req.body;

        if (!name || !birthdate || (adm != true && adm != false) || !sex || !BoschID || !password || !email || !cep)
            return res.status(400).send({ message: 'Field\'s can\'t be empty.' });
        
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
            BoschID: CryptoJS.AES.encrypt(BoschID, process.env.SECRET).toString(),
            password: encrypted,
            email,
            cep,
            release: Date.now(),
            createdAt: Date.now(),
        });

        try {
            await user.save();
            res.status(201).send({ message: 'User registered successfully!' });
        } catch (error) {
            console.log(error)
            return res.status(500).send({ message: 'Something failed while creating a user.' });
        }

    }

    static async clearUsers(req, res) {
        try {
            await User.deleteMany({});
            return res.status(200).send({ message: 'All Users deleted successfully!' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Something went wrong while clearing users.' });
        }
    }

    static async deleteById(req, res) {
        const { id } = req.params;
        
        try {
            const deletedUser = await User.findByIdAndDelete(id);
    
            if (!deletedUser) {
                return res.status(404).send({ message: 'User not found!' });
            }
    
            return res.status(200).send({ message: 'User deleted successfully!' });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Something went wrong while deleting user.' });
        }
    }
    
    static async updateByBoschId(req, res) {
        try {
            const { boschID } = req.params;
            const { newPassword } = req.body;
    
            var IdDecrypted = CryptoJS.AES.decrypt(boschID, process.env.SECRET);
            IdDecrypted = IdDecrypted.toString(CryptoJS.enc.Utf8);
            
            const user = await User.findOne({ BoschID: IdDecrypted });
            await user.updateOne({ $set: { password: newPassword }});

            return res.status(200).send({ message: 'User updated successfully!'});
        } catch(error) {
            console.error(error);
            return res.status(500).send({ message: 'Something went wrong while updating user.' });
        }
    }
}

module.exports = UserController;
