import moment from 'moment';

export default function GetNow() {
    let cnv = moment().format('MMMM Do YYYY, h:mm:ss a'); // May 05th 2018, 7:20:58 pm
    return cnv
}
