import express, { Express } from "express"
import mongoose from "mongoose"
import cors from "cors"
import UserRouter from "./Routes/UserRoutes"
//import compression from "compression"
var bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
//Import the secondary "Strategy" library
const LocalStrategy = require('passport-local').Strategy

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(UserRouter)
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(session({
  secret: "secret",
  resave: false ,
  saveUninitialized: true ,
}))
app.use(passport.initialize()) 
app.use(passport.session())   

const PORT: string | number = process.env.PORT || 4000
const uri: string = process.env.ConnectionString || ""


mongoose
  .connect(uri)
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    )
  )
  .catch(error => {
    throw error
  })