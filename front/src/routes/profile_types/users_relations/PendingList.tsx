import { useState, useEffect } from "react";
import { getUserFriends } from "../../../queries/userQueries";
import { ItableRow } from "../../../globals/Interfaces";
import { DisplayRow } from "./DisplayRowUsers";

export const PendingList = () => {
  const [pendingList, setPendingList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState(false);
  const [isUpdated, setUpdate] = useState(false);

  let pending: ItableRow[] = [];

  useEffect(() => {
    const fetchData = async () => {
      let fetchedPending = await getUserFriends(); ////// GET PENDING

      for (let i = 0; i < fetchedPending.length; i++) {
        let newRow: ItableRow = {
          key: i,
          userModel: { username: "", avatar: "", id: 0 },
        };
        newRow.userModel.id = fetchedPending[i].id;
        newRow.userModel.username = fetchedPending[i].username;
        newRow.userModel.avatar = fetchedPending[i].avatar;
        pending.push(newRow);
      }
      setPendingList(pending);
      console.log("pendingList: ", pendingList);
      setFetched(true);
      setUpdate(false);
    };

    fetchData();
  }, [isFetched, isUpdated]);

  return (
    <div style={{ overflowY: "auto", overflowX: "hidden" }}>
      {isFetched ? (
        pendingList!.map((h, index) => {
          return (
            <DisplayRow
              listType={"pending"}
              hook={setUpdate}
              key={index}
              userModel={h.userModel}
            />
          );
        })
      ) : (
        <div>No Data available, please reload.</div>
      )}
    </div>
  );
};
