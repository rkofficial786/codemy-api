const express =require("express")

const app =express()

const userRoutes =require("./routes/User")
const profileRoutes =require("./routes/Profile")
const paymentRoutes =require("./routes/Payments")
const courseRoutes =require("./routes/Course")
const path=require("path")


const database =require("./config/database")
const cookieParser  =require("cookie-parser")

const cors =require("cors")

const {cloudinaryConnect} =require("./config/cloudinary")
const fileUpload =require("express-fileupload")
const dotenv =require("dotenv")

dotenv.config()

const PORT  = process.env.PORT || 4000


//db connect 
database.connect()

//middleware 
app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.use(
    fileUpload({
        useTempFiles:true ,
        tempFileDir:"/tmp"
    })
)
app.use(express.static(path.join(__dirname,'../build')))

cloudinaryConnect()


app.use("/api/v1/auth" ,userRoutes)
app.use("/api/v1/profile" ,profileRoutes)
app.use("/api/v1/course" ,courseRoutes)
app.use("/api/v1/payment" ,paymentRoutes)


//rest api
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname, "../build/index.html"))
})

app.get("/" ,(req,res)=>{
    return res.json({
        success:true ,
        message:"Your server is running"
    })
})

app.listen(PORT,()=>{
    console.log(`App is ruuning in ${PORT}`)
})