import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Camera, CameraOff, Check, RefreshCw } from 'lucide-react'
import './CameraCapture.css'

const CameraCapture = ({ attendee, onCapture, loading, error, onBack }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const [previewImage, setPreviewImage] = useState(null)
  const [cameraError, setCameraError] = useState(null)

  useEffect(() => {
    let isMounted = true
    const startCamera = async () => {
      try {
        setCameraError(null)
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
          audio: false,
        })

        if (!isMounted) {
          mediaStream.getTracks().forEach((track) => track.stop())
          return
        }

        streamRef.current = mediaStream
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          await videoRef.current.play()
        }
      } catch (err) {
        console.error('Camera access error:', err)
        setCameraError('Unable to access camera. Please check permissions and try again.')
      }
    }

    startCamera()

    return () => {
      isMounted = false
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }
    }
  }, [])

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const dataUrl = canvas.toDataURL('image/png', 0.92)
    setPreviewImage(dataUrl)
  }

  const handleSubmit = () => {
    if (previewImage && !loading) {
      onCapture(previewImage)
    }
  }

  const handleRetake = () => {
    setPreviewImage(null)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  return (
    <motion.section
      className="camera-step"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="camera-card">
        <header className="camera-header">
          <div className="camera-attendee">
            <span className="label">Feedback for</span>
            <strong>{attendee?.email}</strong>
          </div>
          {onBack && (
            <button className="camera-back" onClick={onBack} disabled={loading}>
              Change email
            </button>
          )}
        </header>

        <div className="camera-preview-wrapper">
          {!previewImage ? (
            <div className="camera-live">
              <video ref={videoRef} playsInline muted />
              <div className="camera-overlay">
                <p>Center yourself in the frame and smile when you&apos;re ready.</p>
              </div>
            </div>
          ) : (
            <img src={previewImage} alt="Captured preview" className="camera-still" />
          )}
          <canvas ref={canvasRef} className="hidden-canvas" />
        </div>

        {(cameraError || error) && (
          <motion.div className="camera-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <CameraOff className="error-icon" />
            <span>{cameraError || error}</span>
          </motion.div>
        )}

        <div className="camera-actions">
          {!previewImage ? (
            <motion.button
              type="button"
              className="camera-button primary"
              onClick={capturePhoto}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={!!cameraError || loading}
            >
              <Camera />
              Capture Moment
            </motion.button>
          ) : (
            <div className="camera-button-group">
              <motion.button
                type="button"
                className="camera-button ghost"
                onClick={handleRetake}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
              >
                <RefreshCw />
                Retake
              </motion.button>
              <motion.button
                type="button"
                className="camera-button primary"
                onClick={handleSubmit}
                whileHover={{ scale: loading ? 1 : 1.03 }}
                whileTap={{ scale: loading ? 1 : 0.97 }}
                disabled={loading}
              >
                {loading ? (
                  <span className="inline-loader" />
                ) : (
                  <Check />
                )}
                {loading ? 'Analyzing...' : 'Submit Feedback'}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  )
}

export default CameraCapture
