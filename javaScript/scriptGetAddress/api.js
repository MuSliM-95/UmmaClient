import { https } from "../https.js";

// Функция для получения адресов по координатам

export async function getAddresses(map) {
  const bounds = await map.getBounds();
  const location = {
    topLeft: bounds[0],
    bottomRight: bounds[1],
  };
  const jsonLocation = JSON.stringify(location);

  try {
    const res = await fetch(`${https}/addresses/${jsonLocation}`);
    const data = await res.json();
    if (data) {
      return data;
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Отправка данных адреса в чат-бот через сервер. 
export async function getAddressTelegramChatBot(chatId, addressId) {
  try {
    const data = await fetch(
      `${https}/getAddress/botChat/${chatId}/${addressId}`
    );
    console.log(data);

    if (data.status === 200) {
      alert("Адрес отправлен в чат с ботом")
    }
  } catch (error) {
    console.log(error.message);
  }
}
