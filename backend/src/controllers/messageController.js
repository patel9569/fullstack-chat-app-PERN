import cloudinary from "../lib/cloudniary.js";
import db from "../lib/db.js";
import { getReciverSocketId, io } from "../lib/socket.js";

const getUserForSidebar = async (req, res) => {
  try {
    const loggedId = req.user.id;
    const allUser = await db.query(
      "select id, fullname, email, profile_pic, created_at, updated_at from users where id != $1",
      [loggedId]
    );
    res.status(200).json(allUser.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error", success: false });
  }
};

const getMessage = async (req, res) => {
  try {
    const toChat = req.params.id;
    const myId = req.user.id;
    const message = await db.query(
      "select * from message where (sender_id=$1 and reciver_id=$2) or (sender_id=$2 and reciver_id=$1) order by created_at asc",
      [myId, toChat]
    );
    res.status(200).json(message);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error", success: false });
  }
};


const getContact= async(req,res)=>{
  try {
    
    const id = req.params.id
    const result = await db.query("select distinct on (u.id) u.id from users u join message m on (u.id = m.sender_id and m.reciver_id = $1) or (u.id = m.reciver_id and m.sender_id =  $1) where u.id != $1 order by u.id, m.created_at desc",[id])
    res.status(200).json(result.rows)
    
  } catch (error) {
    console.log(err.message);
    res.status(500).json({ message: "internal server error", success: false });
    
  }

  
}


const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const tochat = req.params.id;
    const myId = req.user.id;

    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const sendData = await db.query(
      "insert into message (sender_id, reciver_id, texts, image, created_at) values ($1, $2, $3, $4, NOW()) returning *",
      [myId, tochat, text, imageUrl]
    );

    const newMessage = sendData.rows[0];

  
    const reciverSocketId = getReciverSocketId(tochat);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("messageUpdated", newMessage);
      


      const result = await db.query("select sender_id as user_id, count(*) as unread_count from message where reciver_id = $1 and read = false group by sender_id", [tochat])
      io.to(reciverSocketId).emit("unreadMeassage", result.rows)
    }
    const senderSocketId = getReciverSocketId(myId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageUpdated", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error", success: false });
  }
};

const sendEmoji = async (req, res) => {
  try {
    const { emoji, id } = req.body;
    const result = await db.query(
      "update message set emoji=$1 where id=$2 returning *",
      [emoji, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "message not found", success: false });
    }

    const updatedMessage = result.rows[0];

    // Emit single unified event
    const reciverSocketId = getReciverSocketId(updatedMessage.reciver_id);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("messageUpdated", updatedMessage);
    }
    const senderSocketId = getReciverSocketId(updatedMessage.sender_id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageUpdated", updatedMessage);
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error", success: false });
  }
};

const updatemessage = async (req, res) => {
  try {
    const { id, texts } = req.body;
    const result = await db.query(
      "update message set texts=$1, edited_text=true where id=$2 returning *",
      [texts, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "message not found", success: false });
    }

    const updatedMessage = result.rows[0];

    const reciverSocketId = getReciverSocketId(updatedMessage.reciver_id);
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("messageUpdated", updatedMessage);
    }
    const senderSocketId = getReciverSocketId(updatedMessage.sender_id);
    if (senderSocketId) {
      io.to(senderSocketId).emit("messageUpdated", updatedMessage);
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "internal server error unable to update message", success: false });
  }
};


const deletemessage = async (req, res) => {

  try {
    const { id } = req.body
    const result = await db.query("update  message set texts='User have deleted the message' where id=$1 returning * ", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "message not found", success: false });
    }
    const updatedMessage = result.rows[0];
    const senderSocketId = getReciverSocketId(updatedMessage.sender_id)
    const reciverSocketId = getReciverSocketId(updatedMessage.reciver_id)

    if (senderSocketId) {

      io.to(senderSocketId).emit("deleteMessage", updatedMessage)

    }
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("deleteMessage", updatedMessage)

    }






  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "internal server error unable to delete message", success: false });


  }

}




const unreadcount = async (req, res) => {

  const currentUserId = req.user.id
  try {

    const result = await db.query("select sender_id as user_id, count(*) as unread_count from message where reciver_id = $1 and read = false group by sender_id", [currentUserId])

    const reciverSocketId = getReciverSocketId(currentUserId)
    if (reciverSocketId) {
      io.to(reciverSocketId).emit("unreadMeassage", result.rows)
    }

    res.status(200).json(result.rows)


  } catch (error) {

    console.log(error)
    res.status(500).json({ message: "internal server error unable to unread count message", success: false });


  }

}

const markReadcount = async (req, res) => {

  try {
    const reciverId = req.user.id
    const senderId = req.params.id
   const  data= await db.query("update message set read=true where sender_id=$1 and reciver_id=$2 and read= false returning *", [senderId, reciverId])

   if(data.rows.length>0){
     const reciverSocketId = getReciverSocketId(reciverId);
     const senderSocketId = getReciverSocketId(senderId)

     data.rows.forEach(msg=>{
       if(senderSocketId){
         io.to(senderSocketId).emit("messageUpdated",msg)
       }
      if(reciverSocketId)
      {
        io.to(reciverSocketId).emit("messageUpdated",msg)
      }
     })
   }


    const result = await db.query("select sender_id as user_id, count(*) as unread_count from message where reciver_id = $1 and read = false group by sender_id", [reciverId])
    const reciverSocketId = getReciverSocketId(reciverId);

    if (reciverSocketId) {
      io.to(reciverSocketId).emit("unreadMeassage", result.rows);
    }
    res.status(200).json({ success: true })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "internal server error unable to update unread count message", success: false });

  }

}






export { getUserForSidebar, getMessage, sendMessage, sendEmoji, updatemessage, deletemessage, unreadcount, markReadcount,getContact };
