import { getMyLocation } from "./api.js";
import { dataProcessing } from "./index.js";

const mapSection = document.getElementById("mapSection");
const addressInput = document.getElementById("addressInput");
const mapButton = document.getElementById("mapButton")

let firstGeoObject

ymaps.ready(init);
function init() {
const location =   getMyLocation()
console.log(location);
    const myMap = new ymaps.Map("map", {
        center: [55.764094, 37.617617],
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

  function getAddressFromCoordinates(coords) {
    
    const geocoder = ymaps.geocode(coords)
    geocoder.then((res) => {
         firstGeoObject = res.geoObjects.get(0);
      addressInput.value = firstGeoObject.getAddressLine();
    });

    if(coords) {
        dataProcessing(firstGeoObject?._xalEntities, coords)
    }
  }
}



mapButton.addEventListener("click", () => {
    mapSection.classList.toggle("section_map_none")
})