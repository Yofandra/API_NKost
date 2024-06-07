import Location from "../models/Location.js";
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
        const point_gmap = locationData;

        const location = await Location.create({id_kost, detail, village, subdistrict, regency, point_gmap});
        res.json({message: 'Data berhasil ditambahkan', data: location})
    }catch(err){
        return res.status(500).json({message: 'Internal Server Error'})
    }
}




