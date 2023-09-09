import { clearForm } from "./index.js";

const { token, botToken, chatId } = await getTokenAndId();

// Получение токенов и id с сервера.
async function getTokenAndId() {
  try {
    const res = await fetch("https://testjavascript.ru/admin/info");
    const data = await res.json();

    return data[0];
  } catch (error) {
    console.log(error.message);
  }
}

// Получаем адреcов по данным, введенных в input.
export async function getAddress(text) {
  try {
    const res = await fetch(
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({ query: text }),
      }
    );
    const address = await res.json();

    if (address) {
      return address;
    }
  } catch (error) {
    console.log(error);
  }
}

// Отправка сообщения c id в Telegram.
export async function sendMessageTelegram(data) {
  try {
    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
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
export async function addAddress(nameInput, photo, formData) {
  const name = nameInput.value;
  formData.delete("name");
  formData.delete("photo");
  formData.append("name", name);
  formData.append("photo", photo.files[0]);

  const region = formData.get("region");
  const place = formData.get("place");
  const city = formData.get("city");
  const prayer = formData.get("prayer");
  const address = formData.get("address");
  const location = formData.get("location");

  if (!name || !region || !city || !place || !prayer || !address || !location) {
    return;
  }

  try {
    const res = await fetch(`https://testjavascript.ru/data`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data) {
      clearForm();
      await sendMessageTelegram(data);
    }
  } catch (error) {
    const errorDiv = document.createElement("div");
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
        console.log(message);
        reject(message)
      }
    });
    return position;
  } catch (error) {
    console.log(error.message);
  }
}
