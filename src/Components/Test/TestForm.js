import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
  rememberMe: yup.boolean(),
});

export default function TestForm() {
  const [number, setNumber] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        Email:
        <input {...register("email")} />
        {errors.email && <span>{errors.email.message}</span>}
      </label>

      <label>
        Password:
        <input type="password" {...register("password")} />
        {errors.password && <span>{errors.password.message}</span>}
      </label>

      <lable>
        <input type="checkbox" {...register("rememberMe")} /> Remember me
        {errors.rememberMe && <span>{errors.rememberMe.message}</span>}
      </lable>

      <label>
        <input
          type="text"
          value={number}
          onChange={(e) => {
            let lastChar = e.target.value.slice(-1);
            if (lastChar === ",")
              setNumber(e.target.value.slice(0, -1) + "000");
            else if (lastChar === ".")
              setNumber(e.target.value.slice(0, -1) + "00000");
            else setNumber(e.target.value);
          }}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}
