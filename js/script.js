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

const serverUrl = "https://tsow-server.herokuapp.com";

async function startNetWorking() {
  const mobile = document.getElementById("mobileno");
  if (mobile && mobile.value && validateMobile(mobile.value)) {
    try {
      const data = { mobileNumber: mobile.value };
      const request = await fetch(`${serverUrl}/auth/signin/mobile`, {
        method: "POST",
        body: JSON.stringify(data),
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
      });
      const response = await request.json();
      console.log({ response });
    } catch (err) {
      console.log(err, "err");
    }
  }
}

function validateMobile(inputtxt) {
  var phoneno = /^\d{10}$/;
  if (inputtxt.match(phoneno)) {
    document.getElementById("mobileError").style.display = "none";
    return true;
  } else {
    document.getElementById("mobileError").style.display = "block";
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
