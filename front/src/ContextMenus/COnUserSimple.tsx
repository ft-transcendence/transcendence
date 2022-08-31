import { Menu, Item } from "react-contexify";
import { useNavigate } from "react-router-dom";

export const COnUserSimple = (props: any) => {
  const navigate = useNavigate();

  return (
    <Menu id="onUserSimple">
      <Item
        data={{ key: "value" }}
        onClick={({ props }) => {
          navigate("/app/public/" + props.who);
          window.location.reload();
        }}
      >
        see profile
      </Item>
    </Menu>
  );
};
