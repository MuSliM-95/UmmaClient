import { getAddresses } from "./api.js";

ymaps.ready(init);

async function init() {
  const getLocationData = await ymaps.geolocation.get();
  const location = await getLocationData.geoObjects.position;
  const addresses = await getAddresses()
  let multiRoute

  const myMap = await new ymaps.Map("map", {
    center: location,
    zoom: 12,
  });

 await addresses?.forEach((el) => {
    const myPlacemark =  new ymaps.Placemark(el.location, {
      balloonContent: `
      <div class="balloon_content" >
      <img class="balloon_image" src="http://localhost:5000/${el.photo?.image || "scale_1200.webp"}" "style="max-width: 20px; max-height: 20px;"/>
      <div class="balloon_address_info">
      <strong>${el.title}</strong>
      <em>${el.place}</em>
      <em><strong>Место молитвы: </strong>${el.prayer}</em>
      <em>${el.address}</em>
      <a href="https://yandex.ru/maps/?rtext=${location}~${el.location}&rtt=auto">Проложить путь</a>
      </div>
      </div>
      `,
  }, {
    iconLayout: 'default#image',
    iconImageHref: settingicon(),
    iconImageSize: [30, 30],
  })
  myPlacemark.events.add("click", () => {
    pathAddress(el.location)
  })
   myMap.geoObjects.add(myPlacemark);

   function settingicon() {
    if(el.place === "Мечеть, молельня...") return "../../image/free-icon-mosque-7720545.png"
    if(el.place === "Кафе, столовая, ресторан") return "../../image/restaurant_location_icon_146860.png"
    if(el.place === "Здоровье, аптека, стоматология") return "../../image/4dlnngicuab8_64.png"
    if(el.place === "Автозапчасти, сервис...") return "../../image/4886967921672192.jpg"
    if(el.place === "Продуктовый Магазин") return "../../image/supermarket-512-e1443509745315.png"
  }

  })
  
  async function pathAddress(endLocation) {
    if(multiRoute) {
      myMap.geoObjects.remove(multiRoute);
    }
  
   multiRoute = await new ymaps.multiRouter.MultiRoute({
      referencePoints:[
        location,
        endLocation
      ]
    },{
      boundsAutoApply: true
    })
   
    myMap.geoObjects.add(multiRoute);
  }

}