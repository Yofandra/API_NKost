import { where } from "sequelize";
import Rating from "../models/Rating.js";
import User from "../models/User.js";

export const findAll = async (req, res) => {
    try {
        const rating = await Rating.findAll()
        res.json(rating)   
    } catch (error) {
        if(Rating.length === 0){
            res.json({msg: 'Null'})
        }else{
            return res.status(500).json({msg: 'Internal Server Error'})
        }
    }
}

export const findByIdUser = async (req, res) => {
    try {
        const rating = await Rating.findOne({ where: { id_user: res.locals.userId } })
        if(rating){
            res.json(rating)
        }else{
            return res.status(200).json({msg : 'Belum memberi penilaian'})
        }
    } catch (error) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}

export const findByIdKost = async (req, res) => {
    try {
        const ratings = await Rating.findAll({ where: { id_kost: req.params.id } });

        if (ratings.length === 0) {
            return res.status(200).json({ msg: 'Belum ada Penilaian' });
        }

        const userIds = ratings.map(rating => rating.id_user);
        const users = await User.findAll({ where: { id: userIds } });

        const formattedResponses = ratings.map(rating => {
            const user = users.find(user => user.id === rating.id_user);

            return {
                id: rating.id,
                penyewa: user,
                ratings: rating.rating,
                comment: rating.comment,
                id_kost: rating.id_kost
            };
        });

        res.json(formattedResponses);
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error', err });
    }
};


export const create = async (req, res) => {
    const id_user =  res.locals.userId
    const {id_kost, rating, comment} = req.body
    try {
        const ratingExist = await Rating.findOne({where: {id_kost, id_user}})
        if(ratingExist){
            return res.status(409).json({message : 'Sudah memberi penilaian'})
        }
        const ratings = await Rating.create({id_user, id_kost, rating, comment})
        res.json({message : 'Data berhasil ditambahkan', data : ratings})
    } catch (error) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}

export const update = async (req, res) => {
    const {rating, comment} = req.body
    try {
        const ratings = await Rating.findOne(({ where: { id_user: res.locals.userId } }))
        if(!ratings){
            return res.status(404).json({msg : 'Data tidak ditemukan'})
        }
        await ratings.update({rating, comment})
        res.json(ratings)
    } catch (error) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}

export const destroy = async (req, res) => {
    try {
        const rating = await Rating.destroy({ where: { id_user: res.locals.userId } })
        if(rating){
            res.json({msg : 'Data berhasil dihapus'})
        }else{
            res.status(404).json({msg : 'Data tidak ditemukan'})
        }
    } catch (error) {
        return res.status(500).json({msg: 'Internal Server Error'})
    }
}