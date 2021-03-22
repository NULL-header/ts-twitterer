import React, { memo, useState, useCallback } from "react";
import { ListForm } from "./ListForm";
import { ToolButton } from "./ToolButton";
import { ToolDetail } from "./ToolDetail";

export const ToolContainer = memo(() => {
  const [toolDetail, setDetail] = useState(new ToolDetail());
  const closeList = useCallback(
    () => setDetail((detail) => detail.set("listTool", false)),
    [],
  );
  return (
    <>
      <ListForm isOpen={toolDetail.listTool} onClose={closeList} />
      <ToolButton setDetail={setDetail} />
    </>
  );
});
ToolContainer.displayName = "ToolContainer";
