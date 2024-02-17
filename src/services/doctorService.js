import db from "../models/index";
import bcrypt from "bcryptjs";

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

let createDoctorDetails = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.contentHTML || !inputData.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                await db.Markdown.create({
                    contentHTML: inputData.contentHTML,
                    contentMarkdown: inputData.contentMarkdown,
                    description: inputData.description,
                    doctorId: inputData.doctorId,
                    // specialtyId: inputData.specialtyId,
                    // clinicId: inputData.clinicId,
                })
            }

            resolve({
                errCode: 0,
                errMessage: "Save info doctor succeed!"
            });
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
                    errMessage: "Missing parameter!"
                });
            } else {
                let data = await db.User.findOne({
                    where: { id: inputId },
                    attributes: {
                        exclude: ["password"]
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentMarkdown', 'contentHTML']
                        },
                        {
                            model: db.Allcode,
                            as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    //raw: true,
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
    createDoctorDetails,
    getDoctorDetailsById
}