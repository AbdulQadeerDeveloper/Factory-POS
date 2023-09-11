import React, { useEffect, useState, useCallback } from "react";
import axios from "../../../AxiosInstance";
// import CodingStyle from './coding.module.css';
import PartyCategs from "../../../Comps/PartyCategs";
import Header from "../../../Shared_Components/Header";
import AnimatedPage from "../../../Shared_Components/AnimatedPage";

export default function PartyTypeCoding() {
  //#region variables
  const [msg, setMsg] = useState({
    err: "",
    color: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [parties, setParties] = useState([]);
  const [fparties, setFparties] = useState([]);
  const [parentobj, setParentobj] = useState({});
  const [partyCategs, setPartyCategs] = useState([]);
  let emptyObject = {
    PartyTypeId: 0,
    PartyTypeName: "",
    PartyCategId: 0,
    PartyCategName: "",
  };
  const [partyObject, setPartyObject] = useState(emptyObject);
  //#endregion variables

  const getData = useCallback(() => {
    console.log("getdata");
    setIsLoading(true);
    axios
      .get("api/partytype")
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

  //#region Filter Product Array Based On PartyTypeId
  useEffect(() => {
    const res = parties.findIndex(
      ({ PartyCategId, PartyCategName }, i, a) =>
        i ===
        a.findIndex(
          (e) =>
            e.PartyCategId === PartyCategId &&
            e.PartyCategName === PartyCategName
        )
    );
    console.table(res);
    setPartyCategs(res);

    if (parentobj.length > 0) {
      setPartyObject(emptyObject);
      setFparties([]);
      for (let j = 0; j < parentobj.length; j++) {
        for (let k = 0; k < parties.length; k++) {
          if (parties[k].PartyTypeId === parentobj[j].value) {
            setFparties((p) => [...p, parties[k]]);
            setPartyObject({
              ...partyObject,
              PartyTypeId: parentobj[j].value,
            });
            // setPartyObject({
            //   ...partyObject,
            //   PartyTypeId: parentobj[j].PartyTypeId,
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

    setPartyObject((p) => {
      return { ...p, [name]: value };
    });

    console.log(partyObject);
  }

  function handleAdd() {
    axios
      .post("api/partytype", partyObject)
      .then((res) => {
        console.log(res);
        let index = fparties.findIndex(
          (x) => x.PartyTypeId === partyObject.PartyTypeId
        );

        if (index >= 0) {
          fparties[index] = partyObject;
          setPartyObject(emptyObject);
        } else {
          setParties([...parties, partyObject]);
        }
        setPartyObject(emptyObject);
      })
      .catch((err) => {
        alert(err.message);
      });
  }

  function handleEdit(prod) {
    setPartyObject(prod);
  }

  function handleDelete(id) {
    console.log(id);
    axios
      .delete(`/api/partytype/${id}`)
      .then((res) => {
        setMsg({
          ...msg,
          err: "Deleted Successfully",
          color: "alert alert-success",
        });
        let index = fparties.findIndex((x) => x.PartyTypeId === id);
        fparties.splice(index, 1);
      })
      .catch((err) => {
        setMsg({ ...msg, err: err.message, color: "alert alert-warning" });
      });
  }

  function handleClear() {
    setPartyObject(emptyObject);
    // if (parentobj[0]?.PartyTypeId > 0) {
    //     setPartyObject({ PartyTypeId: parentobj[0].PartyTypeId });
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
              PartyType Coding
            </div> */}
            <Header title="PartyType Coding" isLoading={isLoading} />
            <div className="clearfix"></div>

            <div className="page_caption_area">
              {/* <div className='col-md-12' style={{ textAlign: "center" }}>
                {isLoading ? "Loading..." : ""}
              </div>
              <br /> */}
              <div className="caption_voc">PartyCategs</div>
              <div className="field_big">
                <PartyCategs
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
                          PartyCategId
                        </th>
                        <th
                          style={{ textAlign: "center" }}
                          className="bg-color col-xs-1"
                        >
                          PartyType Id
                        </th>
                        <th
                          style={{ textAlign: "left" }}
                          className="bg-color col-xs-3"
                        >
                          PartyType Name
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
                            name="PartyCategId"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.PartyCategId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="PartyTypeId"
                            type="number"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "center",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.PartyTypeId}
                            required
                          />
                        </td>
                        <td>
                          <input
                            name="PartyTypeName"
                            type="text"
                            className="form-control POOthers"
                            autoComplete="off"
                            style={{
                              borderRadius: "2px",
                              textAlign: "left",
                              color: "#036",
                            }}
                            onChange={handleChange}
                            value={partyObject.PartyTypeName}
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
                        fparties.map((x) => (
                          <tr key={x.PartyTypeId}>
                            <td style={{ textAlign: "center" }}>
                              {x.PartyCategId}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              {x.PartyTypeId}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {x.PartyTypeName}
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button
                                className="btn btn-info btn-xs"
                                onClick={() => handleEdit(x)}
                              >
                                <i className="fa fa-pencil"></i>
                              </button>{" "}
                              &nbsp;
                              <button
                                className="btn btn-danger btn-xs"
                                onClick={() => handleDelete(x.PartyTypeId)}
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
