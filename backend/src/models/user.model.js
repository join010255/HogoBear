// Empty file
import sequelize from "../config/database";
import { DataTypes } from "sequelize";

const Users = sequelize.define("Users", {
    id : {
        primaryKey : true,
        autoIncrement : true,
        type : DataTypes.INTEGER,
    },
    tokenUser : {
        type : DataTypes.STRING,
        unique : true,
        allowNull : false
    },
    publicKey : {
        type : DataTypes.STRING,
        defaultValue : null,
        unique : true,
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