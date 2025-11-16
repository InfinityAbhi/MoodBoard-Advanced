import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import Background3D from './components/Background3D'
import EmailStep from './components/EmailStep'
import CameraCapture from './components/CameraCapture'
import FeedbackSummary from './components/FeedbackSummary'
import { supabase } from './lib/supabaseClient'
import { deriveSatisfactionScore } from './utils/satisfaction'
import './App.css'

const FEEDBACK_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'feedback-photos'
const ACTIVE_EVENT_ID = import.meta.env.VITE_ACTIVE_EVENT_ID

const ensureSupabaseClient = () => {
  if (!supabase) {
    throw new Error('Supabase client not initialised. Please check your environment configuration.')
  }
}

const dataUrlToFile = (dataUrl, fileName) => {
  const [header, base64] = dataUrl.split(',')
  const mimeMatch = header.match(/:(.*?);/)
  const mime = mimeMatch?.[1] || 'image/png'
  const binary = atob(base64)
  const array = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    array[i] = binary.charCodeAt(i)
  }
  return new File([array], fileName, { type: mime })
}

function App() {
  const [step, setStep] = useState('email')
  const [attendee, setAttendee] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const resetFlow = useCallback(() => {
    setStep('email')
    setAttendee(null)
    setFeedback(null)
    setError(null)
    setLoading(false)
  }, [])

  const verifyAttendee = useCallback(async (email) => {
    ensureSupabaseClient()

    if (!ACTIVE_EVENT_ID) {
      throw new Error('Active event is not configured. Set VITE_ACTIVE_EVENT_ID in your environment variables.')
    }

    const normalizedEmail = email.trim().toLowerCase()

    const { data, error: selectError } = await supabase
      .from('event_attendees')
      .select('id, email, has_participated, name')
      .eq('event_id', ACTIVE_EVENT_ID)
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (selectError) {
      throw new Error(selectError.message)
    }

    if (!data) {
      throw new Error('Email not found for this event. Please check the spelling or contact the organiser.')
    }

    if (data.has_participated) {
      throw new Error('Feedback already captured for this email. Thank you!')
    }

    return data
  }, [])

  const handleEmailSubmit = useCallback(async (email) => {
    try {
      setLoading(true)
      setError(null)

      const attendeeRecord = await verifyAttendee(email)
      setAttendee(attendeeRecord)
      setStep('camera')
    } catch (err) {
      console.error('Email verification failed:', err)
      setError(err.message || 'Unable to verify email. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [verifyAttendee])

  const analyseImage = useCallback(async (imageDataUrl) => {
    const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY

    if (!apiKey) {
      throw new Error('Google Cloud Vision API key missing. Set VITE_GOOGLE_CLOUD_VISION_API_KEY in your environment variables.')
    }

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [
            {
              image: { content: imageDataUrl.split(',')[1] },
              features: [{ type: 'FACE_DETECTION', maxResults: 1 }],
            },
          ],
        }),
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error?.message || 'Failed to analyse expression. Please retry.')
    }

    const data = await response.json()
    const faceAnnotation = data.responses?.[0]?.faceAnnotations?.[0]

    if (!faceAnnotation) {
      throw new Error('No face detected in the frame. Please try again.')
    }

    return deriveSatisfactionScore(faceAnnotation)
  }, [])

  const persistFeedback = useCallback(async ({
    attendeeRecord,
    analysis,
    imageDataUrl,
  }) => {
    ensureSupabaseClient()

    const timestamp = Date.now()
    const safeEmail = attendeeRecord.email.replace(/[^a-z0-9]/gi, '_')
    const fileName = `${ACTIVE_EVENT_ID}-${safeEmail}-${timestamp}.png`
    const file = dataUrlToFile(imageDataUrl, fileName)

    const { error: uploadError } = await supabase
      .storage
      .from(FEEDBACK_BUCKET)
      .upload(fileName, file, { contentType: file.type })

    if (uploadError) {
      throw new Error(uploadError.message)
    }

    const { data: publicUrlData } = supabase
      .storage
      .from(FEEDBACK_BUCKET)
      .getPublicUrl(fileName)

    const photoUrl = publicUrlData?.publicUrl || null

    const { error: insertError } = await supabase
      .from('feedback')
      .insert({
        event_id: ACTIVE_EVENT_ID,
        attendee_id: attendeeRecord.id,
        email: attendeeRecord.email,
        score: analysis.score,
        satisfaction_label: analysis.label,
        sentiment_context: analysis.context,
        photo_path: fileName,
        photo_url: photoUrl,
      })

    if (insertError) {
      throw new Error(insertError.message)
    }

    const { error: updateError } = await supabase
      .from('event_attendees')
      .update({ has_participated: true, last_feedback_at: new Date().toISOString() })
      .eq('id', attendeeRecord.id)

    if (updateError) {
      throw new Error(updateError.message)
    }

    return { ...analysis, photoUrl }
  }, [])

  const handleCapture = useCallback(async (imageDataUrl) => {
    try {
      if (!attendee) {
        throw new Error('Attendee context missing. Please restart the flow.')
      }

      setLoading(true)
      setError(null)

      const analysis = await analyseImage(imageDataUrl)
      const result = await persistFeedback({
        attendeeRecord: attendee,
        analysis,
        imageDataUrl,
      })

      setFeedback({
        email: attendee.email,
        score: result.score,
        label: result.label,
        context: result.context,
        photoUrl: result.photoUrl,
      })

      setStep('summary')
    } catch (err) {
      console.error('Feedback capture failed:', err)
      setError(err.message || 'Unable to capture feedback. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [analyseImage, attendee, persistFeedback])

  return (
    <div className="app">
      <Background3D />
      <Header headline="Event Feedback Station" tagline="Verify, capture, analyse – all in seconds." />
      <main className="main-content">
        {error && step !== 'email' && (
          <motion.div
            className="global-error"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}
        <AnimatePresence mode="wait">
          {step === 'email' && (
            <EmailStep key="email" onSubmit={handleEmailSubmit} loading={loading} error={error} />
          )}
          {step === 'camera' && attendee && (
            <CameraCapture
              key="camera"
              attendee={attendee}
              onCapture={handleCapture}
              loading={loading}
              error={error}
              onBack={resetFlow}
            />
          )}
          {step === 'summary' && feedback && (
            <FeedbackSummary key="summary" feedback={feedback} onReset={resetFlow} />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default App

