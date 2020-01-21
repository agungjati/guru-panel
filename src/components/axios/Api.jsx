import axios from 'axios'

export default axios.create({
  baseURL: `://cms.gdi.pojokan.io/`,
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYmU3ZjA5NzdkODJmMWIzYTVhMzBlMCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTU3NzI2Nzk5NywiZXhwIjoxNTc5ODU5OTk3fQ.UyS0u9MfZ3VsqOUbFjDJbDZdKEEbCKE-Yl9qg-wOko'
})