import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchInsights, fetchPrediction } from '../redux/slices/insightSlice'
import { formatCurrency } from '../utils/format'
import { FiTrendingUp, FiCpu, FiRefreshCw, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi'

function Insights() {
  const dispatch = useDispatch()
  const { insights, predictions, provider, loading, error } = useSelector(state => state.insights)

  useEffect(() => {
    dispatch(fetchInsights())
    dispatch(fetchPrediction())
  }, [dispatch])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">AI Insights & Analytics</h2>
          <p className="text-slate-400 text-sm mt-0.5">Automated recommendations and monthly forecasting metrics.</p>
        </div>
        <button
          onClick={() => { dispatch(fetchInsights()); dispatch(fetchPrediction()) }}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {error && <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4 text-sm text-rose-700">{error}</div>}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recommendation Cards */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <FiCpu className="w-5 h-5 text-secondary" />
              <h3 className="font-bold text-slate-800 text-lg">FinTrack Suggestions</h3>
            </div>
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold capitalize text-secondary border border-indigo-100 shadow-sm">
              Engine: {provider || 'heuristic'}
            </span>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-400 text-sm">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-secondary"></div>
              Generating financial analysis...
            </div>
          ) : (
            <div className="space-y-3">
              {insights.length ? insights.map((item, index) => (
                <div key={`${item}-${index}`} className="flex items-start gap-3 rounded-xl border border-indigo-50/30 bg-indigo-50/10 p-4 text-slate-700 hover:bg-indigo-50/20 transition-colors">
                  <FiCheckCircle className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">{item}</p>
                </div>
              )) : (
                <p className="text-sm text-slate-400 py-6 text-center">
                  Record more transactions to unlock AI analysis recommendations.
                </p>
              )}
            </div>
          )}
        </section>

        {/* Prediction Cards */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-premium h-fit space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <FiTrendingUp className="w-5 h-5 text-secondary" />
            <h3 className="font-bold text-slate-800 text-lg">Spending Forecast</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projected Month Spend</p>
              <p className="text-3xl font-extrabold text-slate-800 mt-1">
                {formatCurrency(predictions.predictedExpense || 0)}
              </p>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confidence Level</p>
              <div className="mt-2">
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-emerald-500 transition-all duration-500"
                    style={{ width: `${predictions.confidence || 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mt-1">
                  <span>{predictions.confidence || 0}% Accuracy</span>
                  <span className="text-slate-400">Sample Count Scored</span>
                </div>
              </div>
            </div>

            {predictions.budgetRisk && (
              <div className="flex items-start gap-2.5 rounded-xl border border-amber-100 bg-amber-50/50 p-4 text-xs font-medium text-amber-800 leading-relaxed">
                <FiAlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
                Warning: Projected month outflows exceed your global monthly limit. Consider restricting discretionary categories immediately.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default Insights