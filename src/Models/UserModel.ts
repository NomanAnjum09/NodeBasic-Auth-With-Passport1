import { IUser } from "../Interfaces/IUser"
import { model, Schema } from "mongoose"

const UserSchema: Schema = new Schema(
    {
        Email: {
            type: String,
            required: true,
        },
        Password: {
            type: String,
            required: true,
        },
        FullName: {
            type: String,
            required: true,
        },

        Gender: {
            type: String,
            required: true,
        },

        DateOfBirth: {
            type: Date,
            required: true,
        },

        LastLogin: {
            type: Date,
            required: true,
        },
        Scope:{
            type: Number,
            required:false
        },
    },
    { timestamps: true }
)

export default model<IUser>("Users", UserSchema)