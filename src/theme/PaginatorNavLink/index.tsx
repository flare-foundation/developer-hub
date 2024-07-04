import React from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import type { Props } from "@theme/PaginatorNavLink";
import styles from "./styles.module.css";

export default function PaginatorNavLink(props: Props): JSX.Element {
  const { permalink, title, subLabel, isNext } = props;
  return (
    <Link
      className={clsx(
        "pagination-nav__link",
        isNext ? "pagination-nav__link--next" : "pagination-nav__link--prev",
      )}
      to={permalink}
    >
      {subLabel && (
        <div
          className={clsx(
            styles.subLabel,
            isNext ? styles.nextSubLabel : styles.prevSubLabe,
          )}
        >
          {!isNext && (
            <svg
              style={{ transform: "rotate(180deg)", marginBottom: 4 }}
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.627 8.75H0.5V7.25H12.627L6.93075 1.55375L8 0.5L15.5 8L8 15.5L6.93075 14.4462L12.627 8.75Z"
                fill="currentColor"
              />
            </svg>
          )}
          <div className="pagination-nav__sublabel">{subLabel}</div>
          {isNext && (
            <svg
              style={{ marginBottom: 4 }}
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.627 8.75H0.5V7.25H12.627L6.93075 1.55375L8 0.5L15.5 8L8 15.5L6.93075 14.4462L12.627 8.75Z"
                fill="currentColor"
              />
            </svg>
          )}
        </div>
      )}
      <div className={styles.title}>{title}</div>
    </Link>
  );
}
