// Accordian
const ItemHeaders = document.querySelectorAll(".header-accor");

ItemHeaders.forEach((ItemHeader) => {
  ItemHeader.addEventListener("click", (event) => {
    ItemHeader.classList.toggle("active");

    const ItemBody = ItemHeader.nextElementSibling;

    if (ItemHeader.classList.contains("active")) {
      ItemBody.style.maxHeight = ItemBody.scrollHeight + "px";
    } else {
      ItemBody.style.maxHeight = 0;
    }
  });
});

// Fullimage
const thumbnails = document.querySelectorAll(".thumbnail");
const modal = document.querySelector(".modal");
const fullImage = document.getElementById("fullImage");
const closeBtn = document.querySelector(".close");

thumbnails.forEach((thumbnail) => {
  thumbnail.addEventListener("click", () => {
    modal.style.display = "block";
    fullImage.src = thumbnail.src;
  });
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
