import { json } from "sequelize";
import Location from "../models/Location.js";
import Kost from "../models/Kost.js";
import { Client } from "@googlemaps/google-maps-services-js";

const apiKey = process.env.GOOGLE_MAPS_API_KEY;

export const findAll = async (req, res) => {
    try{
        const locations = await Location.findAll();
        res.json(locations)
    }catch(err){
        if(Location.length === 0){
            res.json({message: 'Null'})
        }
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

export const findOne = async (req, res) => {
    try{
        const location = await Location.findByPk(req.params.id);
        if(location){
            res.json(location)
        }else{
            return res.status(404).json({message: 'Data tidak ditemukan'})
        }
    }
    catch(err){
        return res.status(500).json({message: 'Internal Server Error'})
    } 
}

export const findByIdKost = async (req, res) => {
    try{
        const location = await Location.findAll({where: {id_kost: req.params.id}});
        if(location){
            res.json(location)
        }else{
            return res.status(404).json({message: 'Data tidak ditemukan'})
        }
    }
    catch(err){
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

export const checkPermissionCreate = async (req, res, next) => {
    try {
        const kost = await Kost.findOne({
            where: { id: req.body.id_kost },
            attributes: ['id_user']
        });
        const {id_user} = kost;
        if (id_user !== res.locals.userId) {
            return res.status(401).json({ message: 'Anda tidak memiliki izin' });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const create = async (req, res) => {
    const { id_kost, detail, village, subdistrict, regency } = req.body;
    if(!id_kost || !detail || !village || !subdistrict || !regency){
        return res.status(400).json({message: 'Data tidak lengkap'})
    }
    try{
        const fullAddress = `${detail}, ${village}, ${subdistrict}, ${regency}`;
        const googleMapsClient = new Client({});
        const geocodeResponse = await googleMapsClient.geocode({
            params: {
                address: fullAddress,
                key: apiKey
            },
            timeout: 1000
        });

        const locationData = geocodeResponse.data.results[0];
        if(!locationData){
            return res.status(404).json({message: 'Alamat tidak ditemukan'})
        }
        const { lat, lng } = locationData.geometry.location;
        const point_gmap = `https://www.google.com/maps?q=${lat},${lng}`;

        const locationExist = await Location.findOne({where: {id_kost}});
        if(locationExist){
            return res.status(409).json({message: 'Data sudah ada'})
        }

        const location = await Location.create({id_kost, detail, village, subdistrict, regency, point_gmap});
        res.json({message: 'Data berhasil ditambahkan', data: location})
    }catch(err){
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

export const checkPermission = async (req, res, next) => {
    try {
        const location = await Location.findOne({
            where: { id: req.params.id },
            attributes: ['id_kost']
        })
        if(!location){
            return res.status(404).json({message: 'Data tidak ditemukan'})
        }
        const {id_kost} = location;
        const kost = await Kost.findOne({
            where: { id: id_kost },
            attributes: ['id_user']
        });
        const {id_user} = kost;
        if (id_user !== res.locals.userId) {
            return res.status(401).json({ message: 'Anda tidak memiliki izin' });
        }
        next();
    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const update = async (req, res) => {
    const { id_kost, detail, village, subdistrict, regency } = req.body;
    if(!id_kost || !detail || !village || !subdistrict || !regency){
        return res.status(400).json({message: 'Data tidak lengkap'})
    }
    try{
        const fullAddress = `${detail}, ${village}, ${subdistrict}, ${regency}`;
        const googleMapsClient = new Client({});
        const geocodeResponse = await googleMapsClient.geocode({
            params: {
                address: fullAddress,
                key: apiKey
            },
            timeout: 1000
        });

        const locationData = geocodeResponse.data.results[0];
        if(!locationData){
            return res.status(404).json({message: 'Alamat tidak ditemukan'})
        }
        const { lat, lng } = locationData.geometry.location;
        const point_gmap = `https://www.google.com/maps?q=${lat},${lng}`;

        const location = await Location.findByPk(req.params.id);
        if(!location){
            return res.status(404).json({message: 'Data tidak ditemukan'})
        }
        await location.update({id_kost, detail, village, subdistrict, regency, point_gmap}, {where: {id: req.params.id}});
        res.json({message: 'Data berhasil diubah', data: location})
    }catch(err){
        return res.status(500).json({message: 'Internal Server Error'})
    }
}

export const destroy = async (req, res) => {
    try{
        const location = await Location.destroy({where: {id: req.params.id}});
        if(location){
            res.json({message: 'Data berhasil dihapus'})
        }else{
            return res.status(404).json({message: 'Data tidak ditemukan'})
        }
    }catch(err){
        return res.status(500).json({message: 'Internal Server Error'})
    }
}




