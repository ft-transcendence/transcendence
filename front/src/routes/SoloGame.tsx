import React from "react";
import "./Game.css";
import {
  Coordinates,
  PaddleProps,
  StatePaddle,
  SettingsProps,
  SettingsState,
  StateSoloPong,
  MsgSolo,
  MsgSoloState,
  SoloButtonState,
  SoloButtonProps,
  PropsSoloPong,
} from "./game.interfaces";
import FocusTrap from "focus-trap-react";
import { getAvatarQuery } from "../queries/avatarQueries";

class Settings extends React.Component<SettingsProps, SettingsState> {
  constructor(props: SettingsProps) {
    super(props);
    this.state = { message: this.props.message };
  }

  static getDerivedStateFromProps(props: SettingsProps, state: SettingsState) {
    return { message: props.message };
  }

  render() {
    return (
      <FocusTrap>
        <aside
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          className="modal-settings"
          onKeyDown={(event) => {
            this.props.onKeyDown(event);
          }}
        >
          <div className="modal-text">
            Press key for moving {this.state.message}
          </div>
          <button
            onClick={() => {
              this.props.onClickClose();
            }}
            className="closeButton"
          >
            X
          </button>
        </aside>
      </FocusTrap>
    );
  }
}

class Message extends React.Component<MsgSolo, MsgSoloState> {
  constructor(props: MsgSolo) {
    super(props);
    this.state = { showMsg: false, type: 0, score: 0 };
  }

  static getDerivedStateFromProps(props: MsgSolo, state: MsgSoloState) {
    return {
      showMsg: props.showMsg,
      type: props.type,
      score: props.score,
    };
  }

  render() {
    const disp = this.state.showMsg ? "unset" : "none";
    var message: string;
    switch (this.state.type) {
      case 1:
        message = "Score: " + this.state.score.toString();
        break;
      default:
        message = "error";
    }
    return (
      <div style={{ display: `${disp}` }} className="Message">
        {message}
      </div>
    );
  }
}

class SoloButton extends React.Component<SoloButtonProps, SoloButtonState> {
  constructor(props: SoloButtonProps) {
    super(props);
    this.state = { showButton: true, buttonText: "Play again" };
  }

  static getDerivedStateFromProps(
    props: SoloButtonProps,
    state: SoloButtonState
  ) {
    return {
      showButton: props.showButton,
      buttonText: props.buttonText,
    };
  }

  render() {
    const btt = this.state.showButton ? "unset" : "none";
    return (
      <button
        onClick={this.props.clickHandler}
        style={{ display: `${btt}` }}
        className="Start_button"
      >
        {this.state.buttonText}
      </button>
    );
  }
}

class Ball extends React.Component<Coordinates, {}> {
  render() {
    const show = this.props.showBall ? "unset" : "none";
    return (
      <div
        style={{
          top: `calc(${this.props.y}% - 1vh)`,
          left: `calc(${this.props.x}% - 1vh)`,
          display: `${show}`,
        }}
        className={"Ball"}
      />
    );
  }
}

class Paddle extends React.Component<PaddleProps, StatePaddle> {
  constructor(props: PaddleProps) {
    super(props);
    this.state = { side: props.side, y: props.ystart, show: props.show };
  }

  componentWillReceiveProps(props: PaddleProps) {
    this.setState({ y: props.y });
  }

  render() {
    const show = this.props.show ? "unset" : "none";
    return (
      <div
        style={{
          display: `${show}`,
          top: `${this.state.y}%`,
        }}
        className="Pad-left"
      />
    );
  }
}

export default class SoloGame extends React.Component<
  PropsSoloPong,
  StateSoloPong
