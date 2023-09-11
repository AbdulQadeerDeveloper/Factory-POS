import React, { forwardRef, useRef } from "react";
import ReactToPrint, { PrintContextConsumer } from "react-to-print";

const ComponentToPrint = forwardRef((props, ref) => {
  return <div ref={ref}>hello world</div>;
});

export default function App() {
  const ref = useRef();

  return (
    <div>
      <ReactToPrint content={() => ref.current}>
        <PrintContextConsumer>
          {({ handlePrint }) => (
            <button onClick={handlePrint}>Print this out!</button>
          )}
        </PrintContextConsumer>
      </ReactToPrint>
      <ComponentToPrint ref={ref} />
    </div>
  );
}