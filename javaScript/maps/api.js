import { config } from "../config.js";

// Функция для получения адресов по координатам
const {https} = config

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
      `${https}/address/${addressId}/${chatId}`
    );

    if (data.status === 200) {
      alert("Адрес отправлен в чат с ботом")
    }
  } catch (error) {
    console.log(error.message);
  }
}
