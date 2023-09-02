import { getMyLocation } from "./api.js";
import { dataProcessing } from "./index.js";

const mapSection = document.getElementById("mapSection");
const addressInput = document.getElementById("addressInput");
const mapButton = document.getElementById("mapButton")

let firstGeoObject


async function init() {

    const location = await getMyLocation()
    await getAddressFromCoordinates(location)

    const myMap = new ymaps.Map("map", {
        center: location,
        zoom: 12, 
    });
    
  const placemark = new ymaps.Placemark(myMap.getCenter(), {
    balloonContent: "Выберите местоположение",
  });

  myMap.geoObjects.add(placemark);

  placemark.events.add("dragend", (event) => {
    getAddressFromCoordinates(placemark.geometry.getCoordinates());
  });

  myMap.events.add("click", (event) => {
    placemark.geometry.setCoordinates(event.get("coords"));

    getAddressFromCoordinates(placemark.geometry.getCoordinates());
    
  });

  async function getAddressFromCoordinates(coords) {
    
    const geocoder = await ymaps.geocode(coords)
   
      firstGeoObject = geocoder.geoObjects.get(0);
      addressInput.value = firstGeoObject.getAddressLine();

    if(coords) {
       dataProcessing(firstGeoObject?._xalEntities, coords)
    }
  }
}

mapButton.addEventListener("click", () => {
  console.log(!addressInput.value);
  if(!addressInput.value) {
    ymaps.ready(init);
  }
    mapSection.classList.toggle("section_map_none")
   
})