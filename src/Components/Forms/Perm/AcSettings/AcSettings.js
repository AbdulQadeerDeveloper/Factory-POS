import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import FormikControl from '../../../Controls/FormikControl'
import CodingStyle from "./coding.module.css";
import axios from '../../../AxiosInstance'

function AcSettings() {

    const [isLoading, setIsLoading] = useState(false)
    const formikRef = useRef();

    const [initialValues, setInitialValues] = useState(
        {
            Id: 0,
            PurAc: 0,
            SalAc: 0,
            PurAdvTaxAc: 0,
            FreightAc: 0,
            FreightParty: 0,
            SalAdvTaxAc: 0,
            TwoFactorAuth: 0,
        }
    )

    const validationSchema = Yup.object({
        PurAc: Yup.number().required('Required'),
        SalAc: Yup.number().required('Required'),
        PurAdvTaxAc: Yup.number().required('Required'),
        FreightAc: Yup.number().required('Required'),
        FreightParty: Yup.number().required('Required'),
        SalAdvTaxAc: Yup.number().required('Required'),
        TwoFactorAuth: Yup.number().required('Required'),
    })

    const onSubmit = (values, { setSubmitting, resetForm }) => {
        console.log('Form data', values)
        axios.put('api/perm/acsettings', values)
            .then(res => {
                console.log('res from server', res)
                alert("Data is Saved.")
            })
            .catch(err => {
                console.log(err)
                alert(err.response.data)
            })
    }



    const getData = useCallback(() => {
        setIsLoading(true);

        axios
            .get(`api/perm/acsettings`)
            .then((res) => {
                console.log(res.data[0])
                setInitialValues({ ...res.data[0] })
                // initialValues = res.data[0]
                setIsLoading(false);
            })
            .catch((err) => {
                alert(err.message);
                setIsLoading(false);
            });
    }, []);

    useEffect(() => {
        getData();

    }, [getData])

    return (
        <>
            <div>
                <div
                    className="container-fluid"
                    style={{ background: "darkgrey", padding: "7px 0" }}
                >

                    <div className="main-div">
                        <div className="bg-info panel_heading">
                            A/C Settings <button onClick={() => {formikRef?.current?.resetForm(); getData()}}>Refresh</button>
                        </div>
                        <div className="clearfix"></div>

                        <div
                            className={CodingStyle.caption_area}
                            style={{ background: "", padding: "20px 0" }}
                        >
                            <div className="col-md-12" style={{ textAlign: "center" }}>
                                {isLoading ? "Loading..." : ""}
                            </div>
                            <br />

                            <br />
                            <div className="clearfix"></div>
                        </div>
                        <div className="clearfix"></div>

                        <div className="panel panel-default transactions_section">
                            <div className="printing_area">
                                <div className='col-sm-12'>
                                    <Formik
                                        innerRef={formikRef}
                                        initialValues={initialValues}
                                        enableReinitialize
                                        validationSchema={validationSchema}
                                        onSubmit={onSubmit}
                                    >
                                        {(formik, isSubmitting) => {
                                            return (
                                                <Form>
                                                    <FormikControl control='input' type='number' label='Id' name='Id' />
                                                    <FormikControl control='input' type='number' label='PurAc' name='PurAc' />
                                                    <FormikControl control='input' type='number' label='SalAc' name='SalAc' />
                                                    <FormikControl control='input' type='number' label='PurAdvTaxAc' name='PurAdvTaxAc' />
                                                    <FormikControl control='input' type='number' label='FreightAc' name='FreightAc' />
                                                    <FormikControl control='input' type='number' label='FreightParty' name='FreightParty' />
                                                    <FormikControl control='input' type='number' label='SalAdvTaxAc' name='SalAdvTaxAc' />
                                                    <FormikControl control='input' type='number' label='TwoFactorAuth' name='TwoFactorAuth' />
                                                    <button type='submit' disabled={!formik.isValid || isSubmitting}>
                                                        Submit
                                                    </button>
                                                    <button name='resetit' type='reset'>
                                                        Reset
                                                    </button>
                                                </Form>
                                            )
                                        }}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default AcSettings
