import User from "../models/User.js";
const statusAccess = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }
    
    if (user.status !== "active") {
      return res.status(403).json({
        message: "Akun belum diverifikasi, silahkan cek email Anda untuk verifikasi akun.",
      });
    } else {
      return next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
}


export default statusAccess;