> {
  interval: NodeJS.Timer;
  refreshRate = 10;
  ballSpeed = 0.25;
  paddleSpeed = 1;
  lock = 0;
  speedX = this.ballSpeed;
  speedY = 1;
  xBall = 50;
  yBall = 50;
  yPaddle = 50;
  paddleDir = 0;

  MOVE_UP = "ArrowUp";
  MOVE_DOWN = "ArrowDown";

  constructor(props: PropsSoloPong) {
    super(props);
    this.state = {
      paddleLeftY: 50,
      ballX: 50,
      ballY: 50,
      gameStarted: true,
      player1Score: 0,
      player1Name: localStorage.getItem("userName")!,
      isSettingsShown: false,
      settingsState: "up",
      avatarP1URL: "",
    };
    this.onSettingsKeyDown = this.onSettingsKeyDown.bind(this);
    this.onSettingsClickClose = this.onSettingsClickClose.bind(this);
    this.startGame = this.startGame.bind(this);
    this.initBall();
    this.getAvatars();
    this.interval = setInterval(() => {
      this.gameLoop();
    }, this.refreshRate);
  }

  componentDidMount() {
    document.onkeydown = this.keyDownInput;
    document.onkeyup = this.keyUpInput;
  }

  keyDownInput = (e: KeyboardEvent) => {
    if (e.key === this.MOVE_UP && this.state.gameStarted) {
      e.preventDefault();
      this.paddleDir = 1;
    }
    if (e.key === this.MOVE_DOWN) {
      e.preventDefault();
      this.paddleDir = 2;
    }
  };

  keyUpInput = (e: KeyboardEvent) => {
    if (
      (e.key === this.MOVE_UP || e.key === this.MOVE_DOWN) &&
      this.state.gameStarted
    ) {
      e.preventDefault();
      this.paddleDir = 0;
    }
  };

  onSettingsKeyDown = (e: KeyboardEvent) => {
    if (this.state.settingsState === "up") {
      this.setState({ settingsState: "down" });
      this.MOVE_UP = e.key;
    } else if (this.state.settingsState! === "down") {
      this.setState({ isSettingsShown: false, settingsState: "up" });
      this.MOVE_DOWN = e.key;
    }
  };

  onSettingsClickClose() {
    this.setState({ isSettingsShown: false, settingsState: "up" });
  }

  showSettings() {
    this.setState({ isSettingsShown: true });
  }

  getAvatars = async () => {
    const result_1: undefined | string | Blob | MediaSource =
      await getAvatarQuery();
    if (result_1 !== undefined && result_1 instanceof Blob) {
      this.setState({ avatarP1URL: URL.createObjectURL(result_1) });
    } else if (result_1 === "error")
      this.setState({
        avatarP1URL:
          "https://img.myloview.fr/stickers/default-avatar-profile-in-trendy-style-for-social-media-user-icon-400-228654852.jpg",
      });
  };

  async startGame() {
    this.initBall();
    this.yPaddle = 50;
    this.paddleDir = 0;
    this.setState({ gameStarted: true, player1Score: 0 });
    this.interval = setInterval(() => {
      this.gameLoop();
    }, this.refreshRate); // create game loop
  }

  initBall() {
    this.setState({ ballX: 50 });
    this.setState({ ballY: 50 });
    this.ballSpeed = 0.25;
    this.xBall = 50;
    this.yBall = 50;
    this.speedX = this.ballSpeed * -1;
    this.speedY = 0.15 + Math.random() * this.ballSpeed;
    let direction = Math.round(Math.random());
    if (direction) this.speedY = this.speedY * -1;
  }

  async gameLoop() {
    if (this.lock === 0) {
      this.lock = 1;
      this.updateBall();
      this.updatePaddle();
      if (this.state.gameStarted === false) clearInterval(this.interval);
      this.setState(
        { ballX: this.xBall, ballY: this.yBall, paddleLeftY: this.yPaddle },
        () => (this.lock = 0)
      );
    }
    return;
  }

  updateBall() {
    this.xBall += this.speedX;
    this.yBall += this.speedY;

    // game windows is 16/9 format - so 1.77, ball radius is 1vh

    // ball collision with floor or ceilling
    if (this.yBall > 98) {
      this.yBall = 98;
      this.speedY *= -1;
    }
    if (this.yBall < 2) {
      this.yBall = 2;
      this.speedY *= -1;
    }

    // ball collision with left paddle (paddle position is 3% from the border, paddle height is 10% of the game windows)
    // ball radius is 1vh
    if (
      this.xBall <= 3 + 2 / 1.77 &&
      this.yBall >= this.yPaddle - 1 &&
      this.yBall <= this.yPaddle + 11
    ) {
      this.speedX *= -1;
      this.speedY = ((this.yBall - this.yPaddle - 5) / 6) * this.ballSpeed;
      this.xBall = 3 + 2 / 1.77;
    }
    if (this.xBall >= 98) {
      this.ballSpeed = this.ballSpeed * 1.1;
      this.speedX *= -1.1;
      this.speedY *= 1.1;

      this.setState({ player1Score: this.state.player1Score + 1 });
    }
    if (this.xBall <= 0 - 2 / 1.77) {
      this.setState({ gameStarted: false });
    }
  }

  updatePaddle() {
    if (this.paddleDir === 1) {
      this.yPaddle -= this.paddleSpeed;
      if (this.yPaddle < 0) this.yPaddle = 0;
    } else if (this.paddleDir === 2) {
      this.yPaddle += this.paddleSpeed;
      if (this.yPaddle > 90) this.yPaddle = 90;
    }
  }

  render() {
    const shoWInfo = this.state.gameStarted ? "flex" : "none";
    const showBorder = this.state.gameStarted
      ? "2px solid rgb(255, 255, 255)"
      : "0px solid rgb(255, 255, 255)";
    const showShadow = "0";

    var leftName = String(this.state.player1Name);

    return (
      <div className="Radial-background">
        <div className="Page-top">
          <div style={{ display: `${shoWInfo}` }} className="Info-card">
            <div className="Player-left">
              <div className="Info">
                {this.state.avatarP1URL ? (
                  <div
                    className="Photo"
                    style={{
                      backgroundImage: `url("${this.state.avatarP1URL}")`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                ) : (
                  <div className="Photo"></div>
                )}
                <div className="Login" style={{ textAlign: "left" }}>
                  {leftName}
                </div>
              </div>
              <div className="Score">{this.state.player1Score}</div>
            </div>
          </div>
        </div>
        <div className="Page-mid">
          <div
            style={{ border: `${showBorder}`, boxShadow: `${showShadow}` }}
            className="Field"
          >
            <Paddle
              show={this.state.gameStarted}
              side={"left"}
              y={this.state.paddleLeftY}
              ystart={this.state.paddleLeftY}
            />

            <div className="Center-zone" style={{ display: `${shoWInfo}` }}>
              <div className="Middle-line-top"></div>
              <div className="Center-circle"></div>
              <div className="Middle-line-bottom"></div>
            </div>

            <div className="Pad-right"></div>

            <Ball
              showBall={this.state.gameStarted}
              x={this.state.ballX}
              y={this.state.ballY}
            />
          </div>
        </div>
        <div className="Button-msg-zone">
          <Message
            showMsg={!this.state.gameStarted}
            type={1}
            score={this.state.player1Score}
          />
          <SoloButton
            showButton={!this.state.gameStarted}
            clickHandler={this.startGame}
            buttonText="Play again"
          />
          <SoloButton
            showButton={!this.state.gameStarted}
            clickHandler={this.props.clickHandler}
            buttonText="Quit"
          />
        </div>
        <div>
          {this.state.isSettingsShown ? (
            <Settings
              message={this.state.settingsState!}
              onKeyDown={this.onSettingsKeyDown}
              onClickClose={this.onSettingsClickClose}
            />
          ) : null}
        </div>
        <div className="Page-foot">
          <div className="bar"></div>
          <div className="innerFoot">
            <div className="Button" onClick={() => this.showSettings()}>
              Settings
            </div>
            <div className="Button" onClick={() => this.props.clickHandler()}>
              Quit
            </div>
          </div>
        </div>
      </div>
    );
  }
}
