document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("project-2 JS imported successfully!");
  },
  false
);

document.getElementById('deleteBtn').addEventListener("click", function() {
  // document.getElementById('popupDelete').removeAttribute('display')
  document.querySelector('.popupDelete').style.setProperty('display','block')
});

document.getElementById('nobtn').addEventListener("click", function() {
  // document.getElementById('popupDelete').removeAttribute('display')
  // console.log(document.getElementById('popupDelete'))
  document.querySelector('.popupDelete').style.setProperty('display','none')
});

