import {
  CommandType,
  ICommandService,
  IUniverInstanceService,
  Plugin,
  UniverInstanceType,
  Workbook,
} from "@univerjs/core";
import {
  ComponentManager,
  IMenuService,
  MenuGroup,
  MenuItemType,
  MenuPosition,
} from "@univerjs/ui";
import { IAccessor, Inject, Injector } from "@wendellhu/redi";
import { SaveSingle } from "@univerjs/icons";

/**
 * Export Excel Button Plugin
 */
class SaveExcelButton extends Plugin {
  static override pluginName = "Save Excel Plugin";
  static override type = UniverInstanceType.UNIVER_SHEET;
  constructor(
    // inject injector, required
    @Inject(Injector) override readonly _injector: Injector,
    // inject menu service, to add toolbar button
    @Inject(IMenuService) private menuService: IMenuService,
    // inject command service, to register command handler
    @Inject(ICommandService) private readonly commandService: ICommandService,
    // inject component manager, to register icon component
    @Inject(ComponentManager)
    private readonly componentManager: ComponentManager
  ) {
    // plugin id
    super();
  }

  /**
   * The first lifecycle of the plugin mounted on the Univer instance,
   * the Univer business instance has not been created at this time.
   * The plugin should add its own module to the dependency injection system at this lifecycle.
   * It is not recommended to initialize the internal module of the plugin outside this lifecycle.
   */
  onStarting() {
    // register icon component
    this.componentManager.register("SaveSingle", SaveSingle);

    const buttonId = "save-excel-button";

    const menuItem = {
      id: buttonId,
      title: "Save Excel",
      tooltip: "Save Excel",
      icon: "SaveSingle", // icon name
      type: MenuItemType.BUTTON,
      group: MenuGroup.CONTEXT_MENU_DATA,
      positions: [MenuPosition.TOOLBAR_START],
    };
    this.menuService.addMenuItem(menuItem);

    const command = {
      type: CommandType.OPERATION,
      id: buttonId,
      handler: (accessor: IAccessor) => {
        // inject univer instance service
        const univer = accessor.get(IUniverInstanceService);
        //const commandService = accessor.get(ICommandService);
        // get current sheet
        const workbook = univer.getCurrentUnitForType<Workbook>(UniverInstanceType.UNIVER_SHEET)!;

        const data = workbook.save();
        console.log(data);
        return true;
      },
    };
    this.commandService.registerCommand(command);
  }
}

export default SaveExcelButton;
