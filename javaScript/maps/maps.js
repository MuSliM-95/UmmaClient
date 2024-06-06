import { config } from "../config.js";
import { getAddressTelegramChatBot, getAddresses } from "./api.js";

const { https, YANDEX_API } = config

const script = document.querySelector('#script')
script.setAttribute('src', YANDEX_API)

// Функция для вывода адресов на карту 

script.onload = function () {
  ymaps.ready(init);
}
async function init() {
  const getLocationData = await ymaps.geolocation.get();
  console.log(getLocationData);
  const location = getLocationData.geoObjects.position;
  const urlParams = new URLSearchParams(window.location.search);
  const chatId = urlParams.get("chatId");

  const state = {
    balloon: false,
    onKeyboardOpen: false,
  };

  const myMap = new ymaps.Map("map", {
    center: location,
    zoom: 12,
  });

  const addresses = await getAddresses(myMap);

  addAddressMaps(addresses);

  // Функция для вывода элементов адреса в виде html в balloon
  function addAddressMaps(addAddress) {
    addAddress?.forEach((el) => {
      const {preset, color} = settingicon(el)
      const text = el.descriptions ? el.descriptions.slice(0, 30) + "..." : ""

      myMap.geoObjects
        .add(new ymaps.Placemark([el.latitude, el.longitude], {
          balloonContent: `
          <div class="balloon_content" >
          <img alt="address_image" class="balloon_image" src="${https}/${el.photo[0] ? el.photo[0].image : "pngtree-img-file-document-icon-png-image_897560.jpg"}"
          "style="max-width: 20px; max-height: 20px;"/>
          <div class="balloon_address_info">
          <strong>${el.title}</strong>
          <em>${el.place}</em>
          <em><strong>Место молитвы: </strong>${el.prayer}</em>
          <em><strong>Время работы: </strong>${el.time}</em>
          <em><strong>id:</strong>${el.id}</em>
          <em><strong>Адрес:</strong> ${el.address}</em>
          <em><strong>Описания:</strong> ${text}</em>
          <a href="https://yandex.ru/maps/?rtext=${location}~${[
              el.latitude,
              el.longitude,
            ]}&rtt=auto">Проложить путь</a>
          </div>
          <button id="btn_balloon" data-id="${el.id}">Вывести в чат</button>
          </div>
          `,
          iconContent: preset,

        }, {
          preset: preset,
          iconColor: color
        }))

    });
  }

  // Функция для вывода иконок
  function settingicon(el) {
    if (el?.place === "Здоровье, аптека, стоматология") {
      return {preset: 'islands#redMedicalIcon', color: 'red'}
    }
    if (el?.place === "Мечеть, молельня...") {
      return { preset: '<img class="iconContent" src="../../images/mosque_building_icon_195165.svg">', color: "green" }
    }
    if (el?.place === "Кафе, столовая, ресторан") {
      return { preset: 'islands#yellowFoodIcon', color: "yellow" }
    }
    if (el?.place === "Автозапчасти, сервис...") {
      return { preset: 'islands#brownAutoIcon', color: "brown" }
    }
    if (
      el?.place === "Продуктовый Магазин" ||
      el?.place === "Исламский магазин"
    ) {
      return { preset: 'islands#blueShoppingIcon', color: "blue" }
    }
    if (el?.place === "Мусульманский отель, хостел") {
      return { preset: 'islands#orangeHotelIcon', color: 'orange' }
    }
    if (el?.place === "Другое") {
      return { preset: 'islands#blackDotIcon', color: 'black' }
    }
  }

  // Обработка перемещения ракурса на карте
  myMap.events.add("boundschange", async function () {
    if (!state.balloon) {
      const updatedVisibleAddresses = await getAddresses(myMap);
      addAddressMaps(updatedVisibleAddresses);
    }
  });

  // Делегирования событий, обработка клик по кнопке в baloon
  document.addEventListener("click", function (event) {
    const btnBalloon = event.target.closest("#btn_balloon");
    if (btnBalloon) {
      const addressId = btnBalloon.dataset.id;

      getAddressTelegramChatBot(chatId, addressId);
    }
  });
}
