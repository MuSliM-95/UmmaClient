
import { config } from "../config.js";
import { init, addAddress, getMyLocation } from "../global-func.js";

const script = document.querySelector('#script')
const dropDownList = document.querySelector("#drop-down-list");
const checkboxesPrayer = document.querySelectorAll(
  'input[name="places_for_prayer"]'
);
const addressInput = document.getElementById("addressInput");
const photo = document.getElementById("file");
const nameInput = document.getElementById("name");
const textarea = document.getElementById("descriptions");
const textarea_label = document.getElementById("descriptions_label");
const timeInput = document.querySelectorAll('input[type="time"]');
const mapSection = document.getElementById("mapSection");
const mapButton = document.getElementById("mapButton")
const form = document.querySelector(".registrationPage")

script.setAttribute('src', config.YANDEX_API)

script.onload = function () {
  ymaps.ready(() => {
    init(mapSection, addressInput, mapButton, formData)
  });
}

const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get("chatId");

export let formData = new FormData();

// Настроил выпадающий список.
function onChange() {
  const value = dropDownList.value;
  formData.delete("place");
  formData.append("place", value);
}
dropDownList.onchange = onChange;


// Вывод количество символов оставшиеся для описания.
textarea.addEventListener("input", (e) => {
  const symbols = 300 - e.target.value.length
  textarea_label.innerHTML = `Символов:${symbols}`

})

// Настроил список с checkbox, только с одним выбором.

checkboxesPrayer.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    formData.delete("prayer");
    formData.append("prayer", checkbox.dataset.prayer);

    checkboxesPrayer.forEach((input) => {
      if (input !== checkbox) {
        input.checked = !checkbox.checked;
        input.disabled = !checkbox.checked;
      } else {
        input.disabled = checkbox.checked;
      }
    });
  });
});

form.addEventListener("submit", (event) => {
  console.log();
  event.preventDefault();
  addAddress(textarea, nameInput, photo, formData, timeInput, form, chatId)
});
