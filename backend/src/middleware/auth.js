import jwt from "jsonwebtoken";
import db from '../lib/db.js'
import { config } from "dotenv";

config();

const protectedRoute = async (req, res, next) => {

    try {

        const token = req.cookies.jwt
        if (!token) {
            return res.status(403).json({ message: "unauthroized no token is provided", success: false })
        }
        const decoded = jwt.verify(token, process.env.SUPER_SECRET)
        if (!decoded) {
            return res.status(403).json({ message: "unauthroized invalid token", success: false })
        }
        const user = await db.query("select id, fullname, email, profile_pic, created_at, updated_at from users where id = $1;", [decoded.user])
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        req.user = user.rows[0]
        next()

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message, success: false })
        
 

    }

}

export { protectedRoute }

