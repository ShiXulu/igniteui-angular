import {
    AfterContentInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ContentChild,
    ContentChildren,
    Input,
    QueryList,
    TemplateRef,
    forwardRef,
    AfterViewInit
} from '@angular/core';
import { DataType } from '../data-operations/data-util';
import { IgxTextHighlightDirective } from '../directives/text-highlight/text-highlight.directive';
import { IgxGridAPIService } from './api.service';
import { IgxGridCellComponent } from './cell.component';
import { IgxDateSummaryOperand, IgxNumberSummaryOperand, IgxSummaryOperand, IgxSummaryResult } from './grid-summary';
import { IgxGridRowComponent } from './row.component';
import {
    IgxCellEditorTemplateDirective,
    IgxCellFooterTemplateDirective,
    IgxCellHeaderTemplateDirective,
    IgxCellTemplateDirective
} from './grid.common';
import { IgxGridComponent } from './grid.component';
import { IFilteringExpressionsTree, IgxBooleanFilteringOperand, IgxNumberFilteringOperand, IgxDateFilteringOperand,
    IgxStringFilteringOperand } from '../../public_api';
/**
 * **Ignite UI for Angular Column** -
 * [Documentation](https://www.infragistics.com/products/ignite-ui-angular/angular/components/grid.html#columns-configuration)
 *
 * The Ignite UI Column is used within an `igx-grid` element to define what data the column will show. Features such as sorting,
 * filtering & editing are enabled at the column level.  You can also provide a template containing custom content inside
 * the column using `ng-template` which will be used for all cells within the column.
 */
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    selector: 'igx-column',
    template: ``
})
export class IgxColumnComponent implements AfterContentInit {
/**
 * Sets/gets the `field` value.
 * ```typescript
 * let columnField = this.column.field;
 * ```
 * ```html
 * <igx-column [field] = "'ID'"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public field: string;
/**
 * Sets/gets the `header` value.
 * ```typescript
 * let columnHeader = this.column.header;
 * ```
 * ```html
 * <igx-column [header] = "'ID'"></igx-column>
 * ```
 *
 * @memberof IgxColumnComponent
 */
@Input()
    public header = '';
/**
 * Sets/gets whether the column is sortable.
 * Default value is `false`.
 * ```typescript
 * let isSortable = this.column.sortable;
 * ```
 * ```html
 * <igx-column [soratble] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public sortable = false;
/**
 * Sets/gets whether the column is groupable.
 * Default value is `false`.
 * ```typescript
 * let isGroupable = this.column.groupable;
 * ```
 * ```html
 * <igx-column [groupable] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public groupable = false;
/**
 * Sets/gets whether the column is editable.
 * Default value is `false`.
 * ```typescript
 * let isEditable = this.column.editable;
 * ```
 * ```html
 * <igx-column [editable] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public editable = false;
/**
 * Sets/gets whether the column is filterable.
 * Default value is `false`.
 * ```typescript
 * let isFilterable = this.column.filterable;
 * ```
 * ```html
 * <igx-column [filterable] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public filterable = false;
/**
 * Sets/gets whether the column is resizable.
 * Default value is `false`.
 * ```typescript
 * let isResizable = this.column.resizable;
 * ```
 * ```html
 * <igx-column [resizable] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public resizable = false;
/**
 * Sets/gets whether the column has summary.
 * Default value is `false`.
 * ```typescript
 * let hasSummary = this.column.hasSummary;
 * ```
 * ```html
 * <igx-column [hasSummary] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public hasSummary = false;
/**
 * Gets whether the column is hidden.
 * ```typescript
 * let isHidden = this.column.hidden;
 * ```
 *@memberof IgxColumnComponent
 */
@Input()
    get hidden(): boolean {
        return this._hidden;
    }
/**
 * Sets the whether the column will be hidden.
 * Default value is `false`.
 * ```typescript
 * <igx-column [hidden] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
set hidden(value: boolean) {
        if (this._hidden !== value) {
            this._hidden = value;
            const cellInEditMode = this.gridAPI.get_cell_inEditMode(this.gridID);
            if (cellInEditMode) {
                if (cellInEditMode.cell.column.field === this.field) {
                    this.gridAPI.escape_editMode(this.gridID, cellInEditMode.cellID);
                }
            }
            this.check();
            if (this.grid) {
                const activeInfo = IgxTextHighlightDirective.highlightGroupsMap.get(this.grid.id);
                const oldIndex = activeInfo.columnIndex;

                if (this.grid.lastSearchInfo.searchText) {
                    if (this.index <= oldIndex) {
                        const newIndex = this.hidden ? oldIndex - 1 : oldIndex + 1;
                        this.updateHighlights(oldIndex, newIndex);
                    } else if (oldIndex === -1 && !this.hidden) {
                        this.grid.refreshSearch();
                    }
                }
                this.grid.reflow();
            }
        }
    }
/**
 * Gets whether the hiding is disabled.
 * ```typescript
 * let isHidingDisabled =  this.column.disableHiding;
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    get disableHiding(): boolean {
        return this._disableHiding;
    }
/**
 * Sets whether the hiding should be disabled.
 * Default value is `false`.
 * ```typescript
 * <igx-column [hidden] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
set disableHiding(value: boolean) {
        if (this._disableHiding !== value) {
            this._disableHiding = value;
            this.check();
        }
    }
/**
 * Sets/gets whether the column is movable.
 * Default value is `false`.
 * ```typescript
 * let isMovable = this.column.movable;
 * ```
 * ```html
 * <igx-column [movable] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public movable = false;
/**
 * Sets/gets the `width` of the column.
 * ```typescript
 * let columnWidth = this.column.width;
 * ```
 * ```html
 * <igx-column [width] = "'25%'"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public width: string;
/**
 * Sets/gets the maximum `width` of the column.
 * ```typescript
 * let columnMaxWidth = this.column.width;
 * ```
 * ```html
 * <igx-column [maxWidth] = "'75%'"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public maxWidth: string;
/**
 * Sets/gets the minimum `width` of the column.
 * Default value is `88`;
 * ```typescript
 * let columnMinWidth = this.column.minWidth;
 * ```
 * ```html
 * <igx-column [minWidth] = "'15%'"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public minWidth = this.defaultMinWidth;
/**
 * Sets/gets the class selector of the column header.
 * ```typescript
 * let columnHeaderClass = this.column.headerClasses;
 * ```
 * ```html
 * <igx-column [headerClasses] = "'column-header'"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public headerClasses = '';
/**
 * Sets/gets the class selector of the column cells.
 * ```typescript
 * let columnCellsClass = this.column.cellClasses;
 * ```
 * ```html
 * <igx-column [cellClasses] = "'column-cell'"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public cellClasses = '';
/**
 * Gets the `index` od the column.
 * ```typescript
 * let columnIndex = this.column.index;
 * ```
 * @memberof IgxColumnComponent
 */
get index(): number {
        return this.grid.columns.indexOf(this);
    }
/**
 * Sets/gets formatter for the column.
 * ```typescript
 * let columnFormatter = this.column.formatter;
 * ```
 * ```typescript
 * this.column.formatter = (val: Date) => {
 * return new Intl.DateTimeFormat("en-US").format(val);
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public formatter: (value: any) => any;
/**
 * Sets/gets whether the column filtering should be case sensitive.
 * Default value is `true`.
 * ```typescript
 * let filteringIgnoreCase = this.column.filteringIgnoreCase;
 * ```
 * ```html
 * <igx-column [filteringIgnoreCase] = "false"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public filteringIgnoreCase = true;
/**
 * Sets/gets whether the column sorting should be case sensitive.
 * Default value is `true`.
 * ```typescript
 * let sortingIgnoreCase = this.column.sortingIgnoreCase;
 * ```
 * ```html
 * <igx-column [sortingIgnoreCase] = "false"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public sortingIgnoreCase = true;
/**
 * Sets/gets the data type of the column values.
 * Default value is `string`.
 * ```typescript
 * let columnDataType = this.column.dataType;
 * ```
 * ```html
 * <igx-column [dataType] = "'number'"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public dataType: DataType = DataType.String;
/**
 * Gets whether the column is `pinned`.
 * ```typescript
 * let isPinned = this.column.pinned;
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public get pinned(): boolean {
        return this._pinned;
    }
/**
 * Sets whether the column is pinned.
 * Default value is `false`.
 * ```html
 * <igx-column [pinned] = "true"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
public set pinned(value: boolean) {
        if (this._pinned !== value) {
            if (this.grid && this.width && !isNaN(parseInt(this.width, 10))) {
                value ? this.pin() : this.unpin();
                return;
            }
            /* No grid/width available at initialization. `initPinning` in the grid
               will re-init the group (if present)
            */
            this._pinned = value;
        }
    }
