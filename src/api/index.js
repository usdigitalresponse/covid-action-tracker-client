import axios from 'axios'

export default() => {

    let rootUrl = process.env.VUE_APP_ROOT_URL ? process.env.VUE_APP_ROOT_URL : 'https://api.actiontracker.org';
    let environment = 'production';

    if (window.location.host.search('localhost') != -1) {
        environment = 'local';
        rootUrl = process.env.VUE_APP_ROOT_URL ? process.env.VUE_APP_ROOT_URL : 'http://localhost:5069';
    }

    console.log('Host: ' + window.location.host);
    console.log('Environment: ' + environment)
    console.log('RootURL: ' + rootUrl)
    //console.log('Token: ' + getPreference('token'))
      
    return axios.create({
        baseURL: rootUrl,
        withCredentials: false,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })


    
}