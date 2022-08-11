import "./LeaderBoard.css"
import { useEffect, useState } from "react";

export default function LeaderBoard() {
    const [data, setData] = useState<[]>([]);

    useEffect(() => {
        setData(JSON.parse(localStorage.getItem("leaderBoard")!));
    }, [])

    return (
        <div className="background">
            <div className="leardboard-logo">
                <b>L<span>ea</span>d<span>e</span><span>r</span>  </b>
                <b>B<span>oa</span>r<span>d</span></b>
            </div>
            <div className="block"/>
            <div className="leaderboard">
                <div className="list">
                    {
                        data?.map((one:any, index) => {
                            return( 
                            <div key={index}>
                                <OneRow
                                    index={index + 1}
                                    id={one.id}
                                    avatar={one.avatar}
                                    username={one.username}
                                    gamesWon={one.gamesWon}
                                    gamesLost={one.gamesLost}
                                    gamesPlayed={one.gamesPlayed}
                                    head={false}
                                />
                            </div>
                        )})
                    }
                </div>
            </div>
        </div>
    )
}

function OneRow({index, id, username, avatar, gamesWon, gamesLost, gamesPlayed, head}
    : { index: number,
        id: number | string,
        username: string,
        avatar: string,
        gamesWon: number,
        gamesLost: number,
        gamesPlayed: number,
        head: boolean} ) {

        switch(index) {
            case 1:
                return(
                <div className="rank rank-1">
                        <div className="top-avatar"></div>
                    <div className="top-info">
                        <div className="top-username">{username}</div>
                        <div className="top-record">{gamesWon}/{gamesLost}/{gamesPlayed}</div>
                        <div className="top-rate">{(gamesWon / gamesPlayed).toFixed(2)}</div>
                    </div>
                </div>
                );
            case 2:
                return(
                <div className="rank rank-2">
                        <div className="top-avatar"></div>
                   <div className="top-info">
                        <div className="top-username">{username}</div>
                        <div className="top-record">{gamesWon}/{gamesLost}/{gamesPlayed}</div>
                        <div className="top-rate">{(gamesWon / gamesPlayed).toFixed(2)}</div>
                    </div>
                </div>
                );
            case 3:
                return(
                <div className="rank rank-3">
                        <div className="top-avatar"></div>
                    <div className="top-info">
                        <div className="top-username">{username}</div>
                        <div className="top-record">{gamesWon}/{gamesLost}/{gamesPlayed}</div>
                        <div className="top-rate">{(gamesWon / gamesPlayed).toFixed(2)}</div>
                    </div>
                </div>
                );
            default:
                return (
                    <div className="element">
                        <div className="rank">#{index}</div>
                        <div className="id">{id}</div>
                        <div className="user">
                            {!head ? <div className="avatar">{avatar}</div> : <></>}
                            
                            <div className="username">{username}</div>
                        </div>
                        <div className="record">
                            {gamesWon}/{gamesLost}/{gamesPlayed}
                        </div>
                        <div className="rate">
                            {(gamesWon / gamesPlayed).toFixed(2)}
                        </div>
                    </div>
                )
        }
    }