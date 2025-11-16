const likelihoodToScore = (likelihood = 'UNKNOWN') => {
  switch (likelihood) {
    case 'VERY_LIKELY':
      return 10
    case 'LIKELY':
      return 8
    case 'POSSIBLE':
      return 6
    case 'UNLIKELY':
      return 3
    case 'VERY_UNLIKELY':
      return 1
    default:
      return 5
  }
}

const clampScore = (value) => Math.min(10, Math.max(1, Math.round(value)))

const labelBuckets = [
  { min: 1, max: 2, label: 'Frustrated' },
  { min: 3, max: 4, label: 'Disappointed' },
  { min: 5, max: 6, label: 'Neutral' },
  { min: 7, max: 8, label: 'Satisfied' },
  { min: 9, max: 10, label: 'Delighted' },
]

export const deriveSatisfactionScore = (faceAnnotation) => {
  if (!faceAnnotation) {
    return {
      score: 5,
      label: 'Neutral',
      context: 'No face detected. Defaulting to neutral response.',
    }
  }

  const joy = likelihoodToScore(faceAnnotation.joyLikelihood)
  const sorrow = likelihoodToScore(faceAnnotation.sorrowLikelihood)
  const anger = likelihoodToScore(faceAnnotation.angerLikelihood)
  const surprise = likelihoodToScore(faceAnnotation.surpriseLikelihood)

  const positiveSignal = joy + surprise * 0.2
  const negativeSignal = Math.max(sorrow, anger)

  const rawScore = positiveSignal - negativeSignal * 0.6
  const finalScore = clampScore(rawScore)

  const bucket = labelBuckets.find((group) =>
    finalScore >= group.min && finalScore <= group.max
  ) || labelBuckets[2]

  const contextMessages = {
    Frustrated: 'Detected signs of dissatisfaction.',
    Disappointed: 'User appears somewhat dissatisfied.',
    Neutral: 'Expression appears neutral.',
    Satisfied: 'Positive expression detected.',
    Delighted: 'Strong positive expression detected.',
  }

  return {
    score: finalScore,
    label: bucket.label,
    context: contextMessages[bucket.label],
  }
}



