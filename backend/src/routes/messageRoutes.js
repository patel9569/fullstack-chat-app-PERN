import express from 'express'
import { protectedRoute } from '../middleware/auth.js'
import { deletemessage, getContact, getMessage, getUserForSidebar, markReadcount, sendEmoji, sendMessage, unreadcount, updatemessage } from '../controllers/messageController.js'

const router= express.Router()

router.get('/users',protectedRoute,getUserForSidebar)
router.get('/contacts/:id',protectedRoute,getContact)
router.get('/:id',protectedRoute,getMessage)
router.post('/send/:id',protectedRoute,sendMessage)
router.put('/send/emoji',protectedRoute,sendEmoji)
router.put('/send/updatemessage',protectedRoute,updatemessage)
router.put('/send/deletemessage',protectedRoute,deletemessage)
router.put('/mark-as-read/:id', protectedRoute, markReadcount)
router.get('/send/unreadcount', protectedRoute, unreadcount)


export default router