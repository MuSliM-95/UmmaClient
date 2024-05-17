const input = document.querySelector("#toggle-animation")
const label = document.querySelector(".checkbox__label")


export function theme(figure) {
    let theme = localStorage.getItem("theme")
    document.body.className = theme;
    figure.classList.add(theme && "shadow-white")
    label.classList.add(theme)
    input.checked = theme
    label.innerHTML = theme ? "Белая тема" : "Темная тема"

    function classToggle() {
        if (!theme) {
            localStorage.setItem("theme", "dark-theme")
            figure.classList.add("shadow-white")
            theme = localStorage.getItem("theme")
            document.body.className = theme;
            label.innerHTML = "Белая тема"
            
        } else {
            figure.classList.remove("shadow-white") 
            theme = localStorage.removeItem("theme")
            label.classList.remove(theme)
            document.body.className = theme
            label.innerHTML = "Темная тема"
        }

    }

    document.querySelector('#toggle-animation').addEventListener('click', classToggle);
}