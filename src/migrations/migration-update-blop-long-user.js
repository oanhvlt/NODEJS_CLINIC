
//reference topic: Sequelize js , how do we change column type in migration
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('users', 'image', {
                type: Sequelize.BLOB('long'),
                allowNull: true,
            })
        ])
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn('users', 'image', {
                type: Sequelize.STRING,
                allowNull: true,
            })
        ])
    }
};