$(document).ready(function() {

  fetch('/api/all').then(function(response) {
  return response.json();
  }).then(function(res) { 
    const arr = Object.keys(res)
    console.log(arr[9]);

    $("#latest").append(`
    <small>
      Latest 3 schools that organized their schedule </br>
      <a style="text-decoration: none;" href="/calendar?school=${arr[arr.length - 1]}">${arr[arr.length - 1]} | </a>
      <a style="text-decoration: none;" href="/calendar?school=${arr[arr.length - 2]}">${arr[arr.length - 2]} | </a>
      <a style="text-decoration: none;" href="/calendar?school=${arr[arr.length - 3]}">${arr[arr.length - 3]} | </a>
    </small>
    `);
  }); 

  $("#saveData").attr("disabled", true);
  var counter = 0;

  $("#addrow").on("click", function() {
    var cols = `
        <tr class="mt-2">
            <td>
                <input type="text" class="form-control form-unique-identifier" name="name${counter}"/>
            </td>

            <td>
                <input type="text" class="form-control form-unique-identifier" name="last${counter}"/>
            </td>

            <td>

            <div class="form-group">
            <select class="form-control form-unique-identifier" name="date${counter}">
              <option>Monday</option>
              <option>Tuesday</option>
              <option>Wednesday</option>
              <option>Thursday</option>
              <option>Friday</option>
            </select>
          </div>
            </td>

            <td>
                <input type="button" class="ibtnDel btn btn-md btn-danger" value="Delete">
            </td>
        </tr>
        `;

    $("#data").append(cols);
    counter++;
    counter !== 0 ? $("#saveData").attr("disabled", false) : "";
  });

  $("#data").on("click", ".ibtnDel", function(event) {
    $(this)
      .closest("tr")
      .remove();
    counter -= 1;
    if (counter === 0) {
      $("#saveData").attr("disabled", true);
    }
  });

  $("#saveData").on("click", async function(event) {
    const school = $("#school-name").val();
    let data = await getInputData();

    data = JSON.stringify(data);

    await $.post("api/add", { data: data, school: school }, (res, status) => {
      let cleanURL = school.toLowerCase();
      cleanURL = cleanURL.split(" ").join("-");

      // $("#latest").prepend(`<a href="?school=${cleanURL}">${cleanURL} | </a>`);

      setTimeout(function() {
        location.href = `/calendar?school=${cleanURL}`;
      }, 1000);
    });
  });

  function getInputData() {
    const data = [];

    let days = {
      Monday: 8,
      Tuesday: 8,
      Wednesday: 8,
      Thursday: 8,
      Friday: 8
    };

    const inputs = $(".form-unique-identifier");

    for (let i = 0; i < inputs.length; i += 3) {
      // Look for overlapping dates
      if (days.hasOwnProperty(inputs[i + 2].value)) {
        if (days[inputs[i + 2].value] === 18) {
          continue;
        } else {
          days[inputs[i + 2].value]++;
        }
      }

      data.push({
        title: `${inputs[i + 1].value}, ${inputs[i + 0].value} - Class ${
          days[inputs[i + 2].value]
        }:00`,
        daysOfWeek: `${getDay(inputs[i + 2].value)}T${
          days[inputs[i + 2].value]
        }:00:00`
      });
    }
    return data;
  }

  function getDay(str) {
    return str === "Monday"
      ? "1"
      : str === "Tuesday"
      ? "2"
      : str === "Wednesday"
      ? "3"
      : str === "Thursday"
      ? "4"
      : "5";
  }
});
