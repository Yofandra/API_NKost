import Room from '../models/Room.js';
import User from '../models/User.js';
import Kost from '../models/Kost.js';
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
    id_user = res.locals.userId;
    const kost = await Kost.findOne({ where: { id_user: id_user } });
    const { num_room, price, description } = req.body;

    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        if (req.files && req.files.file) {
            const file = req.files.file;
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
        
        
        if (!allowedTypes.includes(file.mimetype)) {
            return res.status(422).json({ message: 'Format file yang anda masukkan salah' });
        }
    
            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'room_images',
            });
        
            const fileName = result.secure_url;
            const image_public_id = result.public_id;
        
        
            await Room.create({
                id_kost: kost.id,
                num_room: num_room,
                price: price,
                description_room: description,
                image: fileName,
                url_image: image_public_id,
            });
        }
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
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

            if (!allowedTypes.includes(file.mimetype)) {
                return res.status(422).json({ message: 'Format file yang anda masukkan salah' });
            }

            if (room.image_public_id) {
                await cloudinary.uploader.destroy(room.image_public_id);
            }

            const result = await cloudinary.uploader.upload(file.tempFilePath, {
                folder: 'room_images',
            });

            fileName = result.secure_url;
            image_public_id = result.public_id;
        }

        await room.update({
            status: req.body.status || room.status,
            price: req.body.price || room.price,
            description_room: req.body.description_room || room.description_room,
            image: fileName,
            image_public_id: image_public_id,
            num_room: req.body.num_room || room.num_room,
        });

        res.json({ message: "Room updated successfully", data: room });
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

        let namakost = "";
            const kost = await Kost.findByPk(room.id_kost);
            if (!kost) {
                return res.status(404).json({
                    message: "Kost tidak ditemukan"
                });
            }

        const formattedRooms =  {
                id: room.id,
                id_kost: room.id_kost,
                num_room: room.num_room,
                price: room.price,
                description: room.description_room,
                image: room.image,
                status: room.status,
                nama_penyewa: penyewa,
                namakost: kost.name_kost
            };

        res.json(formattedRooms);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}