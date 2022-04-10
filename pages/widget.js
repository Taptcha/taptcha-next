import "setimmediate";
import s from "../styles/Widget.module.css";
import Image from "next/image";
import loading from "../public/loading.svg";
import check from "../public/check.svg";
import bruteforce from "../lib/bruteforce";
import React from "react";

function LoadingOrCheck(props) {
  if (props.loading) {
    return (
      <Image src={loading} className={s.taptchaLoading} />
    );
  } else if (props.check) {
    return (
      <Image src={check} className={s.taptchaCheck} />
    );
  }
}

export default class Widget extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      check: false,
      clicked: false,
      error: ""
    };
    
    this.completeCaptcha = this.completeCaptcha.bind(this);
  }

  render() {
    return (
      <div className={s.taptchaBox}>
        <div className={s.taptchaCheck} onClick={!this.state.clicked ? this.completeCaptcha : null}>
          <LoadingOrCheck loading={this.state.loading} check={this.state.check} />
        </div>

        <p>I&apos;m not a bot</p>

        <p className={s.taptchaBranding}>Powered by<br />Taptcha</p>
        <p className={s.taptchaError}>{this.state.error}</p>
      </div>
    );
  }

  async completeCaptcha() {
    this.setState({ loading: true, clicked: true });
    
    let puzzleRequest;
    try { puzzleRequest = await fetch("/api/taptcha/puzzle", { headers: { "Cache-Control": "no-cache" } }); }
    catch { this.setState({ error: "Failed to fetch puzzle" }); return; }
    const puzzleResponse = await puzzleRequest.json();
    const { puzzle } = puzzleResponse;

    const answer = await bruteforce(puzzle, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", 3);

    let tokenRequest;
    try { tokenRequest = await fetch(`/api/taptcha/token?puzzle=${encodeURIComponent(puzzle)}&answer=${encodeURIComponent(answer)}`, { headers: { "Cache-Control": "no-cache" } }); }
    catch { this.setState({ error: "Failed to fetch token" }); return; }
    const tokenResponse = await tokenRequest.json();
    const { passed, token } = tokenResponse;

    if (passed) {
      this.setState({ check: true, loading: false });
      console.log(token);
    } else {
      this.setState({ error: "An error occured" });
    }
  }
}