import axios from 'axios'

export default() => {
return axios.create({
baseURL: `https://yawnmeter.com:5443` 
})
}
// baseURL: `https://yawnmeter.com:5443`
// baseURL: `https://localhost:5443`  