import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import './FeedbackSummary.css'

const FeedbackSummary = ({ feedback, onReset }) => {
  if (!feedback) return null

  const { email, score, label, context, photoUrl } = feedback

  return (
    <motion.section
      className="summary-step"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="summary-card">
        <div className="summary-header">
          <div className="summary-icon">
            <CheckCircle2 />
          </div>
          <div>
            <h1>Feedback Captured!</h1>
            <p>The response has been safely stored for {email}.</p>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-score">
            <span className="score-label">Satisfaction Score</span>
            <div className="score-value">{score}/10</div>
            <div className="score-text">{label}</div>
            <p className="score-context">{context}</p>
          </div>

          {photoUrl && (
            <div className="summary-photo">
              <img src={photoUrl} alt="Captured feedback" />
              <span>Captured moment</span>
            </div>
          )}
        </div>

        <motion.button
          type="button"
          className="summary-reset"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={onReset}
        >
          <ArrowLeft />
          Start next feedback
        </motion.button>
      </div>
    </motion.section>
  )
}

export default FeedbackSummary
