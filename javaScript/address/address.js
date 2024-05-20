import { config } from "../config.js";
import { getAddressId } from "../global-func.js";
import { theme } from './carousel.js'

const { https } = config

const urlParams = new URLSearchParams(window.location.search)
const addressId = urlParams.get("address")

const carousel = document.querySelector('.icon-cards__content');
const addressBlock = document.querySelector('.address-info-block')
const figure = document.querySelector(".icon-cards")
const YandexMaps = document.createElement('a')
const GoogleMaps = document.createElement('a')
const maps_block = document.createElement("div")
const div = document.createElement('div')

maps_block.classList.add("maps_block")

const address = await getAddressId(addressId)

address.photo.forEach(({ image }, index) => {
    const img = document.createElement("img")
    img.src = `${https}/${image}`
    img.classList = "address-img"
    carousel.children[index].append(img)
})

theme(figure)

div.innerHTML = `<h3>Место: <i>${address.place}</i></h3>\n\n<h3>Место для молитвы: <i>${address.prayer}</i></h3>\n\n
<h3>Время работы: <i>${address.time}</i></h3>\n\n<h3>Адрес: <i>${address.address}</i></h3>\n\n<h3>Комментария: <i>${address.title}</i></h3>`

GoogleMaps.innerHTML = "Открыть в Google картах"
YandexMaps.innerHTML = "Открыть в Yandex картах"

GoogleMaps.href = `https://www.google.com/maps?daddr=${address.latitude},${address.longitude}`
YandexMaps.href = `https://yandex.ru/maps/?rtext=~${address.latitude},${address.longitude}`

maps_block.append(GoogleMaps, YandexMaps)
addressBlock.append(div, maps_block)