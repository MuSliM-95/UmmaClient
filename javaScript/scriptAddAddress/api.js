import { clearForm } from "./index.js";

// Функция для отправки формы.
export async function addAddress(nameInput, photo, formData, timeInput) {
  const name = nameInput.value;
  const [input1, input2] = timeInput
  console.log(input1.value);
  formData.delete("name");
  formData.delete("photo");
  formData.delete("time")
  formData.append("name", name);
  formData.append("photo", photo.files[0]);
  formData.append("time", `${input1.value} до ${input2.value}`)

  const region = formData.get("region");
  const place = formData.get("place");
  const city = formData.get("city");
  const prayer = formData.get("prayer");
  const address = formData.get("address");
  const location = formData.get("location");
  const time = formData.get("time")

  if (!name || !region || !city || !place || !prayer || !address || !location || !time) {
    return;
  }
  try {
    const res = await fetch(`https://umma-maps.store/data`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
    if (data) {
      clearForm();
    }
  } catch (error) {
    console.error("Ошибка при отправке HTML-файла:", error);
  }
}

export async function getMyLocation() {
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
      });
      function success({ coords }) {
        resolve([coords.latitude, coords.longitude])
      }
      function error({ message }) {
        reject(message)
      }
    });
    return position;
  } catch (error) {
    console.log(error.message);
  }
}
