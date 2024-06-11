import Room from '../models/Room.js';
import path from "path";
import fs from "fs";

export const createRoom = async (req, res) => {     
    const id_kost = req.body.id_kost;
    const id_user = req.body.id_user;
    const status = req.body.status; 
    const price = req.body.price; 
    const description = req.body.description;
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
            await Room.create({
                    id_user: id_user,
                    id_kost: id_kost,
                    status: status,
                    price: price,
                    description: description,
                    image: fileName,
                    url_image: url_image,
                });
            res.json({ message: "Kost created successfully" });
        } catch (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    });
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
    const room = await Room.findByPk(req.params.id);
    let fileName = "";
    if(req.files === null){
        fileName = Room.image;
    }else{
        const file = req.files.file;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedTypes = [".jpg", ".jpeg", ".png"];

        if (!allowedTypes.includes(ext.toLowerCase())) {
            return res.status(422).json({ message: 'Format file yang anda masukkan salah' });
        }

        const filepath = `./public/images/${room.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err) => {
            if (err) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    const status = req.body.status;
    const price = req.body.price;
    const description = req.body.description;
    const url_image = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        await room.update({
            status: status,
            price: price,
            description: description,
            image: fileName,
            url_image: url_image,
        });
        res.json({ message: "Kost updated successfully" });
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

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