import { useState, useEffect, useContext } from "react";
import { getUserFriends } from "../../../queries/userQueries";
import { ItableRow, IUserStatus } from "../../../globals/Interfaces";
import { DisplayRow } from "./DisplayRowUsers";
import { getUserAvatarQuery } from "../../../queries/avatarQueries";
import { UsersStatusCxt } from "../../../App";

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
      return await getUserFriends();
    };

    const fetchDataFriendsAvatar = async (otherId: number) => {
      return await getUserAvatarQuery(otherId);
    };

    const fetchData = async () => {
      let fetchedFriends = await fetchDataFriends();

      if (fetchedFriends !== undefined && fetchedFriends.length !== 0) {
        for (let i = 0; i < fetchedFriends.length; i++) {
          let newRow: ItableRow = {
            key: i,
            userModel: { username: "", avatar: "", id: 0, status: 0 },
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

          if (avatar !== undefined && avatar instanceof Blob) {
            newRow.userModel.avatar = URL.createObjectURL(avatar);
          }
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
        <div>Loading...</div>
      )}
    </div>
  );
};

//isFetched === "error" to add
