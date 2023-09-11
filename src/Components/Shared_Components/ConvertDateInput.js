import moment from "moment";

function ConvertDateInput(date, input) {
  if (input && input === true) {
    let cnv = date.substring(0, 10);
    // console.log(cnv);
    return cnv;
  } else {
    let cnv = moment(date).format("DD-MM-YYYY");
    // console.log(cnv);
    return cnv;
  }
}

export default ConvertDateInput;
