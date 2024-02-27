import db from "../models/index";
require('dotenv').config(); //to use process.env
//import _ from 'lodash';
//const ACTIONS_CREATE = 'CREATE';
//const ACTIONS_EDIT = 'EDIT';


let bookAppointment = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputData.email) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters!"
                })
            } else {
                //upsert patient
                //doc: https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
                let user = await db.User.findOrCreate({
                    where: { email: inputData.email },
                    defaults: {
                        email: inputData.email,
                        roleId: 'R3'
                    },
                    raw: true
                });
                //console.log('check user found: ', user[0])
                //create a booking record
                if (user) {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                            date: inputData.date,
                        },
                        //data from BookingModal.js
                        defaults: {
                            statusId: 'S1',
                            patientId: user[0].id,
                            doctorId: inputData.doctorId,
                            date: inputData.date, //birthday from FE: 
                            timeType: inputData.timeType,
                        },

                    })
                }

                resolve({
                    errCode: 0,
                    errMessage: "Save booking succeed!",
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    bookAppointment
}