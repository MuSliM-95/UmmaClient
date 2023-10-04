import { getAddresses } from "./api.js";
import { filterAddressesByVisibleBounds } from "./options.js";

ymaps.ready(init);

async function init() {

  const getLocationData = await ymaps.geolocation.get();
  const location = await getLocationData.geoObjects.position;
  const addresses = await getAddresses();
  let multiRoute;
  let isSearchPanelIsOpen = false;
  
  const myMap = await new ymaps.Map("map", {
    center: location,
    zoom: 12,
  });

  // // const inputSearch = await document.querySelector(".ymaps-2-1-79-searchbox-input__input")
  // const buttonSearch = document.querySelector(".ymaps-2-1-79-float-button")
  // // console.log(inputSearch);
  // console.log(buttonSearch);

  const visibleAddresses = filterAddressesByVisibleBounds(myMap, addresses);
  addAddressMaps(addresses);

  async function addAddressMaps(addAddress) {
    await addAddress?.forEach((el) => {
      const myPlacemark = new ymaps.Placemark(
        el.location,
        {
          balloonContent: `
      <div class="balloon_content" >
      <img class="balloon_image" src="https://testjavascript.ru/${
        el.photo?.image || "scale_1200.webp"
      }" "style="max-width: 20px; max-height: 20px;"/>
      <div class="balloon_address_info">
      <strong>${el.title}</strong>
      <em>${el.place}</em>
      <em><strong>Место молитвы: </strong>${el.prayer}</em>
      <em>${el.address}</em>
      <a href="https://yandex.ru/maps/?rtext=${location}~${
            el.location
          }&rtt=auto">Проложить путь</a>
      </div>
      </div>
      `,

        },
        {
          iconLayout: "default#image",
          iconImageHref: settingicon(),
          iconImageSize: [30, 30],
          searchControlLayout: isSearchPanelOpen
      
        }
      );

      myPlacemark.events.add("click", () => {
        pathAddress(el.location);
      });
      myMap.geoObjects.add(myPlacemark);

      myPlacemark.events.add('balloonclose', () => {
        if(!isSearchPanelIsOpen) {
          pathAddress()
        }
      });

      function settingicon() {
        if (el.place === "Мечеть, молельня...")
          return "/UmmaClient/images/free-icon-mosque-7720545.png";
        if (el.place === "Кафе, столовая, ресторан")
          return "/UmmaClient/images/restaurant_location_icon_146860.png";
        if (el.place === "Здоровье, аптека, стоматология")
          return "/UmmaClient/images/4dlnngicuab8_64.png";
        if (el.place === "Автозапчасти, сервис...")
          return "/UmmaClient/images/4886967921672192.jpg";
        if (el.place === "Продуктовый Магазин" || el.place === "Исламский магазин")
          return "/UmmaClient/images/supermarket-512-e1443509745315.png";
        if(el.place === "Мусульманский отель, хостел") 
          return "/UmmaClient/images/kP-1K4qVqT4.jpg"
        }
    });
  }

  // myMap.events.add("boundschange", function () {
  //   const updatedVisibleAddresses = filterAddressesByVisibleBounds(
  //     myMap,
  //     addresses
  //   );

  //   if (!multiRoute) {
  //     myMap.geoObjects.removeAll();
  //     // addAddressMaps(updatedVisibleAddresses);
  //   }
  // });

  async function pathAddress(endLocation) {
    if (multiRoute) {
      myMap.geoObjects.remove(multiRoute);
    }
    if(endLocation) {
      multiRoute = await new ymaps.multiRouter.MultiRoute(
        {
          referencePoints: [location, endLocation],
        },
        {
          boundsAutoApply: true,
        }
        );
        
     return  myMap.geoObjects.add(multiRoute);
    }
     multiRoute = null
  }
}
