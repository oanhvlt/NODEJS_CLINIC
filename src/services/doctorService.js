import db from "../models/index";
import _ from 'lodash';

require('dotenv').config(); //to use process.env
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const ACTIONS_CREATE = 'CREATE';
const ACTIONS_EDIT = 'EDIT';

let getTopDoctorsHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [["createdAt", "desc"]],
                attributes: {
                    exclude: ["password"]
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                //raw: true,
                nest: true
            });

            resolve({
                errCode: 0,
                data: users
            });
        } catch (e) {
            reject(e);
        }
    })
}

let getAllDoctors = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude: ["password", "image"]
                },
            });

            resolve({
                errCode: 0,
                data: doctors
            });
        } catch (e) {
            reject(e);
        }
    })
}

let saveDoctorDetails = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown
                || !inputData.action || !inputData.selectedPrice || !inputData.selectedPayment
                || !inputData.selectedProvince || !inputData.nameClinic
                || !inputData.addressClinic) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!"
                })
            } else {
                //upsert to Markdown
                if (inputData.action === ACTIONS_CREATE) {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                        // specialtyId: inputData.specialtyId,
                        // clinicId: inputData.clinicId,
                    })
                } else if (inputData.action === ACTIONS_EDIT) {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        //raw: false
                    });
                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        //doctorMarkdown.updatedAt = new Date();
                        await doctorMarkdown.save();
                    }
                }

                //upsert to Doctor_indo table
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: { doctorId: inputData.doctorId }
                })
                if (doctorInfo) {
                    //update
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.addressClinic = inputData.addressClinic;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.note = inputData.note;
                    await doctorInfo.save();
                } else {
                    //create
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        addressClinic: inputData.addressClinic,
                        nameClinic: inputData.nameClinic,
                        note: inputData.note,
                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save info doctor succeed!"
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getDoctorDetailsById = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ["password"]
                    },
                    include: [
                        //get data form markdown table
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentMarkdown', 'contentHTML']
                        },
                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        //get data from doctor_info table
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ["id", "doctorId"]
                            },
                            include: [
                                {
                                    model: db.Allcode, as: 'priceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                            ]
                        },
                    ],
                    //raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

let bulkCreateSchedule = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try { //inputData send from FE: ManageSchedule.js > handleSaveSchedule
            if (!inputData.arrSchedule || !inputData.doctorIdInput || !inputData.dateInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            } else {
                let schedule = inputData.arrSchedule;
                //console.log('data send: ', typeof schedule)
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                //console.log('data send: ', schedule)
                let existing = await db.Schedule.findAll({
                    where: {
                        doctorId: inputData.doctorIdInput,
                        date: inputData.dateInput
                    },
                    attributes: ['doctorId', 'date', 'timeType', 'maxNumber'],
                    raw: true //important to compare existing and toCreate
                });
                //convert date in DB to timestamp to compare
                // if (existing && existing.length > 0) {
                //     existing = existing.map(item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // }

                //compare existing and toCreate
                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date; //+: compare string
                })
                //save new data
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save info succeed!"
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleByDate = (doctorIdInput, dateInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorIdInput || !dateInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorIdInput,
                        date: dateInput
                    },
                    include: [
                        {
                            model: db.Allcode,
                            as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    nest: true
                })
                if (!data) {
                    data = [];
                }

                resolve({
                    errCode: 0,
                    data
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getExtraInfoDoctorById = (doctorIdInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorIdInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: doctorIdInput,
                    },
                    attributes: {
                        exclude: ["id", "doctorId"]
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'priceData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'provinceData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'paymentData',
                            attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    //nest: true
                })
                if (!data) {
                    data = [];
                }

                resolve({
                    errCode: 0,
                    data
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

let getProfileDoctorById = (doctorIdInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorIdInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters!"
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: doctorIdInput },
                    attributes: {
                        exclude: ["password"]
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        //get data form markdown table
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentMarkdown', 'contentHTML']
                        },
                        //get data from doctor_info table
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ["id", "doctorId"]
                            },
                            include: [
                                {
                                    model: db.Allcode, as: 'priceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                            ]
                        },
                    ],
                    //raw: false,
                    nest: true
                })

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};

                resolve({
                    errCode: 0,
                    data
                });
            }

        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getTopDoctorsHome,
    getAllDoctors,
    saveDoctorDetails,
    getDoctorDetailsById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById
}