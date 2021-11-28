<template>
  <div>
    <div class="d-flex justify-content-end TopMargin">
      <b-button
        v-if="isSubmitted && !isLoading"
        @click="newSearch"
        variant="info"
        >New Search</b-button
      >
    </div>
    <!-- input card -->
    <div class="card" v-if="!isSubmitted && !isLoading">
      <div class="card-header">
        <h4>Add URL</h4>
      </div>
      <div class="card-body">
        <b-form class="form" @submit.stop.prevent="submitForm">
          <b-form-group>
            <!-- <b-form-input
              id="device"
              name="device"
              v-model.trim="$v.form.url.$model"
              :state="validateState('url')"
              placeholder="Enter URL to Analyze"
              aria-describedby="input-0-live-feedback"
            ></b-form-input> -->
            <b-form-select
              id="device"
              name="device"
              v-model.trim="$v.form.device.$model"
              :options="deviceOptions"
              :state="validateState('device')"
              aria-describedby="input-0-live-feedback"
            ></b-form-select>
            <b-form-invalid-feedback id="input-0-live-feedback">
              <p v-if="!$v.form.device.required">Field is required.</p>
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <b-form-input
              id="url"
              v-model.trim="$v.form.url.$model"
              :state="validateState('url')"
              placeholder="Enter URL to Analyze"
              aria-describedby="input-0-live-feedback"
            ></b-form-input>
            <b-form-invalid-feedback id="input-0-live-feedback">
              <p v-if="!$v.form.url.required">Field is required.</p>
              <p v-if="!$v.form.url.url">Please Enter Valid URL.</p>
            </b-form-invalid-feedback>
          </b-form-group>
          <button type="submit" class="btn btn-info btn-sm float-right">
            Analyze Site
          </button>
        </b-form>
      </div>
    </div>
    <!-- Loading Card -->
    <div class="card" v-if="isSubmitted && isLoading">
      <div class="row">
        <div class="col-md-3">
          <div class="m-3" style="height: 200px">
            <b-skeleton-img no-aspect></b-skeleton-img>
          </div>
        </div>
        <div class="col-md-9">
          <div class="card-body">
            <h4 class="card-title m-1">Analyzing your result</h4>
            <p class="card-text text-muted">{{ this.form.url }}</p>
            <!-- v-if="isDataLoaded" -->
            <b-progress
              :value="progressValue"
              :max="maxProgress"
              variant="info"
              show-progress
              animated
            ></b-progress>
            <!-- <div class="mt-2">
              <div class="d-flex">
                <p class="card-text m-1">Testing Server Location</p>
                <p class="card-text m-1 font-weight-bold">vancouver, Canada</p>
              </div>
              <div class="d-flex">
                <p class="card-text m-1">using</p>
                <p class="card-text m-1 font-weight-bold">
                  chrome (Desktop) 86.0.4240.193, Lighthouse 6.3.0
                </p>
              </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- Result Card -->
    <div class="row" v-if="isSubmitted && !isLoading && !isResourceExhausted">
      <!-- left side top box-->
      <div class="col-md-6">
        <div class="card">
          <div class="card-body mt-2">
            <img :src="this.image" style="width: 100%" />
            <h4 class="font-weight-bold mt-5">
              Latest Performance Report for:
            </h4>
            <div class="w-75 d-flex justify-content-between">
              <p class="text-muted">Requested Url</p>
              <p class="font-weight-bold">{{ this.form.url }}</p>
            </div>
            <div class="w-75 d-flex justify-content-between">
              <p class="text-muted">Report generated</p>
              <p class="font-weight-bold">
                {{
                  pageSpeedParams
                    ? pageSpeedParams.lighthouseResult.fetchTime
                    : "-"
                }}
              </p>
            </div>
            <!-- <div class="w-75 d-flex justify-content-between">
              <p class="text-muted">Test Server Location</p>
              <p class="font-weight-bold">Vancouver,Canada</p>
            </div>
            <div class="w-75 d-flex justify-content-between">
              <p class="text-muted">Using</p>
              <p class="font-weight-bold">
                Chrome (Desktop) 86.0.4240.193,Lighthouse 6.3.0
              </p>
            </div> -->
          </div>
        </div>
        <!-- left side bottom box -->
        <div class="card mt-2">
          <div class="card-body">
            <!-- top box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">Metrics</h4>
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "server-response-time"
                          ].numericValue +
                          " " +
                          pageSpeedParams.lighthouseResult.audits[
                            "server-response-time"
                          ].numericUnit
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    Server Response Time
                  </p>
                </div>
              </div>
            </b-jumbotron>
            <!-- 1st Box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">
                  Light House Result
                </h4>
                <div class="d-flex justify-content-around">
                  <!-- first-contentful-paint -->
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "first-contentful-paint"
                          ].displayValue
                        : "-"
                    }}
                  </p>
                  <!-- largest-contentful-paint -->
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "largest-contentful-paint"
                          ].displayValue
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    First Contentful Paint (FCP)
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Largest Contentful Paint (LCP)
                  </p>
                </div>
              </div>
            </b-jumbotron>
            <!-- 2nd Box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">
                  Light House Result
                </h4>
                <div class="d-flex justify-content-around">
                  <!-- max-potential-first input delay -->
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "max-potential-fid"
                          ].displayValue
                        : "-"
                    }}
                  </p>
                  <!-- total-blocking-time -->
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "total-blocking-time"
                          ].displayValue
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    Max Potential First Input Delay
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Total Blocking Time
                  </p>
                </div>
              </div>
            </b-jumbotron>
          </div>
        </div>
        <!-- Diagnostics -->
        <div class="card mt-2">
          <div class="card-body">
            <!-- top box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">
                  Diagnostics
                </h4>
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "mainthread-work-breakdown"
                          ].displayValue
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    Minimizes main-thread work
                  </p>
                </div>
              </div>
            </b-jumbotron>
            <!-- 1st Box -->
            <template >
              <b-jumbotron bg-variant="light-success" class="p-1" v-for="row in diagnostics" :key="row">
                <div class="w-100">
                  <!-- <h4 class="text-center card-title text-info mt-1">
                    Diagnostics
                  </h4> -->
                  <div class="d-flex justify-content-around" >
                    <p
                      class="text-primary"
                      style="font-size: 40px; font-weight: 500"
                    >
                      {{ (row.duration ? row.duration.toFixed(2) : 0) + "ms" }}
                    </p>
                  </div>
                  <div class="d-flex justify-content-around">
                    <p class="font-weight-bold" style="font-size: 14px">
                      {{ row.groupLabel }}
                    </p>
                  </div>
                </div>
              </b-jumbotron>
            </template>
          </div>
        </div>
        <!-- Diagnostics -->
      </div>
      <!-- right side -->
      <div class="col-md-6">
        <!-- Screen Shots -->
        <div class="card">
          <div class="card-body">
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100 text-center">
                <h4 class="text-center card-title text-info mt-1">
                  Sreenshots
                </h4>
                <div>
                  <span
                    v-for="(row, i) in screenshot"
                    :key="i"
                    class="screenshot"
                  >
                    <img :src="row.data" alt="" />
                  </span>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    Tree Map
                  </p>
                </div>
              </div>
            </b-jumbotron>
          </div>
        </div>
        <!-- Screen Shots -->
        <!-- Bar Status  -->
        <div class="card mt-2">
          <div class="card-body">
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100 text-center">
                <h4 class="text-center card-title text-info mt-1">
                  Origin Summary
                </h4>
                <div class="row text-left">
                  <div class="col-md-6 mb-3">
                    <h6>First Contentful Paint (FCP)</h6>
                    <b-progress
                      height="1.5rem"
                      class="mt-2"
                      :max="
                        getTotalProporation(
                          this.barsData.FIRST_CONTENTFUL_PAINT_MS.distributions
                        )
                      "
                      show-value
                    >
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.FIRST_CONTENTFUL_PAINT_MS
                              .distributions[0]
                          )
                        "
                        variant="success"
                      ></b-progress-bar>
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.FIRST_CONTENTFUL_PAINT_MS
                              .distributions[1]
                          )
                        "
                        variant="warning"
                      ></b-progress-bar>
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.FIRST_CONTENTFUL_PAINT_MS
                              .distributions[2]
                          )
                        "
                        variant="danger"
                      ></b-progress-bar>
                    </b-progress>
                  </div>
                  <div class="col-md-6 mb-3">
                    <h6>First Input Delay (FID)</h6>
                    <b-progress
                      height="1.5rem"
                      class="mt-2"
                      :max="
                        getTotalProporation(
                          this.barsData.FIRST_INPUT_DELAY_MS.distributions
                        )
                      "
                      show-value
                    >
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.FIRST_INPUT_DELAY_MS.distributions[0]
                          )
                        "
                        variant="success"
                      ></b-progress-bar>
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.FIRST_INPUT_DELAY_MS.distributions[1]
                          )
                        "
                        variant="warning"
                      ></b-progress-bar>
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.FIRST_INPUT_DELAY_MS.distributions[2]
                          )
                        "
                        variant="danger"
                      ></b-progress-bar>
                    </b-progress>
                  </div>
                  <div class="col-md-6 mb-3">
                    <h6>Largest Contentful Paint (LCP)</h6>
                    <b-progress
                      height="1.5rem"
                      class="mt-2"
                      :max="
                        getTotalProporation(
                          this.barsData.LARGEST_CONTENTFUL_PAINT_MS
                            .distributions
                        )
                      "
                      show-value
                    >
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.LARGEST_CONTENTFUL_PAINT_MS
                              .distributions[0]
                          )
                        "
                        variant="success"
                      ></b-progress-bar>
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.LARGEST_CONTENTFUL_PAINT_MS
                              .distributions[1]
                          )
                        "
                        variant="warning"
                      ></b-progress-bar>
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.LARGEST_CONTENTFUL_PAINT_MS
                              .distributions[2]
                          )
                        "
                        variant="danger"
                      ></b-progress-bar>
                    </b-progress>
                  </div>
                  <div class="col-md-6 mb-3">
                    <h6>Cumulative Layout Shift (CLS)</h6>
                    <b-progress
                      height="1.5rem"
                      class="mt-2"
                      :max="
                        getTotalProporation(
                          this.barsData.CUMULATIVE_LAYOUT_SHIFT_SCORE
                            .distributions
                        )
                      "
                      show-value
                    >
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.CUMULATIVE_LAYOUT_SHIFT_SCORE
                              .distributions[0]
                          )
                        "
                        variant="success"
                      ></b-progress-bar>
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.CUMULATIVE_LAYOUT_SHIFT_SCORE
                              .distributions[1]
                          )
                        "
                        variant="warning"
                      ></b-progress-bar>
                      <b-progress-bar
                        :value="
                          getBarProporation(
                            this.barsData.CUMULATIVE_LAYOUT_SHIFT_SCORE
                              .distributions[2]
                          )
                        "
                        variant="danger"
                      ></b-progress-bar>
                    </b-progress>
                  </div>
                </div>
              </div>
            </b-jumbotron>
          </div>
        </div>
        <!-- Bar Status  -->
        <!-- Metrics -->
        <div class="card mt-2">
          <div class="card-body">
            <!-- top box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">Metrics</h4>
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.categories
                            .performance.score *
                            100 +
                          "%"
                        : "-"
                    }}
                  </p>
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits["speed-index"]
                            .displayValue
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    Peformance
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Speed Index
                  </p>
                </div>
              </div>
            </b-jumbotron>
            <!-- 1st Box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">
                  Original Loading Metrics
                </h4>
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.originLoadingExperience.metrics
                            .FIRST_CONTENTFUL_PAINT_MS.percentile /
                            1000 +
                          "ms"
                        : "-"
                    }}
                  </p>
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.originLoadingExperience.metrics
                            .LARGEST_CONTENTFUL_PAINT_MS.percentile /
                            1000 +
                          "ms"
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    First Contentful Paint (FCP)
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Largest Contentful Paint (LCP)
                  </p>
                </div>
              </div>
            </b-jumbotron>
            <!-- 2nd Box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">
                  Original Loading Metrics
                </h4>
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.originLoadingExperience.metrics
                            .FIRST_INPUT_DELAY_MS.percentile /
                            1000 +
                          "ms"
                        : "-"
                    }}
                  </p>
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.originLoadingExperience.metrics
                            .CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile /
                            1000 +
                          "ms"
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    First Input Delay (FID)
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Cumulative Layout Shift (CLS)
                  </p>
                </div>
              </div>
            </b-jumbotron>
          </div>
        </div>
        <!-- Metrics -->
        <!-- Loading Experience -->
        <div class="card mt-2">
          <div class="card-body">
            <!-- top box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">
                  Loading Experience
                </h4>
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.timing.total + "s"
                        : "-"
                    }}
                  </p>
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.loadingExperience.overall_category
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    Timing
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Overall
                  </p>
                </div>
              </div>
            </b-jumbotron>
            <!-- 1st Box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">
                  Audits
                </h4>
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "first-meaningful-paint"
                          ].displayValue
                        : "-"
                    }}
                  </p>
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "max-potential-fid"
                          ].displayValue
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    First Meaningful Paint (FMP)
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Max Potential Fid (MPF)
                  </p>
                </div>
              </div>
            </b-jumbotron>
            <!-- 2nd Box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">
                  Original Loading Metrics
                </h4>
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.originLoadingExperience.metrics
                            .FIRST_INPUT_DELAY_MS.percentile /
                            1000 +
                          "ms"
                        : "-"
                    }}
                  </p>
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.originLoadingExperience.metrics
                            .CUMULATIVE_LAYOUT_SHIFT_SCORE.percentile /
                            1000 +
                          "ms"
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    First Input Delay (FID)
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Cumulative Layout Shift (CLS)
                  </p>
                </div>
              </div>
            </b-jumbotron>
          </div>
        </div>
        <!-- Loading Experience -->
        <!-- Opportunity -->
        <div class="card mt-2">
          <div class="card-body">
            <!-- top box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <h4 class="text-center card-title text-info mt-1">
                  Opportunity
                </h4>
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "unused-javascript"
                          ].details.overallSavingsMs + "ms"
                        : "-"
                    }}
                  </p>
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "unused-css-rules"
                          ].details.overallSavingsMs + "ms"
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    Unused Javascript
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Unused CSS
                  </p>
                </div>
              </div>
            </b-jumbotron>
            <!-- 1st Box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <!-- <h4 class="text-center card-title text-info mt-1">
                  Original Loading Metrics
                </h4> -->
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "unminified-javascript"
                          ].details.overallSavingsMs + "ms"
                        : "-"
                    }}
                  </p>
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "unminified-css"
                          ].details.overallSavingsMs + "ms"
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    Unminified Javascript
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    Unminified CSS
                  </p>
                </div>
              </div>
            </b-jumbotron>
            <!-- 2nd Box -->
            <b-jumbotron bg-variant="light-success" class="p-1">
              <div class="w-100">
                <!-- <h4 class="text-center card-title text-info mt-1">
                  Original Loading Metrics
                </h4> -->
                <div class="d-flex justify-content-around">
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits[
                            "duplicated-javascript"
                          ].details.overallSavingsMs + "ms"
                        : "-"
                    }}
                  </p>
                  <p
                    class="text-primary"
                    style="font-size: 40px; font-weight: 500"
                  >
                    {{
                      pageSpeedParams
                        ? pageSpeedParams.lighthouseResult.audits["bootup-time"]
                            .displayValue
                        : "-"
                    }}
                  </p>
                </div>
                <div class="d-flex justify-content-around">
                  <p class="font-weight-bold" style="font-size: 14px">
                    Duplicated Javascript
                  </p>
                  <p class="font-weight-bold" style="font-size: 14px">
                    JavaScript Execution Time
                  </p>
                </div>
              </div>
            </b-jumbotron>
          </div>
        </div>
        <!-- Opportunity -->
      </div>
    </div>
  </div>
