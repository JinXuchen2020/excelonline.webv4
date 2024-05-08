import { Button, Upload } from "antd";
import { FunctionComponent } from "react";
import { UniverSheetRef } from "./ExcelEditor";
import * as Excel from 'exceljs';
import { Transformer } from "../toExcel";

export const ExcelExport : FunctionComponent<{workbook: UniverSheetRef | null}> = ({workbook}) => { 
  const handleClick = async ()=> 
  {
    const data = workbook?.getData();
    if(!data) return;
    const excelFile: Excel.Workbook = Transformer.transform(data);
    const buffer = await excelFile.xlsx.writeBuffer();
    Transformer.saveFile(buffer, '工作表');
  }

  return (
    <Button type="primary" onClick={handleClick}>导出</Button>
  );
}