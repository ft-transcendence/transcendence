import { useState, useEffect } from "react";
import { getUserFriends } from "../../../queries/userQueries";
import { ItableRow } from "../../../globals/Interfaces";
import { DisplayRow } from "./DisplayRowUsers";

export const FriendsList = () => {
  const [friendsList, setFriendsList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState(false);
  const [isUpdated, setUpdate] = useState(false);

  let friends: ItableRow[] = [];

  useEffect(() => {
    const fetchData = async () => {
      let fetchedFriends = await getUserFriends();
      if (fetchedFriends.length !== 0) {
        for (let i = 0; i < fetchedFriends.length; i++) {
          let newRow: ItableRow = {
            key: i,
            userModel: { username: "", avatar: "", id: 0 },
          };
          newRow.userModel.id = fetchedFriends[i].id;
          newRow.userModel.username = fetchedFriends[i].username;
          newRow.userModel.avatar = fetchedFriends[i].avatar;
          friends.push(newRow);
        }
      }
      setFriendsList(friends);
      if (fetchedFriends.length !== 0) console.log("friendsList", friendsList);
      setFetched(true);
      setUpdate(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, isUpdated]);

  return (
    <div style={{ overflowY: "auto", overflowX: "hidden" }}>
      {isFetched ? (
        friendsList?.length !== 0 ? (
          friendsList!.map((h, index) => {
            return (
              <DisplayRow
                listType={"friends"}
                hook={setUpdate}
                key={index}
                userModel={h.userModel}
              />
            );
          })
        ) : (
          <span>No friends.</span>
        )
      ) : (
        <div>No friends.</div>
      )}
    </div>
  );
};
