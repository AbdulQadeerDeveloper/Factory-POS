import React from "react";

export default function CurrencyField({
  value,
  onChange,
  Ref,
  onKeyDown,
  className = "JVDebitInput",
}) {
  function onDataChange(e) {
    let lastChar = e.target.value.slice(-1);
    switch (lastChar) {
      case ",": //comma
      case "t": //thousand
      case "T": //thousand
        e.target.value = e.target.value.slice(0, -1) + "000";
        break;
      case "/": //four zero
      case "f": //four zero
      case "F": //four zero
        e.target.value = e.target.value.slice(0, -1) + "0000";
        break;
      case ".": //dot
      case "l": //lac
      case "L": //lac
        e.target.value = e.target.value.slice(0, -1) + "00000";
        break;
      case "+": //plus
      case "m": //million
      case "M": //million
        e.target.value = e.target.value.slice(0, -1) + "000000";
        break;
      default:
        break;
    }
    onChange(e);
  }

  return (
    <input
      style={{
        borderRadius: "2px",
        textAlign: "right",
        color: "#036",
      }}
      ref={Ref}
      onKeyDown={onKeyDown}
      value={value}
      onChange={onDataChange}
      className={"form-control " + className}
      autoComplete="off"
    />
  );
}
