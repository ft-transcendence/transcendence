import { useState, useEffect } from "react";
import { getUserBlocked } from "../../../queries/userQueries";
import { ItableRow } from "../../../globals/Interfaces";
import { DisplayRow } from "./DisplayRowUsers";

export const BlockedList = () => {
  const [blockedList, setBlockedList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState(false);
  const [isUpdated, setUpdate] = useState(false);

  let blocked: ItableRow[] = [];

  useEffect(() => {
    const fetchData = async () => {
      let fetchedBlocked = await getUserBlocked();

      for (let i = 0; i < fetchedBlocked.length; i++) {
        let newRow: ItableRow = {
          key: i,
          userModel: { username: "", avatar: "", id: 0 },
        };
        newRow.userModel.id = fetchedBlocked[i].id;
        newRow.userModel.username = fetchedBlocked[i].username;
        newRow.userModel.avatar = fetchedBlocked[i].avatar;
        blocked.push(newRow);
      }
      setBlockedList(blocked);
      console.log("blockedList: ", blockedList);
      setFetched(true);
      setUpdate(false);
    };

    fetchData();
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
        <div>No Data available, please reload.</div>
      )}
    </div>
  );
};
