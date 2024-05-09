import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";

import {
  IWorkbookData,
  Univer,
  UniverInstanceType,
  Workbook,
} from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import SaveExcelButton from "../plugins/SaveExcelButton";

export interface UniverSheetRef {
  getData: () => IWorkbookData;
}
// eslint-disable-next-line react/display-name
export const UniverSheet = forwardRef<
  UniverSheetRef,
  { data: IWorkbookData; style?: React.CSSProperties }
>(({ data, style }, ref) => {
  const univerRef = useRef<Univer | null>(null);
  // const univerApiRef = useRef<FUniver | null>(null);
  const workbookRef = useRef<Workbook | null>(null);
  const containerRef = useRef(null);

  useImperativeHandle(
    ref,
    () =>
      ({
        getData,
      } as UniverSheetRef),
    []
  );

  /**
   * Initialize univer instance and workbook instance
   * @param data {IWorkbookData} document see https://univer.work/api/core/interfaces/IWorkbookData.html
   */
  const init = (data: IWorkbookData) => {
    if (!containerRef.current) {
      throw Error("container not initialized");
    }
    const univer = new Univer({
      theme: defaultTheme,
    });
    univerRef.current = univer;
    // univerApiRef.current = FUniver.newAPI(univer);

    // core plugins
    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);
    univer.registerPlugin(UniverUIPlugin, {
      container: containerRef.current,
      header: true,
      //toolbar: true,
      footer: true,
    });

    // doc plugins
    univer.registerPlugin(UniverDocsPlugin, {
      hasScroll: false,
    });
    univer.registerPlugin(UniverDocsUIPlugin);

    // sheet plugins
    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin);

    univer.registerPlugin(SaveExcelButton);

    // create workbook instance
    workbookRef.current = univer.createUnit<IWorkbookData, Workbook>(
      UniverInstanceType.UNIVER_SHEET,
      data
    );
  };

  /**
   * Destroy univer instance and workbook instance
   */
  const destroyUniver = () => {
    univerRef.current?.dispose();
    univerRef.current = null;
    workbookRef.current = null;
  };

  /**
   * Get workbook data
   */
  const getData = () => {
    if (!workbookRef.current) {
      throw new Error("Workbook is not initialized");
    }

    return workbookRef.current.save();
  };

  useEffect(() => {
    init(data);
    return () => {
      destroyUniver();
    };
  }, [data]);

  return <div ref={containerRef} className="univer-container" style={style} />;
});
