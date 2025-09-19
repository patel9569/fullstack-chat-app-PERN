
import db from '../lib/db.js'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import genrateToken from '../lib/utils.js'
import cloudinary from '../lib/cloudniary.js'
import oauth2client from '../lib/googleConfig.js'

import axios from 'axios'


config()
const signupAuth = async (req, res) => {
    try {
        const { name, email, password } = req.body
        const emailFind = await db.query("select id, email from users where email=$1", [email])
        if (emailFind.rows.length > 0) {
            return res.status(409).json({ message: "user already exist", success: false })
        }
        const salt = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password, salt)
        const userData = await db.query("insert into users(fullName,email,password) values($1,$2,$3) returning id,email", [name, email, hashPass])
        const userId = userData.rows[0].id
        genrateToken(userId, res)
        res.status(201).json({
            message: "succesfull user login",
            success: true,
            email,
            user: name

        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "server error", success: false })
    }
}

const loginAuth = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await db.query('select * from users where email=$1', [email])
        if (user.rows.length == 0) {
            return res.status(403).json({ message: "user not found", success: false })

        }
        if(user.rows[0].password ===null){
            return res.status(403).json({message: "This account uses Google login", success: false})
        }
        const Hashpass = await bcrypt.compare(password, user.rows[0].password)
        if (!Hashpass) {
            return res.status(403).json({ message: "invalid credentials", success: false })
        }
        genrateToken(user.rows[0].id, res)

        res.status(201).json({
            message: "login successfull",
            success: true,
            id: user.rows[0].id,
            email,
            fullname: user.rows[0].fullname,
            profile_pic: user.rows[0].profile_pic

        })


    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "server error", success: false })

    }

}

const logoutAuth = async (req, res) => {
    try {

        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "logout successfull", success: true })

    } catch (err) {
        res.status(500).json({ message: "internal server error", success: false })

    }

}

const updateProfile = async (req, res) => {

    try {
        const { ProfilePic } = req.body;
        const user = req.user.id;
        if (!ProfilePic) {
            return res.status(400).json({ message: "profile pic is required", success: false })
        }
        const uploadResponse = await cloudinary.uploader.upload(ProfilePic, {
            folder: "profile_pic",
        });
        const updatedUser = await db.query("update users set profile_pic=$1 where id = $2", [uploadResponse.secure_url, user])

        res.status(200).json({ message: updatedUser, success: true })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "internal server error", success: false })
    }


}


const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)

    } catch (err) {
        console.log("error in checkAuth controller", err.message)
        res.status(500).json({ message: "internal server error", success: false })
    }

}

const googleLoginAuth = async (req, res) => {
    const { code } = req.query
    const googleRes = await oauth2client.getToken(code)

    oauth2client.setCredentials(googleRes.tokens)
    const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    )

    const { name, email, picture } = userRes.data
    try {
        const userExists = await db.query("select id, fullname, email, profile_pic FROM users where email = $1 ", [email])
        let userId
        if (userExists.rows.length > 0) {
            userId = userExists.rows[0].id
        } else {
            const result = await db.query("insert into users(fullname, email, profile_pic) values($1, $2, $3) returning id",
                [name, email, picture])

            userId = result.rows[0].id
        }

        genrateToken(userId, res)
        res.status(201).json({
            message: "login successfull",
            success: true,
            id: userId,
            email,
            fullname: name,
            profile_pic: picture
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "server error", success: false })

    }


}

export { signupAuth, loginAuth, logoutAuth, updateProfile, checkAuth, googleLoginAuth }