/**
 * Gets/Sets the `id` of the `igx-grid`.
 * ```typescript
 * let columnGridId = this.column.gridID;
 * ```
 * ```typescript
 * this.column.gridID = 'grid-1';
 * ```
 * @memberof IgxColumnComponent
 */
public gridID: string;
/**
 * Gets the column `summaries`.
 * ```typescript
 * let columnSummaries = this.column.summaries;
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public get summaries(): any {
        return this._summaries;
    }
/**
 * Sets the column `summaries`.
 * ```typescript
 * this.column.summaries = IgxNumberSummaryOperand;
 * ```
 * @memberof IgxColumnComponent
 */
public set summaries(classRef: any) {
        this._summaries = new classRef();
    }
/**
 * Sets/gets whether the column is `searchable`.
 * Default value is `true`.
 * ```typescript
 * let isSearchable =  this.column.searchable';
 * ```
 * ```html
 *  <igx-column [searchable] = "false"></igx-column>
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public searchable = true;
/**
 * Gets the column `filters`.
 * ```typescript
 * let columnFilters = this.column.filters'
 * ```
 * @memberof IgxColumnComponent
 */
@Input()
    public get filters(): any {
        return this._filters;
    }
/**
 * Sets the column `filters`.
 * ```typescript
 * this.column.filters = IgxBooleanFilteringOperand.
 * ```
 * @memberof IgxColumnComponent
 */
