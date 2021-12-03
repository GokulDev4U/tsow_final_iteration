// // Get the modal
// var modal = document.getElementById("otp");

// // Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close")[0];

// // When the user clicks on <span> (x), close the modal
// span.onclick = function () {
//   modal.style.display = "none";
// };

// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// };

const serverUrl =  "http://tsowprod-env-2.eba-a9n3sp7x.ap-south-1.elasticbeanstalk.com/";

async function startNetWorking() {
  const mobile = document.getElementById("mobileno");
  if (mobile && mobile.value && validateMobile(mobile.value)) {
    const callback = () => (window.location.href = "/otp.html");
    sendOtp(mobile.value, callback, "#mobileError");
  }
}

function loaderOn() {
  $(".pac-loader").css("display", "flex");
}
function loaderOff() {
  $(".pac-loader").css("display", "none");
}

async function sendOtp(mobile, callback, errorSelector) {
  try {
    loaderOn();
    const data = { mobileNumber: "+91" + mobile };
    const request = await fetch(`${serverUrl}/auth/signin`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    loaderOff();
    if (request.status === 201) {
      localStorage.setItem(
        "user",
        JSON.stringify({ mobile, isVerified: false })
      );
      callback && callback();
    } else {
      const response = await request.json();
      console.log(response);
      $(errorSelector).text(response.message || 'Something went wrong');
    }
  } catch (err) {
    errorMessage((err && err.message) ||"Something went wrong!!");
    console.log(err);
    loaderOff();
  }
}

function errorMessage(text) {
  if(window.Toastify){
    window.Toastify({
      text,
      duration: 3000,
      backgroundColor: "#ee1414",
      position: "center",
    }).showToast();
  }
}

function validateMobile(inputtxt) {
  var phoneno = /^\d{10}$/;
  if (inputtxt.match(phoneno)) {
    $("#mobileError").text("");
    return true;
  } else {
    $("#mobileError").text("Enter valid mobile number");
    return false;
  }
}

// {
//   title: "bank",
//   profession: ["prof1", "prof2", "prof3"],
// },
// {
//   title: "bank2",
//   profession: ["prof1", "prof2", "prof3"],
// },
