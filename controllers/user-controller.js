import User from "../models/User.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

// const bcrypt = require("bcrypt"),
//   jwt = require("jsonwebtoken");

dotenv.config();

export const register = async (req, res) => {
    const { name, email, password, role } = req.body
    if (password.length <= 8) {
        return res.status(400).json({
            message: "Password harus lebih dari 8 karakter",
        })};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Email tidak valid",
        })};
      
    const allowedRoles = ["penyewa", "pemilik", "admin"];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({
            message: "Role tidak valid",
        })};
    
    try {
      const existingUserEmail = await User.findOne({
        where : {email: email}
      });
      if (existingUserEmail) {
        return res.status(400).json({
          message: "Email sudah terdaftar",
        });
      }
      const newUser = await User.create({
        name: name,
        email: email,
        password: password,
        role: role,
      });
      res.status(201).json({
        status: "Success",
        data: newUser,
      });
    }
    catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({
          where: {
            email: email,
            password: password,
          },
        });
        if (!user) {
          return res.status(400).json({
            message: "Email atau password salah",
          });
        }
        res.status(200).json({
          status: "Success",
          data: user,
        });
      } 
      catch (error) {
        res.status(500).json({
          message: "Server Error",
        });
      }
}

export const forgetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({
          where: {
            email: email,
          },
        });
        if (!user) {
          return res.status(404).json({
            message: "User tidak ditemukan",
          });
        }

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          port: 587,
          secure: false,
          debug: true,
          auth: {
              user: process.env.EMAIL_SENDER,
              pass: process.env.PASS_SENDER
          },
          tls: {
              rejectUnauthorized: true
          }
        });
        const resetURL = `http://yourfrontend.com/reset-password?token=`;
        const mailOptions = {
          to: user.email,
          from: process.env.EMAIL_SENDER,
          subject: 'Password Reset',
          text: `Anda menerima email ini karena Anda telah meminta reset password untuk akun Anda.\n\n` +
                `Klik link berikut, atau salin dan tempel ke browser Anda untuk menyelesaikan prosesnya:\n\n` +
                `${resetURL}\n\n` +
                `Jika Anda tidak meminta ini, abaikan email ini dan password Anda akan tetap aman.\n`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: error.message });
        }
        res.status(200).json({ message: 'Password reset email sent' });
    });
      }
      catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Server Error",
        });
      }
}

export const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({
          where: {
            email: email,
          },
        });
        if (!user) {
          return res.status(404).json({
            message: "User tidak ditemukan",
          });
        }
        const updateUser = await User.update({
          password: password,
        }, {
          where: {
            email: email,
          },
        });
        res.status(200).json({
          status: "Success",
          message: "Password berhasil direset",
        });
      }
      catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Server Error",
        });
      }
}

export const deleteUser = async (req, res) => {
  const id = req.params.id;
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
      
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email } = req.body;
    try {
        const user = await User.update({
          name: name,
          email: email,
        }, 
        {
          where: {
            id: id,
          },
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
export const getUserById = async (req, res) => {
    try {
      const id = req.params.id; 
  
      const user = await User.findByPk(id, {
        attributes: ['name', 'email'], 
      });
  
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