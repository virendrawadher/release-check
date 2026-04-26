import express from "express"
import http from "http"
import router from "./routes"
import cors from "cors"
const app = express()

app.use(cors())
app.use(express.json())
app.use("/",router)

const http_server = http.createServer(app)


http_server.listen(8000, () => {
    console.log("App is listening to port 8000")
})