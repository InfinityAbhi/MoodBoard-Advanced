import { motion } from 'framer-motion'
import { Tag, TrendingUp } from 'lucide-react'
import './ResultsDisplay.css'

const ResultsDisplay = ({ labels }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'emotion':
        return '#f5576c'
      case 'object':
        return '#667eea'
      default:
        return '#764ba2'
    }
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case 'emotion':
        return '😊'
      case 'object':
        return '🎯'
      default:
        return '🏷️'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className="results-display"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="results-header">
        <div className="results-title-section">
          <Tag className="results-icon" />
          <h2 className="results-title">Detected Mood Tags</h2>
        </div>
        <div className="results-count">
          {labels.length} {labels.length === 1 ? 'tag' : 'tags'}
        </div>
      </div>

      <motion.div
        className="tags-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {labels.map((label, index) => (
          <motion.div
            key={`${label.name}-${index}`}
            className="mood-tag"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.1, 
              y: -5,
              rotate: [0, -5, 5, -5, 0],
            }}
            style={{
              '--tag-color': getTypeColor(label.type),
            }}
          >
            <span className="tag-emoji">{getTypeIcon(label.type)}</span>
            <span className="tag-name">{label.name}</span>
            <div className="tag-confidence">
              <TrendingUp className="confidence-icon" />
              <span>{Math.round(label.confidence * 100)}%</span>
            </div>
            <div 
              className="tag-glow"
              style={{
                background: `radial-gradient(circle, ${getTypeColor(label.type)}40, transparent)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {labels.length > 0 && (
        <motion.div
          className="results-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="footer-text">
            Powered by <span className="highlight">Google Cloud Vision API</span>
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ResultsDisplay

