$(document).ready(() => {
  let interval;
  const userData =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  if (userData) {
    $("#selectedMobile").text(` +91 ${userData.mobile}`);
    startTimer()
  } else {
    window.location.href = "/";
  }
  $(".otp_input").keypress(function (e) {
    var arr = [];
    var kk = e.which;

    for (i = 48; i < 58; i++) arr.push(i);

    if (!(arr.indexOf(kk) >= 0)) e.preventDefault();
  });
  async function verifyOtp() {
    loaderOn()
    const otp = $(".otp_input").val();
    if (otp && otp.length === 4) {
      try {
        const data = { otp };
        const request = await fetch(`${serverUrl}/auth/verify`, {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        const response = await request.json();
        loaderOff()
        console.log(response);
        if (response.status !== "failed") {
            interval && clearInterval(interval)
            window.location.href = "/signup.html";
        } else {
          $(".error_message").text(response.message);
        }
      } catch (err) {
        console.log(err);
        $(".error_message").text("Something went wrong!!");
      }
    } else {
      $(".error_message").text("Invalid OTP");
    }
  }
  $("#mobileButton").click(() => {
    verifyOtp();
  });
  $(".resend_otp").click(() => {
      startTimer()
      sendOtp(userData.mobile)
  })

  function startTimer(){
    let time = 10;
    $(".resend_otp").attr("disabled", true)
    interval = setInterval(() => {
        $(".seconds").text(`0:${time}`);
        time--;
        if(time < 0 ){
            $(".seconds").text("");
            clearInterval(interval)
            $(".resend_otp").attr("disabled", false)
        }
    },1000)
  };
});
