import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { Select, Space } from "antd";
import { DEFAULT_WORKBOOK_DATA } from "./assets/default-workbook-data";
import {
  ExcelExport,
  ExcelImport,
  UniverSheet,
  UniverSheetRef,
} from "./components";
import { getAllWorkOrders, getWorkOrders } from "./utils/api";
import { useWeChatLogin } from "./hooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import queryString from 'query-string';
import { IWorkbookData } from "@univerjs/core";

const App: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<IWorkbookData>(DEFAULT_WORKBOOK_DATA);
  const univerRef = useRef<UniverSheetRef | null>(null);
  const [searchParams, ] = useSearchParams();
  const { isLoggedIn, userInfo, handleLogin, handleTempLogin} = useWeChatLogin();

  useEffect(() => {
    if (!isLoggedIn) {
      const { code } = queryString.parse(searchParams.toString())
      if(code === undefined) {
        // navigate('/login')
      }
      else {
        handleLogin(code as string).then(() => {
          navigate('/');
        });
      }
    }
    else {
      const { nickname } = userInfo
      if (nickname === "主任") {
        getAllWorkOrders("123456").then((res) => {
          if (res.status === 200) {
            res.json().then((json) => {
              setData(json.data);
            });
          }
        });
      }
      else {
        getWorkOrders(nickname, "123456").then((res) => {
          if (res.status === 200) {
            res.json().then((json) => {
              setData(json.data);
            });
          }
        });
      }
    }    
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div className="topBar">
        <Space>
          <ExcelImport callback={setData} />
          <ExcelExport workbook={univerRef.current} />
          <Select onChange={(value) => handleTempLogin(value)}>
            <Select.Option value="用户1">用户1</Select.Option>
            <Select.Option value="用户2">用户2</Select.Option>
            <Select.Option value="用户3">用户3</Select.Option>
            <Select.Option value="主任">车间主任</Select.Option>
          </Select>
        </Space>
      </div>
      <UniverSheet style={{ flex: 1 }} ref={univerRef} data={data} />
    </div>
  );
};

export default App;
