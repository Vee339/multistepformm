let currentStep = 0;
let x = document.getElementsByTagName("fieldset");

const streetInputBox = document.querySelector(".inputBox#address");

//Selecting inputs for address
const streetAddress = document.getElementById("streetAddress");
const city = document.getElementById("city");
const country = document.getElementById("country");
const state = document.getElementById("province");
const postalCode = document.getElementById("postalCode");

function reqdSym() {
  let required = x[currentStep].querySelectorAll("label.required");
  required.forEach(function (i) {
    if (i.querySelector("span.reqSymbol") === null) {
      var sup = document.createElement("span");
      sup.innerHTML = " *";
      sup.classList.add("reqSymbol");
      i.insertAdjacentElement("beforeend", sup);
    }
  });
}

reqdSym();

let inputts = document.getElementsByTagName("input");

for (let input of inputts) {
  input.addEventListener("focus", function () {
    for (let input of inputts) {
      const parentNod = input.parentNode;
      if (parentNod.querySelector("p.requiredField") !== null) {
        parentNod.querySelector("p.requiredField").remove();
      }
    }
  });
}

function validate() {
  const inputs = x[currentStep].querySelectorAll("input[required]");
  for (let input of inputs) {
    if (input.value === "") {
      const parNod = input.parentNode;
      if (parNod.querySelector("p.requiredField") === null) {
        const reqFieldWar = document.createElement("p");
        reqFieldWar.textContent = "This is a required Field";
        reqFieldWar.classList.add("requiredField");
        parNod.insertAdjacentElement("beforeend", reqFieldWar);
      }
      return false;
    }
  }
  return true;
}

function next(e) {
  e.preventDefault();

  if (validate()) {
    x[currentStep].classList.remove("show", "current");
    x[currentStep].classList.add("hide");
    currentStep = currentStep + 1;
    x[currentStep].classList.remove("hide");
    x[currentStep].classList.add("show", "current");
    reqdSym();
  }
}

function prev(e) {
  e.preventDefault();
  x[currentStep].classList.remove("show", "current");
  x[currentStep].classList.add("hide");
  currentStep = currentStep - 1;
  x[currentStep].classList.remove("hide");
  x[currentStep].classList.add("show", "current");
}

const date_input = document.getElementById("dateOfBirth");
const age_input = document.getElementById("age");
const today = new Date();

const formatted_today = today.toISOString().split("T")[0];

date_input.max = formatted_today;

let dateOfBirth, birthYear, birthMonth, birthDate, age;

date_input.addEventListener("change", function () {
  dateOfBirth = date_input.value;
  [birthYear, birthMonth, birthDate] = dateOfBirth.split("-");

  const formattedDateOfBirth = new Date();
  formattedDateOfBirth.setFullYear(birthYear);
  formattedDateOfBirth.setMonth(birthMonth - 1);
  formattedDateOfBirth.setDate(birthDate);

  age = Math.floor(
    (today - formattedDateOfBirth) / (1000 * 60 * 60 * 24 * 365)
  );
  age_input.value = age;
});

const addEdu = document.querySelector("button.edu");
const addCertifi = document.querySelector("button.certifi");

const docInput = document.querySelector("input#govtID");
// console.log(docInput);
docInput.addEventListener("change", (e) => {});

let currentTimeout;

function addressAutocomplete() {
  const MIN_ADDRESS_LENGTH = 4;
  const DEBOUNCE_DELAY = 300;
  const apiKey = "33657ebeec714b8d9e2f06c7a6a3c724";

  let autocompleteItemList = streetInputBox.querySelector(
    ".addressSuggestions"
  );
  if (autocompleteItemList) {
    streetInputBox.removeChild(autocompleteItemList);
  }

  const currentValue = this.value;
  if (!currentValue || currentValue.length < MIN_ADDRESS_LENGTH) {
    return;
  }

  clearTimeout(currentTimeout);

  currentTimeout = setTimeout(() => {
    //Making the API request
    const request = fetch(
      `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
        currentValue
      )}&format=json&limit=5&apiKey=${apiKey}`
    );

    //Handling the Promise
    request
      .then((response) => {
        // if (response.status !== "OK") {
        //   throw new Error(`HTPP error: ${response.status}`);
        // }
        return response.json();
      })
      .then((data) => {
        // console.log(data);
        let list = document.createElement("div");
        const results = data.results;
        console.log(results);
        let selectedElement;

        for (const result of results) {
          const address_line1 = result.address_line1;
          const address_line2 = result.address_line2;
          const span = document.createElement("span");
          span.textContent = ` ${address_line2}`;
          const listElement = document.createElement("p");
          listElement.textContent = address_line1;
          listElement.appendChild(span);
          list.appendChild(listElement);
        }
        list.classList.add("addressSuggestions");
        streetInputBox.insertAdjacentElement("beforeend", list);
        list.addEventListener("click", (e) => {
          e.stopPropagation();
          // console.log(e.target.tagName);
          if (e.target.tagName === "SPAN") {
            // console.log(e.target.parentNode.childNodes[0].textContent);
            selectedElement = results.filter(function (result) {
              return (
                result.address_line1 ===
                e.target.parentNode.childNodes[0].textContent.trim()
              );
            })[0];
          } else if (e.target.tagName === "P") {
            // console.log(e.target.childNodes[0].textContent);
            selectedElement = results.filter(function (result) {
              return (
                result.address_line1 ===
                e.target.childNodes[0].textContent.trim()
              );
            })[0];
          }

          console.log(selectedElement);
          streetAddress.value = selectedElement.address_line1;
          city.value = selectedElement.city;
          country.value = selectedElement.country;
          postalCode.value = selectedElement.postcode;
          state.value = selectedElement.state;

          streetInputBox.removeChild(list);
        });
        // console.log(list);
      })
      .catch((error) => {
        console.log(`An error is found while fetching the data: ${error}`);
      });
    // console.log(`There is some input: ${currentValue}`);
  }, DEBOUNCE_DELAY);
}

streetAddress.addEventListener("input", addressAutocomplete);
