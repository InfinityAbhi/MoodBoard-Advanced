import { useState } from 'react'
import { motion } from 'framer-motion'
import { MailCheck, Loader2 } from 'lucide-react'
import './EmailStep.css'

const EmailStep = ({ onSubmit, loading, error }) => {
  const [email, setEmail] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!loading && email.trim()) {
      onSubmit(email.trim())
    }
  }

  return (
    <motion.section
      className="email-step"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="email-card">
        <motion.div className="email-header" layout>
          <MailCheck className="email-icon" />
          <div>
            <h1>Welcome! Let&apos;s Capture Your Feedback</h1>
            <p>Enter your registered email to get started.</p>
          </div>
        </motion.div>

        <form className="email-form" onSubmit={handleSubmit}>
          <label htmlFor="email-input">Registered email address</label>
          <input
            id="email-input"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            disabled={loading}
            autoComplete="email"
          />

          {error ? (
            <motion.div
              className="email-error"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          ) : (
            <p className="email-hint">
              We&apos;ll verify you against today&apos;s event list. One feedback entry per person.
            </p>
          )}

          <motion.button
            type="submit"
            className="email-submit"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="spinner" />
                Verifying...
              </>
            ) : (
              'Verify & Continue'
            )}
          </motion.button>
        </form>
      </div>
    </motion.section>
  )
}

export default EmailStep



