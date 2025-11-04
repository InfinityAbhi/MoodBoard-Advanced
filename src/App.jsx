import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Hero from './components/Hero'
import ImageUploader from './components/ImageUploader'
import ResultsDisplay from './components/ResultsDisplay'
import Background3D from './components/Background3D'
import './App.css'

function App() {
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [labels, setLabels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImageUpload = (file) => {
    setImageFile(file)
    setLabels([])
    setError(null)
    
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleImageAnalysis = async (base64Image) => {
    setLoading(true)
    setError(null)

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY
      
      if (!apiKey) {
        throw new Error('Google Cloud Vision API key not found. Please set VITE_GOOGLE_CLOUD_VISION_API_KEY in your .env file')
      }

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            requests: [
              {
                image: {
                  content: base64Image.split(',')[1],
                },
                features: [
                  { type: 'LABEL_DETECTION', maxResults: 20 },
                  { type: 'FACE_DETECTION', maxResults: 10 },
                  { type: 'OBJECT_LOCALIZATION', maxResults: 20 },
                ],
              },
            ],
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Failed to analyze image')
      }

      const data = await response.json()
      
      // Process labels from different detection types
      const processedLabels = []
      
      // Label detection results
      if (data.responses[0]?.labelAnnotations) {
        data.responses[0].labelAnnotations.forEach(label => {
          processedLabels.push({
            name: label.description,
            confidence: label.score,
            type: 'label'
          })
        })
      }
      
      // Face detection results (emotions)
      if (data.responses[0]?.faceAnnotations) {
        data.responses[0].faceAnnotations.forEach((face, index) => {
          const emotions = []
          if (face.joyLikelihood && face.joyLikelihood !== 'VERY_UNLIKELY') {
            emotions.push('Joy')
          }
          if (face.sorrowLikelihood && face.sorrowLikelihood !== 'VERY_UNLIKELY') {
            emotions.push('Sorrow')
          }
          if (face.angerLikelihood && face.angerLikelihood !== 'VERY_UNLIKELY') {
            emotions.push('Anger')
          }
          if (face.surpriseLikelihood && face.surpriseLikelihood !== 'VERY_UNLIKELY') {
            emotions.push('Surprise')
          }
          
          emotions.forEach(emotion => {
            processedLabels.push({
              name: emotion,
              confidence: 0.8,
              type: 'emotion'
            })
          })
        })
      }
      
      // Object detection results
      if (data.responses[0]?.localizedObjectAnnotations) {
        data.responses[0].localizedObjectAnnotations.forEach(obj => {
          processedLabels.push({
            name: obj.name,
            confidence: obj.score,
            type: 'object'
          })
        })
      }

      // Remove duplicates and sort by confidence
      const uniqueLabels = processedLabels.reduce((acc, label) => {
        const existing = acc.find(l => l.name.toLowerCase() === label.name.toLowerCase())
        if (!existing) {
          acc.push(label)
        } else if (label.confidence > existing.confidence) {
          Object.assign(existing, label)
        }
        return acc
      }, [])

      uniqueLabels.sort((a, b) => b.confidence - a.confidence)
      setLabels(uniqueLabels.slice(0, 15))
    } catch (err) {
      console.error('Error analyzing image:', err)
      setError(err.message || 'Failed to analyze image. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!imageFile) return

    const base64Image = imagePreview
    await handleImageAnalysis(base64Image)
  }

  const handleReset = () => {
    setImageFile(null)
    setImagePreview(null)
    setLabels([])
    setError(null)
  }

  return (
    <div className="app">
      <Background3D />
      <Header />
      <main className="main-content">
        <AnimatePresence mode="wait">
          {!imagePreview ? (
            <Hero key="hero" onImageUpload={handleImageUpload} />
          ) : (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="analysis-container"
            >
              <ImageUploader
                imagePreview={imagePreview}
                onImageChange={handleImageUpload}
                onAnalyze={handleAnalyze}
                onReset={handleReset}
                loading={loading}
                error={error}
              />
              {labels.length > 0 && (
                <ResultsDisplay labels={labels} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App

