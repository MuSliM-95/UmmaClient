import { clearForm } from "./index.js";

export const https =  "https://umma-maps.store"
// "https://umma-maps.store" ||

// Функция для отправки формы.
export async function addAddress(nameInput, photo, formData, timeInput) {
  const name = nameInput.value;
  const [input1, input2] = timeInput;

  // const photo = compressionsImage(files);

 

  console.log(photo);

  formData.delete("name");
  formData.delete("photo");
  formData.delete("time");
  formData.append("name", name);
  formData.append("photo", photo);
  formData.append("time", `${input1.value} до ${input2.value}`);

  const region = formData.get("region");
  const place = formData.get("place");
  const city = formData.get("city");
  const prayer = formData.get("prayer");
  const address = formData.get("address");
  const location = formData.get("location");
  const time = formData.get("time");

  if (
    !name ||
    !region ||
    !city ||
    !place ||
    !prayer ||
    !address ||
    !location ||
    !time
  ) {
    return;
  }
  try {
    const res = await fetch(`${https}/data`, {
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
        resolve([coords.latitude, coords.longitude]);
      }
      function error({ message }) {
        reject(message);
      }
    });
    return position;
  } catch (error) {
    console.log(error.message);
  }
}

function compressionsImage(event) {
  const file = event.target?.files[0];
  let outputCanvas
  let ctx

    if (file) {
      const reader = new FileReader();

      reader.onload = function (e) {
          const img = new Image();
          img.onload = function () {

              const maxWidth = 800;
              const maxHeight = 800;
              let newWidth = img.width;
              let newHeight = img.height;

              if (img.width > maxWidth) {
                  newWidth = maxWidth;
                  newHeight = (img.height * maxWidth) / img.width;
              }

              if (img.height > maxHeight) {
                  newHeight = maxHeight;
                  newWidth = (img.width * maxHeight) / img.height;
              }

              outputCanvas.width = newWidth;
              outputCanvas.height = newHeight;

              ctx.drawImage(img, 0, 0, newWidth, newHeight);

              const compressedDataURL = outputCanvas.toDataURL('image/jpeg', 0.8);

              return compressedDataURL
          };

          img.src = e.target.result;
      };

      reader.readAsDataURL(file);
  }
  
}
