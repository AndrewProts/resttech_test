import axios from 'axios'
const env = require('../../environment')
const urlAccessToken = window.location.hash.split('&')
    .find((e) => e.indexOf('access_tocken'))
    .replace('#access_token=', '')
const localToken = window.localStorage.getItem('access_token')

if (localToken || urlAccessToken) {
    window.localStorage.setItem('access_token', localToken || urlAccessToken)
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + (localToken || urlAccessToken)
    if (urlAccessToken) {
        location.replace('/')
    }
} else {
    location.replace(`https://accounts.spotify.com/authorize?client_id=${env['CLIENT_ID:']}&redirect_uri=${location.origin}&scope=user-read-private%20user-read-email&response_type=token&state=123`)
}

axios.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (401 === error.response.status) {
        console.log('401')
        window.localStorage.clear()
        location.replace(`https://accounts.spotify.com/authorize?client_id=${env['CLIENT_ID:']}&redirect_uri=${location.origin}&scope=user-read-private%20user-read-email&response_type=token&state=123`)
    } else {
        return Promise.reject(error);
    }
});

export default {}
