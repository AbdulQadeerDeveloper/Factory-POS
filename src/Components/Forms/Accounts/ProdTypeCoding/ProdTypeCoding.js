import React, { useEffect, useState, useCallback } from "react";
import axios from "../../../AxiosInstance";
// import CodingStyle from './coding.module.css';
import ProdCategs from "../../../Comps/ProdCategs";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";
import { set } from "react-hook-form";

export default function ProdTypeCoding() {
  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  const [currentIndex, setCurrentIndex] = useState(-1)
  const [currentId, setCurrentId] = useState(-1)
  const [isLoading, setIsLoading] = useState(false);
  const [parties, setParties] = useState([]);
  const [fparties, setFparties] = useState([]);
  const [parentobj, setParentobj] = useState({});
  const [partyCategs, setProdCategs] = useState([]);
  let emptyObject = {
    ProdTypeId: 0,
    ProdTypeName: "",
    ProdCategId: 1,
    ProdCategName: "",
  };
  const [prodTypeObject, setProdTypeObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    axios
      .get("api/prodtype")
      .then((res) => {
        console.log(res);
        setParties(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        alert(err.message);
        setIsLoading(false);
      });
  }, []);

  //#region Fetch All Parties
  useEffect(() => {
    getData();
  }, [getData]);
  //#endregion

  //#region Filter Product Array Based On ProdTypeId
  useEffect(() => {
    const res = parties.findIndex(
      ({ ProdCategId, ProdCategName }, i, a) =>
        i ===
        a.findIndex(
          (e) =>
            e.ProdCategId === ProdCategId && e.ProdCategName === ProdCategName
        )
    );
    console.table(res);
    setProdCategs(res);

    if (parentobj.length > 0) {
      setProdTypeObject(emptyObject);
      setFparties([]);
      for (let j = 0; j < parentobj.length; j++) {
        for (let k = 0; k < parties.length; k++) {
          if (parties[k].ProdTypeId === parentobj[j].value) {
            setFparties((p) => [...p, parties[k]]);
            setProdTypeObject({
              ...prodTypeObject,
              ProdTypeId: parentobj[j].value,
            });
            // setProdTypeObject({
            //   ...prodTypeObject,
            //   ProdTypeId: parentobj[j].ProdTypeId,
            // });
          }
        }
      }
    } else {
      setFparties(parties);
    }
  }, [parties, parentobj]);
  //#endregion

  //#region handle Methods
  function handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;

    setProdTypeObject((p) => {
      return { ...p, [name]: value };
    });

    console.log(prodTypeObject);
  }

  function handleAdd() {
    if (currentIndex >= 0) {
      axios.put(`api/prodtype/${currentId}`, prodTypeObject).then((res) => {
        let index = parties.findIndex((x) => x.ProdTypeId === currentId);
        const partiestoUpdate = [...parties];
        partiestoUpdate[index] = {...prodTypeObject, ProdTypeId: prodTypeObject.ProdTypeId};
        setParties(partiestoUpdate);
      });
    }
    else {
      axios.post("api/prodtype", prodTypeObject).then((res) => {
        setParties([...parties, prodTypeObject]);
      });
    }
    setProdTypeObject(emptyObject);
    setCurrentIndex(-1);
    setCurrentId(0)
  }

  function handleEdit(prod, index) {
    setCurrentIndex(index)
    setCurrentId(prod.ProdTypeId);
    setProdTypeObject(prod);
  }

  function handleDelete(id) {
    console.log(id);
    axios
      .delete(`/api/prodtype/${id}`)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = fparties.findIndex((x) => x.ProdTypeId === id);
        fparties.splice(index, 1);
      })
      .catch((err) => {
        setMsg({ ...msg, err: err.message, color: "alert alert-warning" });
      });
  }

  function handleClear() {
    setProdTypeObject(emptyObject);
    // if (parentobj[0]?.ProdTypeId > 0) {
    //     setProdTypeObject({ ProdTypeId: parentobj[0].ProdTypeId });
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
              ProdType Coding
            </div> */}
            <Header title="ProdType Coding" isLoading={isLoading} />
            <div className="clearfix"></div>

            <div className="page_caption_area">
              {/* <div className='col-md-12' style={{ textAlign: "center" }}>
                {isLoading ? "Loading..." : ""}
              </div>
              <br /> */}
              <div className="caption_voc">ProdCategs</div>
              <div className="field_big">
                <ProdCategs
                  parentobj={parentobj}
                  setParentobj={setParentobj}
                  partyCategs={partyCategs}
                />
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
                    <thead>
                      <tr>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          ProdCategId
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-1"
                        >
                          Categ Name
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          ProdType Id
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-3"
                        >
                          ProdType Name
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1 action_without_print"
                        >
                          ACTION
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <input
                            name="ProdCategId"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodTypeObject.ProdCategId}
                            required
                          />
                        </td>
                        <td></td>
                        <td>
                          <input
                            name="ProdTypeId"
                            type="number"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodTypeObject.ProdTypeId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="ProdTypeName"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={prodTypeObject.ProdTypeName}
                            required
                          />
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <button
                            className="btn btn-info btn-xs"
                            onClick={handleAdd}
                          >
                            <i className="fa fa-plus"></i>
                          </button>{" "}
                          &nbsp;
                          <button
                            className="btn btn-info btn-xs"
                            onClick={handleClear}
                          >
                            <i className="fa fa-refresh"></i>
                          </button>
                        </td>
                      </tr>
                      {fparties &&
                        fparties.map((x, index) => (
                          <tr key={x.ProdTypeId}>
                            <td style={{ textAlign: "center" }}>
                              {x.ProdCategId}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {x.ProdCategName}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {x.ProdTypeId}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {x.ProdTypeName}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button
                                className="btn btn-info btn-xs"
                                onClick={() => handleEdit(x, index)}
                              >
                                <i className="fa fa-pencil"></i>
                              </button>{" "}
                              &nbsp;
                              <button
                                className="btn btn-danger btn-xs"
                                onClick={() => handleDelete(x.ProdTypeId)}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
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
