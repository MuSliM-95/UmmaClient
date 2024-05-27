import { config } from "./config.js";


const { https } = config

// function для обработки данных с Яндекс Карты.
export function dataProcessing(address, coords, formData) {
    formData.delete("region");
    formData.delete("city");
    formData.delete("location");
    formData.delete("address");

    const region =
        address?.administrativeAreas && address?.administrativeAreas[0];
    const city =
        (address?.localities && address?.localities[0]) ||
        address?.premise ||
        "Не указан";
    const location = coords;
    const addressForm = address?.addressLine;

    formData.append("region", region);
    formData.append("city", city);
    formData.append("location", location);
    formData.append("address", addressForm);
}

// Получаем адрес по id
export async function getAddressId(addressId) {
    const res = await fetch(`${https}/address/${addressId}`)
    if (!res.ok) {
        return
    }
    return await res.json()
}

// Функция для определения геолокации
export async function getMyLocation() {
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(success, error, {
                enableHighAccuracy: true,
            });
            function success({ coords }) {
                resolve([coords.latitude, coords.longitude]);
            }
            function error({ message }) {
                reject(message);
            }
        });
        return position;
    } catch (error) {
        console.log(error.message);
    }
}


// Функция получения адреса отмеченного места 
export async function init() {
    const [mapSection, addressInput, mapButton, formData, addressGeolocation] = arguments
    let firstGeoObject

    const location = addressGeolocation || await getMyLocation()
    await getAddressFromCoordinates(location)

    const myMap = new ymaps.Map("map", {
        center: location,
        zoom: 12,
    });

    const placemark = new ymaps.Placemark(myMap.getCenter(), {
        balloonContent: "Выберите местоположение",
    });

    myMap.geoObjects.add(placemark);

    placemark.events.add("dragend", (event) => {
        getAddressFromCoordinates(placemark.geometry.getCoordinates());
    });

    myMap.events.add("click", (event) => {
        placemark.geometry.setCoordinates(event.get("coords"));

        getAddressFromCoordinates(placemark.geometry.getCoordinates());

    });

    async function getAddressFromCoordinates(coords) {

        const geocoder = await ymaps.geocode(coords)

        firstGeoObject = geocoder.geoObjects.get(0);
        addressInput.value = firstGeoObject.getAddressLine();

        if (coords) {
            dataProcessing(firstGeoObject?._xalEntities, coords, formData)
        }
    }
    mapButton.addEventListener("click", () => {
        mapSection.classList.toggle("section_map_none")

    })
}

// Функция для отправки формы.
export async function addAddress() {
    try {
        const [textarea, nameInput, photo, formData, timeInput, form, chatId, addressId = ''] = arguments;
        
        const prayer = formData.get("prayer");

        if (!prayer) {
            alert('Выберите хотя бы один пункт, "Есть места для молитвы".');
            return
        }

        if (photo.files.length > 3) {
            alert("Максимально допустимо только 3 файла")
            return
        }

        onFormdata(formData, textarea, timeInput, photo, nameInput)

        const request = addressId ? "PATCH" : "POST"

        console.log(request);
        const res = await fetch(`${https}/address/${chatId}/${addressId}`, {
            method: request,
            body: formData,
        });

        const data = await res.json()
        if (data) {
            form.reset()
        }

    } catch (error) {
        console.error("Ошибка при отправке HTML-файла:", error);
    }
}


function onFormdata(formData, textarea, timeInput, photo, nameInput) {
    const name = nameInput.value;
    const [input1, input2] = timeInput;
    formData.delete("textarea");
    formData.delete("name");
    formData.delete("photo[]");
    formData.delete("time");
    formData.append("textarea", textarea.value);
    formData.append("name", name);

    for (let file of photo.files) {
        formData.append(`photo[]`, file);
    }

    formData.append("time", `${input1.value} до ${input2.value}`);

}