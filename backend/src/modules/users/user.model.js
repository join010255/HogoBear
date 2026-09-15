// Empty file
import sequelize from '../../config/database.js';
import { DataTypes } from "sequelize";

const Users = sequelize.define("Users", {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
    },
    tokenUser : {
        type : DataTypes.STRING,
        unique : true,
        allowNull : false
    },
    username: {
        type : DataTypes.STRING,
        unique : true,
        allowNull : false
    },
    publicKey : {
        type : DataTypes.STRING,
        defaultValue : null,
        allowNull : true
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    recovery_accout_text : {
        type : DataTypes.STRING,
        unique : true,
        allowNull : false
    },
},
    {
        tableName : "Users",
        timestamps :true
    }
);

export default Users;