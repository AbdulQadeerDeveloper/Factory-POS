
export default function MultiSelectStyling() {
    const customStyles = {
        control: (provided, state) => ({
          ...provided,
          background: '#fff',
        //   borderColor: '#d9edf7',
          borderRadius: '0',
          minHeight: '30px',
          height: '30px',
          boxShadow: state.isFocused ? null : null,
        }),
    
        valueContainer: (provided, state) => ({
          ...provided,
          height: '30px',
          padding: '0 6px'
        }),
    
        input: (provided, state) => ({
          ...provided,
          margin: '0px',
        }),
        indicatorSeparator: state => ({
          display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
          ...provided,
          height: '30px',
        }),
    };
    return customStyles
}