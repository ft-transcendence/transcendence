import { Menu, Item } from "react-contexify";
import { useNavigate } from "react-router-dom";
import { addFriendQuery } from "../queries/userFriendsQueries";

export const COnUser = (props: any) => {
  const navigate = useNavigate();

  const handleClick = (otherId: number) => {
    const addFriend = async () => {
      const result = await addFriendQuery(otherId);
      if (result !== "error") {
        props.setText("Friend request sent to user #" + otherId + "!");
      } else props.setText("Could not send friend request :(.");
      props.setShowNotif(true);
    };
    addFriend();
  };

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
      <Item
        onClick={({ props }) => {
          handleClick(props.who);
        }}
      >
        add as friend
      </Item>
    </Menu>
  );
};
