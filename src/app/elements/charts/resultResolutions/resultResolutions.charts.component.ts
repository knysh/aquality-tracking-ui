import {
  Component,
  Input,
  OnChanges,
  ViewChild,
  EventEmitter,
  Output
} from "@angular/core";
import { SimpleRequester } from "../../../services/simple-requester";
import { TestResultService } from "../../../services/test-result.service";
import { TestResult } from "../../../shared/models/test-result";
import { ResultResolution } from "../../../shared/models/result_resolution";
import { ResultResolutionService } from "../../../services/result-resolution.service";
import { BaseChartDirective } from "ng2-charts";
import { colors } from "../../../shared/colors.service";

@Component({
  selector: "result-resolution-chart",
  templateUrl: "./resultResolutions.charts.component.html",
  providers: [SimpleRequester, ResultResolutionService, TestResultService]
})
export class ResultResolutionsChartsComponent implements OnChanges {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  @Input() testResults: TestResult[];
  @Output() clickedResult = new EventEmitter<ResultResolution>();
  includeNotExecuted = false;
  shownTestResults: TestResult[];
  listOfResultResolutions: ResultResolution[];
  doughnutChartLabels: string[] = [];
  doughnutChartData: number[] = [];
  chartColors: any[] = [];
  doughnutChartType = "doughnut";
  chartOptions: any = {
    legend: {
      display: true,
      position: "left",
      labels: {
        boxWidth: 20
      }
    }
  };

  constructor(private resultResolutionService: ResultResolutionService) {}

  ngOnChanges() {
    this.resultResolutionService.getResolution().subscribe(
      result => {
        this.listOfResultResolutions = result;
        this.getData();
      },
      error => this.resultResolutionService.handleError(error)
    );
  }

  getData() {
    if (this.includeNotExecuted) {
      this.shownTestResults = this.testResults.filter(
        x => x.debug === 0 && x.final_result.id !== 2
      );
    } else {
      this.shownTestResults = this.testResults.filter(
        x => x.debug === 0 && x.final_result.id !== 2 && x.final_result.id !== 3
      );
    }
    this.fillChartData();
    this.fillChartColors();
    this.fillChartLabels();
    if (this.chart && this.chart.chart && this.chart.chart.config) {
      this.chart.chart.config.data.labels = this.doughnutChartLabels;
      this.chart.chart.update();
    }
  }

  toggleNotExecuted() {
    this.includeNotExecuted = !this.includeNotExecuted;
    this.getData();
  }

  fillChartLabels() {
    this.doughnutChartLabels = [];
    for (const resultResolution of this.listOfResultResolutions) {
      this.doughnutChartLabels.push(
        resultResolution.name +
          this.calculatePrecentageAndCount(resultResolution.name)
      );
    }
  }

  fillChartData() {
    this.doughnutChartData = [];
    for (const resultResolution of this.listOfResultResolutions) {
      this.doughnutChartData.push(
        this.shownTestResults.filter(
          x => x.test_resolution.name === resultResolution.name
        ).length
      );
    }
  }

  calculatePrecentageAndCount(resultResolution: String): String {
    const num = this.shownTestResults.filter(
      x => x.test_resolution.name === resultResolution
    ).length;
    const percentage = (num / this.shownTestResults.length) * 100;
    return ` | ${percentage.toFixed(1)}% | ${num}`;
  }

  fillChartColors() {
    const backgroundColors: any[] = [];
    for (const resultResolution of this.listOfResultResolutions) {
      switch (resultResolution.color) {
        case 1:
          backgroundColors.push(colors.danger.fill);
          break;
        case 2:
          backgroundColors.push(colors.warning.fill);
          break;
        case 3:
          backgroundColors.push(colors.primary.fill);
          break;
        case 4:
          backgroundColors.push(colors.info.fill);
          break;
        case 5:
          backgroundColors.push(colors.success.fill);
          break;
        default:
          backgroundColors.push(colors.point.stroke);
      }
    }
    this.chartColors = [{ backgroundColor: backgroundColors }];
  }

  chartClicked(event: any): void {
    if (event.active[0]) {
      const dataIndex = event.active[0]._index;
      const label: string = this.chart.labels[dataIndex].toString();
      const clickedResolution = this.listOfResultResolutions.find(x =>
        label.startsWith(x.name)
      );
      this.clickedResult.emit(clickedResolution);
    }
  }
}