public set filters(classRef: any) {
        this._filters = classRef;
    }
/**
 * Gets the default minimum `width` of the column.
 * ```typescript
 * let defaultMinWidth =  this.column.defaultMinWidth;
 * ```
 * @memberof IgxColumnComponent
 */
get defaultMinWidth(): string {
        return this._defaultMinWidth;
    }
/**
 * Returns reference to the `igx-grid`.
 * ```typescript
 * let gridComponent = this.column.grid;
 * ```
 * @memberof IgxColumnComponent
 */
get grid(): IgxGridComponent {
        return this.gridAPI.get(this.gridID);
    }
/**
 * Returns a reference to the `bodyTemplate`.
 * ```typescript
 * let bodyTemplate = this.column.bodyTemplate;
 * ```
 * @memberof IgxColumnComponent
 */
get bodyTemplate(): TemplateRef<any> {
        return this._bodyTemplate;
    }
/**
 * Sets the body template.
 * ```typescript
 * @ViewChild("'bodyTemplate'", {read: TemplateRef })
 * public bodyTemplate: TemplateRef<any>;
 * this.column.bodyTemplate(bodyTemplate);
 * ```
 * @memberof IgxColumnComponent
 */
set bodyTemplate(template: TemplateRef<any>) {
        this._bodyTemplate = template;
        this.grid.markForCheck();
    }
/**
 * Returns a reference to the header template.
 * ```typescript
 * let headerTemplate = this.column.headerTemplate;
 * ```
 * @memberof IgxColumnComponent
 */
get headerTemplate(): TemplateRef<any> {
        return this._headerTemplate;
    }
/**
 * Sets the header template.
 * ```typescript
 * @ViewChild("'headerTemplate'", {read: TemplateRef })
 * public headerTemplate: TemplateRef<any>;
 * this.column.headerTemplate(headerTemplate);
 * ```
 * @memberof IgxColumnComponent
 */
set headerTemplate(template: TemplateRef<any>) {
        this._headerTemplate = template;
        this.grid.markForCheck();
    }
/**
 * Returns a reference to the footer template.
 * ```typescript
 * let footerTemplate = this.column.footerTemplate;
 * ```
 * @memberof IgxColumnComponent
 */
get footerTemplate(): TemplateRef<any> {
        return this._headerTemplate;
    }
/**
 * Sets the footer template.
 * ```typescript
 * @ViewChild("'footerTemplate'", {read: TemplateRef })
 * public footerTemplate: TemplateRef<any>;
 * this.column.footerTemplate(footerTemplate);
 * ```
 * @memberof IgxColumnComponent
 */
set footerTemplate(template: TemplateRef<any>) {
        this._footerTemplate = template;
        this.grid.markForCheck();
    }
/**
 * Returns a reference to the inline editor template.
 * ```typescript
 * let inlineEditorTemplate = this.column.inlineEditorTemplate;
 * ```
 * @memberof IgxColumnComponent
 */
