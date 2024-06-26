import User from "../models/User.js";
import bcrypt from "bcryptjs";
import errorHandler from "../middlewares/errorHandler.js";

export const findAll = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            status: "Success",
            data: users, 
        });
    } catch (err) {
        if (User.length === 0) {
            const error = new Error("Tidak Ditemukan!");
            return errorHandler(error, req, res);
        } else {
            const error = new Error(err.message);
            return errorHandler(error, req, res);
        }
    }
}

export const findOne = async (req, res) => {
  const id = req.params.id;
    console.log(id);
    try {  
      const user = await User.findOne({ where: { id: id } })  
      if (!user) {
        return res.status(404).json({
          message: "User tidak ditemukan",
        });
      }
  
      res.status(200).json({
        status: "Success",
        data: user,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }

export const getUserById = async (req, res) => {
    const id = res.locals.userId;
    console.log(id);
    try {  
      const user = await User.findOne({ where: { id: res.locals.userId } })  
      if (!user) {
        return res.status(404).json({
          message: "User tidak ditemukan",
        });
      }
  
      res.status(200).json({
        status: "Success",
        data: user,
      });
  
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }

  export const updateUserById = async (req, res) => {
    const id = req.params.id;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[^!,]+$/;
    try {
        if (req.params.id != req.userId) {
            const error = new Error("Unauthorized");
            return errorHandler(error, req, res);
        }
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        if (!nameRegex.test(req.body.name)) {
            return res.status(400).json({
              message: "Nama tidak boleh mengandung tanda seru atau koma",
            })};
        if (req.body.email) {
            if (!emailRegex.test(req.body.email)) {
                const error = new Error("Invalid_Email");
                return errorHandler(error, req, res);
            } else {
                const user = await User.findOne({ where: { email: req.body.email } });
                if (user) {
                    const error = new Error("Email_Exist");
                    return errorHandler(error, req, res);
                }   
            }
        }
        delete req.body.last_login;

        await User.update(req.body, {
            where: { id: req.params.id }
        });

        res.status(200).json({
            status: "Success",
            message: "Berhasil mengubah data",
        });
    } catch (error) {
          console.log(error);
          res.status(500).json({
              message: "Server Error",
          });
      }
}

export const updateUser = async (req, res) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[^!,]+$/;
  
  try {
    const user = await User.findOne({ where: { id: res.locals.userId } });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    if (!nameRegex.test(req.body.name)) {
      return res.status(400).json({
        message: "Nama tidak boleh mengandung tanda seru atau koma",
      });
    }

    if (req.body.email && req.body.email !== user.email) {
      if (!emailRegex.test(req.body.email)) {
        const error = new Error("Invalid_Email");
        return errorHandler(error, req, res);
      } else {
        const existingUser = await User.findOne({ where: { email: req.body.email } });
        if (existingUser) {
          const error = new Error("Email_Exist");
          return errorHandler(error, req, res);
        }
      }
    }

    delete req.body.last_login;

    await User.update(req.body, {
      where: { id: res.locals.userId }
    });

    res.status(200).json({
      status: "Success",
      message: "Berhasil mengubah data",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const deleteUser = async (req, res) => {
    const id = req.params.id;

    if (req.userId != id && req.userRole !== 'admin') {
        return res.status(403).json({
          message: "Anda tidak memiliki izin untuk mengubah data ini",
        });
      }

    try {
      const user = await User.destroy({
        where: {
          id: id,
        },
      });
      if (!user) {
        return res.status(404).json({
          message: "User tidak ditemukan",
        });
      }
      res.status(200).json({
        status: "Success",
        message: "Berhasil menghapus data",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
        