</template>
<script>
import { SET_BREADCRUMB } from "@/core/services/store/breadcrumbs.module";
import ApiService from "../../../../core/services/api.service";
import { validationMixin } from "vuelidate";
import { required, minLength, url } from "vuelidate/lib/validators";
export default {
  name: "metrics",
  mixins: [validationMixin],
  data() {
    return {
      form: {
        url: "",
        device: null
      },
      deviceOptions: [
        { value: null, text: "Please select a device" },
        { value: "mobile", text: "Mobile" },
        { value: "desktop", text: "Desktop" }
      ],
      progressValue: 0,
      maxProgress: 100,
      isDataLoaded: false,
      isLoading: false,
      isSubmitted: false,
      isResourceExhausted: false,
      pageSpeedParams: {},
      image: "",
      errMessage: "",
      diagnostics: [],
      screenshot: [],
      barsData: [],
      temp: null
    };
  },
  validations: {
    form: {
      url: {
        required,
        url,
        minLength: minLength(3)
      },
      device: {
        required
      }
    }
  },
  mounted() {
    this.$store.dispatch(SET_BREADCRUMB, [{ title: "Metrics" }]);
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    resetForm() {
      this.form = {
        url: null,
        device: null
      };

      this.$nextTick(() => {
        this.$v.$reset();
      });
    },
    showMsg(type, msg) {
      this.$swal
        .fire({
          icon: type,
          text: msg
        })
        .then(result => {
          if (result.isConfirmed) {
            this.newSearch();
          }
        });
    },
    submitForm() {
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.isLoading = true;
      this.isSubmitted = true;
      let url = this.$v.form.url.$model;
      let device = this.$v.form.device.$model;
      this.setProgressBar();
      ApiService.get(`/testpagespeed?device=${device}&url=${url}`).then(res => {
        if (res.status == 200) {
          if (res.data.data.hasOwnProperty("error")) {
            let msg = res.data.data.error.message;
            this.isResourceExhausted = true;
            this.showMsg("error", msg);
          } else {
            this.pageSpeedParams = res.data.data;
            this.image = this.pageSpeedParams.lighthouseResult.audits[
              "full-page-screenshot"
            ].details.screenshot.data;
            this.diagnostics = this.pageSpeedParams.lighthouseResult.audits[
              "mainthread-work-breakdown"
            ].details.items;
            this.screenshot = this.pageSpeedParams.lighthouseResult.audits[
              "screenshot-thumbnails"
            ].details.items;
            this.barsData = this.pageSpeedParams.originLoadingExperience.metrics;
            this.isDataLoaded = true;
            this.progressValue = 100;
            // this.setProgressBar();
          }
        }
      });
    },
    setProgressBar() {
      let that = this;
      if (this.progressValue >= 100) {
        this.isLoading = false;
        this.progressValue = 0;
      } else {
        setTimeout(() => {
          that.progressValue += 5;
          that.setProgressBar();
        }, 2500);
      }
    },
    newSearch() {
      this.isLoading = false;
      this.isSubmitted = false;
      this.isResourceExhausted = false;
      this.progressValue = 0;
      this.isDataLoaded = false;
      this.resetForm();
    },
    getBarProporation(arr) {
      return Math.round(arr.proportion * 100);
    },
    getTotalProporation(arr) {
      this.temp = arr;
      // console.log(arr);
      // console.log(
      //   Math.round(arr.map(r => r.proportion).reduce((a, b) => a + b, 0)) * 100
      // );
      return (
        Math.round(arr.map(r => r.proportion).reduce((a, b) => a + b, 0)) * 100
      );
    }
  }
};
</script>
<style scoped>
.TopMargin {
  margin-bottom: 3rem;
}
.placeTop {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  width: 80%;
}
.screenshot img {
  border: 1px solid #c5c5c5;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  width: 100px;
}
.screenshot img:hover {
  border: 1px solid #4e8cff;
}
</style>
