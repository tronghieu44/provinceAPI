
loadProvinceAPI();

const originURL = window.location.origin + "/provinceAPI"
document.getElementById('back-to-login').href = originURL

function loadProvinceAPI () {
    url = 'https://provinces.open-api.vn/api/?depth=3';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // ======== List City ============
            for (let i = 0; i < data.length; i++) {
                // console.log(data);
                optionCity = document.createElement("option");
                optionCity.innerHTML = data[i].name;
                optionCity.value = data[i].codename;
                document.getElementById("city").appendChild(optionCity);
            }
            // ============ List distrisct according to chosen city ============
            const selectCity = document.getElementById("city");
            selectCity.addEventListener('change', (event) => {

                // Reset list district on city change
                let tmp_district = [];
                let prev_districts = document.getElementById("district").childNodes;
                for (let i = (prev_districts.length - 1); i >= 0; i--) {
                    let district = prev_districts[i];
                    district.parentNode.removeChild(district);
                }

                // Create district element  
                for (let i = 0; i < data.length; i++) {
                    if (data[i].codename == event.target.value) {
                        listDistrict = data[i].districts;
                        for (let j = 0; j < listDistrict.length; j++) {
                            tmp_district.push(listDistrict[j])
                            optionDistrict = document.createElement("option");
                            optionDistrict.innerHTML = tmp_district[j].name;
                            optionDistrict.setAttribute("class", "district");
                            optionDistrict.value = tmp_district[j].codename;
                            document.getElementById("district").appendChild(optionDistrict);
                        }
                    }
                }
            });
        })
        .catch((error) => {
            console.log('Error: ', error);
        });
};

// ===========  Register action =============
form = document.getElementById('register-form');
let inputUsername = form.elements['username'];
let inputPassword = form.elements['password'];
let inputCity = form.elements['city'];
let inputDistrict = form.elements['district'];
let registerAccount = {};
let error = [];

if (localStorage.getItem("listUsers") !== null) {
    listUsers = JSON.parse(localStorage.listUsers);
} else {
    listUsers = [];
}
form.addEventListener('submit', (event) => {
    registerAccount = {};
    event.preventDefault();
    // Validate username
    validateInput(inputUsername, inputPassword, inputCity, inputDistrict);
    // Add validated user to storage
    if (validatedRegister(registerAccount.username, registerAccount.password, registerAccount.city)) {
        registerAccount.password = CryptoJS.MD5(registerAccount.password).toString();
        listUsers.push(registerAccount);
        localStorage.setItem("listUsers", JSON.stringify(listUsers));
        window.location.replace(originURL + "#register-success");
    };

});
function validateInput (username, password, city, district) {
    if (!username.value) {
        setError(username, "Username can not be empty!");
    } else if (!isValid(username.value, "username")) {
        setError(username, "Not valid username![6 - 20 characters]");
    } else if (isExist(username.value)) {
        setError(username, "Username already existed!");
    } else {
        registerAccount.username = username.value;
        setSuccess(username);
    }
    // Validate password
    if (!password.value) {
        setError(password, "Password can not be empty!");
    } else if (!isValid(password.value, "password")) {
        setError(password, "Password must contain at least 8 characters and one uppercase character!");
    } else {
        registerAccount.password = password.value;
        setSuccess(password);
    }
    // Validate input city
    if (city.value < 1) {
        setError(city, "Please choose your city!")
    } else {
        registerAccount.city = city.value;
        setSuccess(city);
        registerAccount.district = district.value;
    }
}
function isExist (username) {
    for (let i = 0; i < listUsers.length; i++) {
        if (listUsers[i].username == username) {
            return true;
        } else {
            return false;
        }
    }
}
function setError (input, message) {
    const parent = input.parentElement;
    parent.className = "error-form mb-3";
    const span = parent.querySelector('span');
    span.innerText = message;
}
function setSuccess (input) {
    const parent = input.parentElement;
    parent.className = "success mb-4";
    const span = parent.querySelector('span');
    if (!span.innerText == "") {
        span.innerText = "";
    }
}
function isValid (input, type) {
    let regex = "";
    if (type == "username") {
        regex = /^[a-zA-Z0-9]{6,20}$/;
    } else if (type == "password") {
        regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.{8,})");
    }
    return regex.test(input);
    // https://www.javascripttutorial.net/javascript-dom/javascript-form-validation/
}
function validatedRegister (username, password, city) {
    return (username) && isValid(username, "username") && (password) && isValid(password, "password") && (city != undefined);
}