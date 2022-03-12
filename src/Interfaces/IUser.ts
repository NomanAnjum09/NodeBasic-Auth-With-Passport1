import {Document} from "mongoose"

export interface IUser extends Document{
    Email: string
    Password: string
    FullName: string
    Gender: string
    DateOfBirth: Date
    LastLogin:Date
    Scope:Number
}

