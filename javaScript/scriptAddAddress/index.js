import "./addAddress.js";
import { init } from "./addAddress.js";
import "./api.js";
import { addAddress } from "./api.js";

const dropDownList = document.querySelector('#drop-down_list');
const checkboxesPrayer = document.querySelectorAll('input[name="places_for_prayer"]');
const addressInput = document.getElementById("addressInput");
const submitButton = document.getElementById("button");
const photo = document.getElementById("file");
const nameInput = document.getElementById("name");
const timeInput = document.querySelectorAll('input[type="time"]')


ymaps.ready(init);

export let formData = new FormData();

console.log(timeInput);

// Настроил выпадающий список.
function onChange() {
  const value = dropDownList.value;
  formData.delete("place");
  formData.append("place", value);
}
dropDownList.onchange = onChange;


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


// function для обработки данных с адреса.
export function dataProcessing(address, coords) {
  formData.delete("region");
  formData.delete("city");
  formData.delete("location");
  formData.delete("address");


// Обработка данных с Яндекс.Карты
  const region = address?.administrativeAreas && address?.administrativeAreas[0]
  const city = address?.localities && address?.localities[0] || address?.premise || "Не указан";
  const location = coords
  const addressForm =  address?.addressLine
    
  formData.append("region", region);
  formData.append("city", city);
  formData.append("location", location);
  formData.append("address", addressForm);

}

// Сброс значений формы.
export function clearForm() {
  nameInput.value = "";
  const [input1, input2] = timeInput
  input1.value = ""
  input2.value = ""
  dropDownList.value = ""
  checkboxesPrayer.forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.disabled = false;
  });
  photo.value = "";
  addressInput.value = "";
  formData = new FormData();
}

submitButton.addEventListener("click", () =>
addAddress(
    nameInput,
    photo,
    formData,
    timeInput
  )
);
