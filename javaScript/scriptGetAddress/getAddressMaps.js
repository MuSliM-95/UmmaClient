import { getAddresses } from "./api.js";

ymaps.ready(init);

async function init() {
  const getLocationData = await ymaps.geolocation.get();
  const location = getLocationData.geoObjects.position;
  let multiRoute;
  
  const myMap =  new ymaps.Map("map", {
    center: location,
    zoom: 12,
  });

  const addresses = await getAddresses(myMap);

    addAddressMaps(addresses);

   function addAddressMaps(addAddress) {
     addAddress?.forEach((el) => {
      const myPlacemark =  new ymaps.Placemark(
        el.location,
        {
          balloonContent: `
      <div class="balloon_content" >
      <img class="balloon_image" src="http://localhost:5000/${
        el.photo?.image || "scale_1200.webp"
      }" "style="max-width: 20px; max-height: 20px;"/>
      <div class="balloon_address_info">
      <strong>${el.title}</strong>
      <em>${el.place}</em>
      <em><strong>Место молитвы: </strong>${el.prayer}</em>
      <em><strong>Время работы: </strong>${el.time}</em>
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
      
        }
      );

      myPlacemark.events.add("click", () => {
        pathAddress(el.location);
      });
      myMap.geoObjects.add(myPlacemark);

      myPlacemark.events.add('balloonclose', () => {
          pathAddress()
      });

      function settingicon() {
        if (el.place === "Мечеть, молельня...")
          return "/images/free-icon-mosque-7720545.png";
        if (el.place === "Кафе, столовая, ресторан")
          return "/images/restaurant_location_icon_146860.png";
        if (el.place === "Здоровье, аптека, стоматология")
          return "/images/4dlnngicuab8_64.png";
        if (el.place === "Автозапчасти, сервис...")
          return "/images/4886967921672192.jpg";
        if (el.place === "Продуктовый Магазин" || el.place === "Исламский магазин")
          return "/images/supermarket-512-e1443509745315.png";
        if(el.place === "Мусульманский отель, хостел") 
          return "/images/kP-1K4qVqT4.jpg"
        }
    });
  }

  myMap.events.add("boundschange", async function () {
    const updatedVisibleAddresses = await  getAddresses(
      myMap
    );

    if (!multiRoute) {
      myMap.geoObjects.removeAll();
      addAddressMaps(updatedVisibleAddresses);
    }
  
  });

 
  async function pathAddress(endLocation) {
    if (multiRoute) {
      myMap.geoObjects.remove(multiRoute);
    }
    if(endLocation) {
      multiRoute =  new ymaps.multiRouter.MultiRoute(
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
