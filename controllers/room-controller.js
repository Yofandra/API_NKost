import Room from '../models/Room.js';
import User from '../models/User.js';
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

export const createRoom = async (req, res) => {
    const { id_kost, num_room, price, description } = req.body;

    if (!req.files || !req.files.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.files.file;
    const ext = path.extname(file.name).toLowerCase();
    const allowedTypes = [".jpg", ".jpeg", ".png", "webp"];

    if (!allowedTypes.includes(ext)) {
        return res.status(422).json({ message: 'Invalid file format' });
    }

    try {
        // Unggah gambar ke Cloudinary
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'room_images',
        });

        const fileName = result.secure_url;
        const image_public_id = result.public_id;

        await Room.create({
            id_kost: id_kost,
            num_room: num_room,
            price: price,
            description_room: description,
            image: fileName,
            url_image: image_public_id,
        });

        res.json({ message: "Room created successfully" });
    } catch (err) {
        console.error("Error during room creation:", err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.destroy({
            where: {
                id: id
            }
        });
        if (!room) {
            return res.status(404).json({
                message: "Room tidak ditemukan"
            });
        }
        res.status(200).json({
            status: "Success",
            message: "Room berhasil dihapus"
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const updateRoom = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            return res.status(404).json({ message: 'Room not found' });
        }

        let fileName = room.image;
        let image_public_id = room.image_public_id;

        if (req.files && req.files.file) {
            const file = req.files.file;
            const ext = path.extname(file.name).toLowerCase();
            const allowedTypes = [".jpg", ".jpeg", ".png"];

            if (!allowedTypes.includes(ext)) {
                return res.status(422).json({ message: 'Invalid file format' });
            }

            // Hapus gambar lama dari Cloudinary jika ada
            if (image_public_id) {
                await cloudinary.uploader.destroy(image_public_id);
            }

            // Unggah gambar baru ke Cloudinary
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'room_images',
            });

            fileName = result.secure_url;
            image_public_id = result.public_id;
        }

        const status = req.body.status;
        const price = req.body.price;
        const description = req.body.description;

        await room.update({
            status: status,
            price: price,
            description: description,
            image: fileName,
            url_image: image_public_id,
        });

        res.json({ message: "Room updated successfully" });
    } catch (err) {
        console.error("Error during room update:", err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const getRoom = async (req, res) => {
    try {
        const room = await Room.findAll();
        if (room.length === 0) {
            return res.status(404).json({
                message: "Room tidak ditemukan"
            });
        }
        res.status(200).json({
            status: "Success",
            message: "Berhasil mendapatkan data",
            data: room
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const getRoomByIdUser = async (req, res) => {
    try {
        const room = await Room.findAll({ 
            where: { id_user: res.locals.userId } });
        if (room.length === 0) {
            return res.status(200).json({
                message: "Belum menyewa kamar"
            });
        }
        res.status(200).json({
            status: "Success",
            message: "Berhasil mendapatkan data",
            data: room
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const getRoomByIdKost = async (req, res) => {
    try {
        const rooms = await Room.findAll({ where: { id_kost: req.params.id }, order: [['num_room', 'ASC']] });
        if (rooms.length === 0) {
            return res.status(200).json({
                message: "Belum ada kamar yang tersedia"
            });
        }

        const formattedRooms = await Promise.all(rooms.map(async (room) => {
            let penyewa = "belum ada penyewa";
            const user = await User.findByPk(room.id_user);
            if (user) {
                penyewa = user.name;
            }

            return {
                id: room.id,
                id_kost: room.id_kost,
                num_room: room.num_room,
                price: room.price,
                description: room.description_room,
                image: room.image,
                status: room.status,
                nama_penyewa: penyewa
            };
        }));

        res.json(formattedRooms);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findByPk(req.params.id);
        if (!room) {
            return res.status(404).json({
                message: "Room tidak ditemukan"
            });
        }

        let penyewa = "belum ada penyewa";
            const user = await User.findByPk(room.id_user);
            if (user) {
                penyewa = user.name;
            }

        const formattedRooms =  {
                id: room.id,
                id_kost: room.id_kost,
                num_room: room.num_room,
                price: room.price,
                description: room.description_room,
                image: room.image,
                status: room.status,
                nama_penyewa: penyewa
            };
            
        res.json(formattedRooms);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}