import { ToastContainer } from "react-bootstrap";
import Toast from "react-bootstrap/Toast";

// const getDate = () => {
//   let newDate = new Date();
//   let formattedDate = newDate.getMonth() + 1 + "/" + newDate.getDate();
//   return formattedDate;
// };

const getTime = () => {
  let newDate = new Date();
  const time = newDate.getHours() + "h" + newDate.getMinutes();
  return time;
};

export const TAlert = (props: any) => {
  return (
    <ToastContainer position="bottom-end" className="p-3" style={{zIndex:2000}}>
      <Toast
        onClose={() => props.setShow(false)}
        show={props.show}
        delay={5000}
        autohide
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">Notification Alert</strong>
          <small>{getTime()}</small>
        </Toast.Header>
        <Toast.Body style={{ color: "black" }}>{props.text}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};
