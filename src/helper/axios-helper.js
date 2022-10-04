import axios from "axios"
require("dotenv").config()

const axiosHelper = async (url, method, formData = null, JSONData = null) => {
    const headers = formData
        ? { "Content-Type": "multipart/form-data" }
        : JSONData
        ? { "Content-Type": "application/json" }
        : {}
    headers.Authorization = `Bearer ${localStorage.getItem("token")}`
    return await axios({
        method: method,
        url: `${url}`,
        data: formData ? formData : JSONData ? JSONData : null,
        headers,
    })
}

export default axiosHelper
