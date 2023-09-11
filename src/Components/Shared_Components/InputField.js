import React from "react";

export default function InputField(props) {
  const { type, className, name, value, styling, ref, autoComplete, readOnly, tabIndex } = props;

  return (
    <input
      ref={ref ? ref : ''}
      className={className ? className : ''}
      type={type ? type : "number"}
      name={name ? name : ''}
      value={value !== null ? value : ''}
      style={styling}
      autoComplete={autoComplete ? autoComplete : false}
      readOnly={readOnly ? readOnly : false}
      tabIndex={tabIndex ? tabIndex : ''}
    />
  );
}