import { useEffect, useState } from "react"
import type { ReleaseListI } from "../interface/ReleaseList"
import { STATUS_REV } from "../constants"
import { MdDelete } from "react-icons/md"
import { FaEye } from "react-icons/fa"
import "./ReleaseCheck.css"
import axios from "axios"

export default function ReleaseCheck(){
    const [releaseList, setReleaseList] = useState<Array<ReleaseListI>>([])
    
    useEffect(() => {
        async function callApi(){
            const response = await axios.get("http://localhost:8000/list")
            if(response.data && response.data.data){
                const newData = response.data.data.map((d: ReleaseListI) => {
                    const date = new Date(d.date * 1000)
                    d.readableDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`
                    return d
                })
                setReleaseList(newData)
            }
        }
        callApi()
        return () => {
            callApi()
        }
    }, [])
    
    const [isShowView, setIsShowView] = useState(false)
    const [breadCrumb, setBreadCrumb] = useState(["All Release"])
    const [release, setRelease] = useState<ReleaseListI | null>(null)
    
    const showView = (release_id: string) => {
        console.log("Show view here ", release_id)
        setIsShowView(true)
        const nextBreadCrumb = release_id === "add" ? "Add" : "View"
        setBreadCrumb((prevBreadCrumb) => ([...prevBreadCrumb,  nextBreadCrumb]))
        if(release_id !== "add"){
            const release_by_id = releaseList.find((releaseL) => releaseL._id === release_id)
            if(release_by_id){
                setRelease({...release_by_id})
            }
        }else{
            setRelease(null)
        }
        
    }
    
    const deleteRelease = (release_id: string) => {
        console.log("Delete release ", release_id)
    }
    
    const updateBreadcrumb = (index: number) => {
        const newBreadcrumb = breadCrumb[index]
        console.log("New breadcru")
        setBreadCrumb([newBreadcrumb])
        setIsShowView(false)
    }
    
    const saveDetails = (release_id?: string) => {
        if(!release_id){
            //Add data
            const body_data = {...release, date: Math.floor(new Date(release?.readableDate as string).getTime() / 1000)}
            delete body_data['readableDate']
            const response = axios.post("http://localhost:8000/add", {data: body_data})
            console.log("Response of add", response)
        }else{
            //Edit data
        }
    }
    
    const changesToUpdate = (value: any, key: string) => {
        const update_release = {...release}
        update_release[key as keyof ReleaseListI] = value
        setRelease(update_release as any)
    }
    
    return (
        <div>
            <span>Release Check</span>
            <div>
                <div className="header">
                    <div className="breadcrumb-container">
                        {
                            breadCrumb.map((breadC, index) => (
                                <div key={index} onClick={() => updateBreadcrumb(index)} className="view">
                                    <span>{breadC}</span>
                                    {(index < breadCrumb.length - 1) && <span>{">"}</span>}
                                </div>
                                
                            ))
                        }
                    </div>
                    <button className="button-container" onClick={() => showView("add")}>New Release</button>
                </div>
                {!isShowView && <table className="table-container">
                    <tr>
                        <th>Release</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th></th>
                        <th></th>
                    </tr>
                    {
                        releaseList.map((releaseL: ReleaseListI) => (
                            <tr key={releaseL._id}>
                                <td>{releaseL.name}</td>
                                <td>{releaseL.readableDate}</td>
                                <td>{STATUS_REV[releaseL.status]}</td>
                                <td onClick={() => showView(releaseL._id as string)} className="view">View <FaEye/></td>
                                <td onClick={() => deleteRelease(releaseL._id as string)} className="delete">Delete <MdDelete/></td>
                            </tr>
                        ))
                    }
                </table>}
                {
                    isShowView && <div>
                        <div>
                            <div style={{display: 'flex', flexDirection: 'column', width: "300px"}}>
                                <label>Release</label>
                                <input value={release ? release.name : ""} onChange={(e) => changesToUpdate(e.target.value, "name")}/>
                            </div>
                            <div style={{display: 'flex', flexDirection: 'column', width: "300px"}}>
                                <label>Date</label>
                                <input value={release ? release.readableDate: ""} onChange={(e) => changesToUpdate(e.target.value, "readableDate")} placeholder="Enter date in DD/MM/YYYY"/>
                            </div>
                        </div>
                            <div style={{display: 'flex', flexDirection: 'column', width: "300px"}}>
                                {
                                    (release && release.steps) && (release.steps.map((step) => (
                                        <div>
                                            <input type="checkbox" value={step.name} checked={step.status === 1} />
                                            <span>{step.name}</span>
                                        </div>
                                    )))
                                }
                                
                            </div>
                        <div style={{display: 'flex', flexDirection: 'column', width: "300px"}}>
                            <label>Additional Information</label>
                            <textarea value={release ? release.additional_info: ""} onChange={(e) => changesToUpdate(e.target.value, "additional_info")} />
                        </div>
                        <button onClick={() => saveDetails(release?._id)}>Save</button>
                    </div>
                }
            </div>
        </div>
    )
}