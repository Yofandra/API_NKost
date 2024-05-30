import User from "../models/User.js";

export const register = async (req, res) => {
    const { name, email, password, role } = req.body
    if (password.length < 8) {
        return res.status(400).json({
            message: "Password harus lebih dari 8 karakter",
        })};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Email tidak valid",
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