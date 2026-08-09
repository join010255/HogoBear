// Empty file
import sequelize from "../config/database";
import { DataTypes } from "sequelize";

const Friends =  sequelize.define("Friends", {
    id : {
        primaryKey : true,
        autoIncrement : true,
        type : DataTypes.INTEGER,
    },
    user_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
    },
    friend_id : {
        type : DataTypes.INTEGER,
        allowNull : false,
    } 
},
{  
    tableName : "Friends",
    timestamps : true,
}
)

export default Friends;