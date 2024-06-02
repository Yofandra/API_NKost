import Kost from "../models/Kost.js";
import errorHandler from "../middlewares/errorHandler.js";
import path from "path";
import fs from "fs";

export const findAll = async (req, res) => {
    try {
        const kosts = await Kost.findAll();
        res.json(kosts);
    } catch (err) {
        if (Kost.length === 0) {
            res.json({ message: "Null" });
        } else {
            const error = new Error(err.message);
            return errorHandler(error, req, res);
        }
    }
}

export const findOne = async (req, res) => {
    try {
        const kost = await Kost.findByPk(req.params.id);
        if (kost) {
            res.json(kost);
        } else {
            const error = new Error("Not_Found");
            return errorHandler(error, req, res);
        }
    } catch (err) {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
    }
}

export const create = async (req, res) => {
    const id_user = req.body.id_user;
    const name_kost = req.body.name_kost;
    const description_kost = req.body.description_kost;
    const file =  req.files.file;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url_image = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = [".jpg", ".jpeg", ".png"];

    if (!allowedTypes.includes(ext.toLowerCase())) {
        const error = new Error("Invalid_File_Type");
        return errorHandler(error, req, res);
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
            const error = new Error('err.message');
            return errorHandler(error, req, res);
        }
        try {
            await Kost.create({id_user: id_user,
                    name_kost: name_kost,
                    description_kost: description_kost,
                    image: fileName,
                    url_image: url_image,});
            res.json({ message: "Kost created successfully" });
        } catch (err) {
            const error = new Error(err.message);
            return errorHandler(error, req, res);
        }
    });
}

export const update = async (req, res) => {
    const kost = await Kost.findByPk(req.params.id);
    if (!kost) {
        const error = new Error("Not_Found");
        return errorHandler(error, req, res);
    }
    let fileName = "";
    if(req.files === null){
        fileName = Kost.image;
    }else{
        const file = req.files.file;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedTypes = [".jpg", ".jpeg", ".png"];

        if (!allowedTypes.includes(ext.toLowerCase())) {
            const error = new Error("Invalid_File_Type");
            return errorHandler(error, req, res);
        }

        const filepath = `./public/images/${kost.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) {
                const error = new Error(err.message);
                return errorHandler(error, req, res);
            }
        });
    }
    const name_kost = req.body.name_kost;
    const description_kost = req.body.description_kost;
    const url_image = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        await kost.update({
            name_kost: name_kost,
            description_kost: description_kost,
            image: fileName,
            url_image: url_image,
        });
        res.json({ message: "Kost updated successfully" });
    } catch (err) {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
    }
}

export const remove = async (req, res) => {
    const kost = await Kost.findByPk(req.params.id);
    if (!kost) {
        const error = new Error("Not_Found");
        return errorHandler(error, req, res);
    }
    try {
        fs.unlinkSync(`./public/images/${kost.image}`);
        await kost.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.json({ message: "Kost deleted successfully" });
    } catch (err) {
        const error = new Error(err.message);
        return errorHandler(error, req, res);
    }
}