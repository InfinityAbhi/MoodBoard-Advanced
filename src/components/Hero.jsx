import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Image as ImageIcon, Sparkles, Zap, Globe } from 'lucide-react'
import './Hero.css'

const Hero = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      onImageUpload(file)
    }
  }

  const features = [
    { icon: Sparkles, text: 'AI-Powered Analysis' },
    { icon: Zap, text: 'Instant Results' },
    { icon: Globe, text: 'Cloud Hosted' },
  ]

  return (
    <div className="hero">
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Discover the{' '}
          <span className="gradient-text">Mood</span>
          <br />
          Behind Every Image
        </motion.h1>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Upload any image and let AI reveal emotions, objects, and themes
          hidden within. Powered by Google Cloud Vision API.
        </motion.p>

        <motion.div
          className="upload-area-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <div
            className={`upload-area ${isDragging ? 'dragging' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div
              className="upload-icon"
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Upload size={48} />
            </motion.div>
            <p className="upload-text">
              <span className="upload-text-main">Drop an image here</span>
              <span className="upload-text-sub">or click to browse</span>
            </p>
            <p className="upload-hint">Supports JPG, PNG, GIF, WebP</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="file-input"
            />
          </div>
        </motion.div>

        <motion.div
          className="features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="feature"
              whileHover={{ scale: 1.05, y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
            >
              <feature.icon className="feature-icon" />
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export default Hero

