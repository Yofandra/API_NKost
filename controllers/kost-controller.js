import Kost from "../models/Kost.js";
import Room from "../models/Room.js";
import user from "../models/User.js";
import Location from "../models/Location.js";
import path from "path";
import fs from "fs";
import dotenv from 'dotenv'
import {v2 as cloudinary} from "cloudinary";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
        
        if (!kost) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        const location = await Location.findOne({ where: { id_kost: kost.id } });
        if (!location) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        const adress = `${location.detail}, ${location.village}, ${location.subdistrict}, ${location.regency}`

        const formattedReports = {
            id: kost.id,
            id_user: kost.id_user,
            name_kost: kost.name_kost,
            description_kost: kost.description_kost,
            image: kost.image,
            url_image: kost.url_image,
            fullAddress: adress,
            location: location.point_gmap,
        };
        // if (kost) {
        //     res.json(kost);
        // } else {
        //     return res.status(404).json({ message: 'Data tidak ditemukan' });
        // }
        res.json(formattedReports);
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const findByIdUser = async (req, res) => {
    try {
        const kosts = await Kost.findAll({ where: { id_user: res.locals.userId } });
        if (kosts.length === 0) {
            res.json({ message: "Masih belum memiliki kost" });
        } else {
            res.json(kosts);
        }
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}


export const create = async (req, res) => {
    const id_user = res.locals.userId;
    const name_kost = req.body.name_kost;
    const description_kost = req.body.description_kost;

    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.file;
    const ext = path.extname(file.name).toLowerCase();
    const allowedTypes = [".jpg", ".jpeg", ".png"];

    if (!allowedTypes.includes(ext)) {
        return res.status(422).json({ message: 'Format file yang anda masukkan salah' });
    }

    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'kost_images',
        });

        const fileName = result.secure_url;
        const image_public_id = result.public_id;

        await Kost.create({
            id_user: id_user,
            name_kost: name_kost,
            description_kost: description_kost,
            image: fileName,
            url_image: image_public_id,
        });

        res.json({ message: "Kost created successfully" });
    } catch (err) {
        console.error("Error during kost creation:", err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
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
    try {
        const kost = await Kost.findByPk(req.params.id);
        if (!kost) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        let fileName = kost.image; // Default to current image if no new file is uploaded

        if (req.files && req.files.file) {
            const file = req.files.file;
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(422).json({ message: 'Format file yang anda masukkan salah' });
            }

            if (kost.image_public_id) {
                await cloudinary.uploader.destroy(kost.image_public_id);
            }

            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'kost_images',
            });

            fileName = result.secure_url;
            const image_public_id = result.public_id;

            await kost.update({
                name_kost: req.body.name_kost,
                description_kost: req.body.description_kost,
                image: fileName,
                image_public_id: image_public_id,
            });
        } else {
            await kost.update({
                name_kost: req.body.name_kost,
                description_kost: req.body.description_kost,
            });
        }

        res.json({ message: "Kost updated successfully" });
    } catch (err) {
        console.error("Error during kost update:", err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

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

export const getKostByRoom = async (req, res) => {
    const id_user = res.locals.userId;
    try {
        const rooms = await Room.findOne({ where: { id_user: id_user } });
        if (!rooms) {
            return res.status(200).json({ message: 'User belum menyewa kamar' });
        }
        const kost = await Kost.findOne({ where: { id: rooms.id_kost } });
        if (!kost) {
            return res.status(404).json({ message: 'Data tidak ditemukan' });
        }

        res.json(kost);
        
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}