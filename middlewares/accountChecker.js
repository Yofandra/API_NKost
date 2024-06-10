import User from "../models/User.js";

export const checkPermission = (req, res, next) => {
  const { id } = req.params;
  if (res.locals.userId != id && res.locals.userRole !== 'admin') {
    return res.status(403).json({
      message: "Anda tidak memiliki izin untuk mengakses data ini",
    });
  }
  next();
};

export const adminPermission = (req, res, next) => {
  if (res.locals.userRole !== 'admin') {
    return res.status(403).json({
      message: "Anda tidak memiliki izin untuk mengakses data ini",
    });
  }
  next();
};

export const statusAccess = async (req, res, next) => {
  try {
    const user = await User.findByPk(res.locals.userId);
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
    })};
}

export const Pemilik = (req, res, next) => {
  if (res.locals.userRole !== 'pemilik') {
    return res.status(403).json({
      message: "Anda tidak memiliki izin untuk mengakses data ini",
    });
  }
  next();
};

