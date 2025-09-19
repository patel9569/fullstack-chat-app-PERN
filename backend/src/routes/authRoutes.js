import express, { Router } from 'express'
import { loginValidation, signupValidation } from '../middleware/authValidation.js'
import { checkAuth, googleLoginAuth, loginAuth, logoutAuth, signupAuth, updateProfile } from '../controllers/authController.js'
import { protectedRoute } from '../middleware/auth.js'


const router = express.Router()

router.post('/signup',signupValidation,signupAuth)

router.post('/login',loginValidation,loginAuth)

router.post('/logout',logoutAuth)

router.get('/google',googleLoginAuth)

router.put('/update-profile',protectedRoute,updateProfile)

router.get('/check',protectedRoute,checkAuth)

export default router