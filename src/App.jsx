import "./App.css";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
//Ken@&evano10
const App = () => {
  const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email().required("Email is required"),
    age: yup.number().positive().required("Age is required"),
    password: yup.string().matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,}$/,
        'Password must contain at least 4 characters  one uppercase letter, one lowercase letter, one number, and one special character'
      ).required("Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match"),
    acceptTerms: yup.boolean().oneOf([true], "You must accept the terms and conditions"),
  });
  const express = require("express");
  const app = express();
  const port = 3000; // Change this to the desired port number
  
  const sql = require("mssql");
  const config = {
    user: "Evans",
    password: "Ngugi123",
    server: "myserverevans.database.windows.net",
    database: "myDb",
    options: {
      encrypt: true, // Enable if you're using Azure SQL Database
    },
  };
  
  app.use(express.json());
  
  // Connect to the database
  sql.connect(config)
    .then(() => {
      console.log("Connected to the database");
      // Start the server after successful database connection
      app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
      });
    })
    .catch((error) => {
      console.error("Error connecting to the database:", error);
    });
  
  // Set up CORS
  const cors = require("cors");
  app.use(cors());
  
  // Define your routes and API endpoints here
  
  app.post("/register", (req, res) => {
    const { fullName, email, age, password } = req.body;
  
    const query = `
      INSERT INTO users (fullName, email, age, password)
      VALUES (@fullName, @email, @age, @password)
    `;
  
    const parameters = [
      { name: "fullName", type: sql.VarChar, value: fullName },
      { name: "email", type: sql.VarChar, value: email },
      { name: "age", type: sql.Int, value: age },
      { name: "password", type: sql.VarChar, value: password },
    ];
  
    const request = new sql.Request();
  
    request.query(query, parameters)
      .then(() => {
        console.log("Registration successful");
        res.sendStatus(200);
      })
      .catch((error) => {
        console.error("Error inserting data into the database:", error);
        res.status(500).send("Internal Server Error");
      });
  });
  
  // Additional routes and endpoints can be defined here
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axios.post("http://localhost:3000/register", data);
      alert("Registration successful");
      reset(); // Clear the form fields
    } catch (error) {
      console.error("Error submitting registration:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form-container" action="POST">
      <div className="form-group">
        <label htmlFor="fullName">Full Name</label>
        <input type="text" id="fullName" {...register("fullName")} />
        {errors.fullName && <p className="error">{errors.fullName.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input type="text" id="email" {...register("email")} />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="age">Age</label>
        <input type="number" id="age" {...register("age")} />
        {errors.age && <p className="error">{errors.age.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" {...register("password")} />
        {errors.password && <p className="error">{errors.password.message}</p>}
      </div>
      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input type="password" id="confirmPassword" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="error">{errors.confirmPassword.message}</p>}
      </div>
      <div className="form-group">
        <input type="checkbox" id="acceptTerms" {...register("acceptTerms")} />
        <label htmlFor="acceptTerms">I accept the terms and conditions</label>
        {errors.acceptTerms && <p className="error">{errors.acceptTerms.message}</p>}
      </div>
      <input type="submit" value="Submit" className="submit-button"
      />
    </form>
  );
};

export default App;