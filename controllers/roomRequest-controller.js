import RoomRequest from "../models/RoomRequest.js";
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
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const RoomRequestAccept = async (req, res) => {
    const id_user = req.body.id_user;
    try {
        const roomRequest = await RoomRequest.update({
            status: "approved",
        }, {
            where: {
                id_user: id_user,
            },
        });
        if (!roomRequest) {
            return res.status(404).json({
                message: "Room request tidak ditemukan",
            });
        }
        const emailContent =  `Hai ${id_user.name},\n\n` +
          `Terima kasih telah menggunakan layanan NKost.\n\n` +
          `Kami dengan senang hati menginformasikan bahwa penyewaan kost Anda telah berhasil.\n\n` +
          `Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk \n\n` +
          `menghubungi kami.` +
          `Terima kasih,\n` +
          `Tim Kami \n` +
          `nKost`;

    await sendEmail(id_user.email, 'Status Penyewaan', emailContent);
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
    const id_user = req.body.id_user;
    try {
        const roomRequest = await RoomRequest.update({
            status: "rejected",
        }, {
            where: {
                id_user: id_user,
            },
        });
        if (!roomRequest) {
            return res.status(404).json({
                message: "Room request tidak ditemukan",
            });
        }
        const emailContent =  `Hai ${id_user.name},\n\n` +
          `Terima kasih telah menggunakan layanan NKost.\n\n` +
          `Kami mohon maaf untuk menginformasikan bahwa penyewaan kost Anda tidak dapat kami terima\n\n` +
          `saat ini.` +
          `Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk \n\n` +
          `menghubungi kami.` +
          `Terima kasih,\n` +
          `Tim Kami \n` +
          `nKost`;

    await sendEmail(id_user.email, 'Status Penyewaan', emailContent);
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