get inlineEditorTemplate(): TemplateRef<any> {
        return this._inlineEditorTemplate;
    }
/**
 * Sets the inline editor template.
 * ```typescript
 * @ViewChild("'inlineEditorTemplate'", {read: TemplateRef })
 * public inlineEditorTemplate: TemplateRef<any>;
 * this.column.inlineEditorTemplate(inlineEditorTemplate);
 * ```
 * @memberof IgxColumnComponent
 */
set inlineEditorTemplate(template: TemplateRef<any>) {
        this._inlineEditorTemplate = template;
        this.grid.markForCheck();
    }
/**
 * Gets the cells of the column.
 * ```typescript
 * let columnCells =  this.column.cells;
 * ```
 * @memberof IgxColumnComponent
 */
get cells(): IgxGridCellComponent[] {
        return this.grid.rowList.filter((row) => row instanceof IgxGridRowComponent)
            .map((row) => row.cells.filter((cell) => cell.columnIndex === this.index))
                .reduce((a, b) => a.concat(b), []);
    }
/**
 * Gets the index of the non hidden column.
 * If the column is not visible, returns `-1`.
 * ```typescript
 * let visibleColumnIndex =  this.column.visibleIndex;
 * ```
 * @memberof IgxColumnComponent
 */
get visibleIndex(): number {
        const grid = this.gridAPI.get(this.gridID);
        const unpinnedColumns = this.grid.unpinnedColumns.filter(c => !c.columnGroup);
        const pinnedColumns = this.grid.pinnedColumns.filter(c => !c.columnGroup);
        let col = this;
        let vIndex = -1;

        if (this.columnGroup) {
            col = this.allChildren.filter(c => !c.columnGroup)[0] as any;
        }

        if (!this.pinned) {
            const indexInCollection = unpinnedColumns.indexOf(col);
            vIndex = indexInCollection === -1 ? -1 : pinnedColumns.length + indexInCollection;
        } else {
            vIndex = pinnedColumns.indexOf(col);
        }
        return vIndex;
    }
/**
 * Gets whether the column contains other columns.
 * ```typescript
 * let columnGroup =  this.column.columnGroup;
 * ```
 * @memberof IgxColumnComponent
 */
get columnGroup() {
        return false;
    }
/**
 * Returns the children columns that the current column contains.
 * If it doesn't have children, returns an empty array.
 * ```typescript
 * let childrenColumns =  this.column.allChildren;
 * ```
 * @memberof IgxColumnComponent
 */
get allChildren(): IgxColumnComponent[] {
        return [];
    }
/**
 * Returns the level of the column in a column group.
 * Returns `0` if the column doesn't have a `parent`.
 * ```typescript
 * let columnLevel =  this.column.level;
 * ```
 * @memberof IgxColumnComponent
 */
get level() {
        let ptr = this.parent;
        let lvl = 0;

        while (ptr) {
            lvl++;
            ptr = ptr.parent;
        }
        return lvl;
    }
/**
 * Sets/gets the parent column.
 * ```typescript
 * let parentColumn = this.column.parent;
 * ```
 * ```typescript
 * this.column.parent = higherLevelColumn;
 * ```
 * @memberof IgxColumnComponent
 */
parent = null;
/**
 * Sets/gets the children columns.
 * ```typescript
 * let columnChildren = this.column.children;
 * ```
 * ```typescript
 * this.column.children = childrenColumns;
 * ```
 * @memberof IgxColumnComponent
 */
children;
/**
 *@hidden
 */
protected _unpinnedIndex;
/**
 *@hidden
 */
protected _pinned = false;
/**
 *@hidden
 */
protected _bodyTemplate: TemplateRef<any>;
/**
 *@hidden
 */
protected _headerTemplate: TemplateRef<any>;
/**
 *@hidden
 */
protected _footerTemplate: TemplateRef<any>;
/**
 *@hidden
 */
protected _inlineEditorTemplate: TemplateRef<any>;
/**
 *@hidden
 */
protected _summaries = null;
/**
 *@hidden
 */
protected _filters = null;
/**
 *@hidden
 */
protected _hidden = false;
/**
 *@hidden
 */
protected _index: number;
/**
 *@hidden
 */
protected _disableHiding = false;
/**
 *@hidden
 */
protected _defaultMinWidth = '88';
/**
 *@hidden
 */
@ContentChild(IgxCellTemplateDirective, { read: IgxCellTemplateDirective })
    protected cellTemplate: IgxCellTemplateDirective;
