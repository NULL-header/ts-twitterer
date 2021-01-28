import React from "react";

export const HelloWorld = () => {
  React.useEffect(() => {
    fetch("/api/tweets").then((res) =>
      res.json().then((res) => console.log(res))
    );
  }, []);
  return (
    <>
      <h1>Hello World</h1>
      <hr></hr>
      <h3>Environmental variables:</h3>
      <p>
        process.env.PRODUCTION:<b>{process.env.PRODCTION?.toString()}</b>
      </p>
      <p>
        process.env.NAME:<b>{process.env.NAME}</b>
      </p>
      <p>
        process.env.VERSION:<b>{process.env.VERSION}</b>
      </p>
    </>
  );
};
