import React, { useState } from "react"
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { NavLink, Outlet, useNavigate } from "react-router-dom";


export default function Auth() {

  return (
    <div>
      <h1>Hello there General kenobi</h1>
      <nav
        style={{
          borderRight: "solid 1px",
          padding: "1rem",
        }}
      >
      <NavLink
        to="/auth/signin" // ${authMode}/>
        style={({ isActive }) => {
          return {
            margin: "1rem 0",
            color: isActive ? "red" : "",
          };
        }}
      >
        signin
      </NavLink>
      {" "}{" "}{" "}
      <NavLink
        to="/auth/signup" // ${authMode}/>
        style={({ isActive }) => {
          return {
            margin: "1rem 0",
            color: isActive ? "red" : "",
          };
        }}
      >
        signup
      </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

// const handleSubmit = (event:any, userInputsRefs:any) => {
//   event.preventDefault();
  // if (userInputsRefs.username.current?.value && userInputsRefs.email.current?.value && userInputsRefs.password.current?.value)
  // { 
  //   let myHeaders = new Headers();
  //   myHeaders.append("Content-Type", "application/json");
    
  //   let raw = JSON.stringify({
  //     "email": userInputsRefs.email.current.value,
  //     "password": userInputsRefs.password.current.value,
  //     "username": userInputsRefs.username.current.value
  //   });

  //   console.log('password: ' + userInputsRefs.password.current.value);
    
  //   fetch("http://localhost:4000/auth/signup", {
  //     method: 'POST',
  //     headers: myHeaders,
  //     body: raw,
  //     redirect: 'follow'
  //   })
  //     .then(response => response.text())
  //     .then(result => localStorage.setItem('UserToken', result))
  //     .then(test => console.log('UserToken: '+ localStorage.getItem('UserToken')) )
  //     .catch(error => console.log('error', error));
  // }
  
// }

// export default function Auth () {

//   let [authMode, setAuthMode] = useState("signin");

//   const ChangeAuthMode = () => {
//     setAuthMode(authMode === "signin" ? "signup" : "signin")
//   }
  
//   let userInputsRefs: {
//     username: React.RefObject<HTMLInputElement>,
//     email: React.RefObject<HTMLInputElement>,
//     password: React.RefObject<HTMLInputElement>
//   } = {
//     username: React.createRef(),
//     email: React.createRef(),
//     password: React.createRef(),
//   };

//   let navigate = useNavigate();

//   async function handleClick(event:any) {
//     event.preventDefault();
//     ChangeAuthMode();
//     navigate('/' + authMode);
//   }

//   return (
//   <div className="Auth-form-container">
//     <form className="Auth-form" onSubmit={event => handleSubmit(event, userInputsRefs)}>
//       <div className="Auth-form-content">
//         <h3 className="Auth-form-title">{authMode === "signin" ? "Sign in.": "Sign up."}</h3>
//         <div className="text-secondary">
//           {authMode === "signin" ? "Don't have an account yet?" : "Already registered?"}
//           &nbsp;&nbsp;&nbsp;
//           <a href="#" onClick={handleClick}>
//             {authMode === "signin" ? "Sign up.": "Sign in."}
//           </a>
//         </div>

//         {authMode == "signup" &&
//             <Form.Group className="mb-3">
//             <Form.Label className="form-test" >USERNAME</Form.Label>
//             <Form.Control
//             ref={userInputsRefs.username}
//             type="text"
//             placeholder="JaneDoe"
//             />
//           </Form.Group>
//         }

//         <Form.Group className="mb-3">
//           <Form.Label className="form-test ">EMAIL</Form.Label>
//           <Form.Control
//           ref={userInputsRefs.email}
//           type="email"
//           placeholder="name@example.com"
//           />
//         </Form.Group >
        
//         <Form.Group className="mb-3">
//           <Form.Label className="form-test" htmlFor="inputPassword1">PASSWORD</Form.Label>
//           <Form.Control
//           ref={userInputsRefs.password}
//             type="password"
//             id="inputPassword5"
//             aria-describedby="passwordHelpBlock"
//             placeholder="****"
//           />
//           <Form.Text className="form-help-block" id="passwordHelpBlock" muted>
//             Your password must be 8-20 characters long.
//           </Form.Text>
//         </Form.Group >

//           <Button variant="secondary" className="submit-button" size="sm">Sign in with 42</Button>
//           <Button variant="primary" type="submit" className="submit-button" size="sm" >
//             Submit
//           </Button>
//         <p className="text-secondary mt-2">
//           Forgot your &nbsp; <a href="#">password?</a>
//         </p>
//       </div>
//     </form>
//   </div>
//   )
// }

//   function useHistory() {
//     throw new Error("Function not implemented.");
//   }

