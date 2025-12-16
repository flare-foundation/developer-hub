import React, { Suspense } from "react";
import BrowserOnly from "@docusaurus/BrowserOnly";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { useColorMode } from "@docusaurus/theme-common";
import "swagger-ui-react/swagger-ui.css";

import styles from "./styles.module.css";

const SwaggerUI = React.lazy(() => import("swagger-ui-react"));

export default function OpenApiDoc({ url }: { url: string }) {
  const { colorMode } = useColorMode();
  const resolvedUrl = useBaseUrl(url);

  return (
    <div className={styles.root} data-theme={colorMode}>
      <BrowserOnly fallback={<div>Loading API docs…</div>}>
        {() => (
          <Suspense fallback={<div>Loading API docs…</div>}>
            <SwaggerUI url={resolvedUrl} />
          </Suspense>
        )}
      </BrowserOnly>
    </div>
  );
}
