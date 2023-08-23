import "./map.js";
import "./api.js";
import { getAddress, sendHtmlCodeAsDocument } from "./api.js";
import { showAddressesDropdown } from "./options.js";

const checkboxesPlaces = document.querySelectorAll('input[name="place"]');
const checkboxesPrayer = document.querySelectorAll('input[name="places_for_prayer"]');
const addressInput = document.getElementById("addressInput");
const select = document.getElementById("select");
const submitButton = document.getElementById("button");
const photo = document.getElementById("file");
const nameInput = document.getElementById("name");



select.style.display = "none";

export let formData = new FormData();
let timer;

// Настроил список с checkbox, только с одним выбором.
checkboxesPlaces.forEach((checkbox) => {
  checkbox.addEventListener("click", () => {
    formData.delete("place");
    formData.append("place", checkbox.dataset.place);

    checkboxesPlaces.forEach((input) => {
      if (input !== checkbox) {
        input.checked = !checkbox.checked;
        input.disabled = !checkbox.checked;
      } else {
        input.disabled = checkbox.checked;
      }
    });
  });
});

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



// Вызываем функцию getAddress и передаем input value чтобы получить адреса.
addressInput.addEventListener("input", (e) => {
  const inputValue = e.target.value;

  clearTimeout(timer);

  timer = setTimeout(async () => {
  const address = await getAddress(inputValue);
    if (address) {
      dataProcessing(address)
      showAddressesDropdown(address, select);
    }
  }, 500);
});

// function для обработки данных с адреса.
export function dataProcessing(address, coords) {

  formData.delete("region");
  formData.delete("city");
  formData.delete("location");
  formData.delete("address");

// Есть два способа получение адреса: через поля ввода (input) и С меткой на карте. Обрабатываем их.
  const addressData = address?.suggestions && address?.suggestions[0]?.data;
  const region = addressData?.region + ` ${addressData?.region_type_full}` || address?.administrativeAreas
  const city = addressData?.settlement_with_type || addressData?.city_with_type || address?.localities[0];
  const location =  [addressData?.geo_lat, addressData?.geo_lon] || coords
  const addressForm = address?.suggestions && address?.suggestions[0]?.value || address?.addressLine
  
  formData.append("region", region);
  formData.append("city", city);
  formData.append("location", location);
  formData.append("address", addressForm);

}

// Сброс значений формы.
export function clearForm() {
  nameInput.value = "";
  checkboxesPlaces.forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.disabled = false;
  });
  checkboxesPrayer.forEach((checkbox) => {
    checkbox.checked = false;
    checkbox.disabled = false;
  });
  photo.value = "";
  addressInput.value = "";
  select.style.display = "none";
  formData = new FormData();
}

submitButton.addEventListener("click", () =>
  sendHtmlCodeAsDocument(
    nameInput,
    photo,
    formData,
  )
);
