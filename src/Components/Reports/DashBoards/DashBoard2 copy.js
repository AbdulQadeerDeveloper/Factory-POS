import axios from '../../AxiosInstance'
import React, { useRef, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Jan', receivables: 100, payables: 90 },
  { name: 'Feb', receivables: 110, payables: 95 },
  { name: 'Mar', receivables: 115, payables: 100 },
  { name: 'Apr', receivables: 120, payables: 105 },
  { name: 'May', receivables: 125, payables: 110 },
  { name: 'Jun', receivables: 130, payables: 115 },
  { name: 'Jul', receivables: 135, payables: 120 },
  { name: 'Aug', receivables: 140, payables: 125 },
  { name: 'Sep', receivables: 145, payables: 130 },
  { name: 'Oct', receivables: 150, payables: 135 },
  { name: 'Nov', receivables: 155, payables: 140 },
  { name: 'Dec', receivables: 160, payables: 145 },
];

const DashBoard2 = () => {

    const sDateRef = useRef();
    const eDateRef = useRef();

    const [isLoading, setIsLoading] = useState(true)
    const [showFilters, setShowFilters] = useState(true)
    const [data, setData] = useState([])
    useEffect(() => {

        sDateRef.current.value = new Date().toISOString().slice(0, 10)
        eDateRef.current.value = new Date().toISOString().slice(0, 10)

        GetData()

    }, [])

    const GetData = () => {
        setIsLoading(true)
        axios.get(`api/chart/pl?sdate=${sDateRef.current.value}&edate=${eDateRef.current.value}`)
            .then(res => {
                setData(res.data)
                setIsLoading(false)
            })
            .catch(err => {
                alert(err.message)
                setIsLoading(false)
            })
    }

    function GenerateReport() {
        GetData()
    }

    function handleDecrement() {
        sDateRef.current.value = addDays(sDateRef.current.value, -1)
        eDateRef.current.value = addDays(eDateRef.current.value, -1)
        GenerateReport();
    }

    function handleIncrement() {
        sDateRef.current.value = addDays(sDateRef.current.value, +1)
        eDateRef.current.value = addDays(eDateRef.current.value, +1)
        GenerateReport();
    }

    function addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result.toISOString().slice(0, 10);
    }

    function StartDate(e) {
        sDateRef.current.value = e.target.value;
        GenerateReport();
    }

    function EndDate(e) {
        eDateRef.current.value = e.target.value;
        GenerateReport();
    }



  return (
    <BarChart
      width={500}
      height={300}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="receivables" fill="#8884d8" />
      <Bar dataKey="payables" fill="#82ca9d" />
    </BarChart>
  );
};

export default DashBoard2;
