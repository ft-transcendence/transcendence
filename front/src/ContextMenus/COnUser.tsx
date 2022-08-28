import { Menu, Item } from "react-contexify";
import { useNavigate } from "react-router-dom";

export const COnUser = () => {
  const navigate = useNavigate();

  return (
    <Menu id="onUser">
      <Item
        data={{ key: "value" }}
        onClick={({ props }) => {
          navigate("/app/public/" + props.who);
          window.location.reload();
        }}
      >
        see profile
      </Item>
      <Item onClick={({ props }) => {}}>add as friend</Item>
    </Menu>
  );
};
