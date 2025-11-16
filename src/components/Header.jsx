import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import './Header.css'

const Header = ({ headline = 'MoodBoard', tagline = 'AI-powered insights in seconds.' }) => {
  return (
    <motion.header
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="header-content">
        <motion.div
          className="logo"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles className="logo-icon" />
          <span className="logo-text">{headline}</span>
        </motion.div>
        <motion.div
          className="tagline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {tagline}
        </motion.div>
      </div>
    </motion.header>
  )
}

export default Header

