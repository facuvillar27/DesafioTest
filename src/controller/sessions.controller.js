import jwt from 'jsonwebtoken';
import MailingService from '../services/mailing.js';
import UserDTO from '../dao/DTO/userDTO.js';
import crypto from 'crypto';
import { createHash, isValidPassword } from "../utils.js";
import DAO from '../dao/index.js';

const userService = new DAO.User();
const productService = new DAO.Product();

const createTokenAndUserDTO = (req) => {
    const userDTO = new UserDTO(
        req.user._id,
        `${req.user.first_name} ${req.user.last_name}`,
        req.user.role,
        req.user.email
    );
    const serializedUser = {
        id: userDTO.id,
        name: userDTO.name,
        role: userDTO.role,
        email: userDTO.email
    }
    const token = jwt.sign(serializedUser, 'CoderKeyQueNadieDebeSaber', { expiresIn: "1h" });
    return { token, serializedUser };
}

const getProfile = async (req, res) => {
    let user = await userService.getBy({ "email": req.user.email });
    let product = await productService.getProducts();
    let cartProducts = user.cart.products;
    res.render("current", {
        user,
        product,
        cartProducts,
    })
}

const sendEmail = async (req, res) => {
    const mailer = new MailingService();
    const result = await mailer.sendSimpleMail({
        from: "facuvillar27@gmail.com",
        to: req.user.email,
        subject: "Cuenta creada con éxito",
        html: "<h1>¡Bienvenido!</h1><p>Tu cuenta ha sido creada con éxito.</p>"
    });
}

const passwordReset = async (req, res) => {
    try {
        const user = await userService.getBy({ email: req.body.email });
        if (!user) return res.status(404).json({ error: "User not found" });
        user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordExpires = Date.now() + 20000;

        await userService.update(user._id, user);

        const resetURL = `http://localhost:${process.env.PORT}/api/sessions/reset/${user.resetPasswordToken}`;

        const mailer = new MailingService();
        const result = await mailer.sendSimpleMail({
            from: "facuvillar27@gmail.com",
            to: user.email,
            subject: "Password Reset",
            html: `<p>Click <a href="${resetURL}">here</a> to reset your password</p>`
        });
        res.json({ status: "success", message: "Email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", error: "Error sending email" });
    }
}

const resetUserPassword = async (req, res) => {
    const { rid } = req.params;
    const user = await userService.getBy({ resetPasswordToken: rid });
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.resetPasswordExpires < Date.now()) {
        return res.render('newToken', { error: "Token expired" });
    }
    res.render('reset', { rid });
}

const updateUser = async (req, res) => {
    const { rid } = req.params;
    const { password } = req.body;
    try {
        const user = await userService.getBy({ resetPasswordToken: rid });
        if (!user) return res.status(404).json({ status: "error", error: "User not found" });

        if (user.resetPasswordExpires < Date.now()) {
            return res.status(404).json({ status: "error", error: "Token expired" });
        }

        const isSamePassword = await isValidPassword(user, password);
        if (isSamePassword) return res.status(400).json({ status: "error", error: "Password must be different" });

        const hashedPassword = await createHash(password);
        const updatedUser = await userService.update(user._id, { password: hashedPassword, resetPasswordToken: null, resetPasswordExpires: null});
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', error: "Error al actualizar usuario" });
    }
}

export { createTokenAndUserDTO, getProfile, sendEmail, passwordReset, resetUserPassword, updateUser};