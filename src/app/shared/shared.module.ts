import { NgModule} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasePopupComponent } from '../elements/modals/basePopup.component';
import { CommonModule } from '@angular/common';
import { TableFilterComponent } from '../elements/table/table.filter.component';
import { DataTableModule } from 'angular2-datatable';
import { TableSorterDerective } from '../derectives/mfTableSorter.derective';
import { LookupAutocompleteComponent } from '../elements/lookup/autocomplete/lookupAutocomplete.component';
import { LargeTextContainerComponent } from '../elements/containers/largeTextContainer.component';
import { LookupColorsComponent } from '../elements/lookup/colored/lookupColors.component';
import { LookupComponent } from '../elements/lookup/simple/lookup.component';
import { SetClassDirective } from '../derectives/setClass.derective';
import { CustomEventListener } from '../derectives/customEventListener.derective';
import { CommentsComponent } from '../elements/comments/comments.component';
import { NgxEditorModule } from 'ngx-editor';
import { PanelsRowDirective } from '../derectives/panels-row.derective';
import { FileUploadModule } from 'ng2-file-upload';
import { UploaderComponent } from '../elements/file-uploader/uploader.element';
import { LookupAutocompleteMultiselectComponent } from '../elements/lookup/multiselect/lookupAutocompleteMultiselect.component';
import { RouterModule } from '@angular/router';
import { SetHTMLDirective } from '../derectives/show-html-data.derective';
import { AutofocusDirective } from '../derectives/auto-focus.derective';
import { NgDatepickerModule } from 'custom-a1qa-ng2-datepicker';
import { BaseLookupComponent } from '../elements/lookup/baseLookup';
import { ClickableLinks } from '../derectives/clickableLinks.derective';
import { TextMaskModule } from 'angular2-text-mask';
import { MaxLength } from '../derectives/maxLength.derective';
import { UiSwitchModule } from 'ngx-ui-switch';
import { ManageColumnsModalComponent } from '../elements/table/manage-columns-modal/manage-columns-modal.component';
import { DragulaModule } from 'ng2-dragula';
import { OverflowDirective } from '../derectives/overflow.derective';
import { ClickOutsideModule } from 'ng-click-outside';
import { DisabledInlineDerective } from '../derectives/disabled-inline-editor.derective';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { InputTrimModule } from 'ng2-trim-directive';
import { MatMenuModule, MatListModule, MatIconModule, MatButtonModule } from '@angular/material';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LabeledSwitchComponent } from '../elements/labeled-element/labeled-switch/labeled-switch.component';
import { AttachmentInlineComponent } from '../elements/attachment-inline/attachment-inline.component';
import { LabeledInputComponent } from '../elements/labeled-element/labeled-input/labeled-input.component';
import { LabeledBaseComponent } from '../elements/labeled-element/labeled-base.component';
import { TristateCheckboxComponent } from '../elements/tristate-checkbox/tristate-checkbox.component';
import { ColorDotsComponent } from '../elements/color-dots/color-dots.component';
import { BsDropdownModule, TooltipModule, ModalModule, PopoverModule } from 'ngx-bootstrap';
import { HighliteTextDirective } from '../derectives/highlite-text.derective';
import { RegexpTesterComponent } from '../elements/regexp-tester/regexp-tester.component';
import { SingleLineBarChartComponent } from '../elements/single-line-bar-chart/single-line-bar-chart.component';
import { InlineEditorComponent } from '../elements/inline-editor/inline-editor.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    CommonModule,
    NgxEditorModule,
    FileUploadModule,
    RouterModule,
    NgDatepickerModule,
    TextMaskModule,
    UiSwitchModule,
    DragulaModule,
    ClickOutsideModule,
    HttpClientModule,
    ChartsModule,
    HttpModule,
    InputTrimModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    FontAwesomeModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot()
  ],
  declarations: [
    ClickableLinks,
    LookupAutocompleteComponent,
    BasePopupComponent,
    TableFilterComponent,
    DisabledInlineDerective,
    TableSorterDerective,
    SetClassDirective,
    LargeTextContainerComponent,
    CommentsComponent,
    LookupColorsComponent,
    LookupComponent,
    CustomEventListener,
    PanelsRowDirective,
    UploaderComponent,
    LookupAutocompleteMultiselectComponent,
    BaseLookupComponent,
    SetHTMLDirective,
    AutofocusDirective,
    MaxLength,
    ManageColumnsModalComponent,
    OverflowDirective,
    LabeledSwitchComponent,
    AttachmentInlineComponent,
    LabeledInputComponent,
    LabeledBaseComponent,
    TristateCheckboxComponent,
    ColorDotsComponent,
    HighliteTextDirective,
    RegexpTesterComponent,
    SingleLineBarChartComponent,
    InlineEditorComponent
  ],
  exports: [
    ClickableLinks,
    NgDatepickerModule,
    LookupAutocompleteComponent,
    TableSorterDerective,
    DisabledInlineDerective,
    FormsModule,
    ReactiveFormsModule,
    DataTableModule,
    BasePopupComponent,
    TableFilterComponent,
    LargeTextContainerComponent,
    LookupColorsComponent,
    LookupComponent,
    SetClassDirective,
    CustomEventListener,
    CommentsComponent,
    NgxEditorModule,
    PanelsRowDirective,
    FileUploadModule,
    UploaderComponent,
    LookupAutocompleteMultiselectComponent,
    BaseLookupComponent,
    RouterModule,
    SetHTMLDirective,
    AutofocusDirective,
    TextMaskModule,
    MaxLength,
    UiSwitchModule,
    ManageColumnsModalComponent,
    DragulaModule,
    OverflowDirective,
    ClickOutsideModule,
    HttpClientModule,
    ChartsModule,
    HttpModule,
    InputTrimModule,
    MatMenuModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    FontAwesomeModule,
    LabeledSwitchComponent,
    AttachmentInlineComponent,
    LabeledInputComponent,
    LabeledBaseComponent,
    TristateCheckboxComponent,
    ColorDotsComponent,
    BsDropdownModule,
    TooltipModule,
    ModalModule,
    PopoverModule,
    CommonModule,
    HighliteTextDirective,
    RegexpTesterComponent,
    SingleLineBarChartComponent,
    InlineEditorComponent
  ]
})
export class SharedModule {}
