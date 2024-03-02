import clinicService from '../services/clinicService';

let handleSaveClinic = async (req, res) => {

    try {
        let data = await clinicService.saveClinic(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            errCode: -1,
            message: 'Error from server...'
        })
    }
}

// let handleGetAllSpecialties = async (req, res) => {

//     try {
//         let data = await clinicService.getAllSpecialties();
//         return res.status(200).json(data);
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json({
//             errCode: -1,
//             message: 'Error from server...'
//         })
//     }
// }

// let handleGetClinicDoctorById = async (req, res) => {

//     try {
//         let data = await clinicService.getClinicDoctorById(req.query.id, req.query.location);
//         return res.status(200).json(data);
//     } catch (e) {
//         console.log(e);
//         return res.status(500).json({
//             errCode: -1,
//             message: 'Error from server...'
//         })
//     }
// }


module.exports = {
    handleSaveClinic,
    // handleGetAllSpecialties,
    // handleGetClinicDoctorById
}