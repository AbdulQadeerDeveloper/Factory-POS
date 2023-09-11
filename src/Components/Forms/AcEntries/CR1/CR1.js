import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Form, FormGroup, FormControl, FormSelect, Button, Container, Table } from "react-bootstrap";

const CR1 = () => {
  const [formState, setFormState] = useState({
    VocNo: "",
    Date: "",
    CashAc: "",
    Id: "",
    SrNo: "",
    PartyId: "",
    Description: "",
    NetCredit: "",
  });

  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormGroup>
          <FormControl
            type="number"
            name="VocNo"
            placeholder="VocNo"
            ref={register("VocNo")}
          />
          <FormControl
            type="date"
            name="Date"
            placeholder="Date"
            ref={register("Date")}
          />
          <FormControl
            type="number"
            name="CashAc"
            placeholder="Cash Account 1"
            ref={register("CashAc")}
          />
        </FormGroup>
        <FormGroup>
          {/* Make Description and NetCredit first and second column, respectively */}
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Description</th>
                <th>NetCredit</th>
                <th>Id</th>
                <th>SrNo</th>
                <th>PartyId</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <FormControl
                    type="text"
                    name="Description"
                    placeholder="Description"
                    ref={register("Description")}
                  />
                </td>
                <td>
                  <FormControl
                    type="number"
                    name="NetCredit"
                    placeholder="NetCredit"
                    ref={register("NetCredit")}
                  />
                </td>
                <td>
                  <FormControl
                    type="number"
                    name="Id"
                    placeholder="Id"
                    ref={register("Id")}
                  />
                </td>
                <td>
                  <FormControl
                    type="number"
                    name="SrNo"
                    placeholder="SrNo"
                    ref={register("SrNo")}
                  />
                </td>
                <td>
                  <Form.Select
                    name="PartyId"
                    ref={register("PartyId")}
                  >
                    <option value="1">Party 1</option>
                    <option value="2">Party 2</option>
                    <option value="3">Party 3</option>
                  </Form.Select>
                </td>
              </tr>
            </tbody>
          </Table>
        </FormGroup>
        <Button type="submit">Submit</Button>
      </Form>
    </Container>
  );
};

export default CR1;
