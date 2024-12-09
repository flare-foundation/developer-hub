import React from "react";
import classes from "./contentToinbox.module.css";
export default function ContentToInbox() {
  return (
    <div className={classes.container}>
      <form className={classes.formcontainer}>
        <p className={classes.textstyle}>
          Get the Flare Network latest content straight to your inbox
        </p>
        <div className={classes.elementcontainer}>
          <input
            className={classes.inputstyle}
            type="email"
            id="email"
            name="email"
            required
            placeholder="Enter your email address"
          ></input>
          <button className={classes.buttonstyle} type="submit">
            Subscribe now
          </button>
        </div>
      </form>
    </div>
  );
}
