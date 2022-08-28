import { Tooltip } from "react-bootstrap";

export const renderTooltip = (text: string) => (
  <Tooltip id="button-tooltip">{text}</Tooltip>
);
