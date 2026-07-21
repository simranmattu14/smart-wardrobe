function toggleMenu() {
    const nav = document.getElementById("navbar");
    const intro = document.getElementsByClassName("intro")[0];
    nav.classList.toggle("show");
    if (nav.classList.contains("show")) {
        intro.style.marginTop = "250px";
    } else {
        intro.style.marginTop = "50px";
    }
}


let lastScrollTop = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        // Scrolling down
        header.classList.add("hide");
        header.classList.remove("show");
    } else {
        // Scrolling up
        header.classList.add("show");
        header.classList.remove("hide");        
    }

    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
});