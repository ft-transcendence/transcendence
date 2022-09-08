import "./chat_modes/card.css";
import { useEffect, useState } from "react";
import { socket } from "../App"
import { useNavigate } from "react-router-dom";
import { Player } from "./game.interfaces";
import { getUserAvatarQuery } from "../queries/avatarQueries";
import { gameInvitation } from "./chat_modes/type/chat.type";

export function GameRequestCard({game, gameRequest, onGameRequest}
    : { game: gameInvitation | undefined,
        gameRequest: boolean,
        onGameRequest: () => void}) {
            
    const navigate = useNavigate();
    const [avatarURL, setAvatarURL] = useState("");

    useEffect(() => {
        if (game)
        {
            const getAvatar = async () => {
                const result: undefined | string | Blob | MediaSource =
                    await getUserAvatarQuery(game!.inviterId);
        
                if (result !== undefined && result instanceof Blob) {
                    setAvatarURL(URL.createObjectURL(result));
                }
            }
            getAvatar();
        }
      }, [game]);

    const joinGame = () => {
        socket.emit("join_private", {roomId: game!.gameInfo.roomId}, (player: Player) =>{
            if (player.roomId !== undefined && player.playerNb !== undefined) { 
                localStorage.setItem("roomid", player.roomId.toString());
                localStorage.setItem("playernb", player.playerNb.toString());
                onGameRequest();
                navigate("/app/privateGame");
            }
            else 
            {
                socket.disconnect();
                socket.connect();
                onGameRequest();
            }
        });
    }

    const declineGame = () => {
        socket.disconnect();
        socket.connect();
        socket.emit("decline game", (game));
        onGameRequest();
    }
    
    return (
        <>
            <div className="card-chat">
                <div className="card-chat-title">GAME INVITATION</div>
                <div className="flex-block"/>
                <div style={{flex: "6"}}>
                    <div className="challenger-avatar"
                            style={{backgroundImage: `url("${avatarURL}")`,
                            backgroundSize: "cover",
                            backgroundPosition: "center"}}/>
                    <div className="text">{game?.inviterName}</div>
                    <div className="text">invited you to a game</div>
                </div>
                <div style={{display: "flex", flex: "3"}}>
                    <div className="join-button"
                        onClick={joinGame}>
                        JOIN</div>
                    <div className="decline-button"
                        onClick={declineGame}>
                        DECLINE</div>
                </div>
            </div>
        </>
    )
}