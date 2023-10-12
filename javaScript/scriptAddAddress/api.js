import { clearForm } from "./index.js";

const { token, chatId } = await getTokenAndId();

// Получение токенов и id с сервера.
async function getTokenAndId() {
  try {
    const res = await fetch("http://localhost:5000/admin/info");
    const data = await res.json();

    return data[0];
  } catch (error) {
    console.log(error.message);
  }
}

// Отправка сообщения c id в Telegram.
export async function sendMessageTelegram(data) {
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: `id: ${data?._id}`,
        parse_mode: "HTML",
      }),
    });
  } catch (error) {
    console.log(error);
  }
}

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
