import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DoCheck,
    ElementRef,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild,
    AfterViewInit
} from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";
import { DataType } from "../data-operations/data-util";
import { IgxToggleDirective } from "../directives/toggle/toggle.directive";
import { IgxGridAPIService } from "./api.service";
import { IgxColumnComponent } from "./column.component";
import { autoWire, IGridBus } from "./grid.common";
import { IgxButtonGroupModule, IgxButtonGroupComponent } from "../buttonGroup/buttonGroup.component";
import { IFilteringExpression } from '../data-operations/filtering-expression.interface';
import { IFilteringOperation } from '../data-operations/filtering-condition';


@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    preserveWhitespaces: false,
    selector: "igx-grid-filter-expression",
    templateUrl: "./grid-filtering-expression.component.html"
})
export class IgxGridFilterExpressionComponent implements IGridBus, OnInit, OnDestroy, AfterViewInit {

    get column() {
        return this._column;
    }

    @Input()
    set column(val) {
        this._column = val;
        if(this.expression) {
            this.expression.fieldName = val.field;
        }
    }

    get value() {
        return this._value;
    }

    set value(val) {
        if (!val && val !== 0) {
            this._value = null;
        } else {
            this._value = this.transformValue(val);
        }
        this.expression.searchVal = this._value;
        if (!this._isReset) {
            this.onExpressionChanged.emit(this.expression);
        }
        this._isReset = false;
    }

    @Output()
    public onExpressionChanged = new EventEmitter<IFilteringExpression>();

    @ViewChild("defaultFilterUI", { read: TemplateRef })
    protected defaultFilterUI: TemplateRef<any>;

    @ViewChild("defaultDateUI", { read: TemplateRef })
    protected defaultDateUI: TemplateRef<any>;

    @ViewChild("select", { read: ElementRef})
    protected select: ElementRef;

    @ViewChild("input", { read: ElementRef})
    protected input: ElementRef;

    public booleanFilterAll = 'All';
    private _column: any;
    private _isReset = false;
    public expression: IFilteringExpression;
    protected conditionChanged = new Subject();
    protected unaryConditionChanged = new Subject();
    protected _value = null;

    constructor(private zone: NgZone, public gridAPI: IgxGridAPIService, public cdr: ChangeDetectorRef) {
        this.unaryConditionChanged.subscribe(() => this.unaryConditionChangedCallback());
        this.conditionChanged.subscribe(() => this.conditionChangedCallback());
    }

    public ngOnInit() {
        this.expression = { 
            fieldName: this.column.field,
            condition: null,
            searchVal: null,
            ignoreCase: this.column.filteringIgnoreCase
        }
    }

    public ngAfterViewInit() {
        this.expression.condition = this.getCondition(this.select.nativeElement.value);
    }

    public ngOnDestroy() {
        this.conditionChanged.unsubscribe();
        this.unaryConditionChanged.unsubscribe();
    }

    protected UNARY_CONDITIONS = [
        "true", "false", "null", "notNull", "empty", "notEmpty",
        "yesterday", "today", "thisMonth", "lastMonth", "nextMonth",
        "thisYear", "lastYear", "nextYear"
    ];

    get template() {
        switch (this.column.dataType) {
            case DataType.String:
            case DataType.Number:
                return this.defaultFilterUI;
            case DataType.Date:
                return this.defaultDateUI;
            case DataType.Boolean:
                return null;
        }
    }    

    @autoWire()
    public conditionChangedCallback() {
        if (!!this.expression.searchVal || this.expression.searchVal === 0) {
             this.onExpressionChanged.emit(this.expression); 
        }
    }

    @autoWire()
    public unaryConditionChangedCallback() {
        this.onExpressionChanged.emit(this.expression)
    }

    public isActive(value): boolean {
        if(this.expression && this.expression.condition && this.expression.condition.name === value) {
            return true;
        }
        else {
            return false;
        } 
    }

    get gridID(): string {
        return this.column.gridID;
    }

    get unaryCondition(): boolean {
        return this.isUnaryCondition();
    }

    public isUnaryCondition(): boolean {
        for (const each of this.UNARY_CONDITIONS) {
            if (this.expression && this.expression.condition && this.expression.condition.name === each) {
                return true;
            }
        }
        return false;
    }

    get conditions() {
        return this.column.filters.instance().conditionList();
    }

    protected getCondition(value: string): IFilteringOperation {
        return this.column.filters.instance().condition(value);
    }

    protected transformValue(value) {
        if (this.column.dataType === DataType.Number) {
            value = parseFloat(value);
        } else if (this.column.dataType === DataType.Boolean) {
            value = Boolean(value);
        }

        return value;
    }

    public selectionChanged(value): void {
        if (value === this.booleanFilterAll) {
            this.clearFiltering(true);
            return;
        }
        this.focusInput();
        this.expression.condition = this.getCondition(value);
        if (this.unaryCondition) {
            this.unaryConditionChanged.next(value);
        } else {
            this.conditionChanged.next(value);
        }
    }

    public onInputChanged(val): void {
        this.expression.condition = this.getCondition(this.select.nativeElement.value);
        this.value = val;
    }

    public focusInput(): void {
        if (this.input) {
        this.input.nativeElement.focus();
        }
    }

    public clearFiltering(resetCondition: boolean): void {
        this._isReset = resetCondition;
        this.expression.condition = resetCondition ? undefined : this.expression.condition;
        this.value = null;
        this.cdr.detectChanges();
    }

    public clearInput(): void {
        this.clearFiltering(false);
    }

    // XXX - Temp fix for (#1183, #1177) (Should be deleted)
    onDatePickerClick() {
        this.zone.run(() => {});
    }


}