/**
 *@hidden
 */
@ContentChild(IgxCellHeaderTemplateDirective, { read: IgxCellHeaderTemplateDirective })
    protected headTemplate: IgxCellHeaderTemplateDirective;
/**
 *@hidden
 */
@ContentChild(IgxCellFooterTemplateDirective, { read: IgxCellFooterTemplateDirective })
    protected footTemplate: IgxCellFooterTemplateDirective;
/**
 *@hidden
 */
@ContentChild(IgxCellEditorTemplateDirective, { read: IgxCellEditorTemplateDirective })
    protected editorTemplate: IgxCellEditorTemplateDirective;

    constructor(public gridAPI: IgxGridAPIService, public cdr: ChangeDetectorRef) { }
/**
 *@hidden
 */
public ngAfterContentInit(): void {
        if (this.cellTemplate) {
            this._bodyTemplate = this.cellTemplate.template;
        }
        if (this.headTemplate) {
            this._headerTemplate = this.headTemplate.template;
        }
        if (this.footTemplate) {
            this._footerTemplate = this.footTemplate.template;
        }
        if (this.editorTemplate) {
            this._inlineEditorTemplate = this.editorTemplate.template;
        }
        if (!this.summaries) {
            switch (this.dataType) {
                case DataType.String:
                case DataType.Boolean:
                    this.summaries = IgxSummaryOperand;
                    break;
                case DataType.Number:
                    this.summaries = IgxNumberSummaryOperand;
                    break;
                case DataType.Date:
                    this.summaries = IgxDateSummaryOperand;
                    break;
            }
        }
        if (!this.filters) {
            switch (this.dataType) {
                case DataType.Boolean:
                    this.filters = IgxBooleanFilteringOperand;
                    break;
                case DataType.Number:
                    this.filters = IgxNumberFilteringOperand;
                    break;
                case DataType.Date:
                    this.filters = IgxDateFilteringOperand;
                    break;
                case DataType.String:
                default:
                    this.filters = IgxStringFilteringOperand;
                    break;
            }
        }
    }
/**
 * Updates the highlights when a column index is changed.
 * ```typescript
 * this.column.updateHighlights(1, 3);
 * ```
 * @memberof IgxColumnComponent
 */
public updateHighlights(oldIndex: number, newIndex: number) {
    const activeInfo = IgxTextHighlightDirective.highlightGroupsMap.get(this.grid.id);

    if (activeInfo && activeInfo.columnIndex === oldIndex) {
        IgxTextHighlightDirective.setActiveHighlight(this.grid.id, {
            columnIndex: newIndex,
            rowIndex: activeInfo.rowIndex,
            index: activeInfo.index,
            page: activeInfo.page,
        });

        this.grid.refreshSearch(true);
    }
}
/**
 * Pins the column.
 * The provided index specifies where the column should be pinned in the pinned area.
 * ```typescript
 * this.column.pin();
 * ```
 * @memberof IgxColumnComponent
 */
public pin(index?) {
        // TODO: Probably should the return type of the old functions
        // should be moved as a event parameter.

        if (this._pinned) {
            return false;
        }

        if (this.parent && !this.parent.pinned) {
            return this.topLevelParent.pin(index);
        }

        const grid = (this.grid as any);
        const width = parseInt(this.width, 10);
        const oldIndex = this.visibleIndex;

        if (!this.parent && (grid.getUnpinnedWidth(true) - width < grid.unpinnedAreaMinWidth)) {
            return false;
        }

        this._pinned = true;
        this._unpinnedIndex = grid._unpinnedColumns.indexOf(this);
        index = index !== undefined ? index : grid._pinnedColumns.length;
        const args = { column: this, insertAtIndex: index };
        grid.onColumnPinning.emit(args);

        if (grid._pinnedColumns.indexOf(this) === -1) {
            grid._pinnedColumns.splice(args.insertAtIndex, 0, this);

            if (grid._unpinnedColumns.indexOf(this) !== -1) {
                grid._unpinnedColumns.splice(grid._unpinnedColumns.indexOf(this), 1);
            }
        }

        if (this.columnGroup) {
            this.allChildren.forEach(child => child.pinned = true);
            grid.reinitPinStates();
        }

        grid.markForCheck();
        const newIndex = this.visibleIndex;
        this.updateHighlights(oldIndex, newIndex);
        return true;
    }
