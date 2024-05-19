import { config } from "../config.js";
import { getAddressTelegramChatBot, getAddresses } from "./api.js";

const script = document.querySelector('#script')
script.setAttribute('src', config.YANDEX_API)   

// Функция для вывода адресов на карту 

script.onload = function() {
  ymaps.ready(init);

}
async function init() {
  const getLocationData = await ymaps.geolocation.get();
  const location = getLocationData.geoObjects.position;
  const urlParams = new URLSearchParams(window.location.search);
  const chatId = urlParams.get("chatId");

  const state = {
    multiRoute: null,
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
      const text = el.descriptions ? el.descriptions.slice(0, 30) + "..." : ""
      const myPlacemark = new ymaps.Placemark(
        [el.latitude, el.longitude],
        {
          balloonContent: `
      <div class="balloon_content" >
      <img alt="address_image" class="balloon_image" src="${https}/${el.photo[0] && el.photo[0].image || "pngtree-img-file-document-icon-png-image_897560.jpg"}"
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
        },
        {
          iconLayout: "default#image",
          iconImageHref: settingicon(),
          iconImageSize: [30, 30],
        }
      );

      myPlacemark.events.add("click", () => {
        pathAddress([el.latitude, el.longitude]);
        state.balloon = true;
      });
      myMap.geoObjects.add(myPlacemark);

      myPlacemark.events.add("balloonclose", () => {
        pathAddress();
        state.balloon = false;
      });
   
      // Функция для вывода иконок
      function settingicon() {
        if (el.place === "Мечеть, молельня...") {
          return "/images/free-icon-mosque-7720545.png";
        }
        if (el.place === "Кафе, столовая, ресторан") {
          return "/images/restaurant_location_icon_146860.png";
        }
        if (el.place === "Здоровье, аптека, стоматология") {
          return "/images/4dlnngicuab8_64.png";
        }
        if (el.place === "Автозапчасти, сервис...") {
          return "/images/free-icon-car-repair-5193748.png";
        }
        if (
          el.place === "Продуктовый Магазин" ||
          el.place === "Исламский магазин"
        ) {
          return "/images/supermarket-512-e1443509745315.png";
        }
        if (el.place === "Мусульманский отель, хостел") {
          return "/images/free-icon-hostal-10402340.png";
        }
        if (el.place === "Другое") {
          return "/pngwing.com (4).png";
        }
      }
    });
  }
// Обработка перемещения ракурса на карте
  myMap.events.add("boundschange", async function () {
    if (!state.balloon) {
      const updatedVisibleAddresses = await getAddresses(myMap);
      myMap.geoObjects.removeAll();
      addAddressMaps(updatedVisibleAddresses);
    }
  });

// Функция для изменения схемы пути 
  async function pathAddress(endLocation) {
    if (state.multiRoute) {
      myMap.geoObjects.remove(state.multiRoute);
    }
    if (endLocation) {
      state.multiRoute = new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [location, endLocation],
        },
        {
          boundsAutoApply: true,
        }
      );

      return myMap.geoObjects.add(state.multiRoute);
    }
    state.multiRoute = null;
  }

  // Делегирования событий, обработка клик по кнопке в baloon
  document.addEventListener("click", function (event) {
    const btnBalloon = event.target.closest("#btn_balloon");
    if (btnBalloon) {
      const addressId = btnBalloon.dataset.id;

      getAddressTelegramChatBot(chatId, addressId);
    }
  });
}
