import useBaseUrl from "@docusaurus/useBaseUrl";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import { useColorMode } from "@docusaurus/theme-common";

export default function OpenApiDoc({ url }) {
  const { colorMode } = useColorMode();

  return (
    <div className={`swagger-container`} data-theme={colorMode}>
      <SwaggerUI url={useBaseUrl(`${url}`)} />
    </div>
  );
}
