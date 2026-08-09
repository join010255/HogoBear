// Empty file

import sequelize from "../config/database";
import { DataTypes } from "sequelize";

const Conversation = sequelize.define("Conversation", {
    id : {
        primaryKey : true,
        autoIncrement : true,
        type : DataTypes.INTEGER,
    },
    user_one : {
        type : DataTypes.INTEGER,
        allowNull : false,
        
    },
    user_two : {
        type : DataTypes.INTEGER,
        allowNull : false,
        references : {
            model : "Users",
            key : "id"
        }
    },
    
},{
    tableName : "Conversation",
    timestamps : true,
});

export default Conversation;