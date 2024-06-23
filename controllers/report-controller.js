import Report from "../models/Report.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import Kost from "../models/Kost.js";
import { sendEmail } from "../middlewares/emailService.js";

export const createReport = async (req, res) => {
  const id_user = res.locals.userId;
  const { description } = req.body;
  try {
    const user = await User.findOne({ where: { id: id_user } });
    if (!user) {
      return res.status(404).json({ message: "id user tidak ditemukan" });
    }

    const room = await Room.findOne({ where: { id_user: id_user } });
    if (!room) {
      return res.status(404).json({ message: "id room tidak ditemukan" });
    }

    await Report.create({
      id_user: id_user,
      id_room: room.id,
      description_report: description,
      report_date: new Date(),
    });

    const emailContent =
      `Hai ${user.name},\n\n` +
      `Terima kasih telah menggunakan layanan NKost.\n\n` +
      `Laporan Anda saat ini sudah kami kirim ke pihak kost.\n\n` +
      `Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk \n\n` +
      `menghubungi kami.` +
      `Terima kasih,\n` +
      `Tim Kami \n` +
      `NKost`;

    await sendEmail(user.email, "Penyerahan Laporan", emailContent);

    const kost = await Kost.findOne({ where: { id: room.id_kost } });
    if (!kost) {
      return res.status(404).json({ message: "id kost tidak ditemukan" });
    }
    const pemilik = await User.findOne({ where: { id: kost.id_user } });

    const contentEmail =
      `Hai ${pemilik.name},\n\n` +
      `Ada laporan baru dari penyewa Anda.\n\n` +
      `Silahkan cek aplikasi NKost untuk melihat laporan tersebut.\n\n` +
      `Jika Anda memiliki pertanyaan atau memerlukan bantuan lebih lanjut, jangan ragu untuk \n\n` +
      `menghubungi kami.` +
      `Terima kasih,\n` +
      `Tim Kami \n` +
      `NKost`;

    await sendEmail(pemilik.email, "Laporan Baru", contentEmail);
    res.status(200).json({
      status: "Success",
      message: "Laporan baru telah dikirim",
    });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateReport = async (req, res) => {
  const id_user = res.locals.userId;
  const { description } = req.body;

  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "report tidak ditemukan" });
    }

    const room = await Room.findOne({ where: { id_user: id_user } });
    if (!room) {
      return res.status(404).json({ message: "id room tidak ditemukan" });
    }

    await Report.update(
      {
        description_report: description,
        report_date: new Date(),
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.json({ message: "Report berhasil di update" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "report tidak ditemukan" });
    }

    await Report.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.json({ message: "Report berhasil di hapus" });
  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getReportByIdUser = async (req, res) => {
  const id_user = res.locals.userId;
  try {
    const report = await Report.findAll({ where: { id_user: id_user } });
    if (report.length === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }
    res.json(report);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
