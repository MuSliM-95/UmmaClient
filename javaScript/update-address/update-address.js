import { addAddress, getAddressId, init } from "../global-func.js";
import { config } from "../config.js";

const script = document.querySelector('#script')
const form = document.querySelector("#form")
const block = document.createElement("div")
const file = document.createElement("div")
const dropDownList = document.querySelector("#drop-down-list")
const mapSection = document.getElementById("mapSection");
const addressInput = document.getElementById("addressInput");
const mapButton = document.getElementById("mapButton")
const textarea = document.getElementById("descriptions");
const textarea_label = document.getElementById("descriptions_label");
const nameInput = document.getElementById("name");
const timeInput = document.querySelectorAll('input[type="time"]');
const placeSelect = document.querySelector("#section-place-select")
const submit = document.querySelector('#button')

const { https, YANDEX_API } = config
const urlParams = new URLSearchParams(window.location.search);
const [chatId, addressId] = urlParams.getAll("data");
const address = await getAddressId(addressId)
const formData = new FormData()
const blob = new File([], 'pred.jpg', {type: 'image/jpg'})
const files = [blob, blob, blob]
script.setAttribute('src', YANDEX_API)

const addressGeolocation = [address.latitude, address.longitude]
const defaultImage = "default.jpg"

script.onload = function () {
    ymaps.ready(() => {
        init(mapSection, addressInput, mapButton, formData, addressGeolocation)
    });
}

block.classList.add("block")
file.classList = "files-block"

nameInput.value = address.title
textarea.value = address.descriptions
dropDownList.value = address.place
placeSelect.value = address.prayer
timeInput.forEach((el, index) => {
    el.value = address.time.split(" до ")[index]
})


formData.delete("prayer");
formData.append("prayer", address.prayer);

// Вывод количество символов оставшиеся для описания.
textarea.addEventListener("input", (e) => {
    const symbols = 300 - e.target.value.length
    textarea_label.innerHTML = `Символов:${symbols}`
})

for (let i = 0; i < 3; i++) {
    const div = document.createElement("div")
    const input = document.createElement("input")
    const button_clear = document.createElement("button")

    const reader = new FileReader()

    button_clear.classList.add("delete-image-button")
    input.type = "file"
    input.accept = ".jpg, .jpeg, .png"

    input.classList.add("custom-file-input")

    const img = document.createElement("img")
    div.append(button_clear, img, input)

    const image = address.photo[i] && address.photo[i].image || defaultImage
    img.src = `${https}/${image}`


    input.addEventListener("change", (event) => {

        const file = event.target.files[0]
        const pred_name = `${image}`

        button_clear.classList.remove("delete-image-button")
        button_clear.classList.add("clear-image-button")
        formData.append("pred_name[]", pred_name)

        files[i] = file
        reader.onload = function (e) {
            const imageUrl = e.target.result
            img.src = imageUrl
        }
        reader.readAsDataURL(file);
    })
    
    button_clear.addEventListener("click", (event) => {
        event.stopPropagation();
        button_clear.classList.add("delete-image-button")
        button_clear.classList.remove("clear-image-button")
        
        if(files[i].name === 'pred.jpg') {
            const file = new File([], `${defaultImage}`, {type: 'image/jpg'})
            files[i] = file
            input.value
            img.src = `${https}/${defaultImage}`
            return
        }

        files[i] = blob
        img.src = `${https}/${image}`
    })

    file.append(div)
}


// Настроил выпадающий список.
function onChange() {
    const value = this.value;
    if (this.id === "drop-down-list") {
        formData.delete("place");
        formData.append("place", value);
        return
    }
    formData.delete("prayer");
    formData.append("prayer", value);
}

dropDownList.onchange = onChange;
placeSelect.onchange = onChange;


submit.addEventListener("click", (event) => {
    event.stopPropagation()
    addAddress(textarea, nameInput, { files }, formData, timeInput, form, chatId, addressId)
})


block.append(file)
form.prepend(block)
