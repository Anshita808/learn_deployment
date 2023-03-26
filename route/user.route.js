const express = require("express");
const {UserModel} = require("../model/user.model");
const userRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 

userRouter.post("/Register",async(req,res)=>{
    const {name,email,password,age}=req.body
    try {
        const isemail = await UserModel.findOne({email})
        if(isemail){
            res.status(400).send({"msg":"user already registered"});
        }
        bcrypt.hash(password, 5, async(err, hash)=> {
            
            const user = new UserModel({name,email,password:hash,age})
             await user.save()
            res.status(200).send(user)
        });
    } catch (error) {
        res.status(400).send({err:"user not register"})
    }
})

// login
// userRoute.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     try {
//       const user = await UserModel.find({ email: email, password: password });
//       user.length > 0 ? res.status(200).send({msg: "login successful", token: jwt.sign({ name: "shahbaz" }, "superman"),}): res.status(400).send({ err: "Login failed" });
//     } catch (error) {
//       res.status(400).send({ msg: err.message});
//     }
//   });

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try {
        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password, (err,result)=>{
                if(result){
                    res.status(200).send({"msg":"Login Sucessful","token":jwt.sign({"userID":user._id},"masai")})
                }else{
                    res.status(400).send({"msg":"Wrong Credentials"})
                }
            })
        }
        // user.length>0 ?res.status(200).send({msg:"login sucessful","token":jwt.sign({name:"Anshita"},"soon",{expiresIn:"1h"}),}):
        // res.status(400).send({err:"Login failed"});


    } catch (error) {
        res.status(400).send({err:"login failed"});
    }
})

userRouter.get("/data", async(req,res)=>{
    const token = req.headers.authorization
    jwt.verify(token, 'soon', (err, decoded)=> 
        { decoded ? res.status(200).send({ msg: "User Details" }) : res.status(400).send({ err: "login required, Cannot access restricted route" });
      });
})


// userRoute.get("/data", async (req, res) => {
//     const token  = req.headers.authorization
//     jwt.verify(token, "superman", (err, decoded) => { decoded ? res.status(200).send({ msg: "User Details" }) : res.status(400).send({ err: "login required, Cannot access restricted route" });
//     });
//   });


module.exports={
  userRouter
}