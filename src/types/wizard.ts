export type PortfolioDetailsData = {
    name: string
    description: string
}

export type BenchmarkSelectionData = {
    benchmark: string
}

export type ScenarioSelectionData = {
    scenario: string
}

export type WizardFormData = PortfolioDetailsData & BenchmarkSelectionData & ScenarioSelectionData

export type Step = 'portfolioDetails' | 'benchmarkSelection' | 'scenarioSelection' | 'summary'

