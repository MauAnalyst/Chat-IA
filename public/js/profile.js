const profile = document.querySelector(".container-profile #user-profile ");
const iconProfile = document.querySelector(
  ".container-profile #user-profile span"
);
const profileInfos = document.querySelector(".container-profile #user-infos");

let click = 0;

profile.addEventListener("click", () => {
  if (click === 0) {
    profileInfos.style.display = "block";
    profileInfos.style.opacity = "1";
    iconProfile.style.transform = "rotate(-180deg)";
    click = 1;
  } else {
    profileInfos.style.display = "none";
    profileInfos.style.opacity = "0";
    iconProfile.style.transform = "rotate(0deg)";
    click = 0;
  }
});

document.addEventListener("click", (event) => {
  if (
    !profileInfos.contains(event.target) &&
    !document.querySelector(".container-profile").contains(event.target)
  ) {
    profileInfos.style.display = "none";
    profileInfos.style.opacity = "0";
    iconProfile.style.transform = "rotate(0deg)";
    click = 0;
  }
});
