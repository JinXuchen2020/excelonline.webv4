import React, { useRef, useState } from "react";
import "./App.css";
import { Space } from "antd";
import { DEFAULT_WORKBOOK_DATA } from "./assets/default-workbook-data";
import {
  ExcelExport,
  ExcelImport,
  UniverSheet,
  UniverSheetRef,
} from "./components";

const App: React.FC = () => {
  const [data, setData] = useState(DEFAULT_WORKBOOK_DATA);
  const univerRef = useRef<UniverSheetRef | null>(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="topBar">
        <Space>
          <ExcelImport callback={setData} />
          <ExcelExport workbook={univerRef.current} />
        </Space>
      </div>
      <UniverSheet style={{ flex: 1 }} ref={univerRef} data={data} />
    </div>
  );
};

export default App;
