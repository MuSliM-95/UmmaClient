
export async function getAddresses() {
    try {
        const res  = await fetch("https://testjavascript.ru/addresses")
        const data = await res.json()
        if(data) {           
            return data
        }
    } catch (error) {
        console.log(error.message);
    }
}