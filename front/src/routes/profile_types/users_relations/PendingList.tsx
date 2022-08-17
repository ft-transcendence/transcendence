import { useState, useEffect } from "react";
import { getUserPending } from "../../../queries/userQueries";
import { ItableRow } from "../../../globals/Interfaces";
import { DisplayRow } from "./DisplayRowUsers";
import { getUserAvatarQuery } from "../../../queries/avatarQueries";

export const PendingList = () => {
  const [PendingList, setPendingList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState(false);
  const [isUpdated, setUpdate] = useState(false);

  let pending: ItableRow[] = [];

  useEffect(() => {
    const fetchDataPending = async () => {
      return await getUserPending();
    };

    const fetchDataPendingAvatar = async (otherId: number) => {
      console.log("id? ", otherId);
      return await getUserAvatarQuery(otherId);
    };

    const fetchData = async () => {
      let fetchedPending = await fetchDataPending();

      if (fetchedPending.length !== 0) {
        for (let i = 0; i < fetchedPending.length; i++) {
          let newRow: ItableRow = {
            key: i,
            userModel: { username: "", avatar: "", id: 0 },
          };

          let avatar = await fetchDataPendingAvatar(fetchedPending[i].id);

          newRow.userModel.id = fetchedPending[i].id;
          newRow.userModel.username = fetchedPending[i].username;
          if (avatar !== undefined && avatar instanceof Blob) {
            newRow.userModel.avatar = URL.createObjectURL(avatar);
          }
          pending.push(newRow);
        }
      }
      setPendingList(pending);
      if (fetchedPending.length !== 0) console.log("pendingList", PendingList);
      setFetched(true);
      setUpdate(false);
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, isUpdated]);

  return (
    <div style={{ overflowY: "auto", overflowX: "hidden" }}>
      {isFetched ? (
        PendingList?.length !== 0 ? (
          PendingList!.map((h, index) => {
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
          <span>No pending invites.</span>
        )
      ) : (
        <div>No pending invites.</div>
      )}
    </div>
  );
};
