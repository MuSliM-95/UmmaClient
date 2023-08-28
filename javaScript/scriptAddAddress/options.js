// function для обработки и добавление полученных адресов всплывающий блок с подсказками
export function showAddressesDropdown(addresses, select) {
  clearDropdown(select);

  addresses.suggestions.forEach((address) => {
    const option = document.createElement("div");
    option.innerHTML = address.value;
    select.prepend(option);
    select.style.display = "block";
  });

  if (select.children) {
    for (const option of select.children) {
      option.addEventListener("click", () => {
        addressInput.value = option.innerHTML;
        select.style.display = "none";
      });
    }
  }
}

// function для очистки всплывающий блок с подсказками
function clearDropdown(select) {
  while (select.lastChild) {
    select.removeChild(select.lastChild);
    select.style.display = "none";
  }
}
