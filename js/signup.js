$(document).ready(() => {
  let isAvailable = false;
  let industries = [];
  let cursors = {};
  let inputProfession = "";
  let selectedIndustry;
  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
        args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
  $(".user_name_input").on(
    "input",
    debounce(function () {
      let $this = $(this);
      let inputUsername = $this.val();
      if (!validateUserName(inputUsername)) {
        return;
      } else {
        $("#input-loading").css("display", "block");
        $("#input-close").css("display", "none");
        $("#input-check").css("display", "none");
        checkUsername(inputUsername);
      }
    }, 400)
  );

  $("#industryProfession").on(
    "input",
    debounce(async function () {
      let $this = $(this);
      let input = $this.val();
      inputProfession = input;
      const data = await getProfessions(input);
      $(".autocompleteBox").html("");
      const dataTorender = professionHtmlData(data);
      $(".autocompleteBox").html(dataTorender);
    }, 400)
  );
  async function checkUsername(username) {
    try {
      const request = await fetch(
        `${serverUrl}/auth/check-username/${username}`
      );
      const response = await request.json();
      if (request.status === 200) {
        isAvailable = response.isAvailable;
      }
    } catch (err) {
      isAvailable = false;
      console.log(err);
    }
    $("#input-loading").css("display", "none");
    if (!isAvailable) {
      $("#notavailable").text("Username not available");
      $("#input-close").css("display", "flex");
      $("#input-check").css("display", "none");
    } else {
      $("#notavailable").text("");
      $("#input-close").css("display", "none");
      $("#input-check").css("display", "flex");
    }
  }

  function professionHtmlData(data) {
    let dataTorender = "";
    data.map((industry) => {
      let professionData = "";
      industry.professions.forEach((item) => {
        professionData += `<div data-name="${item}" data-industryId="${industry._id}" data-industryName="${industry.name}" class="profession">${item}</div>`;
      });
      dataTorender += `<div class="industry-cat">
      <div class="industry">${industry.name}</div>
      ${professionData}
    </div>`;
    });
    return dataTorender;
  }

  $(document).on("click", ".profession", function (e) {
    selectedIndustry = $(this).data();
    $("#industryProfession").val(selectedIndustry.name);
    $(".autocompleteBox").css("display", "none");
    $(`.profession-error`).text("");
    console.log("dddd", selectedIndustry);
  });

  $(document).on("click", function (event) {
    if (!$(event.target).closest(".autoCompletemain").length) {
      $(".autocompleteBox").css("display", "none");
    }
  });

  function validateUserName(username) {
    $("#input-check").css("display", "none");
    $("#input-loading").css("display", "none");
    if (
      !/(?!^[a-zA-Z._]*$)^(?=[a-zA-Z0-9._]{5,25}$)(?!.*[_.]{2})[^_.0-9].*[^_.]$/.test(
        username
      )
    ) {
      $("#input-close").css("display", "flex");
      return false;
    }
    $("#input-close").css("display", "none");
    return true;
  }

  function nameValidation(name) {
    return /^[a-zA-Z\. ]*$/.test(name);
  }

  $(".name").on("input", (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log({ name, value }, nameValidation(value));
    if (value.trim()) {
      if (nameValidation(value)) {
        $(`.${name}-error`).text("");
      } else {
        $(`.${name}-error`).text(
          "numbers (123) & special characters (*$%&) are not allowed"
        );
      }
    } else {
      $(`.${name}-error`).text("Required field");
    }
  });

  async function getProfessions(profession, after) {
    try {
      $(".searchBoxLoad").css("display", "block");
      let url = `${serverUrl}/companies/profession?name=${profession}`;
      if (after) {
        url += `&after=${after}`;
      }
      const request = await fetch(url);
      const response = await request.json();
      $(".searchBoxLoad").css("display", "none");
      if (request.status === 200) {
        cursors = response.metadata.cursors;
        industries = [];
        return response.results;
      }
    } catch (err) {
      cursors = {};
      industries = [];
      return [];
    }
  }
  let isLoading = false;
  $(".autocompleteBox").on("scroll", async function () {
    if (
      !isLoading &&
      cursors.after &&
      $(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight
    ) {
      isLoading = true;
      const data = await getProfessions(inputProfession, cursors.after);
      isLoading = false;
      const dataToRender = professionHtmlData(data);
      $(".autocompleteBox").append(dataToRender);
    }
  });
  $("#industryProfession").focus(() => {
    $(".autocompleteBox").css("display", "block");
  });

  $(".letsGo").click(function () {
    const firstName = $(".first_name_input").val();
    const lastName = $(".last_name_input").val();
    const profession = selectedIndustry;
    const username = $(".username-input").val();
    let isValid = true;
    if (!firstName.trim()) {
      $(`.first-error`).text("Required field");
      isValid = false;
    }
    if (!lastName.trim()) {
      $(`.last-error`).text("Required field");
      isValid = false;
    }
    if (!profession) {
      $(`.profession-error`).text("Required field");
      isValid = false;
    }

    if (!username.trim()) {
      $("#notavailable").text("Username not available");
      isValid = false;
    }
    let modifiedProfessionData = {
      name: profession.name,
      industryName: profession.industryname,
      industryId: profession.industryid,
    };
    if (isValid && isAvailable) {
      createUser({
        firstName,
        lastName,
        username,
        profession: modifiedProfessionData,
      });
    }
  });

  async function createUser(userData) {
    try {
      loaderOn();
      const request = await fetch(`${serverUrl}/auth/signup/mobile`, {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const response = await request.json();
      loaderOff();
      if (request.status === 201) {
        window.location.href = "/Member.html";
        console.log(response, "sss");
      } else {
        errorMessage(response.message || 'Something went wrong');
      }
    } catch (err) {
      errorMessage("Something went wrong");
    }
  }

});
