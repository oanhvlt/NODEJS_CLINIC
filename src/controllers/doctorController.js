import userService from "../services/userService";


import doctorService from '../services/doctorService';

let handleGetTopDoctors = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) {
        limit = 10;
    }
    try {
        let topDostors = await doctorService.getTopDoctorsHome(+limit); //+: convert string to int
        return res.status(200).json(topDostors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}



module.exports = {
    handleGetTopDoctors,
}