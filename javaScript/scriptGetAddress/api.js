
export async function getAddresses() {
    try {
        const res  = await fetch("https://testjavascript.ru/addresses")
        const data = await res.json()
        if(data) {
            const arrLocation = data.map(address => address.location)
            const arrImageName = data.map(address => address.photo.image)
           
            return data
        }
    } catch (error) {
        console.log(error.message);
    }
}