import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, Sparkles, AlertCircle } from 'lucide-react'
import './ImageUploader.css'

const ImageUploader = ({ imagePreview, onImageChange, onAnalyze, onReset, loading, error }) => {
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
      onImageChange(file)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      onImageChange(file)
    }
  }

  return (
    <motion.div
      className="image-uploader"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="image-uploader-header">
        <h2 className="uploader-title">
          <Sparkles className="title-icon" />
          Your Image
        </h2>
        <motion.button
          className="reset-button"
          onClick={onReset}
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
        >
          <X size={20} />
        </motion.button>
      </div>

      <div className="image-preview-container">
        <div
          className={`image-drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img
            src={imagePreview}
            alt="Upload preview"
            className="preview-image"
          />
          <div className="image-overlay">
            <Upload className="overlay-icon" />
            <p>Drop new image here</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="file-input"
          />
        </div>

        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="error-icon" />
            <span>{error}</span>
          </motion.div>
        )}

        <motion.button
          className="analyze-button"
          onClick={onAnalyze}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <>
              <motion.div
                className="spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="button-icon" />
              <span>Analyze Image</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}

export default ImageUploader

