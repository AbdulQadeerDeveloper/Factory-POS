import React from "react";

export default function TextField({
  FocusNextInputChild,
  childobj,
  setChildobj,
  Ref,
  className = "JVNarrationInput",
}) {
  return (
    <input
      style={{ borderRadius: "2px" }}
      ref={Ref}
      onKeyDown={FocusNextInputChild}
      onChange={(e) =>
        setChildobj({ ...childobj, Description: e.target.value })
      }
      type="text"
      value={childobj.Description}
      className={"form-control " + className}
      autoComplete="off"
    />
  );
}
