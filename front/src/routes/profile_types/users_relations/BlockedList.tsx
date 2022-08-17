import { useState, useEffect } from "react";
import { getUserBlocked } from "../../../queries/userQueries";
import { ItableRow } from "../../../globals/Interfaces";
import { DisplayRow } from "./DisplayRowUsers";
import { getUserAvatarQuery } from "../../../queries/avatarQueries";

export const BlockedList = () => {
  const [blockedList, setBlockedList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState(false);
  const [isUpdated, setUpdate] = useState(false);

  let blocked: ItableRow[] = [];

  useEffect(() => {
    const fetchDataBlocked = async () => {
      return await getUserBlocked();
    };

    const fetchDataBlockedAvatar = async (otherId: number) => {
      console.log("id? ", otherId);
      return await getUserAvatarQuery(otherId);
    };

    const fetchData = async () => {
      let fetchedBlocked = await fetchDataBlocked();

      if (fetchedBlocked.length !== 0) {
        for (let i = 0; i < fetchedBlocked.length; i++) {
          let newRow: ItableRow = {
            key: i,
            userModel: { username: "", avatar: "", id: 0 },
          };

          let avatar = await fetchDataBlockedAvatar(fetchedBlocked[i].id);

          newRow.userModel.id = fetchedBlocked[i].id;
          newRow.userModel.username = fetchedBlocked[i].username;
          if (avatar !== undefined && avatar instanceof Blob) {
            newRow.userModel.avatar = URL.createObjectURL(avatar);
          }
          blocked.push(newRow);
        }
      }
      setBlockedList(blocked);
      if (fetchedBlocked.length !== 0) console.log("blockedList", blockedList);
      setFetched(true);
      setUpdate(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, isUpdated]);

  return (
    <div style={{ overflowY: "auto", overflowX: "hidden" }}>
      {isFetched ? (
        blockedList?.length !== 0 ? (
          blockedList!.map((h, index) => {
            return (
              <DisplayRow
                listType={"blocked"}
                hook={setUpdate}
                key={index}
                userModel={h.userModel}
              />
            );
          })
        ) : (
          <span>No blocked users.</span>
        )
      ) : (
        <div>No blocked users.</div>
      )}
    </div>
  );
};
