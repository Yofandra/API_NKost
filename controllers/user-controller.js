import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../middlewares/emailService.js";
import crypto from 'crypto';
import { Op } from 'sequelize';

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
      
    const allowedRoles = ["penyewa", "pemilik"];
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

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      });
      const verifyURL = `http://localhost:3000/user/verify-account`;
      const emailContent =  `Hai ${newUser.name},\n\n` +
        `Terima kasih telah mendaftar di platform kami.\n\n` +
        `Untuk menyelesaikan proses pembuatan akun kamu, silakan verifikasi email Anda dengan mengklik tautan di bawah ini atau menyalinnya ke browser kamu:\n\n` +
        `${verifyURL}\n\n` +
        `Jika kamu tidak merasa melakukan pendaftaran ini, kamu dapat mengabaikan email ini dengan aman.\n\n` +
        `Terima kasih,\n` +
        `Tim Kami \n` +
        `nKost`;
          

    await sendEmail(newUser.email, 'Verifikasi Akun', emailContent);
    res.status(200).json({ 
      message: 'Akun telah dibuat, silahkan cek email Anda untuk verifikasi akun.'
    });
    
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "Server Error",
      });
    }
}

export const verifyAccount = async (req, res) => {
  const { email } = req.body;
  try {
    const user
    = await User.findOne({
      where: {
        email: email,
      },
    });
    if (!user) {
      return res.status(404).json({
        message: "User tidak ditemukan",
      });
    }
    if (user.status === "active") {
      return res.status(400).json({
        message: "Akun sudah diverifikasi",
      });
    }
    const updateUser = await User.update({
      status: "active",
    }, {
      where: {
        email: email,
      },
    });
    res.status(200).json({
      status: "Success",
      message: "Akun berhasil diverifikasi",
    });
  } catch (error) {
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
          },
        });
        if (!user) {
          return res.status(400).json({
            message: "Email atau password salah",
          });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          return res.status(400).json({
            message: "Email atau password salah",
          });
        }
    
        const token = jwt.sign(
          { userId: user.id, role: user.role, name: user.name},
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        user.last_login = new Date();
        await user.save();
        
        res.status(200).json({
          status: "Success",
          token: token,
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
            message: "email tidak ditemukan",
          });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiry = Date.now() + 3600000;

        user.resetPasswordToken = token;
        user.resetPasswordExpires = tokenExpiry;
        await user.save();

        const resetURL = `https://api-n-kost.vercel.app/user/reset-password?token=${token}`;
        const emailContent =  `Hai ${user.name},\n\n` +
          `Kami menerima permintaan untuk mereset password akun Anda.\n\n` +
          `Untuk melanjutkan proses reset password, silakan klik tautan di bawah ini atau salin dan tempel ke browser Anda:\n\n` +
          `${resetURL}\n\n` +
          `Jika Anda tidak merasa melakukan permintaan ini, Anda dapat mengabaikan email ini dengan aman. Password Anda akan tetap aman.\n\n` +
          `Terima kasih,\n` +
          `Tim Kami \n` +
          `nKost`;
  
        
        await sendEmail(user.email, 'Reset Password Anda', emailContent);
        res.status(200).json({ 
          message: 'Reset password telah dikirim' 
        });

      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Server Error",
        });
      }
}

export const resetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    console.log('Token received:', token); 
    console.log('Current Time:', Date.now());

    try {
        const user = await User.findOne({
          where: {
            resetPasswordToken: token,
            resetPasswordExpires: { [Op.gt]: Date.now() }
          },
        });
        console.log(user)
        if (!user) {
          return res.status(404).json({
            message: "Token tidak valid atau telah kadaluarsa",
          });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({
          status: "Success",
          message: "Password berhasil direset",
        });

      } catch (error) {
        console.log(error);
        res.status(500).json({
          message: "Server Error",
        });
      }
}