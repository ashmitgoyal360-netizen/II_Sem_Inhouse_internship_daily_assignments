const form = document.getElementById("registrationForm");

form.addEventListener("submit", function (e) {

    e.preventDefault();

    let fullName = document.getElementById("fullName").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let dob = document.getElementById("dob").value;
    let address = document.getElementById("address").value.trim();
    let address2 = document.getElementById("address2").value.trim();
    let country = document.getElementById("country").value;
    let city = document.getElementById("city").value.trim();
    let region = document.getElementById("region").value.trim();
    let postal = document.getElementById("postal").value.trim();

    let gender = document.querySelector('input[name="gender"]:checked');

    if (fullName === "") {
        alert("Please enter your Full Name");
        return;
    }

    let emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;

    if (!email.match(emailPattern)) {
        alert("Please enter a valid Email");
        return;
    }

    let phonePattern = /^[0-9]{10}$/;

    if (!phone.match(phonePattern)) {
        alert("Phone number should contain exactly 10 digits");
        return;
    }

    if (dob === "") {
        alert("Please select your Birth Date");
        return;
    }

    if (!gender) {
        alert("Please select Gender");
        return;
    }

    if (address === "") {
        alert("Please enter Address");
        return;
    }

    if (country === "") {
        alert("Please select Country");
        return;
    }

    if (city === "") {
        alert("Please enter City");
        return;
    }

    if (region === "") {
        alert("Please enter Region");
        return;
    }

    if (postal === "") {
        alert("Please enter Postal Code");
        return;
    }

    alert("🎉 Registration Successful!");

    console.log("------ Student Details ------");
    console.log("Name:", fullName);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("DOB:", dob);
    console.log("Gender:", gender.value);
    console.log("Address:", address);
    console.log("Address2:", address2);
    console.log("Country:", country);
    console.log("City:", city);
    console.log("Region:", region);
    console.log("Postal:", postal);

    form.reset();

});