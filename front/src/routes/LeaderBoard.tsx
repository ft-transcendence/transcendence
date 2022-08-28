import "./LeaderBoard.css"
import { useEffect, useState } from "react";
import { getLeaderBoard } from "../queries/userQueries";

export default function LeaderBoard() {
    const [data, setData] = useState<[]>([]);

    useEffect(() => {
        const updateLeaderBoard = async () => {
            await getLeaderBoard();
        }
        updateLeaderBoard();
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
                                    rank={one.rank}
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

function OneRow({index, id, username, avatar, rank, gamesWon, gamesLost, gamesPlayed, head}
    : { index: number,
        id: number | string,
        username: string,
        avatar: string,
        rank: number,
        gamesWon: number,
        gamesLost: number,
        gamesPlayed: number,
        head: boolean} ) {

        switch(index) {
            case 1:
                return(
                <div className="top first">
                        <div className="top-avatar"></div>
                    <div className="top-info">
                        <div className="top-username">{username}</div>
                        <BadgeReward index={index}/>
                        <div className="top-record">{gamesWon}/{gamesLost}/{gamesPlayed} {(gamesWon / gamesPlayed).toFixed(2)}</div>
                        <div className="top-rank">LV. 2{rank}</div>
                    </div>
                </div>
                );
            case 2:
                return(
                <div className="top second">
                        <div className="top-avatar"></div>
                   <div className="top-info">
                        <div className="top-username">{username}</div>
                        <BadgeReward index={index}/>
                        <div className="top-record">{gamesWon}/{gamesLost}/{gamesPlayed} {(gamesWon / gamesPlayed).toFixed(2)}</div>
                        <div className="top-rank">LV. 2{rank}</div>
                    </div>
                </div>
                );
            case 3:
                return(
                <div className="top third">
                        <div className="top-avatar"></div>
                    <div className="top-info">
                        <div className="top-username">{username}</div>
                        <BadgeReward index={index}/>
                        <div className="top-record">{gamesWon}/{gamesLost}/{gamesPlayed} {(gamesWon / gamesPlayed).toFixed(2)}</div>
                        <div className="top-rank">LV. 1{rank}</div>
                    </div>
                </div>
                );
            default:
                return (
                    <div className="element">
                        <div className="index">#{index}</div>
                        <div className="id">{id}</div>
                        <div className="rank">LV. 0{rank}</div>
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

    function BadgeReward({index}:
        {index: number}) {
        return(
            <div className="badge">
                <div className="top-index">
                    {index}
                </div>
                <svg width="40" height="40" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M472.038 443.917L412.343 279.908C429.649 251.901 439.653 218.926 439.653 183.654C439.653 
                    82.387 357.265 0 255.998 0C154.731 0 72.344 82.387 72.344 183.654C72.344 218.926 82.348 251.901 
                    99.654 279.908L39.959 443.917C34.895 457.838 49.233 471.042 62.704 464.759L133.17 431.9L166.029 
                    502.365C172.32 515.86 191.774 514.966 196.849 501.019L245.625 367.008C249.06 367.201 252.516 367.307 
                    255.998 367.307C259.48 367.307 262.937 367.2 266.371 367.008L315.147 501.019C320.209 514.927 339.66 
                    515.895 345.967 502.365L378.826 431.9L449.292 464.759C462.722 471.021 477.12 457.884 472.038 
                    443.917ZM179.257 451.724L156.377 402.657C152.482 394.308 142.545 390.683 134.189 394.582L85.123 
                    417.462L123.852 311.057C147.484 335.561 177.846 353.526 211.931 361.951L179.257 451.724ZM255.998 
                    333.917C173.143 333.917 105.735 266.509 105.735 183.654C105.735 100.799 173.144 33.392 255.998 
                    33.392C338.852 33.392 406.261 100.8 406.261 183.655C406.261 266.51 338.854 333.917 255.998 
                    333.917ZM377.808 394.58C369.44 390.678 359.511 394.317 355.62 402.655L332.74 451.722L300.065 
                    361.95C334.149 353.524 364.511 335.559 388.143 311.056L426.872 417.461L377.808 394.58Z" fill="white"/>
                </svg>
            </div>
        )
    }