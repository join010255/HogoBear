// Empty file
import sequelize from '../../config/database.js';
import { DataTypes } from "sequelize";

const Friends =  sequelize.define("Friends", {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        primaryKey : true,
    },
    user_id : {
        type : DataTypes.UUID,
        allowNull : false,
    },
    friend_id : {
        type : DataTypes.UUID,
        allowNull : false,
    },
    is_blocked : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
        allowNull : false
    }
},
{  
    tableName : "Friends",
    timestamps : true,
}
)

export default Friends;