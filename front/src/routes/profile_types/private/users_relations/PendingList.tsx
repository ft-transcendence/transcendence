import { useContext, useState, useEffect } from "react";
import { UsersStatusCxt } from "../../../../App";
import { ItableRow, IUserStatus } from "../../../../globals/Interfaces";
import { getUserAvatarQuery } from "../../../../queries/avatarQueries";
import { getUserPending } from "../../../../queries/userQueries";
import { DisplayRow } from "./DisplayRowUsers";

export const PendingList = () => {
  const usersStatus = useContext(UsersStatusCxt);

  const [pendingList, setPendingList] = useState<ItableRow[] | undefined>(
    undefined
  );

  const [isFetched, setFetched] = useState("false");
  const [isUpdated, setUpdate] = useState(false);

  let pending: ItableRow[] = [];

  useEffect(() => {
    const fetchDataPending = async () => {
      return await getUserPending();
    };

    const fetchDataPendingAvatar = async (otherId: number) => {
      return await getUserAvatarQuery(otherId);
    };

    const fetchData = async () => {
      let fetchedPending = await fetchDataPending();

      if (fetchedPending !== undefined && fetchedPending.length !== 0) {
        for (let i = 0; i < fetchedPending.length; i++) {
          let newRow: ItableRow = {
            key: i,
            userModel: { username: "", avatar: "", id: 0, status: 0 },
          };
          newRow.userModel.id = fetchedPending[i].id;
          newRow.userModel.username = fetchedPending[i].username;
          let found = undefined;
          if (usersStatus) {
            found = usersStatus.find(
              (x: IUserStatus) => x.key === fetchedPending[i].id
            );
            if (found) newRow.userModel.status = found.userModel.status;
          }

          let avatar = await fetchDataPendingAvatar(fetchedPending[i].id);

          if (avatar !== undefined && avatar instanceof Blob) {
            newRow.userModel.avatar = URL.createObjectURL(avatar);
          }
          pending.push(newRow);
        }
      }
      setPendingList(pending);
      setFetched("true");
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdated, usersStatus]);

  return (
    <div style={{ overflowY: "auto", overflowX: "hidden" }}>
      {isFetched === "true" ? (
        pendingList?.length !== 0 ? (
          pendingList!.map((h, index) => {
            return (
              <DisplayRow
                listType={"pending"}
                hook={setUpdate}
                state={isUpdated}
                key={index}
                userModel={h.userModel}
              />
            );
          })
        ) : (
          <span>No friend requests.</span>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

//isFetched === "error" to add
