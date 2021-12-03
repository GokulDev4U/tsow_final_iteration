$(document).ready(() => {
  const userData =
    localStorage.getItem("user") && JSON.parse(localStorage.getItem("user"));
  if (userData) {
    localStorage.clear();
    startTimer();
  } else {
    window.location.href = "/";
  }
  localStorage.clear();
  if (window.history && window.history.pushState) {
    $(window).on("popstate", function () {
      var hashLocation = location.hash;
      var hashSplit = hashLocation.split("#!/");
      var hashName = hashSplit[1];

      if (hashName !== "") {
        var hash = window.location.hash;
        if (hash === "") {
          alert("Back button was pressed.");
          window.location.href = "/";
          return false;
        }
      }
    });
  }
  function startTimer() {
    let time = 10;
    interval = setInterval(() => {
      $(".seconds-num").text(`${time}`);
      time--;
      if (time < 0) {
        $(".seconds-num").text("");
        clearInterval(interval);
        window.location.href = "/";
      }
    }, 1000);
  }
});
