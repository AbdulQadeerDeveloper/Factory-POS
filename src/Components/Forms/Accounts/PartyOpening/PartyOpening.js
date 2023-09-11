import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
// import CodingStyle from './coding.module.css';
import PartyTypes from "../../../Comps/PartyTypes";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import PartyOpService from '../../../../Services/PartyOpService'
import PartyOpHead from "./PartyOpHead";
import PartyOpBody from "./PartyOpBody";
import PartyOpList from "./PartyOpList";

export default function PartyOpening() {

  const partyRef = useRef();
  const netDebitRef = useRef();
  const netCreditRef = useRef();
  const btnAddRef = useRef();
  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [fdata, setFdata] = useState([]);
  const [parentobj, setParentobj] = useState({}); //Party Type
  let emptyObject = {
    Id: 0,
    SrNo: 0,
    Date: localStorage.getItem("sDate"),
    TType: "JV",
    PartyId: null,
    PartyName: "",
    Description: "Opening...",
    NetDebit: null,
    NetCredit: null,
    Status: 0,
  };

  const [dataObject, setDataObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    PartyOpService.get()
      .then((res) => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.response.data);
        setIsLoading(false);
      });
    partyRef?.current?.focus();
  }, []);

  //#region Fetch All Data
  useEffect(() => {
    getData();
  }, [getData]);
  //#endregion

  //#region Filter Product Array Based On PartyTypeId
  useEffect(() => {
    if (parentobj.length > 0) {
      setDataObject(emptyObject);
      setFdata([]);
      for (let j = 0; j < parentobj.length; j++) {
        for (let k = 0; k < data.length; k++) {
          if (data[k].PartyTypeId === parentobj[j].value) {
            setFdata((p) => [...p, data[k]]);
            setDataObject({
              ...dataObject,
              PartyTypeId: parentobj[j].value,
            });
          }
        }
      }
    } else {
      setFdata(data);
    }
    data.length > 0 &&
      setDataObject({ ...emptyObject, Date: data[0].Date.slice(0, 10) });
  }, [data, parentobj]);
  //#endregion

  //#region handle Methods
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setDataObject((p) => {
      return { ...p, [name]: value };
    });

    console.log(dataObject);
  }

  function handleAdd() {
    PartyOpService.post(dataObject).then((res) => {
      console.log(res);
      let index = fdata.findIndex((x) => x.Id === dataObject.Id);

      if (index >= 0) {
        fdata[index] = dataObject;
        setDataObject({ ...emptyObject, Date: dataObject.Date.slice(0, 10) });
      } else {
        setData([...data, res.data]);
        setDataObject(emptyObject);
      }
      partyRef.current.focus();
    })
      .catch(err => {
        alert(err.response.data);
      })
  }

  function handleEdit(prod) {
    setDataObject({ ...prod, Date: prod.Date.slice(0, 10) });
  }

  function handleDelete(id) {
    console.log(id);
    PartyOpService.remove(id)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = fdata.findIndex((x) => x.Id === id);
        fdata.splice(index, 1);
      })
      .catch((err) => {
        setMsg({ ...msg, err: err.response.data, color: "alert alert-warning" });
      });
  }

  function handleClear() {
    setDataObject(emptyObject);
    // if (parentobj[0]?.PartyTypeId > 0) {
    //     setDataObject({ PartyTypeId: parentobj[0].PartyTypeId });
    // }
  }

  //#endregion handle Methods

  //#region JSX
  return (
    <>
      <AnimatedPage>
        <div className="container-fluid main_container">
          <div className="main-div">
            {/* <div className='bg-info panel_heading'>
              Party Opening
            </div> */}
            <Header title="Party Opening" isLoading={isLoading} />
            <div className="clearfix"></div>

            <div className="page_caption_area">
              {/* <div className='col-md-12' style={{ textAlign: "center" }}>
                {isLoading ? "Loading..." : ""}
              </div>
              <br /> */}
              <div className="caption_voc">PartyTypes</div>
              <div className="field_big">
                <PartyTypes parentobj={parentobj} setParentobj={setParentobj} />
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>

            <div className="panel panel-default transactions_section">
              <div className="printing_area">
                {/* Child component Area */}
                <div>
                  <table
                    className="table table-bordered"
                    style={{ width: "100%", margin: "0" }}
                  >
                    <PartyOpHead />
                    <tbody>
                      <PartyOpBody dataObject={dataObject} setDataObject={setDataObject} handleChange={handleChange} handleAdd={handleAdd} handleClear={handleClear} btnAddRef={btnAddRef} partyRef={partyRef} netDebitRef={netDebitRef} netCreditRef={netCreditRef} />
                      <PartyOpList fdata={fdata} handleEdit={handleEdit} handleDelete={handleDelete} />
                    </tbody>

                  </table>
                  <div className="clearfix"></div>
                </div>
                {/* Child component Area */}
              </div>
              <div className="clearfix"></div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className="clearfix"></div>
        </div>
        <div className="clearfix"></div>
      </AnimatedPage>
    </>
  );
  //#endregion handle Methods
}
