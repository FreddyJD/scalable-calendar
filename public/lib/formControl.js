$(document).ready(function() {
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
    const school = $('#school-name').val()
    let data = await getInputData();
    
    data = JSON.stringify(data);
    

    await $.post("api/add", {data: data, school: school}, (res, status) => console.log(res, status));
  });

  function getInputData() {
    const data = [];
    const inputs = $(".form-unique-identifier");

    for (let i = 0; i < inputs.length; i += 3) {
      data.push({
        title: `${inputs[i + 1].value}, ${inputs[i + 0].value}`,
        time: getDay(inputs[i + 2].value)
      });
    }
    return data;
  }

  function getDay(str) {
    return (str === 'Monday') ? 
    '1' : (str === 'Tuesday' ?
    '2' : (str === 'Wednesday' ? 
    '3' : (str === 'Thursday' ? 
    '4' : '5'
    ))) 

  }
});
