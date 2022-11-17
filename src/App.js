import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";
import Content from "./Content";

function App() {
  const initialData = {
    name: "",
    age: "",
    dob: "",
  };
  const [user, setUser] = useState(initialData);

  const [pdf, setPdf] = useState(null);

  const onChangeHandler = (e) => {
    setUser((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: "application/pdf" });
  }
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const html2pdf = await import("html2pdf.js");
    const term = html2pdf.default;
    var opt = {
      margin: [0.6, 0.6, 0.6, 0.6],
      filename: "Contract Form.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    const invoice = document.getElementById("htmlpdf");
    await term()
      .from(invoice)
      .set(opt)
      .toPdf()
      .output("datauristring")
      .then(async function (pdfAsString) {
        setPdf(pdfAsString);
        var file = await dataURLtoFile(pdfAsString, `sample`);
        console.log(file);
      });
  };
  return (
    <div className="App">
      <form onSubmit={onSubmitHandler}>
        <input
          type="text"
          className="input"
          placeholder="Name"
          name="name"
          onChange={onChangeHandler}
        />
        <input
          type="number"
          className="input"
          placeholder="age"
          onChange={onChangeHandler}
          name="age"
        />
        <input
          type="date"
          className="input"
          onChange={onChangeHandler}
          placeholder="dob"
          name="dob"
        />
        <button>Submit</button>
      </form>
      <a download="pdf" href={pdf}>
        download
      </a>
      <Content user={user} />
    </div>
  );
}

export default App;
