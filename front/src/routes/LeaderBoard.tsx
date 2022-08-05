import { useEffect, useState } from "react";

export default function LeaderBoard() {
    const [data, setData] = useState([]);
    console.log("data:::", data)
    useEffect(() => {
        setData(JSON.parse(localStorage.getItem("leaderBoard")!));
    }, [])
    return (
        <>
            {
                data?.map((one, index) => {
                    return( 
                    <div key={index}>
                        {JSON.stringify(one)}<br/>
                    </div>
                )})
            }
        </>
    )
}