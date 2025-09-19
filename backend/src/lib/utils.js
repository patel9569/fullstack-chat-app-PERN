import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config();

const genrateToken = (user ,res)=>{

    const token = jwt.sign({user},process.env.SUPER_SECRET,
        {expiresIn:'24h'})

    res.cookie("jwt",token,{
        maxAge:24*60*60*1000,
        httpOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV !=="development"

    })

    return token

}

export default genrateToken