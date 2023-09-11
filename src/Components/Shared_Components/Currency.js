export default function Currency(props) {
    const {value} = props;
    return (
        <span>
            {value !== null ? value?.toLocaleString() : ''}
        </span>
    );
}
