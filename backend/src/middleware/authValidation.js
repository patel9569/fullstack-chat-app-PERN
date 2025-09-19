import Joi from 'joi'

const signupValidation = (req,res,next)=>{


    const schema = Joi.object({
        name:Joi.string().min(4).max(100).required(),
        email:Joi.string().email().required(),
        password:Joi.string().min(6).max(100).required()

    })
    const {error}= schema.validate(req.body)
    if(error){
        return res.status(400).json({message:error.details[0].message,success:false})
    }
    next();
}


const loginValidation = (req,res,next)=>{
    const schema = Joi.object({
        email:Joi.string().email().required(),
        password:Joi.string().min(6).max(100).required()
    })
    const {error} = schema.validate(req.body)
    if(error){
       return res.status(400).json({message:error.details[0].message,success:false})
    }
    next()
}

export {signupValidation,loginValidation}