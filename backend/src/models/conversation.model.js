// Empty file

import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Conversation = sequelize.define("Conversation", {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
    },
    user_one : {
        type : DataTypes.UUID,
        allowNull : false,
        references : {
            model : "Users",
            key : "id"
        }
    },
    user_two : {
        type : DataTypes.UUID,
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