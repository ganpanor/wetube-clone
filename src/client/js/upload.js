const uploadForm = document.querySelector(".upload__form");
const uploadInput = document.querySelectorAll(".upload__input");
const uploadBtn = document.querySelector("#upload__btn");

const handleFileName = (event) => {
  const fakeFile = event.target.parentNode.querySelector(".upload__name");
  const fileValue = event.target.value;
  fakeFile.value = fileValue;
};

const handleSubmit = (event) => {
  const main = document.querySelector("main");
  const inputs = main.querySelectorAll("input");
  for (i = 0; i < inputs.length; i++) {
    if (inputs[i].value === "") {
      inputs[i].focus();
    }
  }
  uploadForm.submit();
};

let originalFile;

for (i = 0; i < uploadInput.length; i++) {
  originalFile = uploadInput[i].querySelector(".upload__origin");
  originalFile.addEventListener("change", handleFileName);
}

uploadBtn.addEventListener("click", handleSubmit);
