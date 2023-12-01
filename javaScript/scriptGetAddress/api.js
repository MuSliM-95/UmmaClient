import { https } from "../https.js"


export async function getAddresses(map) {
    const bounds = await map.getBounds()
    const location = {
        topLeft: bounds[0],
        bottomRight: bounds[1],
    }
    const jsonLocation = JSON.stringify(location)

    try {
        const res  = await fetch(`${https}/addresses/${jsonLocation}`)
        const data = await res.json()
        if(data) {           
            return data
        }
    } catch (error) {
        console.log(error.message);
    }
}

