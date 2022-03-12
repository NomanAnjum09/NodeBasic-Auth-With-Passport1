import { NextFunction, Response, Request } from "express"
import { IUser } from "../Interfaces/IUser"
import Users from "../Models/UserModel"
import * as jwt from "jsonwebtoken";
import "../Passport"
import passportJwt from "passport-jwt";
import passport from "passport";
import { AuthController } from "../Controllers/AuthController"



export class UserController {
    ExtractJwt = passportJwt.ExtractJwt;

    SignOutUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        req.logout();
    };


    AuthenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const JWT_SECRET = process.env.JWTSECRET || ""
        try {
            const user: IUser | null = await Users.findOne({ Email: req.body.Email });
            if (!user) {
                res.status(404).json({ message: 'User not found' });
            }
            const password: string = user?.Password || "";
            const validate = await password === req.body.Password;
            ;

            if (!validate) {
                res.status(500).json({ message: 'IncorrectPassword' });
            }
            const token = jwt.sign({ username: req.body.Email, scope: user?.Scope }, JWT_SECRET);
            user?.update({"LastLogin":new Date()})
            user?.save()
            res.status(200).json({userId: user?.id, token: token, Message: "Login Success" })
        } catch (error) {
            throw error
        }
    }


    RegisterUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const body = req.body as Pick<IUser, "Email" | "Password" | "FullName" | "Gender" | "DateOfBirth" | "Scope">
            //const hashedPassword = bcrypt.hashSync(body.Password, bcrypt.genSaltSync(10));
            const JWT_SECRET = process.env.JWTSECRET || ""
            if(await Users.exists({Email:body.Email}))
                {res.status(500).json({Message:"Email Already Exist In DataBase"});
                return;
            }
                const user = new Users({
                Email: body.Email,
                Password: body.Password,
                FullName: body.FullName,
                Gender: body.Gender,
                DateOfBirth: new Date(body.DateOfBirth),
                LastLogin: new Date(),
                Scope: body.Scope
            })
            const token = jwt.sign({ username: body.Email, scope: body.Scope }, JWT_SECRET);
            const newUser: IUser = await user.save()

            res
                .status(201)
                .json({ message: "User added", user: newUser, token })
        } catch (error) {
            throw error
        }
    }



    GetAllUsers = async (req: Request, res: Response): Promise<void> => {
        try {
            const ALLUsers: IUser[] = await Users.find()
            res.status(200).json({ ALLUsers })
        } catch (error) {
            throw error
        }
    }

    GetUser = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log("gETTING uSER")
            const currentUser: IUser | null = await AuthController.GetUser(req)
                res.status(200).json({ currentUser })
        } catch (error) {
            res.status(500).json({})
        }
    }


    updateUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const currentUser: IUser | null = await AuthController.GetUser(req)
            if(currentUser!=null){
                await Users.findByIdAndUpdate(
                { _id: currentUser._id },
                req.body
            )
            const updateduser: IUser | null = await Users.findById(currentUser._id);

            res.status(200).json({
                message: "User updated",
                updatedUser: updateduser,
            })}
            else{
                res.status(500).json({Message:"Something Went Wrong, Please Update Later"});
            }
        } catch (error) {
            throw error
        }
    }



    deleteUser = async (req: Request, res: Response): Promise<void> => {
        try {
            const deletedUser: IUser | null = await Users.findByIdAndRemove(
                req.params.id
            )
            res.status(200).json({
                message: "User deleted",
                todo: deletedUser,
            })
        } catch (error) {
            throw error
        }
    }

}

export default UserController