/**
 * Unpins the column.
 * The provided index specifies where the column should be placed in the unpinned area.
 * ```typescript
 * this.column.unpin();
 * ```
 * @memberof IgxColumnComponent
 */
public unpin(index?) {

        if (!this._pinned) {
            return false;
        }

        if (this.parent && this.parent.pinned) {
            return this.topLevelParent.unpin(index);
        }

        const grid = (this.grid as any);
        const oldIndex = this.visibleIndex;
        index = (index !== undefined ? index :
            this._unpinnedIndex !== undefined ? this._unpinnedIndex : this.index);
        this._pinned = false;

        grid._unpinnedColumns.splice(index, 0, this);
        if (grid._pinnedColumns.indexOf(this) !== -1) {
            grid._pinnedColumns.splice(grid._pinnedColumns.indexOf(this), 1);
        }

        if (this.columnGroup) {
            this.allChildren.forEach(child => child.pinned = false);
        }
        grid.reinitPinStates();

        grid.markForCheck();
        const newIndex = this.visibleIndex;
        this.updateHighlights(oldIndex, newIndex);
        return true;
    }
/**
 * Returns a reference to the top level parent.
 * ```typescript
 * let topLevelParent =  this.column.topLevelParent;
 * ```
 * @memberof IgxColumnComponent
 */
get topLevelParent() {
        let parent = this.parent;
        while (parent && parent.parent) {
            parent = parent.parent;
        }
        return parent;
    }
/**
 *@hidden
 */
protected check() {
        if (this.grid) {
            this.grid.markForCheck();
        }
    }

}


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: IgxColumnComponent, useExisting: forwardRef(() => IgxColumnGroupComponent)}],
    selector: 'igx-column-group',
    template: ``
})
export class IgxColumnGroupComponent extends IgxColumnComponent implements AfterContentInit {

