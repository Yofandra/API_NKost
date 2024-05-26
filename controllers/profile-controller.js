import User from "../models/User.js";
import bcrypt from "bcrypt";
import errorHandler from "../middlewares/errorHandler.js";

export const findAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        if (User.length === 0) {
            const error = new Error("Not_Found");
            return errorHandler(error, req, res);
        } else {
            const error = new Error(err.message);
            return errorHandler(error, req, res);
        }
    }
}

export const findOne = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (user) {
            res.json(user);
        } else {
            const error = new Error("Not_Found");
            return errorHandler(error, req, res);
        }
    } catch (err) {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
    }
}

export const update = async (req, res) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        if (req.body.email) {
            if (!emailRegex.test(req.body.email)) {
                const error = new Error("Invalid_Email");
                return errorHandler(error, req, res);
            } else {
                const user = await User.findOne({ where: { email: req.body.email } });
                if (user) {
                    const error = new Error("Email_Exist");
                    return errorHandler(error, req, res);
                }   
            }
        }
        delete req.body.last_login;
        await User.update(req.body, {
            where: { id: req.params.id }
        });
        res.json({ message: "User updated successfully" });
    } catch (err) { 
        const error = new Error(err.message);
        return errorHandler(error, req, res);
    }
}