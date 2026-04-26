import { Router } from "express";
import releaseList from './releaseList.json'
const router = Router()

router.get('/list', (req, res) => {
    try {
        res.json({
            status: "success",
            message: "Release list fetched successfully",
            data: releaseList
        })
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Some error occured"
        })
    }
})

router.post('/add', (req, res) => {
    try {
        const body = req.body
        const name = body.name
        const date = body.date
        
        const add_data:any = {
            name: name,
            date: date,
            status: 0,
            steps: [],
            additional_info: "",
            _id: '1234560'
        }
        releaseList.push(add_data)
        res.json({
            status: "success",
            message: "Release list added succeessfully",
            data: add_data
        })
        
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "Some error occured"
        })
    }
})


export default router