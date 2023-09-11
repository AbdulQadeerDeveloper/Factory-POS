import moment from 'moment';

export default function ConvertedDate(props) {
    const {date} = props;
    function ConvertDateFrmt(date) {
        if (date=== null) return null;
        // let cnv = date = date.substring(0, 10);
        let cnv = moment(date).format('DD-MM-YYYY');
        return cnv
    }
    return (
        ConvertDateFrmt(date)
    );
}
