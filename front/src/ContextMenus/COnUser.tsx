import { useContext } from "react";
import { Menu, Item } from "react-contexify";
import { useNavigate } from "react-router-dom";
import { NotifCxt } from "../App";
import { addFriendQuery } from "../queries/userFriendsQueries";

export const COnUser = (props: any) => {
  const navigate = useNavigate();
  const notif = useContext(NotifCxt);

  const handleClick = (otherId: number, otherUsername:string) => {
    const addFriend = async () => {
      const result = await addFriendQuery(otherId);
      if (result !== "error") {
        notif?.setNotifText("Friend request sent to " + otherUsername + "!");
      } else notif?.setNotifText("Could not send friend request :(.");
      notif?.setNotifShow(true);
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
          handleClick(props.who, props.username);
        }}
      >
        add as friend
      </Item>
    </Menu>
  );
};