    @ContentChildren(IgxColumnComponent, { read: IgxColumnComponent })
    children = new QueryList<IgxColumnComponent>();
/**
 * Gets the column group `summaries`.
 * ```typescript
 * let columnGroupSummaries = this.columnGroup.summaries;
 * ```
 * @memberof IgxColumnGroupComponent
 */
@Input()
    public get summaries(): any {
        return this._summaries;
    }
/**
 * Sets the column group `summaries`.
 * ```typescript
 * this.columnGroup.summaries = IgxNumberSummaryOperand;
 * ```
 * @memberof IgxColumnGroupComponent
 */
public set summaries(classRef: any) {}
/**
 * Sets/gets whether the column group is `searchable`.
 * Default value is `true`.
 * ```typescript
 * let isSearchable =  this.columnGroup.searchable;
 * ```
 * ```html
 *  <igx-column-group [searchable] = "false"></igx-column-group>
 * ```
 * @memberof IgxColumnGroupComponent
 */
@Input()
    public searchable = true;
/**
 * Gets the column group `filters`.
 * ```typescript
 * let columnGroupFilters = this.columnGroup.filters;
 * ```
 * @memberof IgxColumnGroupComponent
 */
@Input()
    public get filters(): any {
        return this._filters;
    }
/**
 * Sets the column group `filters`.
 * ```typescript
 * this.columnGroup.filters = IgxStringFilteringOperand;
 * ```
 * @memberof IgxColumnGroupComponent
 */
public set filters(classRef: any) {}
/**
 * Gets the default minimum `width` of the column group.
 * ```typescript
 * let defaultMinWidth = this.columnGroup.defaultMinWidth;
 * ```
 * @memberof IgxColumnGroupComponent
 */
get defaultMinWidth(): string {
        return this._defaultMinWidth;
    }
/**
 * Returns a reference to the body template.
 * ```typescript
 * let bodyTemplate = this.columnGroup.bodyTemplate;
 * ```
 * @memberof IgxColumnGroupComponent
 */
get bodyTemplate(): TemplateRef<any> {
        return this._bodyTemplate;
    }
/**
 * Sets the body template.
 * ```typescript
 * @ViewChild("'bodyTemplate'", {read: TemplateRef })
 * public bodyTemplate: TemplateRef<any>;
 * this.columnGroup.bodyTemplate(bodyTemplate);
 * ```
 * @memberof IgxColumnGroupComponent
 */
set bodyTemplate(template: TemplateRef<any>) {}
/**
 * Returns a reference to the header template.
 * ```typescript
 * let headerTemplate = this.columnGroup.headerTemplate;
 * ```
 * @memberof IgxColumnGroupComponent
 */
get headerTemplate(): TemplateRef<any> {
        return this._headerTemplate;
    }
/**
 * Sets the header template.
 * ```typescript
 * @ViewChild('"headerTemplate"', {read: TemplateRef })
 * public headerTemplate: TemplateRef<any>;
 * this.columnGroup.headerTemplate(headerTemplate);
 * ```
 * @memberof IgxColumnGroupComponent
 */
set headerTemplate(template: TemplateRef<any>) {}
/**
 * Returns a reference to the header template.
 * ```typescript
 * let footerTemplate = this.columnGroup.footerTemplate;
 * ```
 * @memberof IgxColumnGroupComponent
 */
get footerTemplate(): TemplateRef<any> {
        return this._headerTemplate;
    }
/**
 * Sets the footer template.
 * ```typescript
 * @ViewChild("'footerTemplate'", {read: TemplateRef })
 * public footerTemplate: TemplateRef<any>;
 * this.columnGroup.footerTemplate(footerTemplate);
 * ```
 * @memberof IgxColumnGroupComponent
 */
set footerTemplate(template: TemplateRef<any>) {}
/**
 * Returns a reference to the inline editor template.
 * ```typescript
 * let inlineEditorTemplate = this.columnGroup.inlineEditorTemplate;
 * ```
 * @memberof IgxColumnGroupComponent
 */
get inlineEditorTemplate(): TemplateRef<any> {
        return this._inlineEditorTemplate;
    }
/**
 * Sets the inline editor template.
 * ```typescript
 * @ViewChild("'inlineEditorTemplate'", {read: TemplateRef })
 * public inlineEditorTemplate: TemplateRef<any>;
 * this.columnGroup.inlineEditorTemplate(inlineEditorTemplate);
 * ```
 * @memberof IgxColumnGroupComponent
 */
set inlineEditorTemplate(template: TemplateRef<any>) {}
/**
 * Gets the cells of the column group.
 * ```typescript
 * let columnCells = this.columnGroup.cells;
 * ```
 * @memberof IgxColumnGroupComponent
 */
get cells(): IgxGridCellComponent[] {
        return [];
    }
/**
 * Gets whether the column group is hidden.
 * ```typescript
 * let isHidden = this.columnGroup.hidden;
 * ```
 * @memberof IgxColumnGroupComponent
 */
@Input()
get hidden() {
    return this.allChildren.every(c => c.hidden);
}
/**
 * Sets whether the column group should be hidden.
 * ```typescript
 * <igx-column [hidden] = "true"></igx-column>
 * ```
 * @memberof IgxColumnGroupComponent
 */
set hidden(value: boolean) {
    this._hidden = value;
    this.children.forEach(child => child.hidden = value);
}
/**
 *@hidden
 */
ngAfterContentInit() {
        /*
            @ContentChildren with descendants still returns the `parent`
            component in the query list.
        */
        this.children.reset(this.children.toArray().slice(1));
        this.children.forEach(child => {
            child.parent = this;
        });
    }
/**
 * Returns all the columns in the column group.
 * ```typescript
 * let columns =  this.columnGroup.allChilren;
 * ```
 * @memberof IgxColumnGroupComponent
 */
get allChildren(): IgxColumnComponent[] {
        return flatten(this.children.toArray());
    }
/**
 * Indicates that there is a column group.
 * ```typescript
 * let isColumnGroup =  this.columnGroup.columnGroup
 * ```
 * @memberof IgxColumnGroupComponent
 */
get columnGroup() {
        return true;
    }
/**
 * Gets the width of the column group.
 * ```typescript
 * let columnGroupWidth = this.columnGroup.width;
 * ```
 * @memberof IgxColumnGroupComponent
 */
get width() {
        let isChildrenWidthInPercent = false;
        const width = `${this.children.reduce((acc, val) => {
            if (val.hidden) {
                return acc;
            }

            if (val.width && val.width.indexOf('%') !== -1) {
                isChildrenWidthInPercent = true;
            }

            return acc + parseInt(val.width, 10);
        }, 0)}`;
        return isChildrenWidthInPercent ? width + '%' : width;
    }

    set width(val) {}
}



function flatten(arr: any[]) {
    let result = [];

    arr.forEach(el => {
        result.push(el);
        if (el.children) {
            result = result.concat(flatten(el.children.toArray()));
        }
    });
    return result;
}
