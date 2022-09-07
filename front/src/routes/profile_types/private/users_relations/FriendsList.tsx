import { useState, useEffect, useContext } from "react";
import { ItableRow, IUserStatus } from "../../../../globals/Interfaces";
import { getUserAvatarQuery } from "../../../../queries/avatarQueries";
import { getUserFriends } from "../../../../queries/userFriendsQueries";
import { DisplayRow } from "./DisplayRowUsers";
import { UsersStatusCxt } from "../../../../App";
import { Spinner } from "react-bootstrap";

export const FriendsList = () => {
  const usersStatus = useContext(UsersStatusCxt);

  const [friendsList, setFriendsList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState("false");
  const [isUpdated, setUpdate] = useState(false);

  let friends: ItableRow[] = [];

  useEffect(() => {
    const fetchDataFriends = async () => {
      const id = localStorage.getItem("userID");
      if (id) {
        const result = await getUserFriends(+id);
        if (result !== "error") return result;
      }
    };

    const fetchDataFriendsAvatar = async (otherId: number) => {
      const result: undefined | string | Blob | MediaSource =
        await getUserAvatarQuery(otherId);
      if (result !== "error") return result;
      else
        return "https://img.myloview.fr/stickers/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg";
    };

    const fetchData = async () => {
      let fetchedFriends = await fetchDataFriends();

      if (fetchedFriends !== undefined && fetchedFriends.length !== 0) {
        for (let i = 0; i < fetchedFriends.length; i++) {
          let newRow: ItableRow = {
            key: i,
            userModel: { username: "", avatar: "", id: 0, status: -1 },
          };
          newRow.userModel.id = fetchedFriends[i].id;
          newRow.userModel.username = fetchedFriends[i].username;
          let found = undefined;
          if (usersStatus) {
            found = usersStatus.find(
              (x: IUserStatus) => x.key === fetchedFriends[i].id
            );
            if (found) newRow.userModel.status = found.userModel.status;
          }

          let avatar = await fetchDataFriendsAvatar(fetchedFriends[i].id);

          if (avatar !== undefined && avatar instanceof Blob)
            newRow.userModel.avatar = URL.createObjectURL(avatar);
          else if (avatar) newRow.userModel.avatar = avatar;
          friends.push(newRow);
        }
      }
      setFriendsList(friends);
      setFetched("true");
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated, usersStatus]);

  return (
    <div style={{ overflowY: "auto", overflowX: "hidden" }}>
      {isFetched === "true" ? (
        friendsList?.length !== 0 ? (
          friendsList!.map((h, index) => {
            return (
              <DisplayRow
                listType={"friends"}
                hook={setUpdate}
                state={isUpdated}
                key={index}
                userModel={h.userModel}
              />
            );
          })
        ) : (
          <span>No friends.</span>
        )
      ) : (
        <Spinner animation="border" />
      )}
    </div>
  );
};

//isFetched === "error" to add
