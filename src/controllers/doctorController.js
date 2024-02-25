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
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleGetAllDoctors = async (req, res) => {

    try {
        let dostors = await doctorService.getAllDoctors();
        return res.status(200).json(dostors);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleCreateDoctorDetails = async (req, res) => {

    try {
        let dostors = await doctorService.createDoctorDetails(req.body);
        return res.status(200).json(dostors);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleGetDoctorDetailsById = async (req, res) => {

    try {
        let info = await doctorService.getDoctorDetailsById(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleBulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateSchedule(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

let handleGetScheduleByDate = async (req, res) => {
    let doctorId = req.query.doctorId;
    let date = req.query.date;
    try {
        let info = await doctorService.getScheduleByDate(doctorId, date);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

module.exports = {
    handleGetTopDoctors,
    handleGetAllDoctors,
    handleCreateDoctorDetails,
    handleGetDoctorDetailsById,
    handleBulkCreateSchedule,
    handleGetScheduleByDate
}