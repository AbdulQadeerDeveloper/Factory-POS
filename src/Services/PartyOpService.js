import axios from '../Components/AxiosInstance'


const get = () => (
    axios.get(`api/ledger/opening`).then(res => res)
)

const post = (data) => (
    axios.post(`api/ledger/opening`, data).then(res => res)
)

const remove = (id) => (
    axios.delete(`api/ledger/opening/${id}`).then(res => res)
)

export default {get, post, remove}