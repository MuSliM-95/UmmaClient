const checkboxesPlaces = document.querySelectorAll('input[name="place"]');
const checkboxesPrayer = document.querySelectorAll(
  'input[name="places_for_prayer"]'
);
const addressInput = document.getElementById("addressInput");
const select = document.querySelector(".select");
const button = document.querySelector(".buttonSection");
const photo = document.getElementById("file");
const nameInput = document.getElementById("name");

const TOKEN = "6385242471:AAHbB4XATZPHWTOTahCixY9C2N-uf-Df5EQ";
const CHATID = 373573317;

select.style.display = "none";

let formData = new FormData();
let timer;

// Настроил список с checkbox, только с одним выбором
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

// Настроил список с checkbox, только с одним выбором
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

// Вызываем функцию getAddress и передаем input value чтобы получить адреса
addressInput.addEventListener("input", (e) => {
  const inputValue = e.target.value;

  clearTimeout(timer);

  timer = setTimeout(async () => {
    const addresses = await getAddress(inputValue);

    showAddressesDropdown(addresses);
  }, 500);
});

// function для обработки и добавление полученных адресов всплывающий блок с подсказками
function showAddressesDropdown(addresses) {
  clearDropdown();

  addresses.suggestions.forEach((address) => {
    const option = document.createElement("div");
    option.innerHTML = address.value;
    select.prepend(option);
    select.style.display = "block";
  });

  if (select.children) {
    for (const option of select.children) {
      option.addEventListener("click", () => {
        addressInput.value = option.innerHTML;
        select.style.display = "none";
      });
    }
  }
}

// function для очистки всплывающий блок с подсказками
function clearDropdown() {
  while (select.lastChild) {
    select.removeChild(select.lastChild);
    select.style.display = "none";
  }
}

// Получаем адреса из стороннего Api
async function getAddress(text) {
  try {
    const res = await fetch(
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Token d48068d3df3e54cbd1bb9c0a6edf99b88a6adfe4",
        },
        body: JSON.stringify({ query: text }),
      }
    );
    const address = await res.json();

    // Обработка данных с адреса
    formData.delete("region");
    formData.delete("city");
    formData.delete("location");
    formData.delete("address");
    if (address) {
      formData.append(
        "region",
        address.suggestions[0]?.data.region +
          ` ${address.suggestions[0]?.data.region_type_full}`
      );
      formData.append("city", address.suggestions[0].data?.settlement);
      formData.append("location", [
        address.suggestions[0].data?.geo_lat,
        address.suggestions[0].data?.geo_lon,
      ]);
      formData.append("address", address.suggestions[0].value);

      return address;
    }
  } catch (error) {
    console.log(error);
  }
}

// Сброс значений всех инпутов
function clearForm() {
  nameInput.value = "";
  checkboxesPlaces.forEach((input) => {
    input.checked = false;
    input.disabled = false;
  });
  checkboxesPrayer.forEach((input) => {
    input.checked = false;
    input.disabled = false;
  });
  photo.value = "";
  addressInput.value = "";
  select.style.display = "none";
  formData = new FormData();
}

// Отправка сообщения в Telegram
async function sendMessageTelegram(params) {
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: CHATID,
        text: `id: ${params?._id}`,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

// Функция для button для отправки формы
async function sendHtmlCodeAsDocument() {
  const name = nameInput.value;
  formData.append("name", name);
  formData.append("photo", photo.files[0]);

  const region = formData.get("region");
  const place = formData.get("place");
  const city = formData.get("city");
  const prayer = formData.get("prayer");
  const address = formData.get("address");
  const location = formData.get("location");

  console.log(address);

  // if (!name || !region || !city || !place || !prayer || !address || !location) {
  //   return;
  // }

  try {
    const res = await fetch(`http://localhost:5000/data`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data) {
      clearForm();
      await sendMessageTelegram(data);
    }
  } catch (error) {
    console.error("Ошибка при отправке HTML-файла:", error);
  }
}

button.addEventListener("click", sendHtmlCodeAsDocument);
