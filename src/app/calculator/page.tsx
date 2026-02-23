'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import StepIncome from '@/components/calculator/StepIncome'
import StepExpense from '@/components/calculator/StepExpense'
import StepAssets from '@/components/calculator/StepAssets'
import StepGoals from '@/components/calculator/StepGoals'
import { calculateFire } from '@/lib/fire-engine'
import type { FireInput } from '@/types/fire'

const STEP_LABELS = ['收入', '支出', '資產', '目標']

const defaultFormData: FireInput = {
  income: {
    monthlySalary: 0,
    bonusMonths: 0,
    otherMonthlyIncome: 0,
    spouseMonthlyIncome: 0,
    laborInsuranceYears: 10,
    voluntaryPensionRate: 0,
  },
  expense: {
    housingCost: 0,
    livingCost: 0,
    insuranceCost: 0,
    parentalSupport: 0,
    educationCost: 0,
    otherFixedCost: 0,
    annualLargeExpense: 0,
  },
  asset: {
    savings: 0,
    investments: 0,
    insuranceSavings: 0,
    otherAssets: 0,
    totalDebt: 0,
  },
  goal: {
    currentAge: 0,
    targetRetireAge: 55,
    retirementMonthlyExpense: 0,
    riskProfile: 'moderate',
  },
}

export default function CalculatorPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FireInput>(defaultFormData)

  const progressValue = (currentStep / 4) * 100

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 1:
        return formData.income.monthlySalary > 0
      case 2:
        return formData.expense.livingCost > 0
      case 3:
        return true // 0 存款也是合法的情境
      case 4:
        return (
          formData.goal.currentAge > 0 &&
          formData.goal.retirementMonthlyExpense > 0
        )
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      // 計算結果
      const result = calculateFire(formData)
      // 存到 sessionStorage
      sessionStorage.setItem('fire-result', JSON.stringify(result))
      sessionStorage.setItem('fire-input', JSON.stringify(formData))
      router.push('/calculator/result')
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 頂部進度條 */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-3">
            <button
              onClick={() => router.push('/')}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              FIRE 計算器
            </button>
            <span className="text-sm text-gray-500 font-medium">
              Step {currentStep} / 4
            </span>
          </div>

          {/* 步驟指示 */}
          <div className="flex gap-2 mb-3">
            {STEP_LABELS.map((label, i) => (
              <div
                key={label}
                className={`flex-1 text-center text-xs font-medium py-1 rounded-full transition-colors ${
                  i + 1 === currentStep
                    ? 'bg-[#1e3a5f] text-white'
                    : i + 1 < currentStep
                      ? 'bg-[#10b981] text-white'
                      : 'bg-gray-100 text-gray-400'
                }`}
              >
                {label}
              </div>
            ))}
          </div>

          <Progress value={progressValue} className="h-1.5" />
        </div>
      </div>

      {/* 表單內容 */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {currentStep === 1 && (
          <StepIncome
            data={formData.income}
            onChange={(income) => setFormData({ ...formData, income })}
          />
        )}
        {currentStep === 2 && (
          <StepExpense
            data={formData.expense}
            onChange={(expense) => setFormData({ ...formData, expense })}
          />
        )}
        {currentStep === 3 && (
          <StepAssets
            data={formData.asset}
            onChange={(asset) => setFormData({ ...formData, asset })}
          />
        )}
        {currentStep === 4 && (
          <StepGoals
            data={formData.goal}
            onChange={(goal) => setFormData({ ...formData, goal })}
          />
        )}

        {/* 導航按鈕 */}
        <div className="flex gap-4 mt-8">
          {currentStep > 1 && (
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrev}
              className="flex-1 h-14 text-lg rounded-xl"
            >
              上一步
            </Button>
          )}
          <Button
            size="lg"
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex-1 h-14 text-lg font-semibold rounded-xl transition-all ${
              currentStep === 4
                ? 'bg-[#10b981] hover:bg-[#059669]'
                : 'bg-[#1e3a5f] hover:bg-[#162d4a]'
            } text-white`}
          >
            {currentStep === 4 ? '計算結果' : '下一步'}
          </Button>
        </div>
      </div>
    </div>
  )
}
