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
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

export const findOne = async (req, res) => {
    try {
        const kost = await Kost.findByPk(req.params.id);
        if (kost) {
            res.json(kost);
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const create = async (req, res) => {
    const id_user = res.locals.userId;
    const name_kost = req.body.name_kost;
    const description_kost = req.body.description_kost;
    const file =  req.files.file;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url_image = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedTypes = [".jpg", ".jpeg", ".png"];

    if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ message: 'Format file yang anda masukkan salah' });
    }

    file.mv(`./public/images/${fileName}`, async (err) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        try {
            await Kost.create({id_user: id_user,
                    name_kost: name_kost,
                    description_kost: description_kost,
                    image: fileName,
                    url_image: url_image,});
            res.json({ message: "Kost created successfully" });
        } catch (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
}

export const checkPermission = async (req, res, next) => {
    try {
        const kost = await Kost.findOne({
            where: { id: req.params.id },
            attributes: ['id_user']
        });
        const {id_user} = kost;
        if (id_user !== res.locals.userId) {
            return res.status(401).json({ message: 'Anda tidak memiliki izin' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const update = async (req, res) => {
    const kost = await Kost.findByPk(req.params.id);
    if (!kost) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
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
            return res.status(422).json({ message: 'Format file yang anda masukkan salah' });
        }

        const filepath = `./public/images/${kost.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error' });
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
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const remove = async (req, res) => {
    const kost = await Kost.findByPk(req.params.id);
    if (!kost) {
        return res.status(404).json({ message: 'Data tidak ditemukan' });
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
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}