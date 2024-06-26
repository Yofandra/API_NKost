import RoomRequest from "../models/RoomRequest.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Kost from "../models/Kost.js";
import { sendEmail } from "../middlewares/emailService.js";

export const createRoomRequest = async (req, res) => {
    const id_user = res.locals.userId;
    const id_room = req.body.id_room;
    try {
        await RoomRequest.create({
            id_user: id_user,
            id_room: id_room,
            status: "pending",
        });
        res.json({ message: "Room request created successfully" });
        
    } catch (err) {
        return res.status(500).json({ message: 'error' });
    }
}

export const RoomRequestAccept = async (req, res) => {
    const {id_user, id_room} = req.body
    try {
        const user = await User.findOne({
            where: { 
                id: id_user 
            } 
        });

        const roomRequest = await RoomRequest.update({
            status: "approved",
        }, {
            where: {
                id_user: id_user,
                id_room: id_room,
            },
        });
        if (roomRequest[0] > 0) { 
            const room = await Room.update({
                id_user: id_user,
                status: "booked",
            }, {
                where: {
                    id: id_room,
                },
            });
    
            if (room[0] > 0) {
                console.log("Update room berhasil");
            } else {
                console.log("Update room gagal");
            }
        } else {
            console.log("Update RoomRequest gagal");
        }
                
        if (!roomRequest) {
            return res.status(404).json({
                message: "Room request tidak ditemukan",
            });
        }
        const emailContent =  `Hai ${user.name},\n\n` +
          `Terima kasih telah menggunakan layanan NKost.\n\n` +
          `Kami dengan senang hati menginformasikan bahwa penyewaan kost Anda telah berhasil.\n\n` +
          `Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk \n\n` +
          `menghubungi kami.` +
          `Terima kasih,\n` +
          `Tim Kami \n` +
          `nKost`;

    await sendEmail(user.email, 'Status Penyewaan', emailContent);
        res.status(200).json({
            status: "Success",
            message: "Room request berhasil diterima",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const RoomRequestRejected = async (req, res) => {
    const {id_user, id_room} = req.body
    try {
        const user = await User.findOne({
            where: { 
                id: id_user 
            } 
        });

        const roomRequest = await RoomRequest.update({
            status: "rejected",
        }, {
            where: {
                id_user: id_user,
                id_room: id_room,
            },
        });
        if (!roomRequest) {
            return res.status(404).json({
                message: "Room request tidak ditemukan",
            });
        }
        const emailContent =  `Hai ${user.name},\n\n` +
          `Terima kasih telah menggunakan layanan NKost.\n\n` +
          `Kami mohon maaf untuk menginformasikan bahwa permintaan penyewaan kost Anda di tolak\n\n` +
          `saat ini.` +
          `Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk \n\n` +
          `menghubungi kami.` +
          `Terima kasih,\n` +
          `Tim Kami \n` +
          `nKost`;

        await sendEmail(user.email, 'Status Penyewaan', emailContent);
            res.status(200).json({
                status: "Success",
                message: "Room request berhasil diterima",
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Server Error",
        });
    }
}

export const getRoomRequest = async (req, res) => {
    try {
        const roomRequests = await RoomRequest.findAll();
        res.json(roomRequests);
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const getRoomRequestByKostId = async (req, res) => {
    const id_user = res.locals.userId;
    try {
        const kosts = await Kost.findAll({
            where: {
                id_user: id_user,
            },
        });

        const kostIds = kosts.map(kost => kost.id);

        const rooms = await Room.findAll({
            where: {
                id_kost: kostIds,
            },
        });

        const roomIds = rooms.map(room => room.id);

        const roomRequests = await RoomRequest.findAll({
            where: {
                id_room: roomIds,
                status: "pending",
            },
        });

        const userIds = roomRequests.map(roomRequest => roomRequest.id_user);
        const penyewa = await User.findAll({
            where: {
                id: userIds,
            },
        });

        const formattedResponses = roomRequests.map(roomRequest => {
            const room = rooms.find(room => room.id === roomRequest.id_room);
            const kost = kosts.find(kost => kost.id === room.id_kost);
            const user = penyewa.find(user => user.id === roomRequest.id_user);

            return {
                id: roomRequest.id,
                name_kost: kost.name_kost,
                num_room: room.num_room,
                penyewa: user.name,
            };
        });

        res.json(formattedResponses);
    } catch (err) {
        console.error('Error fetching room requests:', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
